<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = User::where('role', 'customer')->withCount('orders')->latest()->paginate(15);

        return view('admin.customers.index', compact('customers'));
    }

    public function show(User $customer)
    {
        $customer->load('orders');

        return view('admin.customers.show', compact('customer'));
    }

    public function updateRole(Request $request, User $customer)
    {
        $request->validate([
            'role' => ['required', 'in:customer,admin'],
        ]);

        if ($customer->id === auth()->id()) {
            return redirect()->back()->with('error', "You can't change your own role.");
        }

        $customer->update(['role' => $request->role]);

        return redirect()->back()->with('status', $customer->name.' is now '.($request->role === 'admin' ? 'an admin' : 'a customer').'.');
    }
}
