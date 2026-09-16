<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Support\LegacyTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;

class WishlistController extends Controller
{
    /**
     * The wishlist page itself is a static shell; the items in it are
     * stored client-side (localStorage) and fetched via items() below.
     */
    public function index()
    {
        $html = LegacyTemplate::spliceProductGrid('wishlist/index.html', '');

        $html = LegacyTemplate::replaceOnce(
            $html,
            '<ul class="products columns-3 columns-md-3 columns-sm-2 columns-xs-2">',
            '<div id="wishlist-empty" class="woocommerce-info" style="display:none;">'
                .'Your wishlist is empty. <a href="'.url('/shop/index.html').'">Browse products</a></div>'
                ."\n".'<ul class="products columns-3 columns-md-3 columns-sm-2 columns-xs-2" id="wishlist-grid">'
        );

        $html = LegacyTemplate::replaceOnce($html, '<title>Shop &#8211;', '<title>Wishlist &#8211;');
        $html = LegacyTemplate::replaceOnce($html, '<h1>Shop</h1>', '<h1>Wishlist</h1>');

        $html = LegacyTemplate::replaceOnce(
            $html,
            '<div class="pagination-ajax-total-title">You have viewed <span>24</span> of 50 products</div>',
            '<div class="pagination-ajax-total-title" id="wishlist-count-text">Your wishlist is empty</div>'
        );

        return response($html)->header('Content-Type', 'text/html');
    }

    /**
     * Renders product cards for the given ids (called client-side with the
     * ids read out of localStorage), reusing the same card partial as the
     * shop and category pages so the markup stays consistent.
     */
    public function items(Request $request)
    {
        $ids = collect(explode(',', (string) $request->query('ids', '')))
            ->map(fn ($id) => (int) trim($id))
            ->filter()
            ->unique()
            ->values();

        if ($ids->isEmpty()) {
            return response('')->header('Content-Type', 'text/html');
        }

        $products = Product::with('category')->whereIn('id', $ids)->get();

        $cardsHtml = $products->map(fn ($product) => View::make('shop._card', compact('product'))->render())
            ->implode("\n");

        return response($cardsHtml)->header('Content-Type', 'text/html');
    }
}
