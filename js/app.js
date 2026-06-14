// ============================================
// APP.JS — Initialization & Event Listeners
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // Initialize everything
  renderProducts();
  updateCartUI();
  updateWishBadge();
  updateShippingBar();
  initCookies();

  // Cart button
  document.getElementById('cartBtn')?.addEventListener('click', openCart);

  // Wishlist button
  document.getElementById('wishlistNavBtn')?.addEventListener('click', openWish);

  // Search button
  document.getElementById('searchBtn')?.addEventListener('click', openSearch);

  // Hamburger
  document.getElementById('hamburger')?.addEventListener('click', toggleMenu);

  // Newsletter enter key
  document.getElementById('emailInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') subscribe();
  });

  // Search enter key
  document.getElementById('searchInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = e.target.value.trim();
      if (q) {
        currentSearch = q;
        closeSearch();
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
        renderProducts();
        showToast(`🔍 Showing results for "${q}"`, 'info');
      }
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeCart(); closeWish(); closeSearch(); closeModal(); closeMenu();
      document.body.style.overflow = '';
    }
    if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) {
      e.preventDefault(); openSearch();
    }
  });

  // Keyboard nav for product cards
  document.getElementById('productsGrid')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.classList.contains('product-img-wrap')) {
      e.target.click();
    }
  });

  // Coupon input enter key
  document.getElementById('couponInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') applyCoupon();
  });

});