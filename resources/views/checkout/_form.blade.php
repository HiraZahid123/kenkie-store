<div class="woocommerce woocommerce-checkout-page-wrapper" style="padding: 20px 0 40px;">
    @if (session('error'))
        <div class="woocommerce-error" style="padding: 16px 20px; background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 6px; margin-bottom: 25px; font-size: 15px; color: #991b1b;">
            {{ session('error') }}
        </div>
    @endif

    @if ($errors->any())
        <div class="woocommerce-error" style="padding: 16px 20px; background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 6px; margin-bottom: 25px; font-size: 15px; color: #991b1b;">
            <ul style="margin: 0; padding-left: 18px;">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form method="POST" action="{{ route('checkout.store') }}" style="display: flex; gap: 30px; align-items: flex-start; flex-wrap: wrap;">
        @csrf

        <div style="flex: 1 1 420px; min-width: 320px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
            <h3 style="margin-top: 0; margin-bottom: 20px; font-size: 18px; font-weight: 700; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">Shipping Details</h3>

            <div style="margin-bottom: 16px;">
                <label style="display: block; font-weight: 600; font-size: 14px; margin-bottom: 6px; color: #374151;">Full Name *</label>
                <input type="text" name="customer_name" required value="{{ old('customer_name', auth()->user()->name ?? '') }}"
                       style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 15px;">
            </div>

            <div style="display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap;">
                <div style="flex: 1 1 200px;">
                    <label style="display: block; font-weight: 600; font-size: 14px; margin-bottom: 6px; color: #374151;">Email *</label>
                    <input type="email" name="customer_email" required value="{{ old('customer_email', auth()->user()->email ?? '') }}"
                           style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 15px;">
                </div>
                <div style="flex: 1 1 200px;">
                    <label style="display: block; font-weight: 600; font-size: 14px; margin-bottom: 6px; color: #374151;">Phone</label>
                    <input type="text" name="customer_phone" value="{{ old('customer_phone') }}"
                           style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 15px;">
                </div>
            </div>

            <div style="margin-bottom: 16px;">
                <label style="display: block; font-weight: 600; font-size: 14px; margin-bottom: 6px; color: #374151;">Shipping Address *</label>
                <textarea name="shipping_address" rows="3" required
                          style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 15px; resize: vertical;">{{ old('shipping_address') }}</textarea>
            </div>

            <div style="margin-bottom: 16px;">
                <label style="display: block; font-weight: 600; font-size: 14px; margin-bottom: 6px; color: #374151;">Order Notes (optional)</label>
                <textarea name="notes" rows="2"
                          style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 15px; resize: vertical;">{{ old('notes') }}</textarea>
            </div>

            <div>
                <label style="display: block; font-weight: 600; font-size: 14px; margin-bottom: 8px; color: #374151;">Payment Method *</label>

                @if ($stripeEnabled)
                    <label style="display: flex; align-items: center; gap: 10px; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; margin-bottom: 10px; cursor: pointer;">
                        <input type="radio" name="payment_method" value="card" {{ old('payment_method', 'card') === 'card' ? 'checked' : '' }}>
                        <span style="display: flex; align-items: center; justify-content: space-between; flex: 1;">
                            <span>
                                <strong style="font-size: 14px; color: #1f2937;">Credit / Debit Card</strong><br>
                                <span style="font-size: 13px; color: #6b7280;">Pay securely by card via Stripe.</span>
                            </span>
                            <svg width="28" height="18" viewBox="0 0 32 20" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;"><rect width="32" height="20" rx="3" fill="#635bff"/><path d="M14.6 8.7c0-.6.5-.8 1.3-.8 1.2 0 2.6.4 3.8 1V6.1c-1.3-.5-2.6-.7-3.8-.7-3.1 0-5.2 1.6-5.2 4.3 0 4.2 5.7 3.5 5.7 5.3 0 .7-.6 1-1.5 1-1.3 0-3-.5-4.3-1.2v2.9c1.5.6 3 .9 4.3.9 3.2 0 5.4-1.6 5.4-4.3 0-4.5-5.7-3.7-5.7-5.6z" fill="#fff"/></svg>
                        </span>
                    </label>
                @endif

                <label style="display: flex; align-items: center; gap: 10px; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; margin-bottom: 10px; cursor: pointer;">
                    <input type="radio" name="payment_method" value="cod" {{ old('payment_method', $stripeEnabled ? '' : 'cod') === 'cod' ? 'checked' : '' }}>
                    <span>
                        <strong style="font-size: 14px; color: #1f2937;">Cash on Delivery</strong><br>
                        <span style="font-size: 13px; color: #6b7280;">Pay with cash when your order arrives.</span>
                    </span>
                </label>
                <label style="display: flex; align-items: center; gap: 10px; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer;">
                    <input type="radio" name="payment_method" value="bank_transfer" {{ old('payment_method') === 'bank_transfer' ? 'checked' : '' }}>
                    <span>
                        <strong style="font-size: 14px; color: #1f2937;">Bank Transfer</strong><br>
                        <span style="font-size: 13px; color: #6b7280;">We'll email you our bank details to complete payment.</span>
                    </span>
                </label>
            </div>
        </div>

        <div style="flex: 0 1 380px; min-width: 300px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
            <h3 style="margin-top: 0; margin-bottom: 20px; font-size: 18px; font-weight: 700; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">Your Order</h3>

            <table style="width: 100%; margin-bottom: 16px; border-collapse: collapse;">
                <tbody>
                    @foreach ($cart as $item)
                        <tr style="border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 10px 0; font-size: 14px; color: #374151;">
                                {{ $item['title'] }} <span style="color: #9ca3af;">&times; {{ $item['quantity'] }}</span>
                            </td>
                            <td style="padding: 10px 0; text-align: right; font-size: 14px; font-weight: 600; color: #111827;">
                                ${{ number_format($item['price'] * $item['quantity'], 2) }}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            <table style="width: 100%; border-collapse: collapse;">
                <tbody>
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                        <th style="padding: 8px 0; text-align: left; font-weight: 600; color: #6b7280;">Subtotal</th>
                        <td style="padding: 8px 0; text-align: right; font-weight: 700; color: #111827;">${{ number_format($subtotal, 2) }}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                        <th style="padding: 8px 0; text-align: left; font-weight: 600; color: #6b7280;">Shipping</th>
                        <td style="padding: 8px 0; text-align: right; font-weight: 600; color: {{ $shippingFee > 0 ? '#111827' : '#22c55e' }};">
                            {{ $shippingFee > 0 ? '$'.number_format($shippingFee, 2) : 'Free' }}
                        </td>
                    </tr>
                    <tr>
                        <th style="padding: 14px 0 0; text-align: left; font-weight: 700; font-size: 16px; color: #111827;">Total</th>
                        <td style="padding: 14px 0 0; text-align: right; font-weight: 800; font-size: 20px; color: #22c55e;">${{ number_format($total, 2) }}</td>
                    </tr>
                </tbody>
            </table>

            <button type="submit" style="display: block; width: 100%; text-align: center; background: #22c55e; color: #fff; padding: 14px; font-size: 16px; font-weight: 700; border-radius: 6px; border: none; margin-top: 24px; cursor: pointer;">
                Place Order
            </button>
            <a href="{{ url('/cart') }}" style="display: block; text-align: center; margin-top: 12px; font-size: 14px; color: #6b7280; text-decoration: none;">&larr; Back to Cart</a>
        </div>
    </form>
</div>
