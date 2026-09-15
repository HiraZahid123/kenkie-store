jQuery(document).ready(function($) {

// Update total price dynamically
    function updateTotalPrice() {
        var total = 0;
        $('.bought-together-checkbox:checked, .bought-together-checkbox:disabled').each(function() {
            var price = parseFloat($(this).attr('data-price'));
            var quantity = parseInt($(this).attr('data-quantity'));
            total += price * quantity;
        });      
		
        $('.total-price').html(wc_price(total));
    }

    // Format price to match WooCommerce currency settings
    function wc_price(price) {
        return accounting.formatMoney(price, {
            symbol: wc_bought_together_params.symbol,
            decimal: wc_bought_together_params.decimal,
            thousand: wc_bought_together_params.thousand,
            precision: wc_bought_together_params.precision,
            format: wc_bought_together_params.format
        });
    }

    $('.bought-together-variation').on('change', function() {
        var $select = $(this);
        var $item = $select.closest('.bought-together-item');
        var $checkbox = $item.find('.bought-together-checkbox');
        var productId = $item.data('product-id');
        var variationId = $select.val();
        var selectedOption = $select.find('option:selected');
        var price = parseFloat(selectedOption.data('price')) || 0;
        var quantity = parseInt(selectedOption.data('quantity')) || 1;		
        if ($checkbox.hasClass('disabled')) {
            // Main product
            $checkbox.attr('data-variation-id', variationId);
            $checkbox.attr('data-price', price);
            $('#bought-together-main-variation').val(variationId);
            $item.find('.item-price').html(wc_price(price) );
        } else {
            // Bundled product
            $checkbox.attr('data-variation-id', variationId);
            $checkbox.attr('data-price', price);
            $checkbox.attr('data-quantity', quantity);
            $item.find('.item-price').html(wc_price(price) );
            if (variationId == 0) {
                $checkbox.prop('checked', false);
            } else if (!$checkbox.is(':checked')) {
                $checkbox.prop('checked', true);
				$select.closest( '.bought-together-item' ).removeClass( 'disabled' );
				$select.closest( '.bought-together-section' ).find( '[data-id="'+ productId +'"]' ).removeClass( 'disabled' );
            }
        }

        updateTotalPrice();
    });

    // Handle checkbox/radio change
    $('.bought-together-checkbox').on('change', function() {
        var $checkbox = $(this);
        var $item = $checkbox.closest('.bought-together-item');
        var productId = $checkbox.data('product-id');
        var $select = $item.find('.bought-together-variation');
		$(this).parent().toggleClass( 'disabled' );
        $(this).closest( '.bought-together-section' ).find( '[data-id="'+ productId +'"]' ).toggleClass( 'disabled' );

        updateTotalPrice();
    });

    // Handle add to cart
    $('.bought-together-add-all').on('click', function() {
        var products = [];
        var variation_ids = [];
        var quantities = [];
		var $this = $(this);
		$this.addClass( 'loading' );
        $('.bought-together-checkbox:checked:not(:disabled)').each(function() {
            products.push($(this).data('product-id'));
            variation_ids.push($(this).data('variation-id'));
            quantities.push($(this).data('quantity'));
        });
        var main_product = $('#bought-together-main-product').val();
        var main_variation = $('#bought-together-main-variation').val();

        $.ajax({
            url: wc_bought_together_params.ajax_url,
            type: 'POST',
            data: {
                action: 'wc_bought_together_add_to_cart',
                nonce: wc_bought_together_params.nonce,
                main_product: main_product,
                main_variation: main_variation,
                products: products,
                variation_ids: variation_ids,
                quantities: quantities,
            },
            success: function(response) {
                if (response.success) {
					$(document.body).trigger('wc_fragment_refresh');
					var $cart_canvas = $('body').find( '.cart-canvas' );
					if( $cart_canvas.length > 0 ){
						setTimeout(function() { 
							$this.removeClass( 'loading' ).addClass( 'added' );
							$( '.cart-canvas .input-toggle').prop('checked', true);
						}, 1000);
					}else{
						$this.removeClass( 'loading' ).addClass( 'added' );
						setTimeout(function() { 
							document.location.href = wc_bought_together_params.cart_url;
						}, 1000);
						
					}
                }
            }
        });
    });

    // Initial total price
    updateTotalPrice();
});