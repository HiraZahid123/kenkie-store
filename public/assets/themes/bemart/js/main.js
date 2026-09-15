(function($) {
	"use strict";
	/*
	** Quickview and single product slider
	*/
	$(document).ready(function(){
		$(".yith-wcwl-add-button a").attr('title', custom_text.wishlist_text);
		$("a.add_to_cart_button").attr('title', custom_text.cart_text);
		/* 
		** Slider single product image
		*/		
			
		
		 $(".share_copy button").on('click',function() {
            $(this).parent().find( '.url_share' ).select();
    		document.execCommand('copy');
			$(this).closest( '.share_copy' ).find( '.copied-message' ).fadeIn( 500 ).fadeOut(3000);
        });
	});
	$(document).on( 'click', '.yith-woocompare-popup-close', function(e){
		e.preventDefault();
	});
	$(document).on( 'click', '.show-sidebar', function(){
		$(this).toggleClass( 'active' );
		$(this).parent().toggleClass( 'open' );
	});
	
	/*
	** Back to top
	**/
	$("#swg-totop").hide();
	var wh = $(window).height();
	var whtml = $(document).height();
	$(window).scroll(function () {
		if ($(this).scrollTop() > whtml/10) {
			$('#swg-totop').fadeIn();
		} else {
			$('#swg-totop').fadeOut();
		}
	});
	
	$('#swg-totop').on('click',function() {
		$('body,html').animate({
			scrollTop: 0
		}, 800);
		return false;
	});

	/* end back to top */
		
	function sw_buynow_variation_product(){
		var element = $( '.single-product' );
		var target = $( '.single-product .variations_form' );
		var bt_addcart = target.find( '.single_add_to_cart_button' );
		var variation  = target.find( '.variation_id' ).val();
		var bt_buynow  = element.find( '.button-buynow' );
		var url = bt_buynow.data( 'url' );
		var qty = $('.single-product input.qty').val();
		if( typeof variation != 'undefined' ){
			if( variation == 0 ){
				bt_buynow.addClass( 'disabled' );
			}else{
				bt_buynow.removeClass( 'disabled' );
			}
			if( variation != '' ){
				bt_buynow.attr( 'href', url + '='+variation + '&quantity='+ qty );
			}else{
				bt_buynow.attr( 'href', url + '&quantity='+ qty );
			}
		}else{
			bt_buynow.attr( 'href', url + '&quantity='+ qty );
		}
		
	}
	$(window).on( 'change', function(){
		sw_buynow_variation_product();
	});
	$(document).ready(function(){
		sw_buynow_variation_product();
		/*add title to button*/
	});
	$(document).on( 'click', '#single-buynow-checkbox', function(){
		$(this).parents( '.swg-buynow-wrapper' ).find( '.button-buynow' ).toggleClass( 'checkbox-disable' );
	});
	
	$(document).on( 'click', '.button-buynow', function(e){
		if( $(this).hasClass( 'disabled' ) || $(this).hasClass( 'checkbox-disable' ) ){
			e.preventDefault();
		}
	});	

	
	$(".widget_nav_menu li.menu-compare a").on('hover', function() {
		$(this).css('cursor','pointer').attr('title', custom_text.compare_text);
	}, function() {
		$(this).css('cursor','auto');
	});
	$(".widget_nav_menu li.menu-wishlist a").on('hover', function() {
		$(this).css('cursor','pointer').attr('title', custom_text.wishlist_text);
	}, function() {
		$(this).css('cursor','auto');
	});
	
	$('.product-categories').each(function(){		
		$(this).find( 'li.cat-parent' ).append( '<span class="child-category-more"><svg xmlns="http://www.w3.org/2000/svg" width="30" viewBox="0 0 24 24"><path  fill-rule="evenodd" d="M4.47 9.4a.75.75 0 0 1 1.06 0l6.364 6.364a.25.25 0 0 0 .354 0L18.612 9.4a.75.75 0 0 1 1.06 1.06l-6.364 6.364a1.75 1.75 0 0 1-2.475 0L4.47 10.46a.75.75 0 0 1 0-1.06" clip-rule="evenodd"/></svg></span>' );
	});
	
	$(document).on( 'click', '.child-category-more', function(){
		$(this).parent().toggleClass( 'active' );
		$(this).parent().find( ' >ul.children' ).toggle(200);
	});	
	
	$(document).on('click', '.filter-sidebar .button-filter', function(){
		$("#sidebar-fixed").toggleClass( 'open' );
		$(this).toggleClass("closex");
	});
	$(document).on('click', '.sidebar-fixed-overlay', function(){
		$(this).parent().removeClass( 'open' );
	});
	
	$(document).on('click', '.sidebar-close', function(e){
		var target = $(this).attr( 'href' );
		$(target).removeClass( 'open' );
		e.preventDefault();
	});
	
	$( '.top-fill .above-product-widget.sidebar .widget .block-title-widget' ).each(function(){
		$(this).addClass( 'draw-border' );
	});

	$(window).scroll(function() {   
		if( $( 'body' ).hasClass( 'mobile-layout' ) ) {
			var target = $( '.mobile-layout #header-page' );
			var sticky_nav_mobile_offset = $(".mobile-layout #header-page").offset();
			if( sticky_nav_mobile_offset != null ){
				var sticky_nav_mobile_offset_top = sticky_nav_mobile_offset.top;
				var scroll_top = $(window).scrollTop();
				if ( scroll_top > sticky_nav_mobile_offset_top ) {
					$(".mobile-layout #header-page").addClass('sticky-mobile');
				}else{
					$(".mobile-layout #header-page").removeClass('sticky-mobile');
				}
			}
		}
	});
	
	/*
	** Ajax login
	*/
	$('form.login-ajax').on('submit', function(e){
		var target = $(this);		
		var usename = target.find( '#username').val();
		var pass 	= target.find( '#password').val();
		if( usename.length == 0 || pass.length == 0 ){
			target.find( '.login_message' ).addClass( 'error' ).html( custom_text.message );
			return false;
		}
		target.addClass( 'loading' );
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: custom_text.ajax_url,
			headers: { 'api-key':target.find( '#woocommerce-login-nonce').val() },
			data: { 
				'action': 'swg_custom_login_user', //calls wp_ajax_nopriv_ajaxlogin
				'username': target.find( '#username').val(), 
				'password': target.find( '#password').val(), 
				'security': target.find( '#woocommerce-login-nonce').val() 
			},
			success: function(data){
				target.removeClass( 'loading' );
				target.find( '#login_message' ).html( data.message );
				if (data.loggedin == false){
					target.find( '.input-login').css( 'box-shadow', '0 0 0 1px red' );
					target.find( '#login_message' ).addClass( 'error' );
				}
				if (data.loggedin == true){
					target.find( '.input-login').removeAttr( 'style' );
					document.location.href = data.redirect;
					target.find( '#login_message' ).removeClass( 'error' );
				}
			}
		});
		e.preventDefault();
	});
	
	var $x = [];
	var $i = 0;
	$( '.button-layout' ).each(function(){
		var $class = $(this).attr( 'data-value' );
		$x[$i] = $class;
		$i ++;
	});
	
	$(document).on( 'click', '.button-layout', function(e){
		$(this).addClass( 'active' ).siblings().removeClass( 'active' );
		var $class = $(this).attr( 'data-value' );
		var $z = $.grep($x, function(value) {
			return value != $class;
		});
		
		var string = $z.toString();
		var target = $(this).closest( '.woocommerce' );
		target.addClass( $class );
		target.find( 'ul.products' ).addClass( $class );
		target.find( 'ul.products' ).fadeOut(1);	
		target.find( 'ul.products' ).fadeIn(300);	
		target.removeClass( string.replace( /,/g, ' ' ) );
		target.find( 'ul.products ' ).removeClass( string.replace( /,/g, ' ' ) );
		
		e.preventDefault();
	});	
	
	$( '.swe-categories-slider-custom-style7 .swe-item' ).on( 'mouseenter', function(){
		var target = $(this).attr( 'data-target' );
		$(this).closest('.swe-category-wrap-top').find('.swe-item.active').removeClass('active');
		$(this).addClass( 'active' );
		$(target).closest('.swe-wrap-content-image').find('.swe-wrap-image.active').removeClass('active');
		$(target).addClass( 'active' );
	});
	$( '.swe-categories-slider-custom-style9 .swe-item' ).on( 'mouseenter', function(){
		var target = $(this).attr( 'data-target' );
		$(this).closest('.swe-category-wrap-top').find('.swe-item.active').removeClass('active');
		$(this).addClass( 'active' );
		$(target).closest('.swe-wrap-content-image').find('.swe-wrap-image.active').removeClass('active');
		$(target).addClass( 'active' );
	});
	
})(jQuery);

