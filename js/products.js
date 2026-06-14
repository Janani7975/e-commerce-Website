// ============================================
// PRODUCTS.JS — Rendering, filtering, wishlist, modal
// ============================================

let wishlist = new Set(JSON.parse(localStorage.getItem('luxe-wish') || '[]'));
let currentFilter = 'all';
let currentSort = 'default';
let currentSearch = '';
let visibleCount = 8;
let selectedSize = '';
let modalQty = 1;

function saveWishlist() {
  localStorage.setItem('luxe-wish', JSON.stringify([...wishlist]));
}

// ── Filter + Sort ─────────────────────────────
function getFilteredSorted() {
  let list = [...PRODUCTS];
  if (currentFilter !== 'all') list = list.filter(p => p.category === currentFilter);
  if (currentSearch) {
    const q = currentSearch.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (currentSort === 'price-asc')  list.sort((a,b) => a.price - b.price);
  if (currentSort === 'price-desc') list.sort((a,b) => b.price - a.price);
  if (currentSort === 'rating')     list.sort((a,b) => b.rating - a.rating);
  if (currentSort === 'newest')     list.sort((a,b) => b.id - a.id);
  return list;
}

// ── Render Skeleton ───────────────────────────
function renderSkeletons(count = 4) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = Array(count).fill(`
    <div class="skeleton-card">
      <div class="skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton-line medium"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-line medium"></div>
        <div class="skeleton-line short"></div>
      </div>
    </div>`).join('');
}

// ── Render Products ───────────────────────────
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  renderSkeletons();

  setTimeout(() => {
    const list = getFilteredSorted();
    const visible = list.slice(0, visibleCount);
    const loadBtn = document.getElementById('loadMoreBtn');

    if (list.length === 0) {
      grid.innerHTML = `<div style="text-align:center;padding:60px;color:var(--warm-gray);grid-column:1/-1">
        <div style="font-size:48px;margin-bottom:16px">🔍</div>
        <p style="font-family:var(--font-display);font-size:22px;margin-bottom:8px">No products found</p>
        <p style="font-size:14px">Try a different search or category</p>
      </div>`;
      if (loadBtn) loadBtn.style.display = 'none';
      return;
    }

    grid.innerHTML = visible.map((p, i) => buildProductCard(p, i)).join('');
    if (loadBtn) loadBtn.style.display = list.length > visibleCount ? 'inline-block' : 'none';
  }, 400);
}

// ── Build Product Card HTML ───────────────────
function buildProductCard(p, i) {
  const tagClass = p.tag ? `tag-${p.tag}` : '';
  const inWish = wishlist.has(p.id);
  const stars = buildStars(p.rating);
  const isOut = p.stock === 0;
  const isLow = p.stock > 0 && p.stock <= 5;
  const savePct = p.oldPrice ? Math.round((1 - p.price/p.oldPrice)*100) : 0;

  return `
    <div class="product-card" style="animation-delay:${i * 0.07}s" role="listitem">
      <div class="product-img-wrap" onclick="openModal(${p.id})" tabindex="0" role="button" aria-label="Quick view ${p.name}">
        ${p.emoji}
        ${p.tag ? `<span class="product-tag ${tagClass}">${p.badge}</span>` : ''}
        ${isOut ? '<span class="product-tag tag-sold">Sold Out</span>' : ''}
        <div class="product-actions">
          <button class="btn-action" onclick="event.stopPropagation();openModal(${p.id})">Quick View</button>
          ${!isOut ? `<button class="btn-action" onclick="event.stopPropagation();addToCart(${p.id})">Add to Cart</button>` : ''}
          <button class="btn-wishlist ${inWish ? 'active' : ''}" onclick="event.stopPropagation();toggleWishlist(${p.id}, this)" aria-label="${inWish ? 'Remove from' : 'Add to'} wishlist">${inWish ? '❤️' : '🤍'}</button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <div class="product-name" onclick="openModal(${p.id})">${p.name}</div>
        <div class="product-rating">
          <span class="stars">${stars}</span>
          <span class="rating-count">(${p.reviews})</span>
        </div>
        <div class="product-price-row">
          <span class="price">$${p.price}</span>
          ${p.oldPrice ? `<span class="price-old">$${p.oldPrice}</span>` : ''}
          ${savePct ? `<span class="price-save">-${savePct}%</span>` : ''}
        </div>
        <div class="stock-info ${isOut ? 'stock-out' : isLow ? 'stock-low' : 'stock-ok'}">
          ${isOut ? '✕ Out of Stock' : isLow ? `⚠️ Only ${p.stock} left!` : '✓ In Stock'}
        </div>
        <button class="btn-add-cart" id="btn-${p.id}" onclick="addToCart(${p.id})" ${isOut ? 'disabled' : ''}>
          ${isOut ? '✕ Out of Stock' : '🛒 Add to Cart'}
        </button>
      </div>
    </div>`;
}

function buildStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0));
}

// ── Load More ─────────────────────────────────
function loadMore() {
  visibleCount += 4;
  renderProducts();
}

// ── Filter ────────────────────────────────────
function filterProducts(cat, btn) {
  currentFilter = cat; visibleCount = 8;
  document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProducts();
}

