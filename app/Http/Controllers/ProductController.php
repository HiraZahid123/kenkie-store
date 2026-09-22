<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Support\LegacyTemplate;
use Illuminate\Support\Facades\View;

class ProductController extends Controller
{
    public function show(string $slug)
    {
        $product = Product::with('category')->where('slug', $slug)->firstOrFail();

        $detailHtml = View::make('product._detail', compact('product'))->render();

        $html = LegacyTemplate::spliceProductDetail(
            'product/indexc0fa.html',
            $detailHtml
        );

        // The static shell (product/indexc0fa.html) is a single shared page
        // for every product, hardcoded with one placeholder product's title
        // in its <title>, meta tags, and breadcrumb. Swap every occurrence
        // of that placeholder for the real product being viewed, wherever
        // it currently is (it gets renamed from time to time, so read it
        // back out of the page itself rather than hardcoding the string).
        if (preg_match('/<li class="active"\s*><span>([^<]+)<\/span><\/li>/', $html, $m)) {
            $placeholderTitle = $m[1];
            $html = LegacyTemplate::replaceAll($html, $placeholderTitle, $product->title);
        }

        // The breadcrumb's category link (immediately before the product
        // name) also needs to match the real product's category.
        if ($product->category) {
            $html = preg_replace(
                '/(<a href="[^"]*product-category\/)[a-z0-9-]+(\/index\.html"\s*>)[^<]+(<\/a>)/',
                '$1'.$product->category->slug.'$2'.$product->category->name.'$3',
                $html,
                1
            );
        }

        return response($html)->header('Content-Type', 'text/html');
    }
}
