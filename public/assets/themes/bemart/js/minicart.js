(function($) {
	"use strict";
	$(document).on( 'click', '.minicart-popup-slide', function(e){
		var target = $(this).attr( 'href' );
		$(this).closest( '.minicart-meta' ).find( '.minicart-popup-dialog' ).removeClass( 'active' );
		$(target).addClass( 'active' );
		e.preventDefault();
	});
	$(document).on( 'click', '.minicart-form-close', function(e){
		$(this).closest('.minicart-popup-dialog').removeClass( 'active' );
	});
	
	function updateCart(itemKey, newQty, coupon_code, remove_coupon, note,$parent_target) {
        var data = {
            action: 'woocommerce_update_cart_item',
            cart_item_key: itemKey,
            new_qty: newQty,
			coupon_code: coupon_code,
			remove_coupon: remove_coupon,
			minicart_note: note
        };
        // Add class to cart to indicate loading
        $parent_target.find('.swe-wrap-cart-content').addClass('loading');
        $.ajax({
            type: 'POST',
			dataType: 'json',
            url: custom_text.ajax_url,
            data: data,
            success: function(response) {
				// Trigger a fragment refresh to update cart content
				$parent_target.find('.swe-wrap-cart-bottom').html( response.cart_html );
				$parent_target.find('.swe-cart-count').html( response.cart_count );
				// Remove the updating class
				$parent_target.find('.swe-wrap-cart-content').removeClass('loading');
            },
            error: function() {
               // Remove the updating class in case of error as well
               $parent_target.find('.swe-wrap-cart-content').removeClass('loading');
            }
        });
    }
	
	$( document ).on( 'submit', '.minicart-note-form', function( event ) {
		var note = $(this).find( '.minicart-note-content' ).val();
		var $target = $(this).closest( '.swe-woo-cart' );
		updateCart( '', 0, '', '', note, $target );  
		event.preventDefault();
	});

	$( document ).on( 'submit', '.minicart-coupon-form', function( event ) {
		var coupon_code = $(this).find( '.input-text' ).val();
		var $target = $(this).closest( '.swe-woo-cart' );
		updateCart( '', 0, coupon_code, '', '', $target );  
		event.preventDefault();
	});
	
	$( document ).on( 'submit', '.woocommerce-shipping-calculator', function( event ) {
		var $parent_target = $(this).closest( '.swe-woo-cart' );
		var data = 'action=woocommerce_update_cart_item' + '&' + $( this ).serialize();
		$parent_target.find('.swe-wrap-cart-content').addClass('loading');
		$.ajax({
            type: 'POST',
			dataType: 'json',
            url: custom_text.ajax_url,
            data: data,
            success: function(response) {
				// Trigger a fragment refresh to update cart content
				$parent_target.find('.swe-wrap-cart-bottom').html( response.cart_html );
				$parent_target.find('.swe-cart-count').html( response.cart_count );
				// Remove the updating class
				$parent_target.find('.swe-wrap-cart-content').removeClass('loading');
            },
            error: function() {
               // Remove the updating class in case of error as well
               $parent_target.find('.swe-wrap-cart-content').removeClass('loading');
            }
        });
		event.preventDefault();
	});
	
	$( document ).on( 'click', '.minicart-bottom-coupon .woocommerce-remove-coupon', function( event ) {
		var remove_coupon = $(this).attr( 'data-coupon' );
		var $target = $(this).closest( '.swe-woo-cart' );
		updateCart( '', 0, '', remove_coupon, '',$target );  
		event.preventDefault();
	});
   
	
	$(document).on('change', '.woocommerce-mini-cart .qty.text', function() {
	   var cart_item_key = $(this).attr('name').match(/\[(.*?)\]/)[1];
	   var new_qty = $(this).val();
	   var $target = $(this).closest( '.swe-woo-cart' );
	   updateCart(cart_item_key, new_qty, '', '', '', $target );
	});
	
	$(document).on( 'click', '.wc-block-checkout__order-notes .wc-block-components-checkbox', function(){
		var order_note = custom_text.order_note;
		console.log( $(this).find( '.wc-block-components-textarea' ) );
		$(this).parent().find( '.wc-block-components-textarea' ).text( order_note );
		
	});
})(jQuery);