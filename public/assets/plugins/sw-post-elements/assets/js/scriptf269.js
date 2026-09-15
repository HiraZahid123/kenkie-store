/**
 * script.js
 *
 * @copyright  2021 Add on elements. All rights reserved.
 * @license MIT
 */
 (function ($) {
 	"use strict";
 	var sw_elements = {
 		swe_tabs: function($target) {
 			let $wrap_tabs = $target.find('.swe-wrap-tabs');
 			$wrap_tabs.find('.swe-tab-title:first-child').addClass('active');
 			$wrap_tabs.find('.swe-tab-content:first-child').addClass('active');
            if ($target.find('.swe-category-block-random')[0]) {
                sw_elements.swe_post_random($wrap_tabs.find('.swe-tab-content:first-child'));
            }

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
              if ($target.find('.swe-category-block-random')[0]) {
                sw_elements.swe_post_random($('#' + tab_control));
                }
            });
            $target.find('.swe-navbar-toggle').on('click', function() {
               $(this).siblings('.swe-tab-head').slideToggle();
           });
        },
        swe_slider: function ($target) {
            let items = $target.find('.swe-slider');
            $.each(items, function(item) {
                let config = getConfigSlider(items[item]);
                $(items[item]).find('.slick-slider').removeClass('slick-initialized slick-slider slick-dotted');
                $(items[item]).siblings('.gallery-thumb').remove();
                $(items[item]).slick(config);
				$( '.slick-arrow' ).removeAttr( 'style' );
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
            $target.on('click', '.swe-close, .woo-cart-close', function (e) {
                e.preventDefault();
                $target.find('.input-toggle').prop('checked', false);
            });
        },
        // Pagination Ajax
        swe_pagination_ajax: function ($target) {

            $target.find('.view-more-button').on('click', function (e) {
                e.preventDefault();
            });
            var wrapId = $target.find('.swe-wrapper')[0].id;

            var wrap = $target.find('.posts')[0];
            var item = '#'+ wrapId +' .post';
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
                    if($target.find('.swe-wrap-post-masonry')[0]){
                        let iso = new Isotope( '.swe-wrap-post-masonry .posts', {
                          itemSelector: '.post',
                      });
                        new InfiniteScroll(wrap, {
                            path: path,
                            append: item,
                            status: '#'+ wrapId +' .scroller-status',
                            hideNav: '#'+ wrapId +' .swe-pagination',
                            button: button,
                            scrollThreshold: scrollThreshold,
                            outlayer: iso
                        });
                    } else {
                        new InfiniteScroll(wrap, {
                            path: path,
                            append: item,
                            status: '#'+ wrapId +' .scroller-status',
                            hideNav: '#'+ wrapId +' .swe-pagination',
                            button: button,
                            scrollThreshold: scrollThreshold,
                        });
                    }

                    $(wrap).on('history.infiniteScroll', function (event, response, path) {
                        $target.find('.view-more-button').show();
                        let items = $target.find('.swe-slider');
                        $.each(items, function(item) {
                            let config = getConfigSlider(items[item]);
                            $(items[item]).find('.slick-slider').removeClass('slick-initialized slick-slider slick-dotted');
                            $(items[item]).siblings('.gallery-thumb').remove();
                            $(items[item]).slick(config);
                        });
                    });
                    $(wrap).on('last.infiniteScroll', function (event, response, path) {
                        $target.find('.view-more-button').remove();

                        let items = $target.find('.swe-slider');
                        $.each(items, function(item) {
                            let config = getConfigSlider(items[item]);
                            $(items[item]).find('.slick-slider').removeClass('slick-initialized slick-slider slick-dotted');
                            $(items[item]).siblings('.gallery-thumb').remove();
                            $(items[item]).slick(config);
                        });
                    });
                }
            }
        },
        swe_masonry_layout: function($target){
            if($target.find('.swe-wrap-post-masonry')[0]){
                $target.find('.swe-wrap-post-masonry .posts').isotope({
                  itemSelector: '.post',
              });
            }
        },
        swe_post_random: function ($target) {
            let posts = $target.find('.posts');
            posts.css({position: 'relative'});

            let postsWidth = posts.width();
            let postsHeight = posts.height();

            let items = $target.find('.post');

            $.each(items, function (item) {
                let wItem;
                if ($(window).width() < 767) {
                    wItem = postsWidth / 2;
                } else {
                    wItem = postsWidth / 3;
                }
                let hItem = $(items[item]).height();
                let widthItem = (wItem / 2) + getNumberRandom(wItem / 2);
                let leftItem = getNumberRandom(postsWidth, widthItem);
                let topItem = getNumberRandom(postsHeight, hItem);

                $(items[item]).css({left: leftItem + 'px', top: topItem + 'px', position: 'absolute', width: widthItem + 'px'});
            });
        }
    };

    $(window).on('elementor/frontend/init', function () {

        // Post grid
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-post-grid.default",
            sw_elements.swe_pagination_ajax
            );
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-post-grid.default",
            sw_elements.swe_slider
            );

        // Post list
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-post-list.default",
            sw_elements.swe_pagination_ajax
            );

        // Post Slider
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-post-slider.default",
            sw_elements.swe_slider
            );

        // Testimonial Slider
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-testimonial.default",
            sw_elements.swe_slider
            );

        // Category Slider
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-category-slider.default",
            sw_elements.swe_slider
            );
        
        // Testimonial Slider
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-category-tab-slider.default",
            sw_elements.swe_slider
            );
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-category-tab-slider.default",
            sw_elements.swe_tabs
            );
        
        // Related posts slider
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-post-related-slider.default",
            sw_elements.swe_slider
            );
        
        // Related posts slider
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-post-recently-viewed.default",
            sw_elements.swe_slider
            );
        
        // Related posts masonry
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-post-masonry.default",
            sw_elements.swe_pagination_ajax
            );
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-post-masonry.default",
            sw_elements.swe_masonry_layout
            );
        
        // Related posts masonry
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/swe-post-tabs-widget.default",
            sw_elements.swe_tabs
            );

    });

    function getNumberRandom(divLg, divSm) {
        let number = screen.width;
        if (divLg) {
            number = divLg;
        }
        if (divSm) {
            number = number - divSm;
        }
        return Math.floor((Math.random() * number));
    }

    function getConfigSlider(slider) {
    	let rtl = $('body').hasClass('rtl') ? true : false;
        let config = {
			appendArrows: ( typeof( $(slider).data('append') ) != 'undefined' ) ? $(slider).data('append') : $(slider).parent(),
            rows: $(slider).data('slides_to_rows') ? parseInt($(slider).data('slides_to_rows')) : 1,
            slidesToShow: $(slider).data('slides_to_show') ? parseInt($(slider).data('slides_to_show')) : 4,
            slidesToScroll: $(slider).data('slides_to_scroll') ? parseInt($(slider).data('slides_to_scroll')) : 1,
            arrows: $(slider).data('arrows') == 'yes' ? true : false,
            dots: $(slider).data('dots') == 'yes' ? true : false,
            pauseOnHover: $(slider).data('pause_on_hover') == 'yes' ? true : false,
            autoplay: $(slider).data('autoplay') == 'yes' ? true : false,
            autoplaySpeed: $(slider).data('autoplay_speed') ? $(slider).data('autoplay_speed') * 1000 : 3000,
            infinite: $(slider).data('infinite') == 'yes' ? true : false,
            fade: $(slider).data('fade') == 'fade' ? true : false,
            centerMode: $(slider).data('center_mode') == 'yes' ? true : false,
			vertical: $(slider).data('vertical') == 'yes' ? true : false,
            lazyLoad: $(slider).data('lazyload') ? $(slider).data('lazyload') : 'progressive',
			nextArrow: $(slider).data('next'),
			prevArrow: $(slider).data('prev'),
            rtl: rtl,
            centerPadding: $(slider).data('center_padding') ? parseInt($(slider).data('center_padding')) + 'px' : '0px',
            responsive: [ {
                breakpoint: 1199,
                settings: {
                    rows: $(slider).data('slides_to_rows_tablet') ? parseInt($(slider).data('slides_to_rows_tablet')) : 1,
                    slidesToShow: $(slider).data('slides_to_show_tablet') ? parseInt($(slider).data('slides_to_show_tablet')) : 1,
                    arrows: $(slider).data('arrows_tablet') == 'yes' ? true : false,
                    dots: $(slider).data('dots_tablet') == 'yes' ? true : false,
                    centerMode: $(slider).data('center_mode_tablet') == 'yes' ? true : false,
                    centerPadding: $(slider).data('center_padding_tablet') ? parseInt($(slider).data('center_padding_tablet')) + 'px' : '0px',
                }
            }, {
                breakpoint: 767,
                settings: {
                    rows: $(slider).data('slides_to_rows_mobile') ? parseInt($(slider).data('slides_to_rows_mobile')) : 1,
                    slidesToShow: $(slider).data('slides_to_show_mobile') ? parseInt($(slider).data('slides_to_show_mobile')) : 1,
                    arrows: $(slider).data('arrows_mobile') == 'yes' ? true : false,
                    dots: $(slider).data('dots_mobile') == 'yes' ? true : false,
                    centerMode: $(slider).data('center_mode_mobile') == 'yes' ? true : false,
                    centerPadding: $(slider).data('center_padding_mobile') ? parseInt($(slider).data('center_padding_mobile')) + 'px' : '0px',
                }
            } ]
        };
        return config;
    }

})(jQuery);
