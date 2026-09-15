<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = json_decode(file_get_contents(__DIR__.'/data/products_seed.json'), true);

        foreach ($data as $row) {
            $categoryName = Str::title(str_replace('-', ' ', $row['category'] ?? 'uncategorized'));
            $category = Category::firstOrCreate(
                ['slug' => Str::slug($categoryName)],
                ['name' => $categoryName]
            );

            $images = collect($row['images'])
                ->map(fn ($relative) => $this->importImage($relative))
                ->filter()
                ->values();

            Product::updateOrCreate(
                ['slug' => $row['slug']],
                [
                    'title' => $row['title'],
                    'category_id' => $category->id,
                    'price' => $row['price'] ?? 0,
                    'sale_price' => $row['sale_price'] ?? null,
                    'stock' => 25,
                    'description' => $row['description'] ?? '',
                    'image' => $images->first(),
                    'gallery' => $images->slice(1)->values()->all(),
                    'is_featured' => false,
                ]
            );
        }
    }

    private function importImage(string $relativePublicPath): ?string
    {
        $source = public_path($relativePublicPath);
        if (! file_exists($source)) {
            return null;
        }

        $filename = 'products/'.Str::random(12).'-'.basename($relativePublicPath);
        Storage::disk('public')->put($filename, file_get_contents($source));

        return $filename;
    }
}
