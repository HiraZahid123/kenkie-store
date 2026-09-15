<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Support\LegacyTemplate;
use Illuminate\Support\Facades\View;

class CategoryController extends Controller
{
    public function show(string $slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();
        $products = $category->products()->with('category')->latest()->get();

        $cardsHtml = $products->map(fn ($product) => View::make('shop._card', compact('product'))->render())
            ->implode("\n");

        $html = LegacyTemplate::spliceProductGrid('shop/index.html', $cardsHtml);

        $html = LegacyTemplate::replaceOnce(
            $html,
            '<title>Shop &#8211;',
            '<title>'.$category->name.' &#8211;'
        );

        $html = LegacyTemplate::replaceOnce(
            $html,
            'You have viewed <span>24</span> of 50 products',
            'Showing '.$products->count().' of '.$products->count().' products'
        );

        return response($html)->header('Content-Type', 'text/html');
    }
}
