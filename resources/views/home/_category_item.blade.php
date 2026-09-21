@php
    $img  = $category->image
        ? asset('storage/' . $category->image)
        : asset('assets/uploads/2026/01/Cate_Bathroom.png');
    $link = url('/product-category/' . $category->slug . '/index.html');
@endphp
<div class="swe-item">
    <div class="swe-wrap-item">
        <div class="swe-wrap-image">
            <a href="{{ $link }}">
                <img loading="lazy" decoding="async" width="80" height="80"
                     src="{{ $img }}"
                     class="attachment-medium size-medium"
                     alt="{{ $category->name }}" />
            </a>
        </div>
        <div class="swe-wrap-content">
            <div class="wrap-content-top">
                <div class="wrap-content-left">
                    <h3 class="swe-title"><a href="{{ $link }}">{{ $category->name }}</a></h3>
                </div>
            </div>
        </div>
    </div>
</div>
