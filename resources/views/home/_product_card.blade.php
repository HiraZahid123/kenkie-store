@php
    $img  = $product->image
        ? asset('storage/' . $product->image)
        : asset('assets/themes/bemart/assets/img/img-404.jpg');
    $link = url('/product/' . $product->slug . '/index.html');
@endphp
<li class="product type-product post-{{ $product->id }} status-publish instock product_cat-{{ $product->category->slug ?? 'uncategorized' }} has-post-thumbnail {{ $product->sale_price ? 'sale' : '' }} shipping-taxable purchasable product-type-simple">
    <div class="products-entry item-wrap short-button">
        <div class="item-img">
            <a href="{{ $link }}" class="woocommerce-LoopProduct-link woocommerce-loop-product__link">
                <div class="product-thumb-hover">
                    <img loading="lazy" width="400" height="480"
                         src="{{ $img }}"
                         class="wp-post-image attachment-woocommerce_thumbnail"
                         alt="{{ $product->title }}" decoding="async" />
                </div>
            </a>
            @if ($product->sale_price)
                <div class="sale-off">sale</div>
            @endif
            <div class="item-bottom">
                <div class="yith-wcwl-add-to-wishlist add-to-wishlist-{{ $product->id }} yith-wcwl-add-to-wishlist--link-style wishlist-fragment on-first-load" data-fragment-ref="{{ $product->id }}">
                    <div class="yith-wcwl-add-button">
                        <a href="javascript:void(0);" class="add_to_wishlist single_add_to_wishlist wishlist-toggle" data-product-id="{{ $product->id }}" data-product-type="simple" data-original-product-id="0" data-title="Add to wishlist" title="Add to wishlist" rel="nofollow">
                            <svg class="yith-wcwl-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.001 3.818a6.228 6.228 0 0 1 8.51 9.087l-5.224 5.225h-.001L12 21.415l-7.28-7.279l-1.23-1.232A6.228 6.228 0 0 1 12 3.818m3.285 11.485l3.811-3.812a4.228 4.228 0 1 0-5.98-5.98L12 6.627L10.883 5.51a4.228 4.228 0 1 0-5.98 5.98l1.232 1.232L12 18.587l3.285-3.285" /></svg>
                            <span>Add to wishlist</span>
                        </a>
                    </div>
                </div>
                <a href="#" class="compare icon-svg" data-product_id="{{ $product->id }}" rel="nofollow" title="Compare">
                    <svg width="40px" height="40px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h48v48H0z" fill="none"/>
                        <g id="Shopicon">
                            <path d="M44,14H25.738C24.848,10.551,21.726,8,18,8s-6.848,2.551-7.738,6H4v4h6.262c0.889,3.449,4.011,6,7.738,6
                                s6.848-2.551,7.738-6H44V14z M18,20c-2.206,0-4-1.794-4-4c0-2.206,1.794-4,4-4s4,1.794,4,4C22,18.206,20.206,20,18,20z"/>
                            <path d="M44,30h-6.262c-0.889-3.449-4.011-6-7.738-6s-6.848,2.551-7.738,6H4v4h18.262c0.889,3.449,4.011,6,7.738,6
                                s6.848-2.551,7.738-6H44V30z M30,36c-2.206,0-4-1.794-4-4c0-2.206,1.794-4,4-4s4,1.794,4,4C34,34.206,32.206,36,30,36z"/>
                        </g>
                    </svg>
                </a>
                <a href="{{ $link }}" data-product_id="{{ $product->id }}" title="Quick view" class="sw-quickview icon-svg" data-type="quickview">
                    <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Quick view</span>
                </a>
                <a href="{{ $link }}" aria-describedby="woocommerce_loop_add_to_cart_link_describedby_{{ $product->id }}" data-quantity="1" class="button product_type_simple add_to_cart_button ajax_add_to_cart" data-product_id="{{ $product->id }}" data-product_sku="" aria-label="Add to cart: &ldquo;{{ $product->title }}&rdquo;" rel="nofollow" data-success_message="&ldquo;{{ $product->title }}&rdquo; has been added to your cart" role="button">Add to cart</a>
                <span id="woocommerce_loop_add_to_cart_link_describedby_{{ $product->id }}" class="screen-reader-text"></span>
            </div>
        </div>
        <div class="item-content">
            <a href="{{ $link }}" class="woocommerce-LoopProduct-link woocommerce-loop-product__link">
                <h2 class="woocommerce-loop-product__title">{{ $product->title }}</h2>
            </a>
            <div class="item-description">{{ \Illuminate\Support\Str::limit($product->description, 120) }}</div>
            <span class="price">
                @if ($product->sale_price)
                    <del aria-hidden="true">
                        <span class="woocommerce-Price-amount amount">
                            <bdi><span class="woocommerce-Price-currencySymbol">$</span>{{ number_format($product->price, 2) }}</bdi>
                        </span>
                    </del>
                    <ins aria-hidden="true">
                        <span class="woocommerce-Price-amount amount">
                            <bdi><span class="woocommerce-Price-currencySymbol">$</span>{{ number_format($product->sale_price, 2) }}</bdi>
                        </span>
                    </ins>
                @else
                    <span class="woocommerce-Price-amount amount">
                        <bdi><span class="woocommerce-Price-currencySymbol">$</span>{{ number_format($product->price, 2) }}</bdi>
                    </span>
                @endif
            </span>
            <a href="{{ $link }}" aria-describedby="woocommerce_loop_add_to_cart_link_describedby_{{ $product->id }}" data-quantity="1" class="button product_type_simple add_to_cart_button ajax_add_to_cart" data-product_id="{{ $product->id }}" data-product_sku="" aria-label="Add to cart: &ldquo;{{ $product->title }}&rdquo;" rel="nofollow" data-success_message="&ldquo;{{ $product->title }}&rdquo; has been added to your cart" role="button">Add to cart</a>
            <span id="woocommerce_loop_add_to_cart_link_describedby_{{ $product->id }}" class="screen-reader-text"></span>
        </div>
    </div>
</li>
