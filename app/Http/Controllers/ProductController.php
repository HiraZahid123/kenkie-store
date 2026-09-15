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

        $html = LegacyTemplate::replaceOnce(
            $html,
            '<title>Clark Light Persimmon Faux Mohair &#8211;',
            '<title>'.$product->title.' &#8211;'
        );

        return response($html)->header('Content-Type', 'text/html');
    }
}
