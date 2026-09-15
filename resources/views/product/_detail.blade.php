@php
    $images = collect([$product->image])->merge($product->gallery ?? [])->filter()->values();
    $mainImage = $images->first() ? asset('storage/'.$images->first()) : asset('assets/themes/bemart/assets/img/img-404.jpg');
@endphp
<div class="product-detail-left">
    <div class="woocommerce-product-gallery woocommerce-product-gallery--with-images images product-images">
        <div class="woocommerce-product-gallery__wrapper" style="display:flex;flex-wrap:wrap;gap:10px;">
            <div class="woocommerce-product-gallery__image" style="flex:1 1 100%;">
                <img src="{{ $mainImage }}" alt="{{ $product->title }}" style="width:100%;border-radius:8px;object-fit:cover;max-height:520px;">
            </div>
            @foreach ($images->skip(1) as $thumb)
                <div class="woocommerce-product-gallery__image" style="width:90px;">
                    <img src="{{ asset('storage/'.$thumb) }}" alt="{{ $product->title }}" style="width:100%;border-radius:6px;object-fit:cover;height:90px;">
                </div>
            @endforeach
        </div>
    </div>
</div>
<div class="product-detail-right">
    <div class="content_product_detail">
        <h1 class="product_title entry-title">{{ $product->title }}</h1>

        <div class="item-bottom-title">
            <div class="product_meta">
                @if ($product->category)
                    <span>Category: </span>
                    <a href="{{ url('/product-category/'.$product->category->slug) }}">{{ $product->category->name }}</a>
                @endif
                @if ($product->sku)
                    <span style="margin-left:15px;">SKU: {{ $product->sku }}</span>
                @endif
            </div>
        </div>

        <div class="product-info">
            @if ($product->stock > 0)
                <p class="stock in-stock">In stock ({{ $product->stock }} available)</p>
            @else
                <p class="stock out-of-stock">Out of stock</p>
            @endif
        </div>

        <div class="woocommerce-product-details__short-description">
            <p>{{ $product->description }}</p>
        </div>

        <div class="single-price">
            <p class="price">
                @if ($product->sale_price)
                    <del aria-hidden="true"><span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">$</span>{{ number_format($product->price, 2) }}</bdi></span></del>
                    <ins aria-hidden="true"><span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">$</span>{{ number_format($product->sale_price, 2) }}</bdi></span></ins>
                @else
                    <span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">$</span>{{ number_format($product->price, 2) }}</bdi></span>
                @endif
            </p>
        </div>

        <form class="cart" action="#" method="post">
            <div class="addcart-wrapper single-buynow">
                <div class="quantity-wrapper">
                    <div class="quantity-text">Quantity: </div>
                    <div class="quantity">
                        <input type="button" value="-" class="minus"/>
                        <input type="number" class="input-text qty text" name="quantity" value="1" min="1" step="1"/>
                        <input type="button" value="+" class="plus" />
                    </div>
                </div>
                <button type="submit" name="add-to-cart" value="{{ $product->id }}" class="single_add_to_cart_button button alt">Add to cart</button>
            </div>
        </form>
    </div>
</div>
