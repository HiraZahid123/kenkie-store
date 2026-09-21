(function () {
	function getCsrfToken() {
		var meta = document.querySelector('meta[name="csrf-token"]');
		if (meta) return meta.getAttribute('content');
		var input = document.querySelector('input[name="_token"]');
		if (input) return input.value;
		return '';
	}

	function showToast(message, link) {
		var existing = document.getElementById('kenkie-cart-toast');
		if (existing) existing.remove();

		var toast = document.createElement('div');
		toast.id = 'kenkie-cart-toast';
		toast.style.cssText =
			'position:fixed;bottom:24px;right:24px;z-index:999999;background:#111827;color:#ffffff;padding:14px 20px;' +
			'border-radius:8px;box-shadow:0 10px 25px rgba(0,0,0,0.2);display:flex;align-items:center;gap:12px;' +
			'font-family:sans-serif;font-size:14px;animation:kenkieFadeIn .25s ease forwards;';

		var checkIcon =
			'<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">' +
			'<circle cx="10" cy="10" r="10" fill="#22c55e"/>' +
			'<path d="M6 10.5L8.5 13L14 7.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
			'</svg>';

		toast.innerHTML = checkIcon + '<span>' + message + '</span>';

		if (link) {
			var viewBtn = document.createElement('a');
			viewBtn.href = link;
			viewBtn.textContent = 'View Cart';
			viewBtn.style.cssText =
				'background:#22c55e;color:#fff;padding:6px 12px;border-radius:4px;text-decoration:none;' +
				'font-weight:700;font-size:12px;margin-left:8px;white-space:nowrap;';
			toast.appendChild(viewBtn);
		}

		document.body.appendChild(toast);

		setTimeout(function () {
			if (toast.parentNode) {
				toast.style.opacity = '0';
				toast.style.transition = 'opacity 0.3s ease';
				setTimeout(function () {
					if (toast.parentNode) toast.remove();
				}, 300);
			}
		}, 4000);
	}

	function updateCartBadges(count, subtotalFormatted) {
		document.querySelectorAll('.swe-cart-count').forEach(function (el) {
			el.textContent = String(count);
		});

		document.querySelectorAll('.swe-cart-subtotal').forEach(function (el) {
			el.innerHTML = '<span class="text">Total: </span>' + subtotalFormatted;
		});
	}

	function updateMiniCartDrawer(items, subtotalFormatted, count) {
		var containers = document.querySelectorAll('.swe-wrap-cart-bottom');
		if (!containers.length) return;

		containers.forEach(function (container) {
			if (!items || !items.length) {
				container.innerHTML =
					'<p class="woocommerce-mini-cart__empty-message" style="padding:20px;text-align:center;color:#6b7280;">No products in the cart.</p>' +
					'<div class="swe-cart-empty" style="text-align:center;padding:10px 20px 30px;">' +
					'<div class="swe-cart-empty-message" style="margin-bottom:12px;color:#374151;">Your cart is currently empty.</div>' +
					'<div class="swe-cart-empty-button"><a href="/shop/index.html" style="display:inline-block;padding:8px 20px;background:#22c55e;color:#fff;border-radius:4px;text-decoration:none;font-weight:600;">Shop All Products</a></div>' +
					'</div>';
				return;
			}

			var html = '<ul class="woocommerce-mini-cart cart_list product_list_widget" style="list-style:none;margin:0;padding:15px 20px;max-height:350px;overflow-y:auto;">';
			items.forEach(function (item) {
				html +=
					'<li class="woocommerce-mini-cart-item mini_cart_item" style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #f1f5f9;">' +
					'<div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0;">' +
					'<img src="' + item.image + '" alt="' + item.title + '" style="width:48px;height:48px;object-fit:cover;border-radius:4px;border:1px solid #e5e7eb;flex-shrink:0;">' +
					'<div style="overflow:hidden;">' +
					'<a href="/product/' + item.slug + '/index.html" style="display:block;font-size:13px;font-weight:600;color:#1f2937;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + item.title + '</a>' +
					'<span class="quantity" style="font-size:12px;color:#6b7280;">' + item.quantity + ' &times; <span style="font-weight:600;color:#111827;">$' + Number(item.price).toFixed(2) + '</span></span>' +
					'</div>' +
					'</div>' +
					'<a href="javascript:void(0);" class="mini-cart-item-remove" data-product-id="' + item.id + '" title="Remove this item" style="color:#ef4444;font-size:18px;text-decoration:none;cursor:pointer;padding:4px 8px;">&times;</a>' +
					'</li>';
			});
			html += '</ul>';

			html +=
				'<div class="widget_shopping_cart_content" style="padding:15px 20px;background:#f9fafb;border-top:1px solid #e5e7eb;">' +
				'<p class="woocommerce-mini-cart__total total" style="display:flex;justify-content:space-between;margin:0 0 15px;font-size:15px;font-weight:700;">' +
				'<strong>Subtotal:</strong> <span class="woocommerce-Price-amount amount" style="color:#22c55e;">' + subtotalFormatted + '</span>' +
				'</p>' +
				'<div class="woocommerce-mini-cart__buttons buttons" style="display:flex;gap:10px;">' +
				'<a href="/cart/index.html" style="flex:1;text-align:center;padding:10px;background:#111827;color:#fff;border-radius:4px;text-decoration:none;font-weight:700;font-size:13px;">View Cart</a>' +
				'<a href="/cart/index.html" style="flex:1;text-align:center;padding:10px;background:#22c55e;color:#fff;border-radius:4px;text-decoration:none;font-weight:700;font-size:13px;">Checkout</a>' +
				'</div>' +
				'</div>';

			container.innerHTML = html;
		});
	}

	function sendAddToCart(productId, quantity, callback) {
		var token = getCsrfToken();
		var formData = new FormData();
		formData.append('product_id', productId);
		formData.append('quantity', quantity || 1);
		if (token) formData.append('_token', token);

		fetch('/cart/add', {
			method: 'POST',
			body: formData,
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Accept': 'application/json'
			}
		})
			.then(function (res) { return res.json(); })
			.then(function (data) {
				if (data.success) {
					updateCartBadges(data.cart_count, data.cart_subtotal);
					updateMiniCartDrawer(data.items, data.cart_subtotal, data.cart_count);
					showToast(data.message || 'Product added to cart!', '/cart/index.html');
				}
				if (callback) callback(data);
			})
			.catch(function (err) {
				console.error('Cart add error:', err);
				showToast('Added to cart!', '/cart/index.html');
			});
	}

	function sendRemoveFromCart(productId, callback) {
		var token = getCsrfToken();
		var formData = new FormData();
		formData.append('product_id', productId);
		if (token) formData.append('_token', token);

		fetch('/cart/remove', {
			method: 'POST',
			body: formData,
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Accept': 'application/json'
			}
		})
			.then(function (res) { return res.json(); })
			.then(function (data) {
				if (data.success) {
					updateCartBadges(data.cart_count, data.cart_subtotal);
					updateMiniCartDrawer(data.items, data.cart_subtotal, data.cart_count);
				}
				if (callback) callback(data);
			})
			.catch(function (err) {
				console.error('Cart remove error:', err);
			});
	}

	function sendUpdateCart(productId, quantity, callback) {
		var token = getCsrfToken();
		var formData = new FormData();
		formData.append('product_id', productId);
		formData.append('quantity', quantity);
		if (token) formData.append('_token', token);

		fetch('/cart/update', {
			method: 'POST',
			body: formData,
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Accept': 'application/json'
			}
		})
			.then(function (res) { return res.json(); })
			.then(function (data) {
				if (data.success) {
					updateCartBadges(data.cart_count, data.cart_subtotal);
					updateMiniCartDrawer(data.items, data.cart_subtotal, data.cart_count);
				}
				if (callback) callback(data);
			})
			.catch(function (err) {
				console.error('Cart update error:', err);
			});
	}

	function syncCartData() {
		fetch('/cart/data', {
			headers: { 'Accept': 'application/json' }
		})
			.then(function (res) { return res.json(); })
			.then(function (data) {
				if (data.success) {
					updateCartBadges(data.cart_count, data.cart_subtotal);
					updateMiniCartDrawer(data.items, data.cart_subtotal, data.cart_count);
				}
			})
			.catch(function () {});
	}

	// Capture phase click handler for cart actions
	document.addEventListener('click', function (e) {
		// 1. Product card "Add to cart" button
		var cardAddBtn = e.target.closest('.add_to_cart_button, a.ajax_add_to_cart');
		if (cardAddBtn) {
			var pId = cardAddBtn.getAttribute('data-product_id') || cardAddBtn.getAttribute('data-product-id');
			if (pId) {
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();

				var oldText = cardAddBtn.textContent;
				cardAddBtn.textContent = 'Adding...';
				sendAddToCart(pId, 1, function () {
					cardAddBtn.textContent = 'Added!';
					setTimeout(function () {
						cardAddBtn.textContent = oldText;
					}, 1500);
				});
				return;
			}
		}

		// 2. Product detail "+ / -" quantity buttons
		var plusBtn = e.target.closest('.quantity .plus');
		if (plusBtn) {
			var wrapper = plusBtn.closest('.quantity');
			var input = wrapper ? wrapper.querySelector('input.qty') : null;
			if (input) {
				input.value = (parseInt(input.value, 10) || 1) + 1;
				e.preventDefault();
				return;
			}
		}

		var minusBtn = e.target.closest('.quantity .minus');
		if (minusBtn) {
			var wrapper = minusBtn.closest('.quantity');
			var input = wrapper ? wrapper.querySelector('input.qty') : null;
			if (input) {
				var val = (parseInt(input.value, 10) || 1) - 1;
				input.value = val < 1 ? 1 : val;
				e.preventDefault();
				return;
			}
		}

		// 3. Mini-cart item remove button
		var miniRemoveBtn = e.target.closest('.mini-cart-item-remove');
		if (miniRemoveBtn) {
			e.preventDefault();
			var removeId = miniRemoveBtn.getAttribute('data-product-id');
			if (removeId) {
				sendRemoveFromCart(removeId, function () {
					// If on cart page, reload or remove row
					var cartRow = document.querySelector('tr[data-product-id="' + removeId + '"]');
					if (cartRow) cartRow.remove();
				});
			}
			return;
		}

		// 4. Cart page table item remove button
		var cartTableRemove = e.target.closest('.kenkie-cart-item-remove');
		if (cartTableRemove) {
			e.preventDefault();
			var tableRemoveId = cartTableRemove.getAttribute('data-product-id');
			if (tableRemoveId) {
				sendRemoveFromCart(tableRemoveId, function () {
					window.location.reload();
				});
			}
			return;
		}

		// 5. Cart page table +/- buttons
		var cartQtyPlus = e.target.closest('.cart-qty-plus');
		if (cartQtyPlus) {
			e.preventDefault();
			var qId = cartQtyPlus.getAttribute('data-product-id');
			var input = document.querySelector('.cart-qty-input[data-product-id="' + qId + '"]');
			if (input) {
				var newQty = (parseInt(input.value, 10) || 1) + 1;
				input.value = newQty;
				sendUpdateCart(qId, newQty, function () {
					window.location.reload();
				});
			}
			return;
		}

		var cartQtyMinus = e.target.closest('.cart-qty-minus');
		if (cartQtyMinus) {
			e.preventDefault();
			var qId = cartQtyMinus.getAttribute('data-product-id');
			var input = document.querySelector('.cart-qty-input[data-product-id="' + qId + '"]');
			if (input) {
				var newQty = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
				input.value = newQty;
				sendUpdateCart(qId, newQty, function () {
					window.location.reload();
				});
			}
			return;
		}
	}, true);

	// Intercept form submit on single product detail page
	document.addEventListener('submit', function (e) {
		var form = e.target.closest('form.cart');
		if (form) {
			e.preventDefault();
			var pIdInput = form.querySelector('input[name="product_id"]') || form.querySelector('button[name="add-to-cart"]');
			var pId = pIdInput ? (pIdInput.value || pIdInput.getAttribute('value')) : null;
			var qtyInput = form.querySelector('input[name="quantity"]');
			var qty = qtyInput ? parseInt(qtyInput.value, 10) : 1;

			if (pId) {
				var submitBtn = form.querySelector('button[type="submit"]');
				var oldText = submitBtn ? submitBtn.textContent : '';
				if (submitBtn) submitBtn.textContent = 'Adding...';

				sendAddToCart(pId, qty || 1, function () {
					if (submitBtn) submitBtn.textContent = 'Added to cart!';
					setTimeout(function () {
						if (submitBtn) submitBtn.textContent = oldText;
					}, 1800);
				});
			}
		}
	});

	document.addEventListener('DOMContentLoaded', function () {
		syncCartData();
	});
})();
