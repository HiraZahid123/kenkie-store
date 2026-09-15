(function($) {	
    "use strict";
    // SW LOOKBOOK
    $(document).ready(function($) {
        $('.sw-lookbook-slick-slider').each(function(){
			var $column = ( typeof( $(this).data('column') ) != 'undefined' ) ? $(this).data('column') : 1;
			$(this).slick({
			  dots: true,
			  infinite: true,
			  slidesToShow: $column,
			  responsive: [ {
				 breakpoint: 767,
				 settings: {
					slidesToShow: 1,
				}
				}],
			   customPaging: function (slider, i) { 
					//FYI just have a look at the object to find aviable information
					//press f12 to access the console
					//you could also debug or look in the source
					return '<span>0'+(i + 1) + '</span>/' + '0'+slider.slideCount;
				}
			});
        });

		
		var showpin =$('.sw-lookbook-slider').data('show-pin');
		
		if($('.pin__type').length){
			$('.sw-lookbook-slick-slider .slick-next').on('click', function(e) {
				$('.sw-lookbook-container .pin__type').mouseleave();
				var currentIndex =  $('.sw-lookbook-slick-slider .slick-current').attr('data-slick-index');			
				$('.idcount-'+currentIndex).mouseenter();
			});
			  
			$('.sw-lookbook-slick-slider .slick-prev').on('click', function(e) {
				$('.sw-lookbook-container .pin__type').mouseleave();
				var currentIndex =  $('.sw-lookbook-slick-slider .slick-current').attr('data-slick-index');
				$('.idcount-'+currentIndex).mouseenter();
			});  


			
			$('.sw-lookbook-image').click(function(){
				$('.sw-lookbook-container .pin__type').removeClass('pin__opened');
			});
			$('.sw-lookbook-container .pin__type .pin__popup .close-popup').click(function(e){
				e.stopPropagation();
				$('.sw-lookbook-container .pin__type').removeClass('pin__opened');
			});
		}
    })
})(jQuery);