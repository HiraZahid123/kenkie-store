<x-admin-layout :title="'Products'">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
            <h2 class="text-lg font-semibold text-gray-800">All Products</h2>
            <p class="text-sm text-gray-500">Manage your store's product catalog.</p>
        </div>
        <a href="{{ route('admin.products.create') }}"
           class="px-4 py-2.5 bg-[#22c55e] hover:bg-[#1ea34f] text-white rounded-lg text-sm font-medium shadow-sm">
            + Add Product
        </a>
    </div>

    <form method="GET" class="flex items-center gap-3 mb-4 flex-wrap">
        <input type="text" name="q" value="{{ request('q') }}" placeholder="Search by title or SKU…"
               class="rounded-lg border-gray-300 text-sm focus:border-[#22c55e] focus:ring-[#22c55e] w-64">
        <select name="category" onchange="this.form.submit()" class="rounded-lg border-gray-300 text-sm focus:border-[#22c55e] focus:ring-[#22c55e]">
            <option value="">All categories</option>
            @foreach ($categories as $cat)
                <option value="{{ $cat->id }}" @selected(request('category') == $cat->id)>{{ $cat->name }}</option>
            @endforeach
        </select>
        <select name="stock" onchange="this.form.submit()" class="rounded-lg border-gray-300 text-sm focus:border-[#22c55e] focus:ring-[#22c55e]">
            <option value="">All stock levels</option>
            <option value="low" @selected(request('stock') === 'low')>Low stock (1–5)</option>
            <option value="out" @selected(request('stock') === 'out')>Out of stock</option>
        </select>
        <button type="submit" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">Filter</button>
        @if (request()->anyFilled(['q', 'category', 'stock']))
            <a href="{{ route('admin.products.index') }}" class="text-sm text-gray-500 hover:underline">Clear</a>
        @endif
    </form>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                @forelse ($products as $product)
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-3">
                                @if ($product->image)
                                    <img src="{{ asset('storage/' . $product->image) }}" class="h-12 w-12 object-cover rounded-lg border">
                                @else
                                    <div class="h-12 w-12 bg-gray-100 rounded-lg"></div>
                                @endif
                                <div>
                                    <div class="font-medium text-gray-800">{{ $product->title }}</div>
                                    @if ($product->sku)
                                        <div class="text-xs text-gray-400">SKU: {{ $product->sku }}</div>
                                    @endif
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-600">{{ $product->category?->name ?? '—' }}</td>
                        <td class="px-6 py-4 text-sm">
                            @if ($product->stock <= 0)
                                <span class="text-red-500 font-medium">Out of stock</span>
                            @elseif ($product->stock <= 5)
                                <span class="text-amber-600 font-medium">{{ $product->stock }} left (low)</span>
                            @else
                                <span class="text-gray-700">{{ $product->stock }} in stock</span>
                            @endif
                        </td>
                        <td class="px-6 py-4 text-sm">
                            @if ($product->sale_price)
                                <span class="line-through text-gray-400">${{ number_format($product->price, 2) }}</span>
                                <span class="text-[#16a34a] font-semibold">${{ number_format($product->sale_price, 2) }}</span>
                            @else
                                <span class="text-gray-800">${{ number_format($product->price, 2) }}</span>
                            @endif
                        </td>
                        <td class="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                            <a href="{{ route('admin.products.edit', $product) }}" class="text-sm text-blue-600 hover:underline">Edit</a>
                            <form action="{{ route('admin.products.destroy', $product) }}" method="POST" class="inline" onsubmit="return confirm('Delete this product?');">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="text-sm text-red-600 hover:underline">Delete</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="px-6 py-12 text-center text-gray-400">
                            @if (request()->anyFilled(['q', 'category', 'stock']))
                                No products match your filters.
                            @else
                                No products yet — add your first one.
                            @endif
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="mt-4">
        {{ $products->links() }}
    </div>
</x-admin-layout>
