// ============================================
// CART.JS — All cart logic
// ============================================

let cart = JSON.parse(localStorage.getItem('luxe-cart') || '[]');
let appliedCoupon = null;

function saveCart() {
  localStorage.setItem('luxe-cart', JSON.stringify(cart));
}

// ── Add to cart ──────────────────────────────
function addToCart(id, qty = 1) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return showToast('Product not found', 'error');
  if (product.stock === 0) return showToast('This item is out of stock', 'error');

  const existing = cart.find(c => c.id === id);
  if (existing) {
    if (existing.qty >= product.stock) {
      return showToast(`Only ${product.stock} in stock!`, 'warning');
    }
    existing.qty += qty;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, emoji: product.emoji, qty });
  }
  saveCart();
  updateCartUI();
  updateShippingBar();
  showToast(`✅ "${product.name}" added to cart`, 'success');

  // Button feedback
  const btn = document.getElementById(`btn-${id}`);
  if (btn) {
    btn.classList.add('added');
    btn.textContent = '✓ Added!';
    setTimeout(() => { btn.classList.remove('added'); btn.innerHTML = '🛒 Add to Cart'; }, 1800);
  }
  animateBadge('cartBadge');
}

// ── Remove item ──────────────────────────────
function removeItem(id) {
  const item = cart.find(c => c.id === id);
  cart = cart.filter(c => c.id !== id);
  saveCart();
  updateCartUI();
  updateShippingBar();
  if (item) showToast(`"${item.name}" removed from cart`, 'info');
}

// ── Change quantity ──────────────────────────
function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeItem(id); return; }
  saveCart();
  updateCartUI();
  updateShippingBar();
}

// ── Apply coupon ─────────────────────────────
function applyCoupon() {
  const code = document.getElementById('couponInput').value.trim().toUpperCase();
  const coupon = COUPONS[code];
  if (!coupon) return showToast('Invalid coupon code', 'error');
  appliedCoupon = { code, ...coupon };
  updateCartUI();
  showToast(`🎉 Coupon "${code}" applied — ${coupon.label}!`, 'success');
}

// ── Get cart totals ──────────────────────────
function getCartTotals() {
  const subtotal = cart.reduce((s, c) => s + (c.price * c.qty), 0);
  let discount = 0;
  let shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 8.99;

  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') discount = Math.round(subtotal * appliedCoupon.value / 100);
    if (appliedCoupon.type === 'flat') discount = appliedCoupon.value;
    if (appliedCoupon.type === 'shipping') shipping = 0;
  }

  const total = Math.max(0, subtotal - discount + shipping);
  return { subtotal, discount, shipping, total };
}

// ── Update Cart UI ───────────────────────────
function updateCartUI() {
  const totalQty = cart.reduce((s, c) => s + c.qty, 0);
  const badge = document.getElementById('cartBadge');
  if (badge) { badge.textContent = totalQty; badge.classList.toggle('show', totalQty > 0); }

  const body = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = `<div class="cart-empty">
      <div class="cart-empty-icon">🛍️</div>
      <p>Your cart is empty</p>
      <span>Add some luxurious items to get started!</span>
    </div>`;
    if (footer) footer.style.display = 'none';
    return;
  }

  if (footer) footer.style.display = 'block';
  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price} × ${item.qty} = <strong>$${item.price * item.qty}</strong></div>
        <div class="qty-row">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)" aria-label="Decrease quantity">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button class="remove-item" onclick="removeItem(${item.id})" aria-label="Remove item">✕</button>
    </div>`).join('');

  const { subtotal, discount, shipping, total } = getCartTotals();
  const subtotalEl = document.getElementById('cartSubtotal');
  const shippingEl = document.getElementById('cartShipping');
  const totalEl = document.getElementById('cartTotal');
  const discountRow = document.getElementById('discountRow');
  const discountAmt = document.getElementById('discountAmt');

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (shippingEl) shippingEl.textContent = shipping === 0 ? '🎉 Free' : `$${shipping.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  if (discountRow) discountRow.style.display = discount > 0 ? 'flex' : 'none';
  if (discountAmt) discountAmt.textContent = `-$${discount.toFixed(2)}`;
}

// ── Shipping progress bar ────────────────────
function updateShippingBar() {
  const subtotal = cart.reduce((s, c) => s + (c.price * c.qty), 0);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const fill = document.getElementById('shippingFill');
  const msg = document.getElementById('shippingMsg');
  const left = document.getElementById('shippingLeft');
  if (!fill) return;
  fill.style.width = `${pct}%`;
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    if (msg) msg.innerHTML = '🎉 You\'ve unlocked <strong>FREE shipping!</strong>';
  } else {
    const rem = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2);
    if (msg) msg.innerHTML = `🚚 Add <strong>$${rem}</strong> more for FREE shipping!`;
    if (left) left.textContent = `$${rem}`;
  }
}

// ── Open / Close ─────────────────────────────
function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('overlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  const wish = document.getElementById('wishSidebar');
  if (wish && !wish.classList.contains('open')) {
    document.getElementById('overlay').classList.remove('show');
    document.body.style.overflow = '';
  }
}
function closeAll() { closeCart(); closeWish(); }

function animateBadge(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('pop-anim');
  void el.offsetWidth;
  el.classList.add('pop-anim');
}