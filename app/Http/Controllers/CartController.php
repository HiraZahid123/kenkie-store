<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Setting;
use App\Support\LegacyTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;

class CartController extends Controller
{
    /**
     * Display the shopping cart page.
     */
    public function index()
    {
        $cart = session()->get('cart', []);
        $subtotal = 0;
        foreach ($cart as $item) {
            $subtotal += $item['price'] * $item['quantity'];
        }

        $shippingFee = (float) Setting::get('shipping_fee', 0);
        $freeThreshold = Setting::get('free_shipping_threshold');
        if ($freeThreshold !== null && $subtotal >= (float) $freeThreshold) {
            $shippingFee = 0.0;
        }

        $cartContentHtml = View::make('cart._content', compact('cart', 'subtotal', 'shippingFee'))->render();

        $html = LegacyTemplate::spliceProductGrid('wishlist/index.html', '');

        $html = LegacyTemplate::replaceOnce(
            $html,
            '<ul class="products columns-3 columns-md-3 columns-sm-2 columns-xs-2">',
            $cartContentHtml . "\n" . '<ul class="products columns-3 columns-md-3 columns-sm-2 columns-xs-2" style="display:none;">'
        );

        $html = LegacyTemplate::replaceOnce($html, '<title>Shop &#8211;', '<title>Shopping Cart &#8211;');
        $html = LegacyTemplate::replaceOnce($html, '<title>Wishlist &#8211;', '<title>Shopping Cart &#8211;');
        $html = LegacyTemplate::replaceOnce($html, '<h1>Shop</h1>', '<h1>Shopping Cart</h1>');
        $html = LegacyTemplate::replaceOnce($html, '<h1>Wishlist</h1>', '<h1>Shopping Cart</h1>');

        $html = preg_replace('/<div class="products-nav ">.*?<\/form>\s*<\/div>/s', '', $html);

        return response($html)->header('Content-Type', 'text/html');
    }

    /**
     * Add an item to the shopping cart.
     */
    public function add(Request $request)
    {
        $productId = (int) $request->input('product_id', $request->input('add-to-cart'));
        $quantity = max(1, (int) $request->input('quantity', 1));

        $product = Product::findOrFail($productId);

        $cart = session()->get('cart', []);

        $price = (float) ($product->sale_price ?: $product->price);
        $image = $product->image ? asset('storage/'.$product->image) : asset('assets/themes/bemart/assets/img/img-404.jpg');

        if (isset($cart[$productId])) {
            $cart[$productId]['quantity'] += $quantity;
        } else {
            $cart[$productId] = [
                'id' => $product->id,
                'title' => $product->title,
                'slug' => $product->slug,
                'price' => $price,
                'regular_price' => (float) $product->price,
                'image' => $image,
                'quantity' => $quantity,
            ];
        }

        session()->put('cart', $cart);

        $summary = $this->getCartSummary($cart);

        if ($request->expectsJson() || $request->ajax() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json([
                'success' => true,
                'message' => '“' . $product->title . '” added to cart!',
                'cart_count' => $summary['count'],
                'cart_subtotal' => $summary['subtotal_formatted'],
                'items' => array_values($cart),
            ]);
        }

        return redirect()->back()->with('success', '“' . $product->title . '” added to your cart!');
    }

    /**
     * Update quantity of a product in the cart.
     */
    public function update(Request $request)
    {
        $productId = (int) $request->input('product_id');
        $quantity = (int) $request->input('quantity', 1);

        $cart = session()->get('cart', []);

        if (isset($cart[$productId])) {
            if ($quantity <= 0) {
                unset($cart[$productId]);
            } else {
                $cart[$productId]['quantity'] = $quantity;
            }
            session()->put('cart', $cart);
        }

        $summary = $this->getCartSummary($cart);

        if ($request->expectsJson() || $request->ajax() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json([
                'success' => true,
                'message' => 'Cart updated successfully!',
                'cart_count' => $summary['count'],
                'cart_subtotal' => $summary['subtotal_formatted'],
                'items' => array_values($cart),
            ]);
        }

        return redirect()->route('cart')->with('success', 'Cart updated!');
    }

    /**
     * Remove an item from the cart.
     */
    public function remove(Request $request)
    {
        $productId = (int) $request->input('product_id');
        $cart = session()->get('cart', []);

        if (isset($cart[$productId])) {
            unset($cart[$productId]);
            session()->put('cart', $cart);
        }

        $summary = $this->getCartSummary($cart);

        if ($request->expectsJson() || $request->ajax() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json([
                'success' => true,
                'message' => 'Item removed from cart!',
                'cart_count' => $summary['count'],
                'cart_subtotal' => $summary['subtotal_formatted'],
                'items' => array_values($cart),
            ]);
        }

        return redirect()->route('cart')->with('success', 'Item removed from cart!');
    }

    /**
     * Get live cart data as JSON.
     */
    public function data()
    {
        $cart = session()->get('cart', []);
        $summary = $this->getCartSummary($cart);

        return response()->json([
            'success' => true,
            'cart_count' => $summary['count'],
            'cart_subtotal' => $summary['subtotal_formatted'],
            'items' => array_values($cart),
        ]);
    }

    private function getCartSummary(array $cart): array
    {
        $count = 0;
        $subtotal = 0.0;
        foreach ($cart as $item) {
            $count += $item['quantity'];
            $subtotal += $item['price'] * $item['quantity'];
        }

        return [
            'count' => $count,
            'subtotal' => $subtotal,
            'subtotal_formatted' => '$' . number_format($subtotal, 2),
        ];
    }
}
