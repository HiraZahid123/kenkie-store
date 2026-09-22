<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $stats = [
            'products' => Product::count(),
            'orders' => Order::count(),
            'customers' => User::where('role', 'customer')->count(),
            'revenue' => Order::where('payment_status', 'paid')->sum('total'),
        ];

        $recentOrders = Order::latest()->take(5)->get();

        $lowStockProducts = Product::where('stock', '<=', 5)->orderBy('stock')->take(6)->get();

        return view('admin.dashboard', compact('stats', 'recentOrders', 'lowStockProducts'));
    }
}
