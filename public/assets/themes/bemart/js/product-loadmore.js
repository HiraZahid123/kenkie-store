(function($) {
	"use strict";
	var button = $('.pagination-ajax > button');
	var page = 2;
	var loading = false;
	var maxpage = button.data( 'maxpage' );
	var number = button.data( 'number' );
	var total_product = button.data( 'total_products' );
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
		$.ajax({method:"GET", url: url, success: function( data ) {
			 var $data = $('<div>'+data+'</div>');
			var target = $data.find( 'ul.products' );			
			var total = ( number * page > total_product ) ? total_product : number * page;
			var percentage = total/total_product * 100 + '%';
			$( '.pagination-ajax-total > .pagination-ajax-total-title > span' ).html( total );
			$( '.pagination-ajax-total > .pagination-ajax-percentage > span' ).css( 'width', percentage );
			$('ul.products').append( target.html() );
			page = page +1;				
			loading = false;
			button.removeClass( 'loading' );
			if( maxpage < page ){
				button.addClass( 'loaded' );
			}		
			
			$( 'ul.products' ).find(".product-countdown").each(function(event){
				var $this = $(this);
				var $current_time 	= new Date().getTime();
				var $cd_date	  	= $(this).data( "date" ); 
				var $start_time 	= $(this).data("starttime") * 1000;
				var $countdown_time = $cd_date * 1000;
				var $austDay 		= new Date( $cd_date * 1000 );	
				var days			= $(this).data( "days" );
				var hours			= $(this).data( "hours" );
				var mins			= $(this).data( "mins" );
				var secs			= $(this).data( "secs" );
				if( $start_time > $current_time ){
					$this.remove();
					return ;
				}
				if( $countdown_time > 0 && $current_time > $countdown_time ){
					$this.remove();
					return ;
				}
				if( $countdown_time <= 0 ){
					$this.remove();
					return ;
				}
				$this.countdown($austDay, function(event) {
					$(this).html(
						event.strftime('<span class="countdown-row countdown-show4"><span class="countdown-section days"><span class="countdown-amount">%D</span><span class="countdown-period">'+days+'</span></span><span class="countdown-section hours"><span class="countdown-amount">%H</span><span class="countdown-period">'+hours+'</span></span><span class="countdown-section mins"><span class="countdown-amount">%M</span><span class="countdown-period">'+mins+'</span></span><span class="countdown-section secs"><span class="countdown-amount">%S</span><span class="countdown-period">'+secs+'</span></span></span>')
					);
				}).on('finish.countdown', function(event){
					$(this).hide('slow', function(){ $(this).remove(); });	
					location.reload();
				});
				//$this.countdown('pause');
			});	
		}});
	}
	if( loadmore_style == 1 ){
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
}(jQuery));