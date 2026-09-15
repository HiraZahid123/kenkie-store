(function($){
	$.fn.megamenu = function(options) {
		options = jQuery.extend({
			  wrap:'.swg-menu',
			  speed: 0,
			  rtl: false,
			  mm_timeout: 0
		  }, options);
		var menuwrap = $(this);		
		buildmenu(menuwrap);
		/* Build menu */
		function buildmenu(mwrap){
			mwrap.find('.swg-menu-horizontal .swg-mega > li').each(function(){
				var menucontent 		= $(this).find(".dropdown-menu");
				var menuitemlink 		= $(this).find(".item-link:first");
				var menucontentinner 	= $(this).find(".nav-level1");
				var mshow_timer = 0;
				var mhide_timer = 0;
				var li = $(this);
				var islevel1 = (li.hasClass('level1')) ?true:false;
				var havechild = (li.hasClass('dropdown')) ?true:false;
				if( !havechild ){
					return;
				}
				var menu_event = $( 'body' ).hasClass( 'menu-click' );
				if( menu_event ){
					li.on( 'click', function(){
						 positionSubMenu(li, islevel1);	
						$(this).find( '>ul').toggleClass( 'visible' );
					});
					$(document).mouseup(function (e){
							var container = li.find( '>ul');
							if (!container.is(e.target) && container.has(e.target).length === 0) {
									container.removeClass( 'visible' );
							}
					});
					li.find( '> a[data-toogle="dropdown"]' ).on( 'click', function(e){
						e.preventDefault();			
					});
					
				}else{							
					li.mouseenter(function(el){
						li.find( '>ul').addClass( 'visible' );
						if(havechild){
							positionSubMenu(li, islevel1);						
						}
					}).mouseleave(function(el){ 
						li.find( '>ul').removeClass( 'visible' );				
					});
				}
			});
		}		
		
		function positionSubMenu(el, islevel1){
			var menu_wrap_W 	= ( $(window).width() >= menuwrap.data( 'width' ) )  ? menuwrap.data( 'width' ) : $(window).width();
			menucontent 		= $(el).find(".dropdown-menu");
			menuitemlink 		= $(el).find(".item-link");
			menuitemlink_offset = menuitemlink.offset();
	    	menucontentinner 	= $(el).find(".nav-level1");
			mega_full			= ( $(el).hasClass( 'megamenu-full' ) ) ? true : false;			
	    	wrap_O				= ( $(window).width() - menu_wrap_W ) / 2;
	    	wrap_W				= ( menuwrap.outerWidth() < menu_wrap_W ) ? menu_wrap_W : menuwrap.outerWidth();
	    	menuitemli_O		= ( options.rtl == false ) ? $(el).offset().left : ( $(window).width() - ($(el).offset().left + $(el).outerWidth()) );
	    	menuitemli_W		= $(el).outerWidth();
	    	menuitemlink_H		= menuitemlink.outerHeight();
	    	menuitemlink_W		= menuitemlink.outerWidth();
	    	menuitemlink_O		= ( options.rtl == false ) ? menuitemlink_offset.left : ( $(window).width() - (menuitemlink_offset.left + menuitemlink.outerWidth()) );
	    	menucontent_W		= menucontent.outerWidth();
			var wrap_RE = wrap_O + wrap_W;
			var menucontent_RE = menuitemlink_O + menucontent_W;
			if( mega_full || ( menucontent_W >= menu_wrap_W ) ){ 
				var left_offset = menuitemlink_O - wrap_O;
				if( options.rtl == false ){
					menucontent.css({
						'left': '-' + left_offset + 'px',
						'width': wrap_W + 'px'
					}); 
				}else{
					menucontent.css({
						'left': 'auto',
						'right': -left_offset + 'px',
						'width': wrap_W + 'px'
					});
				}
			}else{					
				if( menucontent_RE >= wrap_RE ) { 
					var link_OF = $(window).width() - ($(el).offset().left + menucontent.outerWidth());
					var left_offset =  ( link_OF >  wrap_O ) ? wrap_O - link_OF : link_OF - wrap_O;
					if( options.rtl == false ){	
						if( menuitemlink_O + left_offset < wrap_O ){
							var left_offset = menuitemlink_O - wrap_O;
							menucontent.css({
								'left':'-' + left_offset + 'px',
								'width': wrap_W + 'px'
							});
						}else{
							menucontent.css({
								'left':left_offset + 'px'
							}); 
						}
					}else{	
						var link_OF = $(el).offset().left;
						var left_offset = wrap_O - link_OF;
						menucontent.css({
							'left': 'auto',
							'right': left_offset + 'px'
						});
					}
				}
			}
		}
	};	
	
	$( window ).on( 'elementor/frontend/init', function() {		
		var rtl = $('body').hasClass('rtl');
		$('.swg-menu-horizontal-wrapper').each(function(){
			$(this).megamenu({ 
				wrap:'.swg-menu',
				justify: 'left',
				rtl: rtl
			});		
		});
		
		$( '.swg-menu-toggle' ).on( 'click', function(e){
			$(this).toggleClass( 'menu-active' );
			var $offset = $(this).offset();
			var $width = $(window).outerWidth();
			$(this).parent().find('.wrapper-menu').toggleClass( 'menu-active' ).css({'width':$width, 'left': '-'+ $offset.left + 'px'});
			e.stopPropagation();
		});
		
		$( '.verical-toggle .mega-title' ).on( 'click', function(e){
			$(this).parent().find('.wrapper-menu').toggleClass( 'menu-active' );	
			e.stopPropagation();
		});			
		
		$(document).on("click", function(e) {
			if (! $(e.target).is(".swg-menu-vertical")&& $(".swg-menu-vertical").has(e.target).length === 0 ) {
				$(".swg-menu-vertical").removeClass("menu-active");
				$('swg-menu-toggle').removeClass("menu-active");
			}
		});
		$('.swg-menu-vertical > ul').each(function(){
			var number	 = $(this).parent().data( 'number' ) - 1;
			var lesstext = $(this).parent().data( 'less_text' );
			var moretext = $(this).parent().data( 'more_text' );
			if( number > 0 ) {
				$(this).find( '>li:gt('+ number +')' ).hide().end();		
				if( $(this).children('li').length > number ){ 
					$(this).append(
						$('<li class=><a>'+ moretext +'   +</a></li>')
						.addClass('showMore')
						.on('click',function(){
							$(this).toggleClass( 'active' );
							if($(this).siblings(':hidden').length > 0){
								$(this).html( '<a>'+ lesstext +'   -</a>' ).siblings(':hidden').show(400);
							}else{
								$(this).html( '<a>'+ moretext +'   +</a>' ).show().siblings( ':gt('+ number +')' ).hide(400);
							}
						})
						);
				}
			}
		});
		
		$('.wrapper-menu').each(function(){	
			var icon = $(this).find( '.icon-dropdown' );
			if( icon.length ){
				$(this).find( 'li.dropdown > a' ).append( '<span class="dropdown-icon">' + icon.html() + '</span>' );
			}
			$(this).find( 'li.dropdown' ).append( '<span class="child-menu-more"><svg xmlns="http://www.w3.org/2000/svg" width="30" viewBox="0 0 24 24"><path  fill-rule="evenodd" d="M4.47 9.4a.75.75 0 0 1 1.06 0l6.364 6.364a.25.25 0 0 0 .354 0L18.612 9.4a.75.75 0 0 1 1.06 1.06l-6.364 6.364a1.75 1.75 0 0 1-2.475 0L4.47 10.46a.75.75 0 0 1 0-1.06" clip-rule="evenodd"/></svg></span>' );
		});
		
		$(document).on( 'click', '.child-menu-more', function(){
			$(this).parent().toggleClass( 'toggle-active' );
		});	
	});	
})(jQuery);