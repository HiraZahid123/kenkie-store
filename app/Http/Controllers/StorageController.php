<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;

class StorageController extends Controller
{
    /**
     * Fallback for serving files from the "public" storage disk when the
     * public/storage symlink is missing or wasn't preserved by the hosting
     * environment (common on fresh deploys / some shared hosting setups —
     * `php artisan storage:link` creates a real filesystem symlink, which
     * isn't always carried over by a zip/rsync deploy). When the symlink
     * *is* present, the web server serves these files directly and this
     * route is never even reached, so it costs nothing in the normal case.
     */
    public function show(string $path)
    {
        abort_unless(Storage::disk('public')->exists($path), 404);

        return Storage::disk('public')->response($path);
    }
}
