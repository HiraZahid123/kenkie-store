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

        $spliced = preg_replace_callback($pattern, function ($m) use ($newCardsHtml) {
            return $m[1]."\n".$newCardsHtml."\n".$m[3];
        }, $html, 1);

        return self::postProcess($spliced ?: $html);
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
        $html = file_get_contents(self::templatePath($templateRelativePath));
        return self::postProcess($html);
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

        $spliced = preg_replace_callback($pattern, function ($m) use ($newDetailHtml) {
            return $m[1]."\n".$newDetailHtml."\n".$m[3];
        }, $html, 1);

        return self::postProcess($spliced ?: $html);
    }

    /**
     * Replace the static "New Arrivals" product list on the homepage
     * with DB-driven cards.
     * Targets: <ul class="products swe-list-wrappe slider-track"> … </ul>
     */
    public static function spliceHomeNewArrivals(string $html, string $cardsHtml): string
    {
        $pattern = '/(<ul class="products swe-list-wrappe slider-track">)(.*?)(<\/ul>)/s';

        return preg_replace_callback($pattern, function ($m) use ($cardsHtml) {
            return $m[1] . "\n" . $cardsHtml . "\n" . $m[3];
        }, $html, 1);
    }

    /**
     * Replace every static "Best Sellers" tab product list on the homepage
     * with the same DB-driven cards (all tabs show the same products).
     * Targets: <ul class="products swe-slider" …> … </ul>  (all occurrences)
     */
    public static function spliceHomeBestSellers(string $html, string $cardsHtml): string
    {
        $pattern = '/(<ul class="products swe-slider"[^>]*>)(.*?)(<\/ul>)/s';

        return preg_replace_callback($pattern, function ($m) use ($cardsHtml) {
            return $m[1] . "\n" . $cardsHtml . "\n" . $m[3];
        }, $html);
    }

    /**
     * Replace the static category icon slider items on the homepage
     * with DB-driven category items.
     * Targets the swe-slider wrapper that holds the category swe-item divs.
     */
    public static function spliceHomeCategorySlider(string $html, string $itemsHtml): string
    {
        $pattern = '/(<div class="swe-slider"[^>]*>)(.*?)(<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<div class="elementor-element elementor-element-3812a9a)/s';

        return preg_replace_callback($pattern, function ($m) use ($itemsHtml) {
            return $m[1] . "\n" . $itemsHtml . "\n" . $m[3];
        }, $html, 1);
    }

    /**
     * Normalize links, inject CSRF token, ensure Cart and Wishlist scripts
     * are loaded on all served legacy pages.
     */
    public static function postProcess(string $html): string
    {
        // 1. Inject CSRF meta tag if missing
        if (!str_contains($html, 'name="csrf-token"')) {
            $meta = '<meta name="csrf-token" content="'.csrf_token().'">';
            $html = self::replaceOnce($html, '</head>', $meta."\n".'</head>');
        }

        // 2. Fix Wishlist navbar links: replace href="#" or href="../#" on Wishlist menu item
        $html = preg_replace(
            '/(<a\s+[^>]*href=["\'])(?:(?:\.\.\/)+#|#)(["\'][^>]*>.*?<span\s+class=["\']menu-title["\']>Wishlist<\/span>.*?<\/a>)/s',
            '$1/wishlist/index.html$2',
            $html
        );
        $html = preg_replace(
            '/(<a\s+[^>]*href=["\'])(?:(?:\.\.\/)+#|#)(["\'][^>]*>.*?nav-wishlist-icon.*?<\/a>)/s',
            '$1/wishlist/index.html$2',
            $html
        );
        $html = preg_replace(
            '/(<a\s+[^>]*class=["\'][^"\']*swg-wishlist-icon[^"\']*["\'][^>]*href=["\'])[^"\']*(["\'])/s',
            '$1/wishlist/index.html$2',
            $html
        );

        // 3. Remove old wishlist / cart scripts
        $html = preg_replace('/<script[^>]*kenkie-wishlist\.js[^>]*><\/script>\s*/i', '', $html);
        $html = preg_replace('/<script[^>]*kenkie-cart\.js[^>]*><\/script>\s*/i', '', $html);

        // 4. Inject fresh scripts before </body>
        $scripts = '<script src="/assets/js/kenkie-wishlist.js?v=5"></script>'."\n"
                 . '<script src="/assets/js/kenkie-cart.js?v=7"></script>'."\n";

        if (str_contains($html, '</body>')) {
            $html = self::replaceOnce($html, '</body>', $scripts.'</body>');
        } else {
            $html .= "\n".$scripts;
        }

        return $html;
    }
}
