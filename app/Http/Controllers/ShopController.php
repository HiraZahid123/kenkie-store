<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Support\LegacyTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;

class ShopController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')->latest();

        $category = null;
        if ($slug = $request->query('category')) {
            $category = Category::where('slug', $slug)->first();
            if ($category) {
                $query->where('category_id', $category->id);
            }
        }

        $products = $query->get();

        $cardsHtml = $products->map(fn ($product) => View::make('shop._card', compact('product'))->render())
            ->implode("\n");

        $html = LegacyTemplate::spliceProductGrid('shop/index.html', $cardsHtml);

        $html = LegacyTemplate::replaceOnce(
            $html,
            'You have viewed <span>24</span> of 50 products',
            'Showing '.$products->count().' of '.$products->count().' products'
        );

        if ($category) {
            $html = LegacyTemplate::replaceOnce($html, '<title>Shop &#8211;', '<title>'.$category->name.' &#8211;');
            $html = LegacyTemplate::replaceOnce($html, '<h1>Shop</h1>', '<h1>'.$category->name.'</h1>');
        }

        return response($html)->header('Content-Type', 'text/html');
    }
}
