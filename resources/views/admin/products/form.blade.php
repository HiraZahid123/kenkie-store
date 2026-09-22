<x-admin-layout :title="$product->exists ? 'Edit Product' : 'Add Product'">
    <div class="max-w-3xl">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <form action="{{ $product->exists ? route('admin.products.update', $product) : route('admin.products.store') }}"
                  method="POST" enctype="multipart/form-data" class="space-y-6">
                @csrf
                @if ($product->exists)
                    @method('PUT')
                @endif

                @if ($errors->any())
                    <div class="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
                        <p class="font-semibold mb-1">Please fix the following:</p>
                        <ul class="list-disc list-inside space-y-0.5">
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input type="text" name="title" value="{{ old('title', $product->title) }}"
                               class="block w-full rounded-lg border-gray-300 focus:border-[#22c55e] focus:ring-[#22c55e]" required>
                        @error('title') <p class="text-red-600 text-sm mt-1">{{ $message }}</p> @enderror
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                        <input type="text" name="sku" value="{{ old('sku', $product->sku) }}"
                               class="block w-full rounded-lg border-gray-300 focus:border-[#22c55e] focus:ring-[#22c55e]">
                        @error('sku') <p class="text-red-600 text-sm mt-1">{{ $message }}</p> @enderror
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Slug (auto if blank)</label>
                        <input type="text" name="slug" value="{{ old('slug', $product->slug) }}"
                               class="block w-full rounded-lg border-gray-300 focus:border-[#22c55e] focus:ring-[#22c55e]">
                        @error('slug') <p class="text-red-600 text-sm mt-1">{{ $message }}</p> @enderror
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select name="category_id" class="block w-full rounded-lg border-gray-300 focus:border-[#22c55e] focus:ring-[#22c55e]">
                            <option value="">— None —</option>
                            @foreach (\App\Models\Category::orderBy('name')->get() as $cat)
                                <option value="{{ $cat->id }}" @selected(old('category_id', $product->category_id) == $cat->id)>
                                    {{ $cat->name }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <input type="number" step="0.01" name="price" value="{{ old('price', $product->price) }}"
                               class="block w-full rounded-lg border-gray-300 focus:border-[#22c55e] focus:ring-[#22c55e]" required>
                        @error('price') <p class="text-red-600 text-sm mt-1">{{ $message }}</p> @enderror
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Sale Price</label>
                        <input type="number" step="0.01" name="sale_price" value="{{ old('sale_price', $product->sale_price) }}"
                               class="block w-full rounded-lg border-gray-300 focus:border-[#22c55e] focus:ring-[#22c55e]">
                        @error('sale_price') <p class="text-red-600 text-sm mt-1">{{ $message }}</p> @enderror
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                        <input type="number" name="stock" value="{{ old('stock', $product->stock ?? 0) }}"
                               class="block w-full rounded-lg border-gray-300 focus:border-[#22c55e] focus:ring-[#22c55e]">
                        @error('stock') <p class="text-red-600 text-sm mt-1">{{ $message }}</p> @enderror
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" rows="5"
                              class="block w-full rounded-lg border-gray-300 focus:border-[#22c55e] focus:ring-[#22c55e]">{{ old('description', $product->description) }}</textarea>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
                    @if ($product->image)
                        <img src="{{ asset('storage/' . $product->image) }}" class="h-20 w-20 object-cover rounded-lg border mb-2">
                    @endif
                    <input type="file" name="image" accept="image/*" class="block w-full text-sm">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Gallery Images</label>
                    @if ($product->gallery)
                        <div class="flex flex-wrap gap-3 mb-3">
                            @foreach ($product->gallery as $path)
                                <label class="relative block cursor-pointer">
                                    <img src="{{ asset('storage/'.$path) }}" class="h-20 w-20 object-cover rounded-lg border">
                                    <span class="absolute -top-2 -right-2 bg-white rounded-full shadow border">
                                        <input type="checkbox" name="remove_gallery[]" value="{{ $path }}" class="m-1.5 rounded border-gray-300 text-red-600 focus:ring-red-500">
                                    </span>
                                </label>
                            @endforeach
                        </div>
                        <p class="text-xs text-gray-400 mb-2">Check an image's box to remove it when you save.</p>
                    @endif
                    <input type="file" name="gallery[]" accept="image/*" multiple class="block w-full text-sm">
                </div>

                <div class="flex items-center">
                    <input type="checkbox" name="is_featured" value="1"
                           @checked(old('is_featured', $product->is_featured))
                           class="rounded border-gray-300 text-[#22c55e] focus:ring-[#22c55e]">
                    <label class="ml-2 text-sm text-gray-700">Featured product</label>
                </div>

                <div class="flex items-center gap-4 pt-2">
                    <button type="submit" class="px-5 py-2.5 bg-[#22c55e] hover:bg-[#1ea34f] text-white rounded-lg text-sm font-medium">
                        {{ $product->exists ? 'Update Product' : 'Create Product' }}
                    </button>
                    <a href="{{ route('admin.products.index') }}" class="text-sm text-gray-600">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</x-admin-layout>
