<div class="woocommerce woocommerce-order-received-wrapper" style="padding: 40px 0 60px;">
    <div style="max-width: 640px; margin: 0 auto; text-align: center; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 40px 30px;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: #dcfce7; color: #16a34a; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 32px;">&#10003;</div>
        <h2 style="margin: 0 0 8px; font-size: 24px; font-weight: 800; color: #111827;">Thank you, {{ $order->customer_name }}!</h2>
        <p style="margin: 0 0 24px; color: #6b7280; font-size: 15px;">
            Your order has been placed. We've noted it down as <strong>{{ $order->order_number }}</strong>.
        </p>

        <div style="text-align: left; background: #f9fafb; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
                <tbody>
                    @foreach ($order->items as $item)
                        <tr style="border-bottom: 1px solid #e5e7eb;">
                            <td style="padding: 8px 0; font-size: 14px; color: #374151;">{{ $item->product_title }} &times; {{ $item->quantity }}</td>
                            <td style="padding: 8px 0; text-align: right; font-size: 14px; font-weight: 600; color: #111827;">${{ number_format($item->price * $item->quantity, 2) }}</td>
                        </tr>
                    @endforeach
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Shipping</td>
                        <td style="padding: 8px 0; text-align: right; font-size: 14px; color: #111827;">${{ number_format($order->shipping_fee, 2) }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0 0; font-weight: 700; color: #111827;">Total</td>
                        <td style="padding: 12px 0 0; text-align: right; font-weight: 800; font-size: 18px; color: #22c55e;">${{ number_format($order->total, 2) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="text-align: left; font-size: 14px; color: #4b5563; margin-bottom: 30px;">
            <p style="margin: 4px 0;"><strong>Shipping to:</strong> {{ $order->shipping_address }}</p>
            <p style="margin: 4px 0;"><strong>Contact:</strong> {{ $order->customer_email }} @if($order->customer_phone) &bull; {{ $order->customer_phone }} @endif</p>
        </div>

        <a href="{{ url('/shop/index.html') }}" style="display: inline-block; background: #22c55e; color: #fff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 15px;">
            Continue Shopping
        </a>
    </div>
</div>
