<?php

namespace App\Support;

class LegacyTemplate
{
    private static function templatePath(string $relativePath): string
    {
        return resource_path('legacy-templates/'.$relativePath);
    }

    /**
     * Read a real static page (kept in resources/legacy-templates, a copy of
     * the original static site) and splice fresh HTML into the spot where
     * its product grid used to be, so the surrounding nav, styling, and
     * scripts are pixel-identical to the original site.
     */
    public static function spliceProductGrid(string $templateRelativePath, string $newCardsHtml): string
    {
        $html = file_get_contents(self::templatePath($templateRelativePath));

        $pattern = '/(<ul class="products[^"]*">)(.*?)(<\/ul>\s*<div class="clear">)/s';

        return preg_replace_callback($pattern, function ($m) use ($newCardsHtml) {
            return $m[1]."\n".$newCardsHtml."\n".$m[3];
        }, $html, 1);
    }

    /**
     * Replace a single literal string (or the first occurrence) in the page.
     */
    public static function replaceOnce(string $html, string $search, string $replace): string
    {
        $pos = strpos($html, $search);
        if ($pos === false) {
            return $html;
        }

        return substr_replace($html, $replace, $pos, strlen($search));
    }

    public static function replaceAll(string $html, string $search, string $replace): string
    {
        return str_replace($search, $replace, $html);
    }

    public static function read(string $templateRelativePath): string
    {
        return file_get_contents(self::templatePath($templateRelativePath));
    }

    /**
     * Splice fresh HTML into the spot where the single-product summary
     * (gallery + title + price + description) used to be, keeping the
     * real nav/header/footer/tabs/related-products markup untouched.
     */
    public static function spliceProductDetail(string $templateRelativePath, string $newDetailHtml): string
    {
        $html = file_get_contents(self::templatePath($templateRelativePath));

        $pattern = '/(<div class="product-detail">)(.*?)(<div class="woocommerce-tabs)/s';

        return preg_replace_callback($pattern, function ($m) use ($newDetailHtml) {
            return $m[1]."\n".$newDetailHtml."\n".$m[3];
        }, $html, 1);
    }
}
