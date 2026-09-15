<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    private array $keys = [
        'store_name', 'store_email', 'store_phone', 'store_address',
        'shipping_fee', 'free_shipping_threshold', 'currency_symbol',
    ];

    public function edit()
    {
        $settings = collect($this->keys)->mapWithKeys(fn ($key) => [$key => Setting::get($key)]);

        return view('admin.settings.edit', compact('settings'));
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'store_name' => ['nullable', 'string', 'max:255'],
            'store_email' => ['nullable', 'email', 'max:255'],
            'store_phone' => ['nullable', 'string', 'max:50'],
            'store_address' => ['nullable', 'string'],
            'shipping_fee' => ['nullable', 'numeric'],
            'free_shipping_threshold' => ['nullable', 'numeric'],
            'currency_symbol' => ['nullable', 'string', 'max:5'],
        ]);

        foreach ($data as $key => $value) {
            Setting::set($key, $value);
        }

        return redirect()->route('admin.settings.edit')->with('status', 'Settings saved.');
    }
}
