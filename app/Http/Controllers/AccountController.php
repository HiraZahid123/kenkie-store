<?php

namespace App\Http\Controllers;

class AccountController extends Controller
{
    /**
     * The logged-in customer's account home: their own order history.
     * Admins are sent to the admin dashboard instead.
     */
    public function index()
    {
        $user = auth()->user();

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        $orders = $user->orders()->latest()->paginate(10);

        return view('dashboard', compact('orders'));
    }
}
