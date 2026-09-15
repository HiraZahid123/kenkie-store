/**
 * script.js
 *
 * @copyright  2021 Add on elements. All rights reserved.
 * @license MIT
 */
 (function ($) {
 	"use strict";
 	var swg_elements = { 		
		swe_tabs: function($target) {
 			let $wrap_tabs = $target.find('.swe-wrap-tabs');
 			$wrap_tabs.find('.swe-tab-title').on('click', function() {
 				if ($(this).hasClass('active')) {
 					return;
 				}
 				let tab_control = $(this).attr('aria-controls');
 				$(this).closest('.swe-wrap-tab-head').find('.swe-tab-title.active').removeClass('active');
 				$(this).addClass('active');
 				$(this).closest('.swe-wrap-tabs').find('.swe-tab-content.active').removeClass('active');
 				$(this).closest('.swe-wrap-tabs').find('#' + tab_control).addClass('active');
 				if ($(this).closest('.swe-wrap-tabs').find('#' + tab_control).find('.swe-slider')[0]) {
 					let item = $(this).closest('.swe-wrap-tabs').find('.slick-slider');
 					let config = getConfigSlider(item);
 					$(this).closest('.swe-wrap-tabs').find('.slick-slider').slick('unslick').slick(config);
 				}
 			});
 			$target.find('.swe-navbar-toggle').on('click', function() {
 				$(this).siblings('.swe-tab-head').slideToggle();
 			});
 		},
		swe_popup: function($target) { 
 			var $wrap_popup = $target.find('.swg-button-popup');
 			$wrap_popup.find('.swg-button').on('click', function() { 
 				var data_target = $(this).attr( 'data-target' );
				$(data_target).addClass( 'active' );
 			});
 			$(document).on( 'click', '.popup-close', function(e){
				e.preventDefault();
				var data_target = $(this).attr( 'data-target' );
				$(data_target).removeClass( 'active' );
			});
 		},
		swe_login_expand: function( $target ){ 
			$target.find( '.expand-button' ).on( 'click', function(e){
				var target = $(this).attr( 'href' );
				var action = $(this).attr( 'data-action' );
				$(target).addClass( 'active' );
				$(this).closest( '.expand-form' ).removeClass( 'active' );
				e.preventDefault();
			});
			$target.find( '.swg-login-expand-action' ).on( 'click', function(e){
				var target = $(this).attr( 'href' );
				var type = $(this).attr( 'data-type' );
				if( type === 'register' ){
					$target.find( '.expand-login-form' ).removeClass( 'active' );
					$target.find( '.expand-register-form' ).addClass( 'active' );
				}else{
					$target.find( '.expand-login-form' ).addClass( 'active' );
					$target.find( '.expand-register-form' ).removeClass( 'active' );
				}
				$(target).addClass( 'active' );
				e.preventDefault();
				
			});		
			
			$target.find( '.close-popup' ).on( 'click', function(e){
				$(this).closest( '.login-expand-bottom' ).removeClass( 'active' );
				e.preventDefault();
			});
			$target.find( '.expand-show-password' ).on( 'click', function() {
				$(this).toggleClass( 'active' );
				var input = $(this).parent().find( 'input' );
				if (input.attr("type") == "password") {
					input.attr("type", "text");
				} else {
					input.attr("type", "password");
				}
			});
			
		},
    	// Call back count down timer for variable product
    	swg_countdown: function ($target) {
    		var items = $target.find('.swg-countdown-wrapper');
            $.each(items, function(item) {
                const $date = $(items[item]).data('date');
				const $austDay 	= new Date( $date  * 1000 );	
                const $separate = $(items[item]).data('title') ? $(items[item]).data('title') : '';
				const $days = $(items[item]).data('days') ? $(items[item]).data('days') : 'days';
                const $hours = $(items[item]).data('hours') ? $(items[item]).data('hours') : 'hours';
                const $mins = $(items[item]).data('mins') ? $(items[item]).data('mins') : 'mins';
                const $secs = $(items[item]).data('secs') ? $(items[item]).data('secs') : 'secs';
				const $action = $(items[item]).data('action') ? $(items[item]).data('action') : 'message';
				const $url = $(items[item]).data('url') ? $(items[item]).data('url') : '';
                $(items[item]).countdown($austDay, function(event) {
					$(this).html(
						event.strftime('<div class="countdown-row"><div class="countdown-section days"><span class="countdown-amount">%D</span><span class="countdown-period">'+$days+'</span></div><div class="countdown-section hours"><span class="countdown-amount">%H</span><span class="countdown-period">'+$hours+'</span></div><div class="countdown-section mins"><span class="countdown-amount">%M</span><span class="countdown-period">'+$mins+'</span></div><div class="countdown-section secs"><span class="countdown-amount">%S</span><span class="countdown-period">'+$secs+'</span></div></div>')
					);
					$(this).find( '.countdown-section' ).attr( 'title', $separate );
				}).on('finish.countdown', function(event){
					if( $action == 'message' ){
						$(this).hide('slow', function(){ $(this).remove(); });	
						$(this).parent().find( '.swg-expire-message' ).show();
					}else if( $action == 'redirect' && $url != '' ){
						window.location.replace( $url );
					}
				});
            });
        },   
		swg_gallery: function ($target) {
			var items = $target.find('.photobox-gallery');
			$.each(items, function(item) {
                $(items[item]).photobox("li > a");
            });
		},
		swg_button_popup: function ($target) {
			$target.find( '.swg-button' ).on( 'click', function(){
				var $event = $(this).attr( 'data-event' );
				if( $event == 1 ){
					$(this).hide();
				}
			});
			$target.find( '.popup-close' ).on( 'click', function(){
				$target.find( '.swg-button' ).show();
			});
		},
		swg_slider_image_dot: function ($target) {
			let items = $target.find( '.swg-slider-image-dot' );
			if( items.length > 0 ){
				$.each(items, function(item) {
					get_config_slider_image_dot(items[item]);
				});
				$( '.slick-arrow' ).removeAttr( 'style' );
			}
		},
    };

    $(window).on('elementor/frontend/init', function () {       
		elementorFrontend.hooks.addAction(
            "frontend/element_ready/swg-brand-element.default",
            swg_elements.swe_slider
            );
			
		elementorFrontend.hooks.addAction(
            "frontend/element_ready/swg-testimonial.default",
            swg_elements.swe_slider
            );
			
		elementorFrontend.hooks.addAction(
            "frontend/element_ready/swg-testimonial.default",
            swg_elements.swg_slider_image_dot
            );
			
		elementorFrontend.hooks.addAction(
            "frontend/element_ready/swg-ourteam.default",
            swg_elements.swe_slider
            );
			
		elementorFrontend.hooks.addAction(
            "frontend/element_ready/swg_list_images.default",
            swg_elements.swe_slider
         );
		elementorFrontend.hooks.addAction(
			"frontend/element_ready/swg-countdown.default",
			swg_elements.swg_countdown
		);	
		elementorFrontend.hooks.addAction(
			"frontend/element_ready/swg_list_store.default",
			swg_elements.swe_tabs
		);	
		elementorFrontend.hooks.addAction(
			"frontend/element_ready/swg_stores.default",
			swg_elements.swe_tabs
		);
		elementorFrontend.hooks.addAction(
			"frontend/element_ready/swg-button-popup.default",
			swg_elements.swe_popup
		);	
		elementorFrontend.hooks.addAction(
			"frontend/element_ready/swg-login-expand.default",
			swg_elements.swe_login_expand
		);	
		elementorFrontend.hooks.addAction(
			"frontend/element_ready/swg-button-popup.default",
			swg_elements.swg_button_popup
		);
		elementorFrontend.hooks.addAction(
			"frontend/element_ready/swg-gallery-images.default",
			swg_elements.swg_gallery
		);	
		
		$( '.product-images-slider' ).each(function(){
			var $rtl 			= $('body').hasClass( 'rtl' );
			var $vertical		= $(this).data('vertical');
			var $vertical_tb	= $(this).data('vertical_tablet');
			var $img_slider 	= $(this).find('.product-responsive');
			var $thumb_slider 	= $(this).find('.product-responsive-thumbnail' );
			var number_slider	=  $(this).data( 'number' );
			var number_tablet 	= $(this).data( 'number_tablet' );
			var number_mobile 	= $(this).data( 'number_mobile' );
			
			$img_slider.slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				fade: true,
				arrows: false,
				rtl: $rtl,
				asNavFor: $thumb_slider,
				infinite: false
			});
			$thumb_slider.slick({
				slidesToShow: number_slider,
				slidesToScroll: 1,
				asNavFor: $img_slider,
				arrows: true,
				rtl: $rtl,
				infinite: false,
				vertical: $vertical,
				verticalSwiping: $vertical,
				focusOnSelect: true,
				responsive: [
				{
					breakpoint: 992,
					settings: {
						slidesToShow: number_tablet,
						vertical: $vertical_tb
					}
				},
				{
					breakpoint: 580,
					settings: {
						slidesToShow: number_mobile,
						vertical: false
					}
				},
				{
					breakpoint: 360,
					settings: {
						slidesToShow: 2,
						vertical: false
					}
				}
				]
			});
			var el = $(this);
			setTimeout(function(){
				el.removeClass("loading");				
			});
		});		
		
	});
	
	function get_config_slider_image_dot( slider ){
		var $rtl 			= $('body').hasClass( 'rtl' );
		var $img_slider 	= $(slider).find('.swg-testimonial-responsive');
		var $thumb_slider 	= $(slider).find('.swg-testimonial-responsive-thumbnail' );
		var number_slider	= $(slider).data( 'number' );
		var number_tablet 	= $(slider).data( 'number_tablet' );
		var number_mobile 	= $(slider).data( 'number_mobile' );
		$img_slider.slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			fade: true,
			arrows: true,
			nextArrow: $(slider).data('next'),
			prevArrow: $(slider).data('prev'),
			rtl: $rtl,
			asNavFor: $thumb_slider,
			infinite: true
		});
		$thumb_slider.slick({
			slidesToShow: 5,
			slidesToScroll: 1,
			asNavFor: $img_slider,
			arrows: false,
			rtl: $rtl,
			infinite: true,
			focusOnSelect: true,
			responsive: [
			{
				breakpoint: 580,
				settings: {
					slidesToShow: 3,
					vertical: false
				}
			},
			{
				breakpoint: 360,
				settings: {
					slidesToShow: 1,
					vertical: false
				}
			}
			]
		});
	}

    function getConfigSlider(slider) {
    	let rtl = $('body').hasClass('rtl') ? true : false;
        let config = {
		  variableWidth: ( typeof( $(slider).data('variable_width') ) != 'undefined' ) ? $(slider).data('variable_width') : false,
          rows: $(slider).data('slides_to_rows') ? parseInt($(slider).data('slides_to_rows')) : 1,
          slidesToShow: $(slider).data('slides_to_show') ? parseInt($(slider).data('slides_to_show')) : 4,
          slidesToScroll: $(slider).data('slides_to_scroll') ? parseInt($(slider).data('slides_to_scroll')) : 1,
          arrows: $(slider).data('arrows') == 'yes' ? true : false,
          dots: $(slider).data('dots') == 'yes' ? true : false,
          pauseOnHover: $(slider).data('pause_on_hover') == 'yes' ? true : false,
          autoplay: $(slider).data('autoplay') == 'yes' ? true : false,
		  speed: ( typeof( $(slider).data('speed') ) != 'undefined' )? $(slider).data('speed') : 500,
          autoplaySpeed: ( typeof( $(slider).data('autoplay_speed') ) != 'undefined' ) ? $(slider).data('autoplay_speed') * 1000 : 3000,
          infinite: $(slider).data('infinite') == 'yes' ? true : false,
          fade: $(slider).data('fade') == 'fade' ? true : false,
		  cssEase: 'linear',
          centerMode: $(slider).data('center_mode') == 'yes' ? true : false,
          lazyLoad: $(slider).data('lazyload') ? $(slider).data('lazyload') : 'progressive',
          nextArrow: $(slider).data('next'),
          prevArrow: $(slider).data('prev'),
          rtl: rtl,
          centerPadding: $(slider).data('center_padding') ? parseInt($(slider).data('center_padding')) + 'px' : '0px',
          responsive: [ {
             breakpoint: 992,
             settings: {
                slidesToShow: $(slider).data('slides_to_show_tablet') ? parseInt($(slider).data('slides_to_show_tablet')) : 1,
                arrows: $(slider).data('arrows_tablet') == 'yes' ? true : false,
                dots: $(slider).data('dots_tablet') == 'yes' ? true : false,
                centerMode: $(slider).data('center_mode_tablet') == 'yes' ? true : false,
                centerPadding: $(slider).data('center_padding_tablet') ? parseInt($(slider).data('center_padding_tablet')) + 'px' : '0px',
            }
			}, {
			 breakpoint: 580,
			 settings: {
				slidesToShow: $(slider).data('slides_to_show_mobile') ? parseInt($(slider).data('slides_to_show_mobile')) : 1,
				arrows: $(slider).data('arrows_mobile') == 'yes' ? true : false,
				dots: $(slider).data('dots_mobile') == 'yes' ? true : false,
				centerMode: $(slider).data('center_mode_mobile') == 'yes' ? true : false,
				centerPadding: $(slider).data('center_padding_mobile') ? parseInt($(slider).data('center_padding_mobile')) + 'px' : '0px',
			}
		}]
		};
		return config;
	}
	
	
})(jQuery);
