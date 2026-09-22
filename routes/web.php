<?php

use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\StorageController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

// Fallback for /storage/* when the public/storage symlink is missing (see
// StorageController docblock). Only reached if the web server didn't
// already serve a real symlinked file for this path.
Route::get('/storage/{path}', [StorageController::class, 'show'])
    ->where('path', '.*')
    ->name('storage.fallback');

Route::get('/shop/index.html', [ShopController::class, 'index'])->name('shop');
Route::get('/product-category/{slug}/index.html', [CategoryController::class, 'show'])->name('category.show');
Route::get('/product-category/{slug}', [CategoryController::class, 'show'])->name('category.show.short');
Route::get('/product/{slug}/index.html', [ProductController::class, 'show'])->name('product.show');

Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.short');
Route::get('/wishlist/index.html', [WishlistController::class, 'index'])->name('wishlist');
Route::get('/wishlist/items', [WishlistController::class, 'items'])->name('wishlist.items');

Route::get('/cart', [CartController::class, 'index'])->name('cart');
Route::get('/cart/index.html', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
Route::post('/cart/update', [CartController::class, 'update'])->name('cart.update');
Route::post('/cart/remove', [CartController::class, 'remove'])->name('cart.remove');
Route::get('/cart/data', [CartController::class, 'data'])->name('cart.data');

Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/checkout/success/{order}', [CheckoutController::class, 'success'])->name('checkout.success');
Route::get('/checkout/stripe/callback', [CheckoutController::class, 'stripeCallback'])->name('checkout.stripe.callback');
Route::get('/checkout/stripe/cancel', [CheckoutController::class, 'stripeCancel'])->name('checkout.stripe.cancel');

Route::get('/dashboard', [\App\Http\Controllers\AccountController::class, 'index'])
    ->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', DashboardController::class)->name('dashboard');
    Route::resource('products', AdminProductController::class)->except(['show']);
    Route::resource('categories', AdminCategoryController::class)->except(['show']);
    Route::resource('orders', OrderController::class)->only(['index', 'show', 'update']);
    Route::resource('customers', CustomerController::class)->only(['index', 'show']);
    Route::patch('customers/{customer}/role', [CustomerController::class, 'updateRole'])->name('customers.role');
    Route::get('settings', [SettingController::class, 'edit'])->name('settings.edit');
    Route::put('settings', [SettingController::class, 'update'])->name('settings.update');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
