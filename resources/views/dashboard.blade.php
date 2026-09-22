<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('My Account') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                <p class="text-gray-700">Welcome back, <strong>{{ auth()->user()->name }}</strong>.</p>
                <div class="mt-3 flex gap-4 text-sm">
                    <a href="{{ route('profile.edit') }}" class="text-[#22c55e] hover:underline">Edit profile</a>
                    <a href="{{ url('/shop/index.html') }}" class="text-[#22c55e] hover:underline">Continue shopping</a>
                </div>
            </div>

            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h3 class="text-sm font-semibold text-gray-700">My Orders</h3>
                </div>

                <table class="min-w-full divide-y divide-gray-100">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        @forelse ($orders as $order)
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 text-sm font-medium text-gray-800">{{ $order->order_number }}</td>
                                <td class="px-6 py-4 text-sm text-gray-500">{{ $order->created_at->format('M d, Y') }}</td>
                                <td class="px-6 py-4"><x-order-status-badge :status="$order->status" /></td>
                                <td class="px-6 py-4 text-sm text-gray-600">{{ ucfirst($order->payment_status) }}</td>
                                <td class="px-6 py-4 text-sm text-right text-gray-800">${{ number_format($order->total, 2) }}</td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5" class="px-6 py-12 text-center text-gray-400">
                                    You haven't placed any orders yet.
                                    <a href="{{ url('/shop/index.html') }}" class="text-[#22c55e] hover:underline">Start shopping</a>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>

                @if ($orders->hasPages())
                    <div class="px-6 py-4">
                        {{ $orders->links() }}
                    </div>
                @endif
            </div>
        </div>
    </div>
</x-app-layout>
