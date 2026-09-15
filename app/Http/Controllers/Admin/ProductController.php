<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::latest()->paginate(15);

        return view('admin.products.index', compact('products'));
    }

    public function create()
    {
        return view('admin.products.form', ['product' => new Product()]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        if ($request->hasFile('gallery')) {
            $data['gallery'] = collect($request->file('gallery'))
                ->map(fn ($file) => $file->store('products', 'public'))
                ->all();
        }

        $data['slug'] = $data['slug'] ?: Str::slug($data['title']);
        $data['is_featured'] = $request->boolean('is_featured');

        Product::create($data);

        return redirect()->route('admin.products.index')->with('status', 'Product created.');
    }

    public function edit(Product $product)
    {
        return view('admin.products.form', compact('product'));
    }

    public function update(Request $request, Product $product)
    {
        $data = $this->validated($request);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        if ($request->hasFile('gallery')) {
            $data['gallery'] = collect($request->file('gallery'))
                ->map(fn ($file) => $file->store('products', 'public'))
                ->all();
        }

        $data['slug'] = $data['slug'] ?: Str::slug($data['title']);
        $data['is_featured'] = $request->boolean('is_featured');

        $product->update($data);

        return redirect()->route('admin.products.index')->with('status', 'Product updated.');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('admin.products.index')->with('status', 'Product deleted.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'sku' => ['nullable', 'string', 'max:255'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'sale_price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:4096'],
            'gallery.*' => ['nullable', 'image', 'max:4096'],
        ]);
    }
}
