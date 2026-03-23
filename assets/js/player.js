/* ═══════════════════════════════════════════════════════════════
   Stream Live V1.3 — player.js
   Controls the video player modal.
   V1.3: scroll position memory, video poster, share button,
         keyboard focus trap, deep-link URL update.
   ═══════════════════════════════════════════════════════════════ */

SL.player = {

  _current:  null,
  _scrollY:  0,

  open(video) {
    this._current = video;
    this._scrollY = window.scrollY;   // ← remember scroll position

    const videoEl = document.getElementById('player-video');
    const noSrcEl = document.getElementById('player-no-src');
    const modal   = document.getElementById('modal-player');

    // Metadata
    document.getElementById('player-title').textContent    = video.title;
    document.getElementById('player-creator').textContent  = video.creator;
    document.getElementById('player-views').textContent    = SL.views.fmtViews(video.views) + ' views';
    document.getElementById('player-duration').textContent = video.duration;
    document.getElementById('player-desc').textContent     = video.desc;

    // Premium badge
    document.getElementById('player-badge').innerHTML = video.premium
      ? `<span class="badge-premium">✦ Premium</span>`
      : `<span class="badge-free">Free</span>`;

    // Video source + poster
    if (video.src) {
      videoEl.poster = video.thumb || '';    // ← show thumbnail while buffering
      videoEl.src    = video.src;
      videoEl.classList.remove('hidden');
      noSrcEl.classList.add('hidden');
      videoEl.load();
      videoEl.play().catch(() => {});
    } else {
      videoEl.poster = '';
      videoEl.src    = '';
      videoEl.classList.add('hidden');
      noSrcEl.classList.remove('hidden');
    }

    // Push deep-link URL (no page reload)
    const url = new URL(window.location.href);
    url.searchParams.set('v', video.id);
    history.replaceState(null, '', url.toString());

    modal.classList.remove('hidden');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    SL.a11y.trapFocus(modal);
  },

  close() {
    const videoEl = document.getElementById('player-video');
    videoEl.pause();
    videoEl.src    = '';
    videoEl.poster = '';

    const modal = document.getElementById('modal-player');
    modal.classList.add('hidden');
    modal.classList.remove('open');
    document.body.style.overflow = '';
    SL.a11y.releaseFocus();

    // Remove ?v= from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('v');
    history.replaceState(null, '', url.toString());

    // Restore scroll position
    window.scrollTo({ top: this._scrollY, behavior: 'instant' });

    this._current = null;
  },

  share() {
    if (!this._current) return;
    const url = new URL(window.location.href);
    url.searchParams.set('v', this._current.id);
    const shareUrl = url.toString();

    if (navigator.share) {
      navigator.share({ title: this._current.title, url: shareUrl }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => SL.toast.show('Link copied to clipboard! 🔗'))
        .catch(() => SL.toast.show('Share: ' + shareUrl, 'info'));
    } else {
      SL.toast.show('Share: ' + shareUrl, 'info');
    }
  },

};
