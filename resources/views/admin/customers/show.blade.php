<x-admin-layout :title="$customer->name">
    <div class="grid grid-cols-3 gap-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">Contact</h3>
            <p class="text-sm text-gray-800">{{ $customer->name }}</p>
            <p class="text-sm text-gray-500">{{ $customer->email }}</p>
            <p class="text-xs text-gray-400 mt-2">Joined {{ $customer->created_at->format('M d, Y') }}</p>

            <div class="mt-4 pt-4 border-t border-gray-100">
                <p class="text-xs text-gray-500 mb-2">Role: <span class="font-medium text-gray-700">{{ ucfirst($customer->role) }}</span></p>
                @if ($customer->id !== auth()->id())
                    <form method="POST" action="{{ route('admin.customers.role', $customer) }}"
                          onsubmit="return confirm('{{ $customer->isAdmin() ? 'Remove admin access from' : 'Grant admin access to' }} {{ $customer->name }}?');">
                        @csrf
                        @method('PATCH')
                        <input type="hidden" name="role" value="{{ $customer->isAdmin() ? 'customer' : 'admin' }}">
                        <button type="submit" class="text-sm text-blue-600 hover:underline">
                            {{ $customer->isAdmin() ? 'Revoke admin access' : 'Make admin' }}
                        </button>
                    </form>
                @endif
            </div>
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
