jQuery( function( $ ) {

	// wc_add_to_cart_params is required to continue, ensure the object exists
	if ( typeof wc_add_to_cart_params === 'undefined' )
		return false;

	// Ajax add to cart
	$( document ).on( 'click', '.product_type_variable.add_to_cart_button', function(e) {
		
		$variation_form = $( this ).closest( '.item-wrap' ).find( '.sw-variation-frontend' );
		var var_id = $(this).attr('data-variation_id' );		
		var product_id = $(this).attr('data-product_id' );
		var quantity = $(this).attr('data-quantity' );
		var	item = $(this).attr('data-variation' );
		
		if( var_id == 0 ){
			$(this).removeClass( 'loading' );
			$('#sw-wooswatches-alert-overlay').addClass( 'active' );
			$('#sw_wooswatches_alert').addClass( 'active' );			
			e.preventDefault();
		}else{
			
			var $thisbutton = $( this );
			if ( $thisbutton.is( '.product_type_variable.add_to_cart_button' ) ) {

				$thisbutton.removeClass( 'added' );
				$thisbutton.addClass( 'loading' );

				var data = {
					action: 'sw_wooswatches_custom_add_to_cart_ajax',
					product_id: product_id,
					quantity: quantity,
					variation_id: var_id,
					variation: item
				};

				// Trigger event
				$( 'body' ).trigger( 'adding_to_cart', [ $thisbutton, data ] );
				var ajaxurl   = wc_add_to_cart_params.wc_ajax_url.replace( '%%endpoint%%', 'sw_wooswatches_custom_add_to_cart_ajax' );
				// Ajax action
				$.post( ajaxurl, data, function( response ) {

					if ( ! response )
						return;

					var this_page = window.location.toString();

					this_page = this_page.replace( 'add-to-cart', 'added-to-cart' );

					$thisbutton.removeClass('loading');

					if ( response.error && response.product_url ) {
						window.location = response.product_url;
						return;
					}

					fragments = response.fragments;
					cart_hash = response.cart_hash;
					
					// Block fragments class
					if ( fragments ) {
						$.each(fragments, function(key, value) {
							$(key).addClass('updating');
						});
					}

					// Block widgets and fragments
					$('.shop_table.cart, .updating, .cart_totals,.widget_shopping_cart_top', '.top-form-minicart').fadeTo('400', '0.6').block({message: null, overlayCSS: {background: 'transparent url(' + woocommerce_params.ajax_loader_url + ') no-repeat center', backgroundSize: '16px 16px', opacity: 0.6 } } );
					
					// Changes button classes
					$thisbutton.removeClass( 'loading' ).addClass( 'added' );				

					// Replace fragments
					if ( fragments ) {
						$.each(fragments, function(key, value) {
							$(key).replaceWith(value);
						});
					}

					// Unblock
					$('.widget_shopping_cart, .updating, .widget_shopping_cart_top').stop(true).css('opacity', '1').unblock();

					// Cart page elements
					$('.widget_shopping_cart_top').load( this_page + ' .widget_shopping_cart_top:eq(0) > *', function() {

						$("div.quantity:not(.buttons_added), td.quantity:not(.buttons_added)").addClass('buttons_added').append('<input type="button" value="+" id="add1" class="plus" />').prepend('<input type="button" value="-" id="minus1" class="minus" />');

						$('.widget_shopping_cart_top').stop(true).css('opacity', '1').unblock();

						$('body').trigger('cart_page_refreshed');
					});
					
					// Cart page elements
					$('.shop_table.cart').load( this_page + ' .shop_table.cart:eq(0) > *', function() {

						$("div.quantity:not(.buttons_added), td.quantity:not(.buttons_added)").addClass('buttons_added').append('<input type="button" value="+" id="add1" class="plus" />').prepend('<input type="button" value="-" id="minus1" class="minus" />');

						$('.shop_table.cart').stop(true).css('opacity', '1').unblock();

						$('body').trigger('cart_page_refreshed');
					});				

					$('.cart_totals').load( this_page + ' .cart_totals:eq(0) > *', function() {
						$('.cart_totals').stop(true).css('opacity', '1').unblock();
					});

					// Trigger event so themes can refresh other areas
					$('body').trigger( 'added_to_cart', [ fragments, cart_hash ] );
				});

				return false;

			} else {
				return true;
			}
		}

	});
	
	$('#sw-wooswatches-alert-overlay').on( 'click', function(){
		$( '#sw_wooswatches_alert' ).removeClass( 'active' );
		$(this).removeClass( 'active' );
	});
	$(document).on( 'click', '#sw_wooswatches_alert .close-popup', function(e){
		e.preventDefault();
		$( '#sw-wooswatches-alert-overlay' ).removeClass('active');
		$( '#sw_wooswatches_alert' ).removeClass('active');
	});
});
