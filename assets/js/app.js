/* ═══════════════════════════════════════════════════════════════
   Stream Live V1.3 — app.js
   Entry point + toast system + accessibility utilities.
   V1.3: async init (IndexedDB), keyboard focus trap, mobile search,
         deep-link ?v= routing, dark/light mode toggle.
   ═══════════════════════════════════════════════════════════════ */

/* ── Accessibility — focus trap ───────────────────────────────── */
SL.a11y = (() => {
  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  let _handler = null;
  let _prev    = null;

  function trapFocus(modal) {
    releaseFocus();
    _prev = document.activeElement;
    const getFocusable = () => [...modal.querySelectorAll(FOCUSABLE)].filter(el => !el.closest('.hidden'));

    _handler = e => {
      if (e.key !== 'Tab') return;
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    };
    modal.addEventListener('keydown', _handler);
  }

  function releaseFocus() {
    if (_handler) {
      document.querySelectorAll('.modal-overlay').forEach(m => m.removeEventListener('keydown', _handler));
      _handler = null;
    }
    if (_prev && typeof _prev.focus === 'function') {
      try { _prev.focus(); } catch (_) {}
      _prev = null;
    }
  }

  return { trapFocus, releaseFocus };
})();

/* ── Toast system ─────────────────────────────────────────────── */
SL.toast = {
  _queue: [],
  _visible: false,

  show(msg, type = 'success') {
    this._queue.push({ msg, type });
    if (!this._visible) this._next();
  },

  _next() {
    if (!this._queue.length) { this._visible = false; return; }
    this._visible = true;
    const { msg, type } = this._queue.shift();
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `<span class="toast-msg">${msg}</span>`;
    container.appendChild(el);
    requestAnimationFrame(() => el.classList.add('toast-show'));
    setTimeout(() => {
      el.classList.remove('toast-show');
      el.classList.add('toast-hide');
      setTimeout(() => { el.remove(); this._next(); }, 350);
    }, 3200);
  },
};

/* ── Main app controller ──────────────────────────────────────── */
SL.app = {

  async init() {
    // Show skeletons immediately while IndexedDB loads
    SL.views.renderSkeletons();

    // Bootstrap state (async — waits for IndexedDB)
    await SL.store.init();
    SL.views.renderNav();
    SL.views.renderGrid();
    SL.carousel.init();

    if (SL.store.user) {
      document.getElementById('cat-mine').classList.remove('hidden');
    }

    // Theme — restore preference
    const savedTheme = localStorage.getItem('sl_theme') || 'dark';
    document.documentElement.dataset.theme = savedTheme;
    this._updateThemeBtn(savedTheme);

    // Search input
    document.getElementById('nav-search').addEventListener('input', e => {
      SL.store.searchQuery = e.target.value;
      SL.views.renderGrid();
    });

    // Mobile search toggle
    document.getElementById('nav-search-toggle').addEventListener('click', () => {
      this.toggleMobileSearch();
    });

    // Close mobile search on outside click
    document.addEventListener('click', e => {
      const wrap   = document.querySelector('.nav-search-wrap');
      const toggle = document.getElementById('nav-search-toggle');
      if (wrap.classList.contains('mobile-open') &&
          !wrap.contains(e.target) && !toggle.contains(e.target)) {
        wrap.classList.remove('mobile-open');
      }
    });

    // Category bar — event delegation
    document.getElementById('cat-bar').addEventListener('click', e => {
      const btn = e.target.closest('.cat-btn');
      if (!btn) return;
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      SL.store.currentCat = btn.dataset.cat;
      SL.views.renderGrid();
    });

    // Sort select
    const sortEl = document.getElementById('sort-select');
    if (sortEl) sortEl.addEventListener('change', () => SL.views.renderGrid());

    // Video grid — event delegation (click + keyboard)
    document.getElementById('video-grid').addEventListener('click', e => {
      const card = e.target.closest('.video-card');
      if (card) this.handleVideoClick(parseInt(card.dataset.id, 10));
    });
    document.getElementById('video-grid').addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.video-card');
        if (card) { e.preventDefault(); this.handleVideoClick(parseInt(card.dataset.id, 10)); }
      }
    });

    // Escape key closes any open modal
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      SL.player.close();
      SL.auth.close();
      SL.premium.closeGate();
      SL.upload.close();
    });

    // Deep-link: ?v=<id> — open player on page load if present
    const params = new URLSearchParams(location.search);
    const deepId = parseInt(params.get('v'), 10);
    if (deepId) {
      const video = SL.store.videos.find(v => v.id === deepId);
      if (video) setTimeout(() => this.handleVideoClick(deepId), 400);
    }
  },

  toggleMobileSearch() {
    const wrap = document.querySelector('.nav-search-wrap');
    const isOpen = wrap.classList.toggle('mobile-open');
    if (isOpen) {
      setTimeout(() => document.getElementById('nav-search').focus(), 80);
    }
  },

  toggleTheme() {
    const html    = document.documentElement;
    const newTheme = html.dataset.theme === 'light' ? 'dark' : 'light';
    html.dataset.theme = newTheme;
    localStorage.setItem('sl_theme', newTheme);
    this._updateThemeBtn(newTheme);
  },

  _updateThemeBtn(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    btn.innerHTML = theme === 'dark'
      ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  },

  /** Core routing logic — free-first, never compulsive */
  handleVideoClick(videoId) {
    const video = SL.store.videos.find(v => v.id === videoId);
    if (!video) return;

    if (!video.premium) {
      SL.player.open(video);
      return;
    }
    if (SL.store.canWatch(video)) {
      SL.player.open(video);
      return;
    }
    SL.store.pendingVideo = video;
    SL.premium.openGate(video);
  },

  goHome() {
    SL.store.searchQuery = '';
    SL.store.currentCat = 'All';
    document.getElementById('nav-search').value = '';
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === 'All'));
    SL.views.renderGrid();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  clearSearch() {
    SL.store.searchQuery = '';
    SL.store.currentCat = 'All';
    document.getElementById('nav-search').value = '';
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === 'All'));
    SL.views.renderGrid();
  },

};

/* ── Boot ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => SL.app.init());
