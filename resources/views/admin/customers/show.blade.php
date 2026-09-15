<x-admin-layout :title="$customer->name">
    <div class="grid grid-cols-3 gap-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">Contact</h3>
            <p class="text-sm text-gray-800">{{ $customer->name }}</p>
            <p class="text-sm text-gray-500">{{ $customer->email }}</p>
            <p class="text-xs text-gray-400 mt-2">Joined {{ $customer->created_at->format('M d, Y') }}</p>
        </div>

        <div class="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
                <h3 class="text-sm font-semibold text-gray-700">Order History</h3>
            </div>
            <table class="min-w-full divide-y divide-gray-100">
                <tbody class="divide-y divide-gray-100">
                    @forelse ($customer->orders as $order)
                        <tr>
                            <td class="px-6 py-4 text-sm font-medium text-gray-800">{{ $order->order_number }}</td>
                            <td class="px-6 py-4 text-sm text-gray-600">${{ number_format($order->total, 2) }}</td>
                            <td class="px-6 py-4"><x-order-status-badge :status="$order->status" /></td>
                            <td class="px-6 py-4 text-right">
                                <a href="{{ route('admin.orders.show', $order) }}" class="text-sm text-blue-600 hover:underline">View</a>
                            </td>
                        </tr>
                    @empty
                        <tr><td class="px-6 py-8 text-center text-gray-400" colspan="4">No orders yet.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</x-admin-layout>
