<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Support\LegacyTemplate;
use Illuminate\Support\Facades\View;

class HomeController extends Controller
{
    public function __invoke()
    {
        // Latest 8 products for "New Arrivals" section
        $newArrivals = Product::with('category')->latest()->take(8)->get();

        // All products for "Best Sellers" tabs (show all, tabs are cosmetic in static theme)
        $bestSellers = Product::with('category')->latest()->take(8)->get();

        // All categories for the category icon slider
        $categories = Category::orderBy('name')->get();

        // Render blade partials into HTML strings
        $newArrivalsHtml = $newArrivals
            ->map(fn ($p) => View::make('home._product_card', ['product' => $p])->render())
            ->implode("\n");

        $bestSellersHtml = $bestSellers
            ->map(fn ($p) => View::make('home._product_card', ['product' => $p])->render())
            ->implode("\n");

        $categoryItemsHtml = $categories
            ->map(fn ($c) => View::make('home._category_item', ['category' => $c])->render())
            ->implode("\n");

        // Read static homepage shell and splice in dynamic content
        $html = LegacyTemplate::read('home/index.html');

        // 1. Replace "New Arrivals" product slider
        $html = LegacyTemplate::spliceHomeNewArrivals($html, $newArrivalsHtml);

        // 2. Replace all "Best Sellers" tab product lists
        $html = LegacyTemplate::spliceHomeBestSellers($html, $bestSellersHtml);

        // 3. Replace category icon slider items
        $html = LegacyTemplate::spliceHomeCategorySlider($html, $categoryItemsHtml);

        return response($html)->header('Content-Type', 'text/html');
    }
}
