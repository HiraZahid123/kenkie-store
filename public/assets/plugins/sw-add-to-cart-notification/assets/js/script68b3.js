(function ($) {
    "use strict";
    //Update mini top cart ajax
    $(document).on('added_to_cart', function (event, fragments) {
        if (!$('.cafe-canvas-cart')[0]) {
            sw_add_to_cart_mess(fragments['sw_add_to_cart_message']);
        }

    });
    //Function for Add to Cart message
    function sw_add_to_cart_mess($sw_mess) {
        if (!!$sw_mess && $sw_mess != undefined) {
            if ($('#sw-add-to-cart-message')[0]) {
                $('#sw-add-to-cart-message').replaceWith($sw_mess);
            } else {
                $('body').append($sw_mess);
            }
            $('#sw-add-to-cart-message').addClass('active');


        }
        var countdown = $('.cart-countdown').data('countdown');
        var interval = '';
        if (countdown) {
            countdown = parseInt(countdown);
            interval = setInterval(function() {
                --countdown;
                $('.cart-countdown').html(countdown);
                console.log(countdown);
                if (countdown <= 0) {
                    $('#sw-add-to-cart-message').removeClass('active');
                    myStopFunction(interval);
                }
            }, 1000);
        }
		$(document).on( 'click' ,' #sw-add-to-cart-message .close, #sw-add-to-cart-message .button.close', function(){
			$(this).closest( '#sw-add-to-cart-message' ).removeClass('active');
			myStopFunction(interval);
		});
        $(window).on('click', function(event) {
            var modal = $('#sw-add-to-cart-message');
            if (event.target == modal.find('.mark')[0] ) {
                modal.removeClass('active');
                    myStopFunction(interval);

            }
        });
    }

    function myStopFunction(interval) {
        clearInterval(interval);
    }

    function addtocartAnimate(element, animation) {
        var tclass = $(element).attr('class');
        tclass += 'animate__animated ' + animation;
        $(element).addClass(tclass);
        setTimeout(function () {
            $(element).removeClass(tclass);
        });
    }

    $(document).on('click', '.single_add_to_cart_button:not(.disabled)', function (e) {
        e.preventDefault();

        var $thisbutton = $(this),
        variations = {},
        $form = $thisbutton.closest('form.cart'),
        product_qty = $form.find('input[name=quantity]').val() || 1,
        product_id = $form.find('input[name=product_id]').val() || $form.find('input[name=add-to-cart]').val() || $thisbutton.val(),
        variation_id = $form.find('input[name=variation_id]').val() || 0,
        layout = $('input#atcn_layout').val() || '';


        if ($form.find('select')[0]&& variation_id != 0) {
            $form.find('select').each(function () {
                if ($(this).val() != '') {
                    variations[$(this).attr('name')] = $(this).val();
                }
            });
        }

        var data = {
            action: 'sw_add_single_product_to_cart',
            product_id: product_id,
            quantity: product_qty,
            variation_id: variation_id,
            variations: variations,
            layout: layout
        };

        $.each(data, function (i, item) {
            if (item.name == 'add-to-cart') {
                item.name = 'product_id';
                item.value = $form.find('input[name=variation_id]').val() || $thisbutton.val();
            }
        });

        $(document.body).trigger('adding_to_cart', [$thisbutton, data]);
		
		$thisbutton.removeClass('added').addClass('loading');
        jQuery.post( woocommerce_params.ajax_url, data, function( response ) {
                $thisbutton.addClass('added').removeClass('loading');
                if (response.error && response.product_url) {
                    window.location = response.product_url;
                    return;
                }

                $(document.body).trigger('added_to_cart', [response.fragments, response.cart_hash, $thisbutton]);

        });		

        return false;
    });

})(jQuery);
