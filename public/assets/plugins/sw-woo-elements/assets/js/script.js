/**
 * script.js
 *
 * @copyright  2021 Add on elements. All rights reserved.
 * @license MIT
 */
 (function ($) {
 	"use strict";
 	var sw_woo_elements = {
 		swe_tabs: function($target) {
			var tabs = $target.find('.swe-tab-head');
			var elastic = tabs.find( '.elastic-tab' );
			if( elastic.length > 0 ){
				var selector = tabs.find('a').length;
				var activeItem = tabs.find('.active');
				var activeWidth = activeItem.outerWidth();
				elastic.css({
				  'left': activeItem.position.left + 'px', 
				  'width': activeWidth + 'px'
				});
			}
			
			let $wrap_tabs = $target.find('.swe-wrap-tabs');			
 			
 			$wrap_tabs.find('.swe-tab-title').on('click', function() {				
 				let tab_control = $(this).attr('aria-controls');
 				$(this).closest('.swe-wrap-tab-head').find('.swe-tab-title.active').removeClass('active');
 				$(this).addClass('loaded active');
				if( elastic.length > 0 ){
					var activeWidth = $(this).outerWidth();
					var itemPos = $(this).position();
					elastic.css({
						'left':itemPos.left + 'px', 
						'width': activeWidth + 'px'
					});
				}
				
 				$(this).closest('.swe-wrap-tabs').find('.swe-tab-content.active').removeClass('active');
 				$(this).closest('.swe-wrap-tabs').find('#' + tab_control).addClass('active');
 				if (!$(this).hasClass( 'loaded' ) && $(this).closest('.swe-wrap-tabs').find('#' + tab_control).find('.swe-slider')[0]) {
 					let item = $(this).closest('.swe-wrap-tabs').find('.slick-slider');
 					let config = getConfigSlider(item);
 					$(this).closest('.swe-wrap-tabs').find('.slick-slider').slick('unslick').slick(config);
 				}
				if( $target.find('.swe-dropdown-select').length > 0 ){ 
					$target.find('.swe-dropdown-select').html( $(this).html() );
				}
 			});		
			
 			let $tab_btn = $target.find('.swe-wrap-tab-head');
 			$target.find('.swe-navbar-toggle, .swe-dropdown-select').on('click', function() {
 				$(this).siblings('.swe-tab-head').slideToggle();
 			});
			var $width = $(window).width();
			if( $width < 1025 && $tab_btn.hasClass( 'btn-tablet' ) ){
				$tab_btn.find( '.swe-tab-title' ).on('click', function() {
					$(this).closest('.swe-tab-head').slideToggle();
				});
			}
			if( $width < 767 && $tab_btn.hasClass( 'btn-mobile' ) ){
				$tab_btn.find( '.swe-tab-title' ).on('click', function() {
					$(this).closest('.swe-tab-head').slideToggle();
					$(this).parent().css('display','none');
				});
			}			
 		},
 		swe_slider: function ($target) {
 			let items = $target.find('.swe-slider');
            $.each(items, function(item) {
                let config = getConfigSlider(items[item]);
                $(items[item]).find('.slick-slider').removeClass('slick-initialized slick-slider slick-dotted');
                $(items[item]).slick(config);
				$( '.slick-arrow' ).removeAttr( 'style' );
            });
        },
		swe_cat_style2: function ($target) {
			var $wrap_item = $target.find('.swe-wrap-slider');

			$wrap_item.find('.swe-item').on('click', function(e) {
				$wrap_item.find('.swe-item.active').removeClass('active');
				$(this).addClass('active');
				e.preventDefault();
			});
			$wrap_item.find('.swe-item a').on('click', function(e){
				var href = $(this).attr('href');
				window.location.href = href;
				e.preventDefault();
			});
		},
    	// Call back count down timer for variable product
    	swe_countdown: function ($target) {
    		var items = $target.find('[data-countdown="countdown"]');
            $.each(items, function(item) {
                const $date = $(items[item]).data('date').split("-");
                const $textdays = $(items[item]).data('textdays') ? $(items[item]).data('textdays') : 'days';
                const $texthours = $(items[item]).data('texthours') ? $(items[item]).data('texthours') : 'hours';
                const $textmins = $(items[item]).data('textmins') ? $(items[item]).data('textmins') : 'mins';
                const $textsecs = $(items[item]).data('textsecs') ? $(items[item]).data('textsecs') : 'secs';
                const $format = '<div class="countdown-times"><div class="day">%%D%% <span>'+ $textdays +'</span> </div><div class="hours">%%H%% <span>'+ $texthours +'</span> </div><div class="minutes">%%M%% <span>'+ $textmins +'</span> </div><div class="seconds">%%S%% <span>'+ $textsecs +'</span> </div></div>';
                $(items[item]).lofCountDown({
                    TargetDate: $date[0] + "/" + $date[1] + "/" + $date[2] + " " + $date[3] + ":" + $date[4] + ":" + $date[5],
                    DisplayFormat: $format,
                    FinishMessage: "Expired"
                });
            });
        },
        swe_cart: function ($target) {
			$target.on('click', '.cart-canvas .swe-wrap-cart-head', function (e) {
				$('body').addClass( 'overflow' );
			});
            $target.on('click', '.swe-close, .woo-cart-close', function (e) {
                e.preventDefault();
                $target.find('.input-toggle').prop('checked', false);
				$('body').removeClass( 'overflow' );
            });
        },
		
		swe_category_tab_ajax: function ($target) {
			var $target_slider = $target.find( '.swe-tab-head' );
			var config_slider = getConfigSlider( $target_slider );

			var tg_append 	= $target.find( ' .swe-wrap-tab-content' );
			var action = 'swe_category_ajax_callback';
			var ajaxurl   = swe_ajax.ajax_url.replace( '%%endpoint%%', action );

			$target.on('click', '.swe-tab-title', function (e) {
				var element = $(this);
				var target 		= element.attr( 'aria-controls' );
				var id	 		= element.data( 'target_id' );
				var orderby 	= element.data( 'orderby' );
				var order 		= element.data( 'order' );
				var filter    	= element.data( 'filter' );
				var layout_style   	= element.data( 'layout_style' );
				var image_cat    	= element.data( 'image_cat' );
				var image_link    	= element.data( 'image_link' );
				var catid 		= element.data( 'category' );
				var number 		= element.data( 'number' );
				var row 		= element.parent().data('slides_to_rows');
				if( !element.hasClass ('tab-loaded') ){
					tg_append.find( '.swe-tab-content:last-child' ).addClass( 'active' );
					
					tg_append.addClass( 'loading' );
					var data 		= {
						action: action,
						catid: catid,
						number: number,
						target: target,
						target_id: id,
						filter: filter,
						layout_style: layout_style,
						image_cat: image_cat,
						image_link: image_link,
						orderby: orderby,
						order: order,
						row: row,
					};
					jQuery.post(ajaxurl, data, function(response) {
						element.addClass( 'tab-loaded' );
						tg_append.find( '.swe-tab-content' ).removeClass( 'active' );
						tg_append.append( response );
						$(id).removeClass('slick-initialized slick-slider slick-dotted');
						config_slider.appendArrows = $(id).parent();
						$(id).slick(config_slider);
						$( ".add_to_cart_button" ).attr( "title", swe_ajax.title );
						$( ".add_to_wishlist" ).attr( "title", swe_ajax.wishlist );
						$( ".compare" ).attr( "title", swe_ajax.compare );
						$( ".sw-quickview" ).attr( "title", swe_ajax.quickview );
						tg_append.removeClass( 'loading' );
					});
				}	
			});					
        }, 
		
		swe_category_hover: function ($target) {
			if( $target.find('.swe-woo-categories-slider.style-6 .swe-item > .swe-wrap-item' ).length > 0 ){
				$target.find('.swe-woo-categories-slider.style-6 .swe-item > .swe-wrap-item' ).each(function(){
					var $this = $(this);
					var $img_target = $this.find( '.swe-wrap-image img' );
					var img_H = $img_target.height();
					var img_W = $img_target.width();
					var outer_W = $(this).width();

					var target_H = $(this).find( '.swe-wrap-content' ).outerHeight(true);
					$img_target.parents( '.swe-wrap-image' ).css({'left': -img_W/2, 'top': -( img_H/2 - target_H/2) });
					$(this).find( '.swe-title' ).on({
						mouseenter: function() { 				 
							$this.addClass( 'hover' );					
							$img_target.parents( '.swe-wrap-image' ).css( 'left', outer_W - img_W );
						},
						mouseleave: function() {
							$this.removeClass( 'hover' );	
							$img_target.parents( '.swe-wrap-image' ).css( 'left', -img_H/2 );
						}
					});
				});
			}
        },
        // Pagination Ajax
        swe_pagination_ajax: function ($target) {
            $target.find('.view-more-button').on('click', function (e) {
                e.preventDefault();
            });
            var wrapId = $target.find('.swe-wrapper')[0].id;

            var wrap = $target.find('ul.products')[0];
            var item = '#'+ wrapId +' .product';
            var path = '#'+ wrapId +' a.next.page-numbers';

            if ($target.find('.pagination-ajax')[0]) { 
                if ($target.find(path)[0]) {
                    var button = false;
                    var scrollThreshold = false;
                    if ($target.find('.view-more-button')[0]) {
                        button = '#'+ wrapId +' .view-more-button';
                        scrollThreshold = false;
                        $(document).on('click', '.view-more-button', function () {
                            $(this).hide();
                        });
                    }
                    var infScroll = new InfiniteScroll(wrap, {
                        path: path,
                        append: item,
                        status: '#'+ wrapId +' .scroller-status',
                        hideNav: '#'+ wrapId +' .swe-pagination',
                        button: button,
                        scrollThreshold: scrollThreshold,
                    });

                    $(wrap).on('history.infiniteScroll', function (event, response, path) {
                        $target.find('.view-more-button').show();
                    });
                    $(wrap).on('last.infiniteScroll', function (event, response, path) {
                        $target.find('.view-more-button').remove();
                    });
                }
            }
        },
		swe_loadmore_ajax: function ($target) {
			var button =  $target.find('.collection-loadmore');
			var page = 2;
			var loading = false;
			var maxpage = button.data( 'maxpage' );
			var loadmore_style  = button.data( 'loadmore_style' );
            var scrollHandling = {
				allow: true,
				reallow: function() {
					scrollHandling.allow = true;
				},
				delay: 400 /* milliseconds) adjust to the highest acceptable value */
			};
			
			function containsSpecialChars(str) {
			  const specialChars = /[?]/;
			  return specialChars.test(str);
			}
			
			function get_url( $page ){
				var current_url = window.location.href;
				var next_url = '';
				if( containsSpecialChars( current_url ) ){
					next_url = current_url + '&paged=' + $page;
				}else{
					next_url = current_url + '?paged=' + $page;
				}
				return next_url;
			}
			
			
			function _product_loadmore_ajax(){
				loading = true;
				button.addClass( 'loading' );	
				var url = get_url( page );	
				$target.find( 'ul.swe-slider' ).each( function(){
					$(this).addClass( 'loaded' );
				});
				$.ajax({method:"GET", url: url, success: function( data ) {
					 var $data = $('<div>'+data+'</div>');
					var target_html = $data.find( 'ul.swe-collections-wrapper' );					
					page = page +1;				
					loading = false;
					$target.find('ul.swe-collections-wrapper').append( target_html.html() );
					var target_sliders = $target.find( '.swe-wrap-item ul.swe-slider' );
					target_sliders.each( function(item){
						let config = getConfigSlider(target_sliders[item]);
						if( !$(target_sliders[item]).hasClass( 'loaded' ) ){
							$(target_sliders[item]).removeClass('slick-initialized slick-slider slick-dotted');
							$(target_sliders[item]).slick(config);
							$(target_sliders[item]).addClass( 'loaded' );
						}
					});
					button.removeClass( 'loading' );
					if( maxpage < page ){
						button.addClass( 'loaded' );
					}
				}});
			}
			if( loadmore_style == 2 ){
				$(window).scroll(function(){
					if( ! loading && scrollHandling.allow ) {
						scrollHandling.allow = false;
						setTimeout(scrollHandling.reallow, scrollHandling.delay);
						var offset = $(button).offset().top - $(window).scrollTop();	
						if( maxpage < page ){
							button.addClass( 'loaded' );
						}
						if( 1000 > offset && maxpage >= page ) {
							_product_loadmore_ajax();
						}
					}
				});
			}else{		
				button.on( 'click', function(e){
					if( maxpage >= page ){			
						_product_loadmore_ajax();
					}
					e.preventDefault();
				});
			}
        },
    };

    $(window).on('elementor/frontend/init', function () {

        // Woo Cart
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-woo-cart.default",
            sw_woo_elements.swe_cart
            );

 		// Category Tab slider
 		elementorFrontend.hooks.addAction(
 			"frontend/element_ready/swe-woo-category-tab-slider.default",
 			sw_woo_elements.swe_tabs
		);		
 		elementorFrontend.hooks.addAction(
 			"frontend/element_ready/swe-woo-category-tab-slider.default",
 			sw_woo_elements.swe_slider
 			);
		elementorFrontend.hooks.addAction(
 			"frontend/element_ready/swe-woo-category-tab-slider.default",
 			sw_woo_elements.swe_category_tab_ajax
		);	
		// Category Tab Chils Cat
 		elementorFrontend.hooks.addAction(
 			"frontend/element_ready/swe-woo-category-tab-childcat.default",
 			sw_woo_elements.swe_tabs
 			);
 		elementorFrontend.hooks.addAction(
 			"frontend/element_ready/swe-woo-category-tab-childcat.default",
 			sw_woo_elements.swe_slider
 			);
 		
 		// Filter Tab slider
 		elementorFrontend.hooks.addAction(
 			"frontend/element_ready/swe-woo-filter-tab-slider.default",
 			sw_woo_elements.swe_tabs
 			);
 		elementorFrontend.hooks.addAction(
 			"frontend/element_ready/swe-woo-filter-tab-slider.default",
 			sw_woo_elements.swe_slider
 			);

 		// Tags slider
 		elementorFrontend.hooks.addAction(
 			"frontend/element_ready/swe-woo-tags-slider.default",
 			sw_woo_elements.swe_slider
 			);
			
		// Categories slider
 		elementorFrontend.hooks.addAction(
 			"frontend/element_ready/swe-woo-categories-slider.default",
 			sw_woo_elements.swe_slider
 			);
		elementorFrontend.hooks.addAction(
 			"frontend/element_ready/swe-woo-categories-slider.default",
 			sw_woo_elements.swe_category_hover
 			);

        // Countdown slider
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-woo-countdown-slider.default",
            sw_woo_elements.swe_countdown
            );
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-woo-countdown-slider.default",
            sw_woo_elements.swe_slider
            );

        // Related and Upsells slider
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-woo-related-and-upsells-tab-slider.default",
            sw_woo_elements.swe_tabs
            );
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-woo-related-and-upsells-tab-slider.default",
            sw_woo_elements.swe_slider
            );

        // Recent Viewed slider
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-woo-recent-viewed.default",
            sw_woo_elements.swe_slider
            );

        // Related slider
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-woo-related-slider.default",
            sw_woo_elements.swe_slider
            );

        // Upsells slider
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-woo-upsells-slider.default",
            sw_woo_elements.swe_slider
            );

        // Products grid
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-woo-products-grid.default",
            sw_woo_elements.swe_pagination_ajax
            );

        // Products slider
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-woo-products-slider.default",
            sw_woo_elements.swe_slider
            ); 
			
		elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-woo-products-slider.default",
            sw_woo_elements.swe_countdown
            );
			
		 // Vendor slider
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-vendor-slider.default",
            sw_woo_elements.swe_slider
            ); 
		
		// Dokan slider
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-dokan-slider.default",
            sw_woo_elements.swe_slider
            ); 
			
		// WCFM slider
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-wcfm-slider.default",
            sw_woo_elements.swe_slider
            ); 
			
		// Vendor slider
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-wcmp-slider.default",
            sw_woo_elements.swe_slider
            ); 
		
		// Tab products slider
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-woo-tab-products-slider.default",
            sw_woo_elements.swe_slider
            ); 
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-woo-tab-products-slider.default",
            sw_woo_elements.swe_tabs
            );	
		
		elementorFrontend.hooks.addAction(
			"frontend/element_ready/swe-woo-categories-slider.default",
			sw_woo_elements.swe_cat_style2
		);	
		elementorFrontend.hooks.addAction(
            "frontend/element_ready/swg-brand-element.default",
            sw_woo_elements.swe_slider
            );
			
		elementorFrontend.hooks.addAction(
            "frontend/element_ready/swg-testimonial.default",
            sw_woo_elements.swe_slider
            );
			
		elementorFrontend.hooks.addAction(
            "frontend/element_ready/swg-ourteam.default",
            sw_woo_elements.swe_slider
            );
			
		elementorFrontend.hooks.addAction(
            "frontend/element_ready/swg_list_images.default",
            sw_woo_elements.swe_slider
            );
			
		elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-woo-collections.default",
            sw_woo_elements.swe_loadmore_ajax
            );
		elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-woo-collections.default",
            sw_woo_elements.swe_slider
            );
    });

    function getConfigSlider(slider) {
        let config = {
		  appendArrows: ( typeof( $(slider).data('append') ) != 'undefined' ) ? $(slider).data('append') : $(slider).parent(),
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
          vertical: $(slider).data('vertical') == 'yes' ? true : false,
		  nextArrow: $(slider).data('next'),
		  prevArrow: $(slider).data('prev'),
          rtl: ( $('body').hasClass('rtl') && $(slider).data('vertical') != 'yes' ) ? true : false,
          centerPadding: $(slider).data('center_padding') ? parseInt($(slider).data('center_padding')) + 'px' : '0px',
          responsive: [ {
            breakpoint: 1400,
				settings: {
					slidesToShow: $(slider).data('slides_to_show_medium') ? parseInt($(slider).data('slides_to_show_medium')) : 3,
				}
			},{
			breakpoint: 1199,
             settings: {
                slidesToShow: $(slider).data('slides_to_show_tablet') ? parseInt($(slider).data('slides_to_show_tablet')) : 1,
                arrows: $(slider).data('arrows_tablet') == 'yes' ? true : false,
                dots: $(slider).data('dots_tablet') == 'yes' ? true : false,
                centerMode: $(slider).data('center_mode_tablet') == 'yes' ? true : false,
                centerPadding: $(slider).data('center_padding_tablet') ? parseInt($(slider).data('center_padding_tablet')) + 'px' : '0px',
            }
			}, {
			 breakpoint: 767,
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
