// ============================================
// UI.JS — Toast, Search, Scroll, Cookies
// ============================================

// ── Toast ──────────────────────────────────
function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ── Search Overlay ──────────────────────────
function openSearch() {
  document.getElementById('searchOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('searchInput')?.focus(), 200);
}
function closeSearch() {
  document.getElementById('searchOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function liveSearch(query) {
  const container = document.getElementById('searchResults');
  if (!container) return;
  if (!query.trim()) { container.innerHTML = ''; return; }

  const results = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase())
  );

  if (results.length === 0) {
    container.innerHTML = `<div class="search-no-result">
      <p>No results for "${query}"</p>
      <span>Try a different keyword</span>
    </div>`;
    return;
  }

  container.innerHTML = results.map(p => `
    <div class="search-result-card" onclick="handleSearchSelect(${p.id})" tabindex="0" role="button">
      <div class="search-result-emoji">${p.emoji}</div>
      <div class="search-result-name">${p.name}</div>
      <div class="search-result-price">$${p.price}</div>
    </div>`).join('');
}

function handleSearchSelect(id) {
  closeSearch();
  setTimeout(() => openModal(id), 300);
}

// ── Scroll to Top ───────────────────────────
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', () => {
  const btn = document.getElementById('scrollTop');
  if (btn) btn.classList.toggle('show', window.scrollY > 400);
}, { passive: true });

// ── Newsletter ──────────────────────────────
function subscribe() {
  const input = document.getElementById('emailInput');
  if (!input) return;
  const val = input.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!val) return showToast('Please enter your email address', 'warning');
  if (!emailRegex.test(val)) return showToast('Please enter a valid email address', 'error');
  showToast(`🎉 Welcome! Check "${val}" for your exclusive 15% off code!`, 'success');
  input.value = '';
}

// ── Cookies ─────────────────────────────────
function acceptCookies() {
  localStorage.setItem('luxe-cookies', 'accepted');
  hideCookieBanner();
  showToast('Cookie preferences saved', 'info');
}
function declineCookies() {
  localStorage.setItem('luxe-cookies', 'declined');
  hideCookieBanner();
}
function hideCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (banner) { banner.style.transform = 'translateY(100%)'; setTimeout(() => banner.remove(), 400); }
}
function initCookies() {
  if (!localStorage.getItem('luxe-cookies')) {
    setTimeout(() => {
      const banner = document.getElementById('cookieBanner');
      if (banner) banner.classList.add('show');
    }, 2000);
  }
}

// ── Mobile Menu ─────────────────────────────
let menuOpen = false;
function toggleMenu() {
  menuOpen = !menuOpen;
  document.getElementById('mobileMenu')?.classList.toggle('open', menuOpen);
  const ham = document.getElementById('hamburger');
  if (ham) { ham.classList.toggle('open', menuOpen); ham.setAttribute('aria-expanded', menuOpen); }
  document.body.style.overflow = menuOpen ? 'hidden' : '';
}
function closeMenu() {
  menuOpen = false;
  document.getElementById('mobileMenu')?.classList.remove('open');
  const ham = document.getElementById('hamburger');
  if (ham) { ham.classList.remove('open'); ham.setAttribute('aria-expanded', 'false'); }
  document.body.style.overflow = '';
}