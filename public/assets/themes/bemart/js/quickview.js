(function($) {
	"use strict";
	/**
	* Quickview
	**/
	if( $('body').html().match( /sw-quickview-bottom/ ) ){
		var qv_target =  $('.sw-quickview-bottom');
		$(document).on( 'click', '[data-type="popup"]', function(e){
			var video_url = $(this).data( 'video' );
			var image_url = $(this).data( 'image' );
			qv_target.addClass( 'show popup' );					
			setTimeout(function(){
				if( typeof video_url != 'undefined' ){
					qv_target.find( '.quickview-inner' ).append( '<div class="video-wrapper"><iframe width="560" height="390" src="'+ video_url +'" frameborder="0" allowfullscreen></iframe></div>' );	
				}
				if( typeof image_url != 'undefined' ){
					qv_target.find( '.quickview-inner' ).append( '<div class="image-wrapper"><img src="'+ image_url +'" alt=""/></div>' );	
				}
				qv_target.find( '.quickview-content' ).css( 'margin-top', ( $(window).height() - qv_target.find( '.quickview-content' ).outerHeight() ) /2 );
				qv_target.removeClass( 'loading' );
			}, 0);
			e.preventDefault();
		});
		$(document).on( 'click', 'a[data-type="quickview"]', function(e){
			var product_id = $(this).data( 'product_id' ), ajaxurl = quickview_param.ajax_url.replace( '%%endpoint%%', 'swg_quickviewproduct' );
			ajaxurl = ajaxurl.replace( '%endpoint%', 'swg_quickviewproduct' );
			qv_target.addClass( 'show loading' );
			var data 		= {
				action: 'swg_quickviewproduct',
				product_id: product_id,
				
			};
			jQuery.post(ajaxurl, data, function(response) {
				qv_target.find( '.quickview-inner' ).append( response );				
				qv_target.removeClass( 'loading' );
				$( '.quickview-container .product-images' ).each(function(){
					var $id 					= this.id;
					var $rtl 					= $('body').hasClass( 'rtl' );
					var $img_slider 	= $(this).find('.product-responsive');
					var $thumb_slider = $(this).find('.product-responsive-thumbnail' )
					$img_slider.slick({
						slidesToShow: 1,
						slidesToScroll: 1,
						fade: true,
						arrows: true,
						rtl: $rtl,
						asNavFor: $thumb_slider
					});
					$thumb_slider.slick({
						slidesToShow: 5,
						slidesToScroll: 1,
						asNavFor: $img_slider,
						arrows: false,
						focusOnSelect: true,
						rtl: $rtl,
						responsive: [				
						{
							breakpoint: 640,
							settings: {
								slidesToShow: 2    
							}
						}
						]
					});

					var el = $(this);
					setTimeout(function(){
						el.removeClass("loading");
						var height = el.find('.product-responsive').outerHeight();
						var target = el.find( ' .item-video' );
						target.css({'height': height,'padding-top': (height - target.outerHeight())/2 });

						var thumb_height = el.find('.product-responsive-thumbnail' ).outerHeight();
						var thumb_target = el.find( '.item-video-thumb' );
						thumb_target.css({ height: thumb_height,'padding-top':( thumb_height - thumb_target.outerHeight() )/2 });			
						var _wpUtilSettings  = quickview_param.wpUtilSettings;
						var woocommerce_params = quickview_param.woocommerce_params;
						var wc_add_to_cart_variation_params = quickview_param.wc_add_to_cart_variation_params;
						$.getScript(quickview_param.add_to_cart);
						$.getScript(quickview_param.woocommerce);
						$.getScript(quickview_param.add_to_cart_variable);
						$.getScript(quickview_param.add_to_cart_variable_select);
						$.getScript(quickview_param.wp_embed);
						$.getScript(quickview_param.underscore);
						$.getScript(quickview_param.wp_util);
					}, 1000);
				});							
			});
			e.preventDefault();
		});
		
		$(document).on('click','.quickview-close, .quickview-overlay', function(){
			qv_target.removeClass( 'show popup' );
			qv_target.find( '.quickview-inner' ).html('');			
		});
	}
})(jQuery);	