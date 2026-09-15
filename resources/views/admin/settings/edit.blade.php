<x-admin-layout :title="'Settings'">
    <div class="max-w-2xl">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <form action="{{ route('admin.settings.update') }}" method="POST" class="space-y-6">
                @csrf
                @method('PUT')

                <div>
                    <h3 class="text-sm font-semibold text-gray-700 mb-4">Store Information</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                            <input type="text" name="store_name" value="{{ old('store_name', $settings['store_name']) }}"
                                   class="block w-full rounded-lg border-gray-300 focus:border-[#22c55e] focus:ring-[#22c55e]">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Store Email</label>
                            <input type="email" name="store_email" value="{{ old('store_email', $settings['store_email']) }}"
                                   class="block w-full rounded-lg border-gray-300 focus:border-[#22c55e] focus:ring-[#22c55e]">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Store Phone</label>
                            <input type="text" name="store_phone" value="{{ old('store_phone', $settings['store_phone']) }}"
                                   class="block w-full rounded-lg border-gray-300 focus:border-[#22c55e] focus:ring-[#22c55e]">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
                            <input type="text" name="currency_symbol" value="{{ old('currency_symbol', $settings['currency_symbol'] ?? '$') }}"
                                   class="block w-full rounded-lg border-gray-300 focus:border-[#22c55e] focus:ring-[#22c55e]">
                        </div>
                    </div>
                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Store Address</label>
                        <textarea name="store_address" rows="2"
                                  class="block w-full rounded-lg border-gray-300 focus:border-[#22c55e] focus:ring-[#22c55e]">{{ old('store_address', $settings['store_address']) }}</textarea>
                    </div>
                </div>

                <div class="border-t pt-6">
                    <h3 class="text-sm font-semibold text-gray-700 mb-4">Shipping</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Flat Shipping Fee</label>
                            <input type="number" step="0.01" name="shipping_fee" value="{{ old('shipping_fee', $settings['shipping_fee']) }}"
                                   class="block w-full rounded-lg border-gray-300 focus:border-[#22c55e] focus:ring-[#22c55e]">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Free Shipping Above</label>
                            <input type="number" step="0.01" name="free_shipping_threshold" value="{{ old('free_shipping_threshold', $settings['free_shipping_threshold']) }}"
                                   class="block w-full rounded-lg border-gray-300 focus:border-[#22c55e] focus:ring-[#22c55e]">
                        </div>
                    </div>
                </div>

                <div class="pt-2">
                    <button type="submit" class="px-5 py-2.5 bg-[#22c55e] hover:bg-[#1ea34f] text-white rounded-lg text-sm font-medium">
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    </div>
</x-admin-layout>
