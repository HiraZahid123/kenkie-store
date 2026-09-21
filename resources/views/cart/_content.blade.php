<div class="woocommerce woocommerce-cart-page-wrapper" style="padding: 20px 0 40px;">
    @if (empty($cart))
        <div class="woocommerce-info" style="padding: 25px 30px; background: #f8fafc; border-left: 4px solid #22c55e; border-radius: 6px; margin-bottom: 25px; font-size: 16px;">
            Your shopping cart is currently empty.
            <div style="margin-top: 15px;">
                <a href="{{ url('/shop/index.html') }}" class="button wc-backward" style="background: #22c55e; color: #fff; padding: 10px 24px; border-radius: 4px; text-decoration: none; display: inline-block; font-weight: 600;">
                    Browse Products
                </a>
            </div>
        </div>
    @else
        <div class="kenkie-cart-table-wrap" style="overflow-x: auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <table class="shop_table shop_table_responsive cart woocommerce-cart-form__contents" cellspacing="0" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 2px solid #e5e7eb; text-align: left; font-size: 14px; text-transform: uppercase; color: #4b5563;">
                        <th class="product-remove" style="padding: 12px 10px; width: 40px;">&nbsp;</th>
                        <th class="product-thumbnail" style="padding: 12px 10px; width: 90px;">Image</th>
                        <th class="product-name" style="padding: 12px 10px;">Product</th>
                        <th class="product-price" style="padding: 12px 10px; width: 120px;">Price</th>
                        <th class="product-quantity" style="padding: 12px 10px; width: 140px;">Quantity</th>
                        <th class="product-subtotal" style="padding: 12px 10px; width: 120px; text-align: right;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($cart as $id => $item)
                        <tr class="woocommerce-cart-form__cart-item cart_item" style="border-bottom: 1px solid #f1f5f9;" data-product-id="{{ $id }}">
                            <td class="product-remove" style="padding: 16px 10px; text-align: center;">
                                <a href="javascript:void(0);" class="remove kenkie-cart-item-remove" data-product-id="{{ $id }}" title="Remove this item" style="color: #ef4444; font-size: 20px; font-weight: bold; text-decoration: none; cursor: pointer;">&times;</a>
                            </td>
                            <td class="product-thumbnail" style="padding: 16px 10px;">
                                <a href="{{ url('/product/'.$item['slug'].'/index.html') }}">
                                    <img src="{{ $item['image'] }}" alt="{{ $item['title'] }}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 6px; border: 1px solid #e5e7eb;" />
                                </a>
                            </td>
                            <td class="product-name" style="padding: 16px 10px; font-weight: 600;">
                                <a href="{{ url('/product/'.$item['slug'].'/index.html') }}" style="color: #1f2937; text-decoration: none; font-size: 15px;">
                                    {{ $item['title'] }}
                                </a>
                            </td>
                            <td class="product-price" style="padding: 16px 10px; font-size: 15px; color: #374151;">
                                <span class="woocommerce-Price-amount amount">
                                    <bdi><span class="woocommerce-Price-currencySymbol">$</span>{{ number_format($item['price'], 2) }}</bdi>
                                </span>
                            </td>
                            <td class="product-quantity" style="padding: 16px 10px;">
                                <div class="quantity" style="display: inline-flex; align-items: center; border: 1px solid #d1d5db; border-radius: 4px; overflow: hidden;">
                                    <button type="button" class="cart-qty-btn cart-qty-minus" data-product-id="{{ $id }}" style="background: #f3f4f6; border: none; width: 32px; height: 36px; font-weight: bold; cursor: pointer;">-</button>
                                    <input type="number" class="input-text qty text cart-qty-input" data-product-id="{{ $id }}" value="{{ $item['quantity'] }}" min="1" step="1" style="width: 48px; height: 36px; text-align: center; border: none; font-size: 14px; font-weight: 600; -moz-appearance: textfield;" />
                                    <button type="button" class="cart-qty-btn cart-qty-plus" data-product-id="{{ $id }}" style="background: #f3f4f6; border: none; width: 32px; height: 36px; font-weight: bold; cursor: pointer;">+</button>
                                </div>
                            </td>
                            <td class="product-subtotal" style="padding: 16px 10px; text-align: right; font-weight: 700; font-size: 15px; color: #111827;">
                                <span class="woocommerce-Price-amount amount">
                                    <bdi><span class="woocommerce-Price-currencySymbol">$</span>{{ number_format($item['price'] * $item['quantity'], 2) }}</bdi>
                                </span>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; flex-wrap: wrap; gap: 10px;">
                <a href="{{ url('/shop/index.html') }}" style="display: inline-flex; align-items: center; padding: 10px 20px; background: #f3f4f6; color: #374151; font-weight: 600; text-decoration: none; border-radius: 4px; font-size: 14px;">
                    &larr; Continue Shopping
                </a>
            </div>
        </div>

        <div class="cart-collaterals" style="max-width: 460px; margin-left: auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
            <div class="cart_totals">
                <h3 style="margin-top: 0; margin-bottom: 20px; font-size: 18px; font-weight: 700; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">Cart Totals</h3>
                <table cellspacing="0" class="shop_table shop_table_responsive" style="width: 100%; margin-bottom: 20px;">
                    <tbody>
                        <tr class="cart-subtotal" style="border-bottom: 1px solid #f1f5f9;">
                            <th style="padding: 10px 0; text-align: left; font-weight: 600; color: #6b7280;">Subtotal</th>
                            <td style="padding: 10px 0; text-align: right; font-weight: 700; color: #111827;">
                                <span class="cart-subtotal-amount">${{ number_format($subtotal, 2) }}</span>
                            </td>
                        </tr>
                        <tr class="shipping" style="border-bottom: 1px solid #f1f5f9;">
                            <th style="padding: 10px 0; text-align: left; font-weight: 600; color: #6b7280;">Shipping</th>
                            <td style="padding: 10px 0; text-align: right; color: #22c55e; font-weight: 600;">Free Shipping</td>
                        </tr>
                        <tr class="order-total">
                            <th style="padding: 14px 0 0; text-align: left; font-weight: 700; font-size: 16px; color: #111827;">Total</th>
                            <td style="padding: 14px 0 0; text-align: right; font-weight: 800; font-size: 20px; color: #22c55e;">
                                <span class="cart-total-amount">${{ number_format($subtotal, 2) }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="wc-proceed-to-checkout" style="margin-top: 20px;">
                    <a href="javascript:void(0);" onclick="alert('Checkout process initiated! Thank you for testing Kenkie Store.');" class="checkout-button button alt wc-forward" style="display: block; width: 100%; text-align: center; background: #22c55e; color: #fff; padding: 14px; font-size: 16px; font-weight: 700; border-radius: 6px; text-decoration: none; box-sizing: border-box; cursor: pointer;">
                        Proceed to Checkout
                    </a>
                </div>
            </div>
        </div>
    @endif
</div>
