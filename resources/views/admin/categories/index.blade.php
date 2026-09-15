<x-admin-layout :title="'Categories'">
    <div class="flex items-center justify-between mb-6">
        <div>
            <h2 class="text-lg font-semibold text-gray-800">Categories</h2>
            <p class="text-sm text-gray-500">Organize your products into categories.</p>
        </div>
        <a href="{{ route('admin.categories.create') }}"
           class="px-4 py-2.5 bg-[#22c55e] hover:bg-[#1ea34f] text-white rounded-lg text-sm font-medium shadow-sm">
            + Add Category
        </a>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                @forelse ($categories as $category)
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-3">
                                @if ($category->image)
                                    <img src="{{ asset('storage/' . $category->image) }}" class="h-10 w-10 object-cover rounded-lg border">
                                @else
                                    <div class="h-10 w-10 bg-gray-100 rounded-lg"></div>
                                @endif
                                <span class="font-medium text-gray-800">{{ $category->name }}</span>
                            </div>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-600">{{ $category->products_count }}</td>
                        <td class="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                            <a href="{{ route('admin.categories.edit', $category) }}" class="text-sm text-blue-600 hover:underline">Edit</a>
                            <form action="{{ route('admin.categories.destroy', $category) }}" method="POST" class="inline" onsubmit="return confirm('Delete this category?');">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="text-sm text-red-600 hover:underline">Delete</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="3" class="px-6 py-12 text-center text-gray-400">No categories yet.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="mt-4">
        {{ $categories->links() }}
    </div>
</x-admin-layout>
