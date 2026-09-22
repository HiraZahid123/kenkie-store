<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Setting;
use App\Support\LegacyTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\View;
use Stripe\StripeClient;

class CheckoutController extends Controller
{
    /**
     * Show the checkout form (shipping details + order summary).
     */
    public function index()
    {
        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return redirect()->route('cart')->with('error', 'Your cart is empty — add something before checking out.');
        }

        [$subtotal, $shippingFee, $total] = $this->totals($cart);

        $contentHtml = View::make('checkout._form', [
            'cart' => $cart,
            'subtotal' => $subtotal,
            'shippingFee' => $shippingFee,
            'total' => $total,
            'stripeEnabled' => filled(config('services.stripe.key')) && filled(config('services.stripe.secret')),
        ])->render();

        $html = LegacyTemplate::spliceProductGrid('wishlist/index.html', '');

        $html = LegacyTemplate::replaceOnce(
            $html,
            '<ul class="products columns-3 columns-md-3 columns-sm-2 columns-xs-2">',
            $contentHtml."\n".'<ul class="products columns-3 columns-md-3 columns-sm-2 columns-xs-2" style="display:none;">'
        );

        $html = LegacyTemplate::replaceOnce($html, '<title>Shop &#8211;', '<title>Checkout &#8211;');
        $html = LegacyTemplate::replaceOnce($html, '<title>Wishlist &#8211;', '<title>Checkout &#8211;');
        $html = LegacyTemplate::replaceOnce($html, '<h1>Shop</h1>', '<h1>Checkout</h1>');
        $html = LegacyTemplate::replaceOnce($html, '<h1>Wishlist</h1>', '<h1>Checkout</h1>');

        $html = preg_replace('/<div class="products-nav ">.*?<\/form>\s*<\/div>/s', '', $html);

