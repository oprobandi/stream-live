/* ═══════════════════════════════════════════════════════════════
   Stream Live V1.0 — app.js
   Entry point: initialises all modules, wires event delegation,
   and defines the toast notification system.
   ═══════════════════════════════════════════════════════════════ */

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
    // Animate in
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

  init() {
    // Bootstrap state
    SL.store.init();
    SL.views.renderNav();
    SL.views.renderGrid();

    // Show My Uploads tab if already logged in
    if (SL.store.user) {
      document.getElementById('cat-mine').classList.remove('hidden');
    }

    // Search input
    document.getElementById('nav-search').addEventListener('input', e => {
      SL.store.searchQuery = e.target.value;
      SL.views.renderGrid();
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
  },

  /** Core routing logic for video access — free-first, never compulsive */
  handleVideoClick(videoId) {
    const video = SL.store.videos.find(v => v.id === videoId);
    if (!video) return;

    if (!video.premium) {
      // Free content — no auth needed, ever
      SL.player.open(video);
      return;
    }

    if (SL.store.canWatch(video)) {
      // User has a plan OR has purchased this video
      SL.player.open(video);
      return;
    }

    // Premium gate — user can close it and keep browsing for free
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
