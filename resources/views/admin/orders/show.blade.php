<x-admin-layout :title="'Order ' . $order->order_number">
    <div class="grid grid-cols-3 gap-6">
        <div class="col-span-2 space-y-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table class="min-w-full divide-y divide-gray-100">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        @foreach ($order->items as $item)
                            <tr>
                                <td class="px-6 py-4 text-sm text-gray-800">{{ $item->product_title }}</td>
                                <td class="px-6 py-4 text-sm text-gray-600">${{ number_format($item->price, 2) }}</td>
                                <td class="px-6 py-4 text-sm text-gray-600">{{ $item->quantity }}</td>
                                <td class="px-6 py-4 text-sm text-right text-gray-800">${{ number_format($item->price * $item->quantity, 2) }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
                <div class="border-t border-gray-100 px-6 py-4 space-y-1 text-sm">
                    <div class="flex justify-between text-gray-600">
                        <span>Subtotal</span><span>${{ number_format($order->subtotal, 2) }}</span>
                    </div>
                    <div class="flex justify-between text-gray-600">
                        <span>Shipping</span><span>${{ number_format($order->shipping_fee, 2) }}</span>
                    </div>
                    <div class="flex justify-between font-semibold text-gray-900 text-base pt-1">
                        <span>Total</span><span>${{ number_format($order->total, 2) }}</span>
                    </div>
                </div>
            </div>

            @if ($order->notes)
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 class="text-sm font-semibold text-gray-700 mb-2">Notes</h3>
                    <p class="text-sm text-gray-600">{{ $order->notes }}</p>
                </div>
            @endif
        </div>

        <div class="space-y-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 class="text-sm font-semibold text-gray-700 mb-3">Customer</h3>
                <p class="text-sm text-gray-800">{{ $order->customer_name }}</p>
                <p class="text-sm text-gray-500">{{ $order->customer_email }}</p>
                <p class="text-sm text-gray-500">{{ $order->customer_phone }}</p>
                @if ($order->shipping_address)
                    <p class="text-sm text-gray-500 mt-2 whitespace-pre-line">{{ $order->shipping_address }}</p>
                @endif
                @if ($order->payment_method)
                    <p class="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
                        Payment method: <span class="font-medium text-gray-600">{{ $order->payment_method }}</span>
                        @if ($order->stripe_session_id)
                            <br>Stripe session: <span class="font-mono">{{ $order->stripe_session_id }}</span>
                        @endif
                    </p>
                @endif
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 class="text-sm font-semibold text-gray-700 mb-3">Update Status</h3>
                <form action="{{ route('admin.orders.update', $order) }}" method="POST" class="space-y-4">
                    @csrf
                    @method('PUT')
                    <div>
                        <label class="block text-xs font-medium text-gray-500 mb-1">Order Status</label>
                        <select name="status" class="block w-full rounded-lg border-gray-300 text-sm focus:border-[#22c55e] focus:ring-[#22c55e]">
                            @foreach (\App\Models\Order::STATUSES as $status)
                                <option value="{{ $status }}" @selected($order->status === $status)>{{ ucfirst($status) }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-500 mb-1">Payment Status</label>
                        <select name="payment_status" class="block w-full rounded-lg border-gray-300 text-sm focus:border-[#22c55e] focus:ring-[#22c55e]">
                            @foreach (['unpaid', 'paid', 'refunded'] as $status)
                                <option value="{{ $status }}" @selected($order->payment_status === $status)>{{ ucfirst($status) }}</option>
                            @endforeach
                        </select>
                    </div>
                    <button type="submit" class="w-full px-4 py-2.5 bg-[#22c55e] hover:bg-[#1ea34f] text-white rounded-lg text-sm font-medium">
                        Save
                    </button>
                </form>
            </div>
        </div>
    </div>
</x-admin-layout>
