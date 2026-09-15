<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Login — Kenkie Admin</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-100 font-sans antialiased">
    <div class="min-h-screen flex items-center justify-center px-4">
        <div class="w-full max-w-md">
            <div class="flex justify-center mb-8">
                <img src="{{ asset('images/kenkie-logo.png') }}" alt="Kenkie" class="h-14 w-auto">
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h1 class="text-lg font-semibold text-gray-800 mb-1">Welcome back</h1>
                <p class="text-sm text-gray-500 mb-6">Sign in to manage your store.</p>

                <x-auth-session-status class="mb-4" :status="session('status')" />

                @if ($errors->any())
                    <div class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                        {{ $errors->first() }}
                    </div>
                @endif

                <form method="POST" action="{{ route('login') }}" class="space-y-5">
                    @csrf

                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input id="email" type="email" name="email" value="{{ old('email') }}" required autofocus autocomplete="username"
                               class="block w-full rounded-lg border-gray-300 focus:border-[#22c55e] focus:ring-[#22c55e]">
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input id="password" type="password" name="password" required autocomplete="current-password"
                               class="block w-full rounded-lg border-gray-300 focus:border-[#22c55e] focus:ring-[#22c55e]">
                    </div>

                    <div class="flex items-center justify-between">
                        <label class="inline-flex items-center">
                            <input type="checkbox" name="remember" class="rounded border-gray-300 text-[#22c55e] focus:ring-[#22c55e]">
                            <span class="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>

                        @if (Route::has('password.request'))
                            <a class="text-sm text-gray-500 hover:text-gray-800" href="{{ route('password.request') }}">
                                Forgot password?
                            </a>
                        @endif
                    </div>

                    <button type="submit"
                            class="w-full px-4 py-2.5 bg-[#22c55e] hover:bg-[#1ea34f] text-white rounded-lg text-sm font-medium shadow-sm">
                        Log in
                    </button>
                </form>
            </div>

            <p class="text-center text-xs text-gray-400 mt-6">&copy; {{ date('Y') }} Kenkie. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
