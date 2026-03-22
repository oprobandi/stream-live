/* ═══════════════════════════════════════════════════════════════
   Stream Live V1.0 — player.js
   Controls the video player modal. Uses a real <video> element
   with public sample sources where available.
   ═══════════════════════════════════════════════════════════════ */

SL.player = {

  _current: null,

  open(video) {
    this._current = video;
    const videoEl   = document.getElementById('player-video');
    const noSrcEl   = document.getElementById('player-no-src');
    const modal     = document.getElementById('modal-player');

    // Populate metadata
    document.getElementById('player-title').textContent    = video.title;
    document.getElementById('player-creator').textContent  = video.creator;
    document.getElementById('player-views').textContent    = SL.views.fmtViews(video.views) + ' views';
    document.getElementById('player-duration').textContent = video.duration;
    document.getElementById('player-desc').textContent     = video.desc;

    // Premium badge
    const badgeEl = document.getElementById('player-badge');
    badgeEl.innerHTML = video.premium
      ? `<span class="badge-premium">✦ Premium</span>`
      : `<span class="badge-free">Free</span>`;

    // Video source
    if (video.src) {
      videoEl.src = video.src;
      videoEl.classList.remove('hidden');
      noSrcEl.classList.add('hidden');
      videoEl.load();
      videoEl.play().catch(() => {}); // autoplay may be blocked; ignore
    } else {
      videoEl.src = '';
      videoEl.classList.add('hidden');
      noSrcEl.classList.remove('hidden');
    }

    modal.classList.remove('hidden');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  close() {
    const videoEl = document.getElementById('player-video');
    videoEl.pause();
    videoEl.src = '';
    document.getElementById('modal-player').classList.add('hidden');
    document.getElementById('modal-player').classList.remove('open');
    document.body.style.overflow = '';
    this._current = null;
  },

};
