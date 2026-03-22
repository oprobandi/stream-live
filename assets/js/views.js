/* ═══════════════════════════════════════════════════════════════
   Stream Live V1.0 — views.js
   All DOM rendering logic. Keeps controllers clean.
   ═══════════════════════════════════════════════════════════════ */

SL.views = {

  /** Render the top-right nav actions based on auth state */
  renderNav() {
    const { user } = SL.store;
    const el = document.getElementById('nav-actions');

    if (!user) {
      el.innerHTML = `
        <button class="btn-nav-ghost" onclick="SL.auth.open('login')">Sign In</button>
        <button class="btn-nav-primary" onclick="SL.auth.open('signup')">Join Free</button>
      `;
      document.getElementById('hero-join-btn').classList.remove('hidden');
    } else {
      const premiumBadge = user.plan
        ? `<span class="nav-premium-badge" title="Premium active">✦ PREMIUM</span>`
        : `<button class="btn-nav-premium" onclick="SL.premium.openSubscribePage()">Go Premium</button>`;
      el.innerHTML = `
        <button class="btn-nav-upload" onclick="SL.upload.open()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
          Upload
        </button>
        ${premiumBadge}
        <div class="nav-avatar" title="${this._esc(user.name)}">${user.avatar}</div>
        <button class="btn-nav-ghost sm" onclick="SL.auth.logout()">Sign Out</button>
      `;
      document.getElementById('hero-join-btn').classList.add('hidden');
      document.getElementById('cat-mine').classList.remove('hidden');
    }
  },

  /** Main grid renderer — filters, sorts, renders cards */
  renderGrid() {
    const sort    = document.getElementById('sort-select')?.value || 'newest';
    let vids      = [...SL.store.filtered];

    if      (sort === 'popular') vids.sort((a, b) => b.views - a.views);
    else if (sort === 'free')    vids.sort((a, b) => a.premium - b.premium);
    else                         vids.sort((a, b) => b.uploaded - a.uploaded);

    const count = vids.length;
    const { currentCat, searchQuery } = SL.store;

    document.getElementById('grid-title').textContent =
      searchQuery ? `Results for "${searchQuery}"` :
      currentCat === 'Mine' ? 'My Uploads' :
      currentCat === 'All'  ? 'All Videos' : currentCat;

    document.getElementById('grid-count').textContent =
      `${count} video${count !== 1 ? 's' : ''}`;

    const grid  = document.getElementById('video-grid');
    const empty = document.getElementById('empty-state');

    if (count === 0) {
      grid.innerHTML = '';
      empty.classList.remove('hidden');
    } else {
      empty.classList.add('hidden');
      grid.innerHTML = vids.map(v => this._card(v)).join('');
    }
  },

  /** Single video card HTML */
  _card(v) {
    const hasPurchased = SL.store.hasPurchased(v.id);
    const canWatch     = SL.store.canWatch(v);
    const locked       = v.premium && !canWatch;

    return `
      <article class="video-card${v.premium ? ' is-premium' : ''}${locked ? ' is-locked' : ''}"
               data-id="${v.id}" role="button" tabindex="0"
               aria-label="Watch ${this._esc(v.title)}">
        <div class="card-thumb">
          <img src="${this._esc(v.thumb)}" alt="${this._esc(v.title)}" loading="lazy" decoding="async">
          <div class="card-overlay">
            ${locked
              ? `<div class="card-lock-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>`
              : `<div class="card-play-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,3 20,12 6,21"/></svg></div>`
            }
          </div>
          ${v.premium
            ? `<div class="card-badge premium-badge">${hasPurchased ? '✓ Owned' : '✦ Premium'}</div>`
            : ''}
          ${v.premium && v.purchasable && v.price && !hasPurchased
            ? `<div class="card-badge price-badge">$${v.price.toFixed(2)}</div>`
            : ''}
          <div class="card-duration">${this._esc(v.duration)}</div>
        </div>
        <div class="card-meta">
          <div class="card-avatar-sm">${v.creator[0]}</div>
          <div class="card-info">
            <h3 class="card-title">${this._esc(v.title)}</h3>
            <div class="card-sub-row">
              <span class="card-creator">${this._esc(v.creator)}</span>
              <span class="sep">·</span>
              <span class="card-views">${this.fmtViews(v.views)}</span>
            </div>
            <span class="card-cat-tag">${this._esc(v.cat)}</span>
          </div>
        </div>
      </article>`;
  },

  // ── Utilities ────────────────────────────────────────────────
  fmtViews(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(n);
  },

  _esc(str) {
    return String(str ?? '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  },

};
