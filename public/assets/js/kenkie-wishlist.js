(function () {
	var STORAGE_KEY = 'kenkie_wishlist';

	function getIds() {
		try {
			var raw = localStorage.getItem(STORAGE_KEY);
			var ids = raw ? JSON.parse(raw) : [];
			return Array.isArray(ids) ? ids.filter(function (n) { return Number.isInteger(n); }) : [];
		} catch (e) {
			return [];
		}
	}

	function setIds(ids) {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
		} catch (e) {}
	}

	function isInWishlist(id) {
		return getIds().indexOf(id) !== -1;
	}

	function toggleId(id) {
		var ids = getIds();
		var idx = ids.indexOf(id);
		var added = false;
		if (idx === -1) {
			ids.push(id);
			added = true;
		} else {
			ids.splice(idx, 1);
			added = false;
		}
		setIds(ids);
		return added;
	}

	function updateCounters() {
		var count = getIds().length;
		document.querySelectorAll('.wishtlist-counter').forEach(function (el) {
			el.textContent = String(count);
		});
	}

	function updateButtonState(btn, active) {
		if (typeof active !== 'boolean') {
			var id = parseInt(btn.getAttribute('data-product-id'), 10);
			active = isInWishlist(id);
		}
		btn.classList.toggle('is-active', active);
		btn.classList.toggle('added', active);
		btn.setAttribute('title', active ? 'Remove from wishlist' : 'Add to wishlist');

		var svg = btn.querySelector('svg');
		if (svg) {
			if (active) {
				svg.style.fill = '#22c55e';
				svg.style.color = '#22c55e';
			} else {
				svg.style.fill = '';
				svg.style.color = '';
			}
		}

		var span = btn.querySelector('span');
		if (span && !btn.classList.contains('sw-quickview')) {
			span.textContent = active ? 'Browse wishlist' : 'Add to wishlist';
		}
	}

	function updateAllButtonsForId(id, active) {
		document.querySelectorAll('[data-product-id="' + id + '"]').forEach(function (el) {
			if (el.classList.contains('wishlist-toggle') || el.classList.contains('add_to_wishlist')) {
				updateButtonState(el, active);
			}
		});
	}

	function initButtons() {
		document.querySelectorAll('.wishlist-toggle[data-product-id], .add_to_wishlist[data-product-id]').forEach(function (btn) {
			updateButtonState(btn);
		});
	}

	function fixNavbarWishlistLinks() {
		document.querySelectorAll('a').forEach(function (a) {
			var isWishlistMenu =
				a.querySelector('.nav-wishlist-icon') ||
				a.classList.contains('swg-wishlist-icon') ||
				a.textContent.trim().toLowerCase() === 'wishlist';

			if (isWishlistMenu) {
				a.setAttribute('href', '/wishlist/index.html');
			}
		});
	}

	function showWishlistToast(message) {
		var existing = document.getElementById('kenkie-wishlist-toast');
		if (existing) existing.remove();

		var toast = document.createElement('div');
		toast.id = 'kenkie-wishlist-toast';
		toast.style.cssText =
			'position:fixed;bottom:24px;left:24px;z-index:999999;background:#111827;color:#ffffff;padding:14px 20px;' +
			'border-radius:8px;box-shadow:0 10px 25px rgba(0,0,0,0.2);display:flex;align-items:center;gap:12px;' +
			'font-family:sans-serif;font-size:14px;animation:kenkieFadeIn .25s ease forwards;';

		var heartIcon =
			'<svg width="20" height="20" viewBox="0 0 24 24" fill="#22c55e" xmlns="http://www.w3.org/2000/svg">' +
			'<path d="M12.001 3.818a6.228 6.228 0 0 1 8.51 9.087l-5.224 5.225h-.001L12 21.415l-7.28-7.279l-1.23-1.232A6.228 6.228 0 0 1 12 3.818m3.285 11.485l3.811-3.812a4.228 4.228 0 1 0-5.98-5.98L12 6.627L10.883 5.51a4.228 4.228 0 1 0-5.98 5.98l1.232 1.232L12 18.587l3.285-3.285"/>' +
			'</svg>';

		var btnHtml =
			'<a href="/wishlist/index.html" style="background:#22c55e;color:#fff;padding:6px 12px;border-radius:4px;text-decoration:none;font-weight:700;font-size:12px;margin-left:8px;white-space:nowrap;">View Wishlist</a>';

		toast.innerHTML = heartIcon + '<span>' + message + '</span>' + btnHtml;
		document.body.appendChild(toast);

		setTimeout(function () {
			if (toast.parentNode) {
				toast.style.opacity = '0';
				toast.style.transition = 'opacity 0.3s ease';
				setTimeout(function () {
					if (toast.parentNode) toast.remove();
				}, 300);
			}
		}, 3500);
	}

	// Capture phase click listener: intercepts BEFORE jQuery or YITH can cancel the event
	document.addEventListener(
		'click',
		function (e) {
			var btn = e.target.closest('.wishlist-toggle[data-product-id], .add_to_wishlist[data-product-id]');
			if (!btn) return;

			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();

			var id = parseInt(btn.getAttribute('data-product-id'), 10);
			if (!id) return;

			var added = toggleId(id);
			updateAllButtonsForId(id, added);
			updateCounters();

			if (added) {
				showWishlistToast('Product added to your wishlist!');
			} else {
				showWishlistToast('Product removed from wishlist.');

				// If we are currently on the wishlist page, remove the card from view
				var grid = document.getElementById('wishlist-grid');
				if (grid) {
					var card = btn.closest('li.product');
					if (card) {
						card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
						card.style.opacity = '0';
						card.style.transform = 'scale(0.9)';
						setTimeout(function () {
							if (card.parentNode) card.remove();
							var remaining = grid.querySelectorAll('li.product').length;
							var emptyNotice = document.getElementById('wishlist-empty');
							var countText = document.getElementById('wishlist-count-text');
							if (!remaining) {
								if (emptyNotice) emptyNotice.style.display = '';
								if (countText) countText.textContent = 'Your wishlist is empty';
							} else if (countText) {
								countText.textContent = 'Showing ' + remaining + ' of ' + remaining + ' products';
							}
						}, 300);
					}
				}
			}
		},
		true
	);

	function loadWishlistPage() {
		var grid = document.getElementById('wishlist-grid');
		if (!grid) return;

		var emptyNotice = document.getElementById('wishlist-empty');
		var countText = document.getElementById('wishlist-count-text');
		var ids = getIds();

		if (!ids.length) {
			if (emptyNotice) emptyNotice.style.display = '';
			if (countText) countText.textContent = 'Your wishlist is empty';
			grid.innerHTML = '';
			return;
		}

		fetch('/wishlist/items?ids=' + ids.join(','))
			.then(function (res) { return res.text(); })
			.then(function (html) {
				grid.innerHTML = html;
				initButtons();
				var rendered = grid.querySelectorAll('li.product').length;
				if (!rendered) {
					if (emptyNotice) emptyNotice.style.display = '';
					if (countText) countText.textContent = 'Your wishlist is empty';
				} else {
					if (emptyNotice) emptyNotice.style.display = 'none';
					if (countText) {
						countText.textContent = 'Showing ' + rendered + ' of ' + rendered + ' products';
					}
				}
			})
			.catch(function () {
				if (emptyNotice) {
					emptyNotice.style.display = '';
					emptyNotice.textContent = 'Could not load your wishlist. Please try again.';
				}
			});
	}

	function disableYithListeners() {
		if (window.jQuery) {
			try {
				window.jQuery(document).off('click', '.add_to_wishlist');
				window.jQuery(document).off('click', '.single_add_to_wishlist');
			} catch (e) {}
		}
	}

	document.addEventListener('DOMContentLoaded', function () {
		disableYithListeners();
		fixNavbarWishlistLinks();
		updateCounters();
		initButtons();
		loadWishlistPage();

		setTimeout(function () {
			disableYithListeners();
			fixNavbarWishlistLinks();
			initButtons();
		}, 600);
	});
})();
