<x-admin-layout :title="$category->exists ? 'Edit Category' : 'Add Category'">
    <div class="max-w-xl">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <form action="{{ $category->exists ? route('admin.categories.update', $category) : route('admin.categories.store') }}"
                  method="POST" enctype="multipart/form-data" class="space-y-6">
                @csrf
                @if ($category->exists)
                    @method('PUT')
                @endif

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" name="name" value="{{ old('name', $category->name) }}"
                           class="block w-full rounded-lg border-gray-300 focus:border-[#22c55e] focus:ring-[#22c55e]" required>
                    @error('name') <p class="text-red-600 text-sm mt-1">{{ $message }}</p> @enderror
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Slug (auto if blank)</label>
                    <input type="text" name="slug" value="{{ old('slug', $category->slug) }}"
                           class="block w-full rounded-lg border-gray-300 focus:border-[#22c55e] focus:ring-[#22c55e]">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    @if ($category->image)
                        <img src="{{ asset('storage/' . $category->image) }}" class="h-16 w-16 object-cover rounded-lg border mb-2">
                    @endif
                    <input type="file" name="image" accept="image/*" class="block w-full text-sm">
                    @error('image') <p class="text-red-600 text-sm mt-1">{{ $message }}</p> @enderror
                </div>

                <div class="flex items-center gap-4 pt-2">
                    <button type="submit" class="px-5 py-2.5 bg-[#22c55e] hover:bg-[#1ea34f] text-white rounded-lg text-sm font-medium">
                        {{ $category->exists ? 'Update' : 'Create' }}
                    </button>
                    <a href="{{ route('admin.categories.index') }}" class="text-sm text-gray-600">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</x-admin-layout>
