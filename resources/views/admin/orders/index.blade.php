<x-admin-layout :title="'Orders'">
    <div class="flex items-center justify-between mb-6">
        <div>
            <h2 class="text-lg font-semibold text-gray-800">Orders</h2>
            <p class="text-sm text-gray-500">Track and manage customer orders.</p>
        </div>
        <form method="GET" class="flex items-center gap-2">
            <select name="status" onchange="this.form.submit()" class="rounded-lg border-gray-300 text-sm focus:border-[#22c55e] focus:ring-[#22c55e]">
                <option value="">All statuses</option>
                @foreach (\App\Models\Order::STATUSES as $status)
                    <option value="{{ $status }}" @selected(request('status') === $status)>{{ ucfirst($status) }}</option>
                @endforeach
            </select>
        </form>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                @forelse ($orders as $order)
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 font-medium text-gray-800">{{ $order->order_number }}</td>
                        <td class="px-6 py-4 text-sm text-gray-600">{{ $order->customer_name }}</td>
                        <td class="px-6 py-4 text-sm text-gray-800">${{ number_format($order->total, 2) }}</td>
                        <td class="px-6 py-4">
                            <x-order-status-badge :status="$order->status" />
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500">{{ $order->created_at->format('M d, Y') }}</td>
                        <td class="px-6 py-4 text-right">
                            <a href="{{ route('admin.orders.show', $order) }}" class="text-sm text-blue-600 hover:underline">View</a>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="6" class="px-6 py-12 text-center text-gray-400">No orders yet.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="mt-4">
        {{ $orders->links() }}
    </div>
</x-admin-layout>