        return response($html)->header('Content-Type', 'text/html');
    }

    /**
     * Validate the shipping form. Cash-on-delivery / bank transfer create the
     * order immediately; card payments go to Stripe Checkout first and the
     * order is only created once Stripe confirms the payment succeeded.
     */
    public function store(Request $request)
    {
        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return redirect()->route('cart')->with('error', 'Your cart is empty.');
        }

        $data = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'email', 'max:255'],
            'customer_phone' => ['nullable', 'string', 'max:50'],
            'shipping_address' => ['required', 'string', 'max:2000'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'payment_method' => ['required', 'in:cod,bank_transfer,card'],
        ]);

        // Re-check stock right before placing the order.
        foreach ($cart as $productId => $item) {
            $product = Product::find($productId);
            if (! $product || ($product->stock !== null && $product->stock < $item['quantity'])) {
                return redirect()->route('cart')->with(
                    'error',
                    'Sorry, "'.$item['title'].'" no longer has enough stock. Please update your cart.'
                );
            }
        }

        if ($data['payment_method'] === 'card') {
            return $this->startStripeCheckout($data, $cart);
        }

        [$subtotal, $shippingFee, $total] = $this->totals($cart);

        $order = $this->createOrder($data, $cart, $subtotal, $shippingFee, $total, $data['payment_method'], 'unpaid');

        session()->forget('cart');
        session()->put('last_order_id', $order->id);

        return redirect()->route('checkout.success', $order->order_number);
    }

    /**
     * Create a Stripe Checkout Session for the current cart and send the
     * customer to Stripe's hosted payment page. The shipping form data is
     * stashed in the session so the order can be created once they return.
     */
    private function startStripeCheckout(array $data, array $cart)
    {
        [$subtotal, $shippingFee, $total] = $this->totals($cart);

        $lineItems = [];
        foreach ($cart as $item) {
            $lineItems[] = [
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => ['name' => $item['title']],
                    'unit_amount' => (int) round($item['price'] * 100),
                ],
                'quantity' => $item['quantity'],
            ];
        }

        if ($shippingFee > 0) {
            $lineItems[] = [
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => ['name' => 'Shipping'],
                    'unit_amount' => (int) round($shippingFee * 100),
                ],
                'quantity' => 1,
            ];
        }

        try {
            $stripe = new StripeClient(config('services.stripe.secret'));

            $session = $stripe->checkout->sessions->create([
                'mode' => 'payment',
                'line_items' => $lineItems,
                'customer_email' => $data['customer_email'],
                'success_url' => route('checkout.stripe.callback').'?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('checkout.stripe.cancel'),
                'metadata' => [
                    'customer_name' => $data['customer_name'],
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('Stripe checkout session creation failed: '.$e->getMessage());

            return redirect()->route('checkout')->with('error', 'We could not start the payment process. Please try again.');
        }

        // The cart stays in the session (untouched) until payment is confirmed.
        session()->put('pending_checkout', $data);

        return redirect()->away($session->url);
    }

    /**
     * Stripe redirects here after a successful payment. Verify the payment
     * really went through (server-side, via the secret key — never trust the
     * redirect alone), then create the order.
     */
    public function stripeCallback(Request $request)
    {
        $sessionId = $request->query('session_id');

        if (! $sessionId) {
            return redirect()->route('checkout')->with('error', 'Missing payment session.');
        }

        // Idempotent: if this Stripe session already produced an order
        // (e.g. the customer refreshed this page), just show it again
        // instead of creating a duplicate.
        $existingOrder = Order::where('stripe_session_id', $sessionId)->first();
        if ($existingOrder) {
            session()->put('last_order_id', $existingOrder->id);

            return redirect()->route('checkout.success', $existingOrder->order_number);
        }

        try {
            $stripe = new StripeClient(config('services.stripe.secret'));
            $session = $stripe->checkout->sessions->retrieve($sessionId);
        } catch (\Throwable $e) {
            Log::error('Stripe session retrieval failed: '.$e->getMessage());

            return redirect()->route('cart')->with('error', 'We could not verify your payment. If you were charged, please contact us.');
        }

        if ($session->payment_status !== 'paid') {
            return redirect()->route('checkout')->with('error', 'Payment was not completed.');
        }

        $data = session()->get('pending_checkout');
        $cart = session()->get('cart', []);

        if (! $data || empty($cart)) {
            Log::warning('Stripe payment succeeded but checkout session data was missing.', ['session_id' => $sessionId]);

            return redirect()->route('cart')->with(
                'error',
                'Your payment went through, but we lost track of your order details (your session may have expired). Please contact us with your payment confirmation and we\'ll sort it out.'
            );
        }

        [$subtotal, $shippingFee, $total] = $this->totals($cart);

        $order = $this->createOrder($data, $cart, $subtotal, $shippingFee, $total, 'card', 'paid', $sessionId);

        session()->forget(['cart', 'pending_checkout']);
        session()->put('last_order_id', $order->id);

        return redirect()->route('checkout.success', $order->order_number);
    }

    /**
     * Customer backed out of Stripe Checkout. Cart is untouched, send them
     * back to the checkout form.
     */
    public function stripeCancel()
    {
        return redirect()->route('checkout')->with('error', 'Payment was cancelled — your cart is still here whenever you\'re ready.');
    }

    /**
     * Order confirmation page. Only viewable right after placing the order
     * (or by the account that placed it), so random order numbers can't be
     * browsed to see someone else's order.
     */
    public function success(Order $order)
    {
        $canView = session('last_order_id') === $order->id
            || (auth()->check() && $order->user_id === auth()->id());

        abort_unless($canView, 404);

        $contentHtml = View::make('checkout._success', compact('order'))->render();

        $html = LegacyTemplate::spliceProductGrid('wishlist/index.html', '');

        $html = LegacyTemplate::replaceOnce(
            $html,
            '<ul class="products columns-3 columns-md-3 columns-sm-2 columns-xs-2">',
            $contentHtml."\n".'<ul class="products columns-3 columns-md-3 columns-sm-2 columns-xs-2" style="display:none;">'
        );

        $html = LegacyTemplate::replaceOnce($html, '<title>Shop &#8211;', '<title>Order Confirmed &#8211;');
        $html = LegacyTemplate::replaceOnce($html, '<title>Wishlist &#8211;', '<title>Order Confirmed &#8211;');
        $html = LegacyTemplate::replaceOnce($html, '<h1>Shop</h1>', '<h1>Order Confirmed</h1>');
        $html = LegacyTemplate::replaceOnce($html, '<h1>Wishlist</h1>', '<h1>Order Confirmed</h1>');

        $html = preg_replace('/<div class="products-nav ">.*?<\/form>\s*<\/div>/s', '', $html);

        return response($html)->header('Content-Type', 'text/html');
    }

    private function createOrder(
        array $data,
        array $cart,
        float $subtotal,
        float $shippingFee,
        float $total,
        string $paymentMethod,
        string $paymentStatus,
        ?string $stripeSessionId = null
    ): Order {
        $paymentMethodLabels = [
            'cod' => 'Cash on Delivery',
            'bank_transfer' => 'Bank Transfer',
            'card' => 'Card (Stripe)',
        ];

        return DB::transaction(function () use ($data, $cart, $subtotal, $shippingFee, $total, $paymentMethod, $paymentStatus, $stripeSessionId, $paymentMethodLabels) {
            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'user_id' => auth()->id(),
                'customer_name' => $data['customer_name'],
                'customer_email' => $data['customer_email'],
                'customer_phone' => $data['customer_phone'] ?? null,
                'shipping_address' => $data['shipping_address'],
                'status' => 'pending',
                'payment_status' => $paymentStatus,
                'payment_method' => $paymentMethodLabels[$paymentMethod] ?? $paymentMethod,
                'stripe_session_id' => $stripeSessionId,
                'subtotal' => $subtotal,
                'shipping_fee' => $shippingFee,
                'total' => $total,
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($cart as $productId => $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $productId,
                    'product_title' => $item['title'],
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                ]);

                Product::where('id', $productId)->decrement('stock', $item['quantity']);
            }

            return $order;
        });
    }

    /**
     * @return array{0: float, 1: float, 2: float} subtotal, shipping fee, total
     */
    private function totals(array $cart): array
    {
        $subtotal = 0.0;
        foreach ($cart as $item) {
            $subtotal += $item['price'] * $item['quantity'];
        }

        $shippingFee = (float) Setting::get('shipping_fee', 0);
        $freeThreshold = Setting::get('free_shipping_threshold');

        if ($freeThreshold !== null && $subtotal >= (float) $freeThreshold) {
            $shippingFee = 0.0;
        }

        $total = $subtotal + $shippingFee;

        return [$subtotal, $shippingFee, $total];
    }
}
