/*global wc_add_to_cart_variation_params, wc_cart_fragments_params */
;(function ( $, window, document, undefined ) {
	/**
	 * VariationFormFrontEnd class which handles variation forms and attributes.
	 */
	var VariationFormFrontEnd = function( $form ) {
		this.$form                = $form;
		this.$attributeGroups     = $form.find( '.sw-variation-wrapper .sw-variation-value' );
		this.$attributeFields     = $form.find( '.sw-variation-wrapper input[type=radio]' );
		this.$singleVariation     = $form.closest( '.item-detail' );
		this.$resetVariations     = $form.find( '.reset_variations' );
		this.$product             = $form.closest( '.product' );
		this.variationData        = $form.data( 'product_variations' );
		this.useAjax              = false === this.variationData;
		this.xhr                  = false;

		// Initial state.
		this.$form.unbind( 'check_variations update_variation_values found_variation_frontend_frontend' );
		this.$resetVariations.unbind( 'click' );
		this.$attributeFields.unbind( 'change ' );

		// Methods.
		this.getChosenAttributes    = this.getChosenAttributes.bind( this );
		this.findMatchingVariations = this.findMatchingVariations.bind( this );
		this.isMatch                = this.isMatch.bind( this );
		this.toggleResetLink        = this.toggleResetLink.bind( this );

		// Events.
		$form.on( 'click.wc-variation-form', '.reset_variations', { variationForm: this }, this.onReset );
		$form.on( 'reload_product_variations', { variationForm: this }, this.onReload );
		$form.on( 'hide_variation', { variationForm: this }, this.onHide );
		$form.on( 'show_variation', { variationForm: this }, this.onShow );
		$form.on( 'reset_data_frontend', { variationForm: this }, this.onResetDisplayedVariation );
		$form.on( 'reset_image', { variationForm: this }, this.onResetImage );
		$form.on( 'change.wc-variation-form', '.sw-variation-wrapper input[type="radio"]', { variationForm: this }, this.onChange );
		$form.on( 'found_variation_frontend.wc-variation-form', { variationForm: this }, this.onFoundVariation );
		$form.on( 'check_variations.wc-variation-form', { variationForm: this }, this.onFindVariation );
		$form.on( 'update_variation_values.wc-variation-form', { variationForm: this }, this.onUpdateAttributes );
	
		// Check variations once init.
		$form.trigger( 'check_variations' );
		$form.trigger( 'wc_variation_form' );
	};

	/**
	 * Reset all fields.
	 */
	VariationFormFrontEnd.prototype.onReset = function( event ) {
		var form = event.data.variationForm;
		form.$form.closest( '.product' ).find( '.add_to_cart_button' ).html( AddToCartAjax.select_text );
		event.preventDefault();
		event.data.variationForm.$attributeFields.removeAttr('checked').change();
		event.data.variationForm.$attributeFields.parent().removeClass('selected').change();
		event.data.variationForm.$attributeFields.parent().removeClass('disabled').change();
		event.data.variationForm.$form.trigger( 'reset_data_frontend' );
	};

	/**
	 * Reload variation data from the DOM.
	 */
	VariationFormFrontEnd.prototype.onReload = function( event ) {
		var form           = event.data.variationForm;
		form.variationData = form.$form.data( 'product_variations' );
		form.useAjax       = false === form.variationData;
		form.$form.trigger( 'check_variations' );
	};

	/**
	 * When a variation is hidden.
	 */
	VariationFormFrontEnd.prototype.onHide = function( event ) {
		event.preventDefault();
		event.data.variationForm.$form.find( '.woocommerce-variation-add-to-cart' ).removeClass( 'woocommerce-variation-add-to-cart-enabled' ).addClass( 'woocommerce-variation-add-to-cart-disabled' );
	};

	/**
	 * When a variation is shown.
	 */
	VariationFormFrontEnd.prototype.onShow = function( event, variation, purchasable ) {
		event.preventDefault();
		if ( purchasable ) {
			event.data.variationForm.$form.find( '.woocommerce-variation-add-to-cart' ).removeClass( 'woocommerce-variation-add-to-cart-disabled' ).addClass( 'woocommerce-variation-add-to-cart-enabled' );
		} else {
			event.data.variationForm.$form.find( '.woocommerce-variation-add-to-cart' ).removeClass( 'woocommerce-variation-add-to-cart-enabled' ).addClass( 'woocommerce-variation-add-to-cart-disabled' );
		}
	};

	/**
	 * When displayed variation data is reset.
	 */
	VariationFormFrontEnd.prototype.onResetDisplayedVariation = function( event ) {
		var form = event.data.variationForm;
		form.$form.trigger( 'reset_image' );
		// form.$form.closest( '.product' ).find( '.item-bottom' ).removeClass( 'show' );
	};

	/**
	 * When the product image is reset.
	 */
	VariationFormFrontEnd.prototype.onResetImage = function( event ) {
		event.data.variationForm.$form.wc_variations_image_update_frontend( false );
	};

	/**
	 * Looks for matching variations for current selected attributes.
	 */
	VariationFormFrontEnd.prototype.onFindVariation = function( event ) {
		var form              = event.data.variationForm,
			attributes        = form.getChosenAttributes(),
			currentAttributes = attributes.data;
			form.$form.closest( '.product' ).find( '.add_to_cart_button' ).attr( 'data-variation', JSON.stringify( currentAttributes ) );
		if ( attributes.count === attributes.chosenCount ) {
			if ( form.useAjax ) {
				if ( form.xhr ) {
					form.xhr.abort();
				}
				form.$form.block( { message: null, overlayCSS: { background: '#fff', opacity: 0.6 } } );
				currentAttributes.product_id  = parseInt( form.$form.data( 'product_id' ), 10 );
				currentAttributes.custom_data = form.$form.data( 'custom_data' );
				form.xhr                      = $.ajax( {
					url: wc_cart_fragments_params.wc_ajax_url.toString().replace( '%%endpoint%%', 'get_variation' ),
					type: 'POST',
					data: currentAttributes,
					success: function( variation ) {
						if ( variation ) {
							form.$form.trigger( 'found_variation_frontend', [ variation ] );
						} else {
							form.$form.trigger( 'reset_data_frontend' );
							form.$form.find( '.wc-no-matching-variations' ).slideDown( 200 );
						}
					},
					complete: function() {
						form.$form.unblock();
					}
				} );
			} else {
				form.$form.trigger( 'update_variation_values' );
				var matching_variations = form.findMatchingVariations( form.variationData, currentAttributes ),
					variation           = matching_variations.shift();				
				if ( variation ) {
					form.$form.trigger( 'found_variation_frontend', [ variation ] );
				} else {
					form.$form.trigger( 'reset_data_frontend' );
					form.$form.find( '.wc-no-matching-variations' ).slideDown( 200 );
				}
			}
		} else {
			form.$form.trigger( 'update_variation_values' );
			form.$form.trigger( 'reset_data_frontend' );
		}
		// Show reset link.
		form.toggleResetLink( attributes.chosenCount > 0 );
	};

	/**
	 * Triggered when a variation has been found which matches all attributes.
	 */
	VariationFormFrontEnd.prototype.onFoundVariation = function( event, variation ) {
		var form         = event.data.variationForm,			
			purchasable    = true,
			variation_id   = '',
			template       = false,
			$template_html = '';

		form.$form.wc_variations_image_update_frontend( variation );

		if ( ! variation.variation_is_visible ) {
			template = wp.template( 'unavailable-variation-template' );
		} else {
			template     = wp.template( 'variation-template' );
			variation_id = variation.variation_id;
		}
		form.$form.closest( '.product' ).find( '.add_to_cart_button' ).attr( 'data-variation_id', variation.variation_id ).change();
		form.$form.closest( '.product' ).find( '.add_to_cart_button' ).html( AddToCartAjax.add_cart_text );
		if ( ! variation.variation_is_visible ) {
			form.$form.closest( '.product' ).find( '.price .variable-price' ).hide();
		}else {			
			if( variation.price_html != '' ){
				form.$form.closest( '.product' ).find( '.price .price-wrapper' ).hide();
				form.$form.closest( '.product' ).find( '.price .variable-price' ).show().html( variation.price_html );
			}else{
				form.$form.closest( '.product' ).find( '.price .price-wrapper' ).show();
				form.$form.closest( '.product' ).find( '.price .variable-price' ).hide();	
			}
		}
		$('.reset_variations').on( 'click', function(){
			form.$form.closest( '.product' ).find( '.price .price-wrapper' ).show();
			form.$form.closest( '.product' ).find( '.price .variable-price' ).hide();			
		});
		
		
		// Enable or disable the add to cart button
		if ( ! variation.is_purchasable || ! variation.is_in_stock || ! variation.variation_is_visible ) {
			purchasable = false;
		}
		
		// Reveal
		//form.$form.closest( '.product' ).find( '.item-bottom' ).addClass( 'show' );
	};

	/**
	 * Triggered when an attribute field changes.
	 */
	VariationFormFrontEnd.prototype.onChange = function( event ) {
		var form = event.data.variationForm;
		form.$form.closest( '.product' ).find( '.add_to_cart_button' ).attr( 'data-variation_id', '' ).change();
		form.$form.find( '.wc-no-matching-variations' ).remove();
		if ( form.useAjax ) {
			form.$form.trigger( 'check_variations' );
		} else {
			form.$form.trigger( 'woocommerce_variation_select_change' );
			form.$form.trigger( 'check_variations' );
			$( this ).blur();
		}

		// Custom event for when variation selection has been changed
		form.$form.trigger( 'woocommerce_variation_has_changed' );
	};

	/**
	 * Escape quotes in a string.
	 * @param {string} string
	 * @return {string}
	 */
	VariationFormFrontEnd.prototype.addSlashes = function( string ) {
		string = string.replace( /'/g, '\\\'' );
		string = string.replace( /"/g, '\\\"' );
		return string;
	};

	/**
	 * Updates attributes in the DOM to show valid values.
	 */
	VariationFormFrontEnd.prototype.onUpdateAttributes = function( event ) {
		var form              = event.data.variationForm,
			attributes        = form.getChosenAttributes(),
			currentAttributes = attributes.data;
		if ( form.useAjax ) {
			return;
		}

		// Loop through radio buttons and disable/enable based on selections.
		form.$attributeGroups.each( function( index, el ) {
			var current_attr      = $( el ).find( '.sw-custom-variation' ),
				fields            = current_attr.find( 'input[type=radio]' ),
				current_attr_name = fields.data( 'attribute_name' ) || fields.attr( 'name' );
				
			// The attribute of this radio button should not be taken into account when calculating its matching variations:
			// The constraints of this attribute are shaped by the values of the other attributes.
			var checkAttributes = $.extend( true, {}, currentAttributes );

			checkAttributes[ current_attr_name ] = '';

			var variations = form.findMatchingVariations( form.variationData, checkAttributes );	
			
			fields.parent().addClass( 'disabled' );
			// Loop through variations.
			for ( var num in variations ) {
				if ( typeof( variations[ num ] ) !== 'undefined' && variations[ num ].variation_is_active ) {
					var variationAttributes = variations[ num ].attributes;

					for ( var attr_name in variationAttributes ) {
						if ( variationAttributes.hasOwnProperty( attr_name ) && attr_name === current_attr_name  ) {
							var attr_val = variationAttributes[ attr_name ];
							if ( attr_val ) {
								// Remove disabled.
								fields.filter( '[value="' + form.addSlashes( attr_val ) + '"]' ).parent().removeClass( 'disabled' );
							} else {								
								// Enable all radio buttons of attribute.
								fields.parent().removeClass( 'disabled' );
							}
						}
					}
				}
			}
		});

		// Custom event for when variations have been updated.
		form.$form.trigger( 'woocommerce_update_variation_values' );
	};

	/**
	 * Get chosen attributes from form.
	 * @return array
	 */
	VariationFormFrontEnd.prototype.getChosenAttributes = function() {
		var data   = {};
		var count  = 0;
		var chosen = 0;

		this.$attributeGroups.each( function() {
			var fields = $( this ).find( 'input[type=radio]' );
			
			var attribute_name = fields.data( 'attribute_name' ) || fields.attr( 'name' );
			var value          = fields.filter(':checked').val() || '';

			if ( value.length > 0 ) {
				chosen ++;
			}

			count ++;
			data[ attribute_name ] = value;
		});
		return {
			'count'      : count,
			'chosenCount': chosen,
			'data'       : data
		};
	};

	/**
	 * Find matching variations for attributes.
	 */
	VariationFormFrontEnd.prototype.findMatchingVariations = function( variations, attributes ) {
		var matching = [];
		for ( var i = 0; i < variations.length; i++ ) {
			var variation = variations[i];

			if ( this.isMatch( variation.attributes, attributes ) ) {
				matching.push( variation );
			}
		}
		return matching;
	};

	/**
	 * See if attributes match.
	 * @return {Boolean}
	 */
	VariationFormFrontEnd.prototype.isMatch = function( variation_attributes, attributes ) {
		var match = true;
		for ( var attr_name in variation_attributes ) {
			if ( variation_attributes.hasOwnProperty( attr_name ) ) {
				var val1 = variation_attributes[ attr_name ];
				var val2 = attributes[ attr_name ];
				if ( val1 !== undefined && val2 !== undefined && val1.length !== 0 && val2.length !== 0 && val1 !== val2 ) {
					match = false;
				}
			}
		}
		return match;
	};

	/**
	 * Show or hide the reset link.
	 */
	VariationFormFrontEnd.prototype.toggleResetLink = function( on ) {
		if ( on ) {
			if ( this.$resetVariations.css( 'visibility' ) === 'hidden' ) { 
				this.$resetVariations.css( 'visibility', 'visible' ).hide().fadeIn();
			}
		} else {
			this.$resetVariations.css( 'visibility', 'hidden' );
		}
	};

	/**
	 * Function to call wc_variation_form on jquery selector.
	 */
	$.fn.wc_variation_form_frontend = function() {
		new VariationFormFrontEnd( this );
		return this;
	};

	/**
	 * Stores a default attribute for an element so it can be reset later
	 */
	if( typeof wc_set_variation_attr != 'undefined' ){
	$.fn.wc_set_variation_attr = function( attr, value ) {
		if ( undefined === this.attr( 'data-o_' + attr ) ) {
			this.attr( 'data-o_' + attr, ( ! this.attr( attr ) ) ? '' : this.attr( attr ) );
		}
		if ( false === value ) {
			this.removeAttr( attr );
		} else {
			this.attr( attr, value );
		}
	};
	}

	/**
	 * Reset a default attribute for an element so it can be reset later
	 */
	if( typeof wc_reset_variation_attr != 'undefined' ){
	$.fn.wc_reset_variation_attr = function( attr ) {
		if ( undefined !== this.attr( 'data-o_' + attr ) ) {
			this.attr( attr, this.attr( 'data-o_' + attr ) );
		}
	};
	}

	/**
	 * Reset the slide position if the variation has a different image than the current one
	 */
	$.fn.wc_maybe_trigger_slide_position_reset_frontend = function( variation ) {
		var $form                = $( this ),
			$product             = $form.closest( '.product' ),
			$product_gallery     = $product.find( '.item-img' ),
			reset_slide_position = false,
			new_image_id = ( variation && variation.image_id ) ? variation.image_id : '';

		if ( $form.attr( 'current-image' ) !== new_image_id ) {
			reset_slide_position = true;
		}

		$form.attr( 'current-image', new_image_id );

		if ( reset_slide_position ) {
			$product_gallery.trigger( 'woocommerce_gallery_reset_slide_position' );
		}
	};

	/**
	 * Sets product images for the chosen variation
	 */
	$.fn.wc_variations_image_update_frontend = function( variation ) {
		var $form             = this,
			$product          = $form.closest( '.product' ),
			$product_gallery  = $product.find( '.item-img' ),
			$product_img_wrap = $product_gallery.find( '> a' ),
			$product_img      = $product_img_wrap.find( '.attachment-woocommerce_thumbnail' ),
			$product_link     = $product_img_wrap.eq( 0 );

		if ( variation && variation.image && variation.image.src && variation.image.src.length > 1 ) {
			$product_img.wc_set_variation_attr( 'src', variation.image.src );
			$product_img.wc_set_variation_attr( 'height', variation.image.src_h );
			$product_img.wc_set_variation_attr( 'width', variation.image.src_w );
			$product_img.wc_set_variation_attr( 'srcset', variation.image.srcset );
			$product_img.wc_set_variation_attr( 'sizes', variation.image.sizes );
			$product_img.wc_set_variation_attr( 'title', variation.image.title );
			$product_img.wc_set_variation_attr( 'alt', variation.image.alt );
			$product_img.wc_set_variation_attr( 'data-src', variation.image.full_src );
			$product_img.wc_set_variation_attr( 'data-large_image', variation.image.full_src );
			$product_img.wc_set_variation_attr( 'data-large_image_width', variation.image.full_src_w );
			$product_img.wc_set_variation_attr( 'data-large_image_height', variation.image.full_src_h );
			$product_img_wrap.wc_set_variation_attr( 'data-thumb', variation.image.src );
		} else {
			$product_img.wc_reset_variation_attr( 'src' );
			$product_img.wc_reset_variation_attr( 'width' );
			$product_img.wc_reset_variation_attr( 'height' );
			$product_img.wc_reset_variation_attr( 'srcset' );
			$product_img.wc_reset_variation_attr( 'sizes' );
			$product_img.wc_reset_variation_attr( 'title' );
			$product_img.wc_reset_variation_attr( 'alt' );
			$product_img.wc_reset_variation_attr( 'data-src' );
			$product_img.wc_reset_variation_attr( 'data-large_image' );
			$product_img.wc_reset_variation_attr( 'data-large_image_width' );
			$product_img.wc_reset_variation_attr( 'data-large_image_height' );
			$product_img_wrap.wc_reset_variation_attr( 'data-thumb' );
		}
	};

	$(function() {
		$( '.sw-variation-frontend' ).each( function() {
			$( this ).wc_variation_form_frontend();				
		});
		$(document).on( 'click', '.sw-radio-variation', function(e){
			e.stopPropagation();
			$(this).addClass('selected').siblings().removeClass('selected');
		});
		function initSwatches() {
			$('.sw-variation-frontend').each(function() {
				$( this ).wc_variation_form_frontend();		
			});
		}
		$(document).ready(function(){
			$(document).on('ajaxComplete', function() {
				setTimeout(initSwatches, 200); // Delay 500ms
			});
		});
		$(document).on( 'append.infiniteScroll', function( event, body, path, items, response ) {
		  // Your custom logic here
		  setTimeout(initSwatches, 200);
		});
	});

	/**
	 * Matches inline variation objects to chosen attributes
	 * @deprecated 2.6.9
	 * @type {Object}
	 */
	if( typeof wc_reset_variation_attr != 'undefined' ){
	var wc_variation_form_matcher = {
		find_matching_variations: function( product_variations, settings ) {
			var matching = [];
			for ( var i = 0; i < product_variations.length; i++ ) {
				var variation    = product_variations[i];

				if ( wc_variation_form_matcher.variations_match( variation.attributes, settings ) ) {
					matching.push( variation );
				}
			}
			return matching;
		},
		variations_match: function( attrs1, attrs2 ) {
			var match = true;
			for ( var attr_name in attrs1 ) {
				if ( attrs1.hasOwnProperty( attr_name ) ) {
					var val1 = attrs1[ attr_name ];
					var val2 = attrs2[ attr_name ];
					if ( val1 !== undefined && val2 !== undefined && val1.length !== 0 && val2.length !== 0 && val1 !== val2 ) {
						match = false;
					}
				}
			}
			return match;
		}
	};	
	}
	
	// trigger( 'destroy');
})( jQuery, window, document );