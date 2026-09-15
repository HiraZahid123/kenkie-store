@php
    $img = $product->image ? asset('storage/'.$product->image) : asset('assets/themes/bemart/assets/img/img-404.jpg');
    $link = url('/product/'.$product->slug.'/index.html');
@endphp
<li class="product type-product status-publish instock has-post-thumbnail {{ $product->sale_price ? 'sale' : '' }} shipping-taxable purchasable product-type-simple">
    <div class="products-entry item-wrap short-button">
        <div class="item-img">
            <a href="{{ $link }}" class="woocommerce-LoopProduct-link woocommerce-loop-product__link">
                <div class="product-thumb-hover">
                    <img loading="lazy" width="400" height="480" src="{{ $img }}" class="wp-post-image attachment-woocommerce_thumbnail" alt="{{ $product->title }}" decoding="async" />
                </div>
                @if ($product->sale_price)
                    <div class="sale-off ">sale</div>
                @endif
            </a>
            <div class="item-bottom ">
                <a href="#" class="compare icon-svg" rel="nofollow" title="Compare">
                    <svg width="40px" height="40px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h48v48H0z" fill="none"/>
                        <g><path d="M44,14H25.738C24.848,10.551,21.726,8,18,8s-6.848,2.551-7.738,6H4v4h6.262c0.889,3.449,4.011,6,7.738,6
                            s6.848-2.551,7.738-6H44V14z M18,20c-2.206,0-4-1.794-4-4c0-2.206,1.794-4,4-4s4,1.794,4,4C22,18.206,20.206,20,18,20z"/>
                        <path d="M44,30h-6.262c-0.889-3.449-4.011-6-7.738-6s-6.848,2.551-7.738,6H4v4h18.262c0.889,3.449,4.011,6,7.738,6
                            s6.848-2.551,7.738-6H44V30z M30,36c-2.206,0-4-1.794-4-4c0-2.206,1.794-4,4-4s4,1.794,4,4C34,34.206,32.206,36,30,36z"/>
                        </g>
                    </svg>
                </a>
                <a href="{{ $link }}" class="button product_type_simple" role="button">View Product</a>
            </div>
        </div>
        <div class="item-content">
            <a href="{{ $link }}" class="woocommerce-LoopProduct-link woocommerce-loop-product__link">
                <h2 class="woocommerce-loop-product__title">{{ $product->title }}</h2>
            </a>
            <div class="item-description">{{ \Illuminate\Support\Str::limit($product->description, 120) }}</div>
            <span class="price">
                @if ($product->sale_price)
                    <del aria-hidden="true"><span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">$</span>{{ number_format($product->price, 2) }}</bdi></span></del>
                    <ins aria-hidden="true"><span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">$</span>{{ number_format($product->sale_price, 2) }}</bdi></span></ins>
                @else
                    <span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">$</span>{{ number_format($product->price, 2) }}</bdi></span>
                @endif
            </span>
            <a href="{{ $link }}" class="button product_type_simple" role="button">View Product</a>
        </div>
    </div>
</li>
