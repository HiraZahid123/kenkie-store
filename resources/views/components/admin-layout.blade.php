@props(['title' => 'Dashboard'])
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title ?? 'Admin' }} — Kenkie Admin</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-100 font-sans antialiased">
    <div class="flex min-h-screen">
        {{-- Sidebar --}}
        <aside class="w-64 bg-[#0f172a] text-gray-300 flex-shrink-0 flex flex-col">
            <div class="h-20 flex items-center justify-center border-b border-white/10">
                <a href="{{ route('admin.dashboard') }}">
                    <img src="{{ asset('images/kenkie-logo.png') }}" alt="Kenkie" class="h-9 w-auto">
                </a>
            </div>
            <nav class="flex-1 py-6 space-y-1 px-3">
                @php
                    $nav = [
                        ['label' => 'Dashboard', 'route' => 'admin.dashboard', 'icon' => 'grid'],
                        ['label' => 'Products', 'route' => 'admin.products.index', 'icon' => 'box'],
                        ['label' => 'Categories', 'route' => 'admin.categories.index', 'icon' => 'tag'],
                        ['label' => 'Orders', 'route' => 'admin.orders.index', 'icon' => 'cart'],
                        ['label' => 'Customers', 'route' => 'admin.customers.index', 'icon' => 'users'],
                        ['label' => 'Settings', 'route' => 'admin.settings.edit', 'icon' => 'gear'],
                    ];
                @endphp
                @foreach ($nav as $item)
                    @php $active = request()->routeIs($item['route'].'*'); @endphp
                    <a href="{{ route($item['route']) }}"
                       class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
                              {{ $active ? 'bg-[#22c55e] text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white' }}">
                        <x-admin-icon :name="$item['icon']" class="w-5 h-5" />
                        {{ $item['label'] }}
                    </a>
                @endforeach
            </nav>
            <div class="p-4 border-t border-white/10 text-xs text-gray-500">
                Kenkie Admin &copy; {{ date('Y') }}
            </div>
        </aside>

        {{-- Main --}}
        <div class="flex-1 flex flex-col min-w-0">
            <header class="h-20 bg-white border-b flex items-center justify-between px-8">
                <h1 class="text-xl font-semibold text-gray-800">{{ $title ?? 'Dashboard' }}</h1>

                <div class="relative" x-data="{ open: false }">
                    <button @click="open = !open" class="flex items-center gap-2 text-sm text-gray-700">
                        <span class="w-8 h-8 rounded-full bg-[#22c55e] text-white flex items-center justify-center font-semibold">
                            {{ strtoupper(substr(auth()->user()->name, 0, 1)) }}
                        </span>
                        {{ auth()->user()->name }}
                    </button>
                    <div x-show="open" @click.outside="open = false" x-cloak
                         class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border py-1 z-10">
                        <a href="{{ route('profile.edit') }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</a>
                        <a href="{{ url('/') }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" target="_blank">View Store</a>
                        <form method="POST" action="{{ route('logout') }}">
                            @csrf
                            <button type="submit" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Logout</button>
                        </form>
                    </div>
                </div>
            </header>

            <main class="flex-1 p-8">
                @if (session('status'))
                    <div class="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm">
                        {{ session('status') }}
                    </div>
                @endif

                {{ $slot }}
            </main>
        </div>
    </div>
</body>
</html>
