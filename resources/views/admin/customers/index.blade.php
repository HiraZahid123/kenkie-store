<x-admin-layout :title="'Customers'">
    <div class="mb-6">
        <h2 class="text-lg font-semibold text-gray-800">Customers</h2>
        <p class="text-sm text-gray-500">Everyone who has registered on your store.</p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                @forelse ($customers as $customer)
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 font-medium text-gray-800">{{ $customer->name }}</td>
                        <td class="px-6 py-4 text-sm text-gray-600">{{ $customer->email }}</td>
                        <td class="px-6 py-4 text-sm text-gray-600">{{ $customer->orders_count }}</td>
                        <td class="px-6 py-4 text-sm text-gray-500">{{ $customer->created_at->format('M d, Y') }}</td>
                        <td class="px-6 py-4 text-right">
                            <a href="{{ route('admin.customers.show', $customer) }}" class="text-sm text-blue-600 hover:underline">View</a>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="px-6 py-12 text-center text-gray-400">No customers yet.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="mt-4">
        {{ $customers->links() }}
    </div>
</x-admin-layout>