(function ($) {
  "use strict";

  document.querySelectorAll('.swe-product-slider').forEach(function (slider) {
    var track = slider.querySelector('.slider-track');
    var prev = slider.querySelector('.slider-prev');
    var next = slider.querySelector('.slider-next');

    if (!track || !prev || !next) return;

    var items = Array.from(track.querySelectorAll('li.product'));
    if (!items.length) return;

    var gap = parseInt(getComputedStyle(items[0]).marginRight) || 0;
    var itemWidth = items[0].offsetWidth + gap;

    var viewportWidth = track.parentElement.offsetWidth;
    var maxScroll = track.scrollWidth - viewportWidth;

    var currentIndex = 0;
    var isAnimating = false;

    function getCurrentIndex() {
      return Math.floor((track.scrollLeft + 0.5) / itemWidth);
    }

    function clamp(val, min, max) {
      return Math.max(min, Math.min(val, max));
    }

    function smoothScrollTo(target) {
      target = clamp(target, 0, maxScroll);
      if (isAnimating) return;
      isAnimating = true;

      var start = track.scrollLeft;
      var distance = target - start;
      var duration = 320;
      var startTime = null;

      function ease(t) {
		return 1 - Math.pow(1 - t, 3);
      }

      function animate(time) {
        if (!startTime) startTime = time;
        var progress = Math.min((time - startTime) / duration, 1);
        track.scrollLeft = start + distance * ease(progress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          isAnimating = false;
          currentIndex = getCurrentIndex();
          updateButtons();
        }
      }
	  track.scrollLeft = start;
      requestAnimationFrame(animate);
    }

    function updateButtons() {
      prev.disabled = track.scrollLeft <= 0;
      next.disabled = track.scrollLeft >= maxScroll - 1;
    }

    /* ===== BUTTON ===== */
    next.addEventListener('click', function () {
      smoothScrollTo(track.scrollLeft + itemWidth);
    });

    prev.addEventListener('click', function () {
      smoothScrollTo(track.scrollLeft - itemWidth);
    });

    /* ===== DRAG / SCROLL SYNC ===== */
    track.addEventListener('scroll', function () {
      if (!isAnimating) {
        currentIndex = getCurrentIndex();
        updateButtons();
      }
    });

    window.addEventListener('resize', function () {
      viewportWidth = track.parentElement.offsetWidth;
      maxScroll = track.scrollWidth - viewportWidth;
      updateButtons();
    });

    updateButtons();
  });
})(jQuery);

/*
** Check comment form
*/
function submitform(){
	if(document.commentform.comment.value=='' || document.commentform.author.value=='' || document.commentform.email.value==''){
		alert('Please fill the required field.');
		return false;
	} else return true;
}