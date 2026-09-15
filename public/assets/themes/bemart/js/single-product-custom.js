document.addEventListener('DOMContentLoaded', function() {
    // Target WooCommerce gallery image links
    const galleryLinks = document.querySelectorAll('.woocommerce-product-gallery__image a');

    galleryLinks.forEach(link => {
        link.removeAttribute('data-elementor-open-lightbox'); // Prevent Elementor interference

        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const $link = jQuery(this);
            const $gallery = $link.closest('.woocommerce-product-gallery');

            if ($gallery.length && jQuery.fn.wc_product_gallery) {
                // Ensure gallery is initialized
                const galleryData = $gallery.data('product_gallery');
                if (!galleryData) {
                    $gallery.wc_product_gallery();
                }

                // Build items array from gallery images
                const items = [];
                const $allImages = $gallery.find('.woocommerce-product-gallery__image a');
                $allImages.each(function() {
                    const $img = jQuery(this).find('img');
                    items.push({
                        src: $img.attr('data-large_image') || this.href,
                        w: parseInt($img.attr('data-large_image_width')) || 990,
                        h: parseInt($img.attr('data-large_image_height')) || 1320,
                        title: $img.attr('alt') || ''
                    });
                });

                // Get the index of the clicked image
                const clickedIndex = $allImages.index($link);

                // Open PhotoSwipe with the correct starting index
                const pswpElement = document.querySelector('.pswp');
                if (pswpElement) {
                    const options = {
                        index: clickedIndex, // Start at the clicked image
                        getThumbBoundsFn: function(index) {
                            const thumbnail = $gallery.find('.woocommerce-product-gallery__image').eq(index)[0];
                            const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
                            const rect = thumbnail.getBoundingClientRect();
                            return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
                        }
                    };
                    const photoswipe = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
                    photoswipe.init();
                }
            }
        }, { capture: true });
    });
	
	var $vertical		= jQuery( '.product-images' ).data('vertical');
	var $img_slider 	= jQuery('.product-images').find('.product-responsive');
	var video_link 		= jQuery('.product-images').data('video');
	var $thumb_slider 	= jQuery('.product-images').find('.product-responsive-thumbnail' );
	var number_slider	= ( $vertical ) ? 6: 5;
	var number_medium	= ( $vertical ) ? 5: 5;
	var number_tablet	= ( $vertical ) ? 4: 4;
	var number_mobile 	= ( $vertical ) ? 3: 3;
	
	$img_slider.slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		fade: true,
		arrows: true,
		asNavFor: $thumb_slider,
		infinite: false
	});
	$thumb_slider.slick({
		slidesToShow: number_slider,
		slidesToScroll: 1,
		asNavFor: $img_slider,
		arrows: false,
		infinite: false,
		vertical: $vertical,
		verticalSwiping: $vertical,
		focusOnSelect: true,
		responsive: [
		{
			breakpoint: 1366,
			settings: {
				slidesToShow: number_medium    
			}
		},
		{
			breakpoint: 991,
			settings: {
				slidesToShow: number_tablet    
			}
		},
		{
			breakpoint: 480,
			settings: {
				slidesToShow: number_mobile    
			}
		},
		{
			breakpoint: 360,
			settings: {
				slidesToShow: 2    
			}
		}
		]
	});
	var el = jQuery('.product-images');
	setTimeout(function(){
		jQuery( '.woocommerce-product-gallery__trigger' ).remove();
		el.removeClass("loading");
		var height = el.find('.product-responsive').outerHeight();
		var target = el.find( ' .item-video' );
		target.css({'height': height,'padding-top': (height - target.outerHeight())/2 });
		if( custom_text.product_zoom == 1 ){
				$img_slider.prepend( '<a href="#" class="woocommerce-product-gallery__trigger">ðŸ”</a>' );
				const triggerButton = document.querySelector('.woocommerce-product-gallery__trigger');
				if (triggerButton) {
					triggerButton.addEventListener('click', function(e) {
						e.preventDefault();
						e.stopPropagation();
						const currentSlideIndex = $img_slider.slick('slickCurrentSlide');
						const items = [];
						const $galleryImages = $img_slider.find('.woocommerce-product-gallery__image');
						$galleryImages.each(function() {
							const $img = jQuery(this).find('img');
							items.push({
								src: $img.attr('data-large_image') || $img.attr('src') || jQuery(this).find('a').attr('href'),
								w: parseInt($img.attr('data-large_image_width')) || 990,
								h: parseInt($img.attr('data-large_image_height')) || 1320,
								title: $img.attr('alt') || ''
							});
						});
						const pswpElement = document.querySelector('.pswp');
						if (pswpElement) {
							const options = {
								index: currentSlideIndex,
								getThumbBoundsFn: function(index) {
									const thumbnail = $galleryImages.eq(index)[0];
									const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
									const rect = thumbnail.getBoundingClientRect();
									return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
								}
							};
							const photoswipe = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
							photoswipe.init();
						}
					});
				}
			}
			var thumb_height = el.find('.product-responsive-thumbnail' ).outerHeight();
			var thumb_target = el.find( '.item-video-thumb' );
			thumb_target.css({ height: thumb_height,'padding-top':( thumb_height - thumb_target.outerHeight() )/2 });
		}, 500);
		if( video_link != '' && typeof video_link != 'undefined' ) {
			$img_slider.append( '<button data-type="popup" class="featured-video-button fa fa-play" data-video="'+ video_link +'"></button>' );
			if( jQuery( 'body' ).hasClass( 'single-product-style1' ) || jQuery( 'body' ).hasClass( 'single-product-style2' ) ){
				jQuery( '.woocommerce-product-gallery__wrapper > .woocommerce-product-gallery__image:first' ).prepend( '<button data-type="popup" class="featured-video-button style1" data-video="'+ video_link +'"></button>' );
			}
		}

	const $gallery = jQuery('.woocommerce-product-gallery__wrapper .product-responsive');
	
	
	const triggerButton = document.querySelector('.woocommerce-product-gallery__trigger');
	if (triggerButton) {
		triggerButton.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			const currentSlideIndex = $gallery.slick('slickCurrentSlide');
			const items = [];
			const $galleryImages = $gallery.find('.woocommerce-product-gallery__image');
			$galleryImages.each(function() {
				const $img = jQuery(this).find('img');
				items.push({
					src: $img.attr('data-large_image') || $img.attr('src') || jQuery(this).find('a').attr('href'),
					w: parseInt($img.attr('data-large_image_width')) || 990,
					h: parseInt($img.attr('data-large_image_height')) || 1320,
					title: $img.attr('alt') || ''
				});
			});
			const pswpElement = document.querySelector('.pswp');
			if (pswpElement) {
				const options = {
					index: currentSlideIndex,
					getThumbBoundsFn: function(index) {
						const thumbnail = $galleryImages.eq(index)[0];
						const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
						const rect = thumbnail.getBoundingClientRect();
						return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
					}
				};
				const photoswipe = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
				photoswipe.init();
			}
		});
	}
	if( custom_text.tab_accordion == 1 ){
		const accordionTitles = document.querySelectorAll('.accordion-title');

		accordionTitles.forEach(title => {
			title.addEventListener('click', function() {
				const content = this.nextElementSibling;
				const isOpen = content.classList.contains('open');

				document.querySelectorAll('.accordion-content').forEach(item => {
					item.classList.remove('open');
					item.previousElementSibling.classList.remove('active');
				});

				if (!isOpen) {
					content.classList.add('open');
					this.classList.add('active');
				} else {
					content.classList.remove('open');
					this.classList.remove('active');
				}
			});
		});

		// Open first item by default (optional)
		const firstTitle = document.querySelector('.accordion-title');
		if (firstTitle) {
			firstTitle.click();
		}
	}		
});