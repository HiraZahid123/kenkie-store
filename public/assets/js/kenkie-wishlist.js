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
		if (idx === -1) {
			ids.push(id);
		} else {
			ids.splice(idx, 1);
		}
		setIds(ids);
		return idx === -1;
	}

	function updateCounters() {
		var count = getIds().length;
		document.querySelectorAll('.wishtlist-counter').forEach(function (el) {
			el.textContent = String(count);
		});
	}

	function updateButtonState(btn) {
		var id = parseInt(btn.getAttribute('data-product-id'), 10);
		var active = isInWishlist(id);
		btn.classList.toggle('is-active', active);
		btn.setAttribute('title', active ? 'Remove from wishlist' : 'Add to wishlist');
	}

	function initButtons() {
		document.querySelectorAll('.wishlist-toggle[data-product-id]').forEach(updateButtonState);
	}

	document.addEventListener('click', function (e) {
		var btn = e.target.closest('.wishlist-toggle[data-product-id]');
		if (!btn) return;
		e.preventDefault();
		var id = parseInt(btn.getAttribute('data-product-id'), 10);
		if (!id) return;
		toggleId(id);
		updateButtonState(btn);
		updateCounters();
	});

	function loadWishlistPage() {
		var grid = document.getElementById('wishlist-grid');
		if (!grid) return;

		var emptyNotice = document.getElementById('wishlist-empty');
		var countText = document.getElementById('wishlist-count-text');
		var ids = getIds();

		if (!ids.length) {
			if (emptyNotice) emptyNotice.style.display = '';
			return;
		}

		fetch('/wishlist/items?ids=' + ids.join(','))
			.then(function (res) { return res.text(); })
			.then(function (html) {
				grid.innerHTML = html;
				var rendered = grid.querySelectorAll('li.product').length;
				if (!rendered) {
					if (emptyNotice) emptyNotice.style.display = '';
					if (countText) countText.textContent = 'Your wishlist is empty';
				} else if (countText) {
					countText.textContent = 'Showing ' + rendered + ' of ' + rendered + ' products';
				}
			})
			.catch(function () {
				if (emptyNotice) {
					emptyNotice.style.display = '';
					emptyNotice.textContent = 'Could not load your wishlist. Please try again.';
				}
			});
	}

	document.addEventListener('DOMContentLoaded', function () {
		updateCounters();
		initButtons();
		loadWishlistPage();
	});
})();
