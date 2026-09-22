<x-admin-layout :title="'Dashboard'">
    <div class="grid grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p class="text-sm text-gray-500">Products</p>
            <p class="text-2xl font-semibold text-gray-800 mt-1">{{ $stats['products'] }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p class="text-sm text-gray-500">Orders</p>
            <p class="text-2xl font-semibold text-gray-800 mt-1">{{ $stats['orders'] }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p class="text-sm text-gray-500">Customers</p>
            <p class="text-2xl font-semibold text-gray-800 mt-1">{{ $stats['customers'] }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p class="text-sm text-gray-500">Revenue (paid)</p>
            <p class="text-2xl font-semibold text-[#16a34a] mt-1">${{ number_format($stats['revenue'], 2) }}</p>
        </div>
    </div>

    <div class="grid grid-cols-3 gap-6">
        <div class="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 class="text-sm font-semibold text-gray-700">Recent Orders</h3>
                <a href="{{ route('admin.orders.index') }}" class="text-sm text-blue-600 hover:underline">View all</a>
            </div>
            <table class="min-w-full divide-y divide-gray-100">
                <tbody class="divide-y divide-gray-100">
                    @forelse ($recentOrders as $order)
                        <tr>
                            <td class="px-6 py-4 text-sm font-medium text-gray-800">{{ $order->order_number }}</td>
                            <td class="px-6 py-4 text-sm text-gray-600">{{ $order->customer_name }}</td>
                            <td class="px-6 py-4 text-sm text-gray-600">${{ number_format($order->total, 2) }}</td>
                            <td class="px-6 py-4"><x-order-status-badge :status="$order->status" /></td>
                            <td class="px-6 py-4 text-right">
                                <a href="{{ route('admin.orders.show', $order) }}" class="text-sm text-blue-600 hover:underline">View</a>
                            </td>
                        </tr>
                    @empty
                        <tr><td class="px-6 py-8 text-center text-gray-400" colspan="5">No orders yet.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 class="text-sm font-semibold text-gray-700">Low / Out of Stock</h3>
                <a href="{{ route('admin.products.index', ['stock' => 'low']) }}" class="text-sm text-blue-600 hover:underline">View all</a>
            </div>
            <ul class="divide-y divide-gray-100">
                @forelse ($lowStockProducts as $product)
                    <li class="px-6 py-3 flex items-center justify-between">
                        <a href="{{ route('admin.products.edit', $product) }}" class="text-sm text-gray-700 hover:underline truncate pr-3">{{ $product->title }}</a>
                        <span class="text-xs font-medium {{ $product->stock <= 0 ? 'text-red-500' : 'text-amber-600' }} whitespace-nowrap">
                            {{ $product->stock <= 0 ? 'Out of stock' : $product->stock.' left' }}
                        </span>
                    </li>
                @empty
                    <li class="px-6 py-8 text-center text-gray-400 text-sm">All products are well stocked.</li>
                @endforelse
            </ul>
        </div>
    </div>
</x-admin-layout>