// ── Sort ──────────────────────────────────────
function sortProducts(val) {
  currentSort = val;
  renderProducts();
}

// ── Inline Search ─────────────────────────────
function inlineSearchFn(val) {
  currentSearch = val; visibleCount = 8;
  renderProducts();
}

// ── Wishlist ──────────────────────────────────
function toggleWishlist(id, btn) {
  if (wishlist.has(id)) {
    wishlist.delete(id);
    if (btn) { btn.textContent = '🤍'; btn.classList.remove('active'); }
    showToast('Removed from wishlist', 'info');
  } else {
    wishlist.add(id);
    if (btn) { btn.textContent = '❤️'; btn.classList.add('active'); }
    showToast('❤️ Added to wishlist', 'success');
  }
  saveWishlist();
  updateWishBadge();
  updateWishUI();
}

function updateWishBadge() {
  const badge = document.getElementById('wishBadge');
  if (!badge) return;
  badge.textContent = wishlist.size;
  badge.classList.toggle('show', wishlist.size > 0);
}

function openWish() {
  updateWishUI();
  document.getElementById('wishSidebar').classList.add('open');
  document.getElementById('overlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeWish() {
  document.getElementById('wishSidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
  document.body.style.overflow = '';
}

function updateWishUI() {
  const body = document.getElementById('wishBody');
  if (!body) return;
  const items = PRODUCTS.filter(p => wishlist.has(p.id));
  if (items.length === 0) {
    body.innerHTML = `<div class="cart-empty">
      <div class="cart-empty-icon">🤍</div>
      <p>Your wishlist is empty</p>
      <span>Click the heart icon on any product to save it!</span>
    </div>`;
    return;
  }
  body.innerHTML = items.map(p => `
    <div class="cart-item">
      <div class="cart-item-img">${p.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${p.name}</div>
        <div class="cart-item-price">$${p.price}</div>
        <button class="btn-add-cart" style="margin-top:8px;padding:8px" onclick="addToCart(${p.id})">🛒 Add to Cart</button>
      </div>
      <button class="remove-item" onclick="toggleWishlist(${p.id}, null)" aria-label="Remove from wishlist">✕</button>
    </div>`).join('');
}

// ── Product Modal ─────────────────────────────
function openModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  selectedSize = ''; modalQty = 1;

  const savePct = p.oldPrice ? Math.round((1 - p.price/p.oldPrice)*100) : 0;
  const isOut = p.stock === 0;
  const isLow = p.stock > 0 && p.stock <= 5;

  document.getElementById('modalContent').innerHTML = `
    <div class="modal-img">${p.emoji}</div>
    <div class="modal-info">
      <div class="modal-category">${p.category}</div>
      <div class="modal-name">${p.name}</div>
      <div class="modal-rating">
        <span class="stars">${buildStars(p.rating)}</span>
        <span class="rating-count">(${p.reviews} reviews)</span>
      </div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <div class="modal-price">$${p.price}</div>
        ${p.oldPrice ? `<div class="modal-price-old">$${p.oldPrice}</div>` : ''}
        ${savePct ? `<span class="price-save">Save ${savePct}%</span>` : ''}
      </div>
      <p class="modal-desc">${p.description}</p>

      ${p.sizes.length > 1 ? `
        <div class="size-label">Select Size</div>
        <div class="size-options">
          ${p.sizes.map(s => `<button class="size-btn" onclick="selectSize('${s}', this)">${s}</button>`).join('')}
        </div>` : ''}

      <div class="modal-qty-row">
        <span class="modal-qty-label">Qty:</span>
        <button class="qty-btn" onclick="changeModalQty(-1)">−</button>
        <span class="qty-val" id="modalQtyVal">1</span>
        <button class="qty-btn" onclick="changeModalQty(1)">+</button>
      </div>

      <div class="stock-info ${isOut ? 'stock-out' : isLow ? 'stock-low' : 'stock-ok'}" style="margin-bottom:16px">
        ${isOut ? '✕ Out of Stock' : isLow ? `⚠️ Only ${p.stock} left!` : '✓ In Stock'}
      </div>

      <button class="btn-add-modal" onclick="addToCartFromModal(${p.id})" ${isOut ? 'disabled' : ''}>
        ${isOut ? '✕ Out of Stock' : '🛒 Add to Cart'}
      </button>
      <button class="btn-add-cart" style="background:transparent;color:var(--ink);border:1.5px solid var(--ink)" onclick="toggleWishlist(${p.id}, null)">
        ${wishlist.has(p.id) ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
      </button>

      <div class="modal-features">
        <p>📦 <strong>Material:</strong> ${p.material}</p>
        <p>🌍 <strong>Origin:</strong> ${p.origin}</p>
        ${p.features.map(f => `<p>✓ ${f}</p>`).join('')}
      </div>
    </div>`;

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function selectSize(size, btn) {
  selectedSize = size;
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function changeModalQty(delta) {
  modalQty = Math.max(1, modalQty + delta);
  const el = document.getElementById('modalQtyVal');
  if (el) el.textContent = modalQty;
}

function addToCartFromModal(id) {
  addToCart(id, modalQty);
  closeModal();
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}