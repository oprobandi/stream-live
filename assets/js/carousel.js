/* ═══════════════════════════════════════════════════════════════
   Stream Live V1.3.3 — carousel.js
   Featured category carousel.
   — 5 slides, one per category
   — 3500ms auto-advance interval, 500ms crossfade transition
   — Pause on hover / resume on mouse leave
   — Prev / next arrows + dot indicators
   — Clicking a slide or CTA filters the video grid to that category
   — Keyboard: ArrowLeft / ArrowRight while carousel is focused
   ═══════════════════════════════════════════════════════════════ */

SL.carousel = (() => {

  const INTERVAL   = 3500;   // ms between auto-advances
  const TOTAL      = 5;

  let _current  = 0;
  let _timer    = null;
  let _paused   = false;

  // ── Internal helpers ─────────────────────────────────────────

  function _slides() {
    return document.querySelectorAll('.carousel-slide');
  }

  function _dots() {
    return document.querySelectorAll('.carousel-dot');
  }

  function _activate(idx) {
    const slides = _slides();
    const dots   = _dots();

    // Bounds wrap
    _current = ((idx % TOTAL) + TOTAL) % TOTAL;

    slides.forEach((s, i) => {
      s.classList.toggle('active',   i === _current);
      s.classList.toggle('leaving',  false);
    });

    dots.forEach((d, i) => {
      d.classList.toggle('active', i === _current);
      d.setAttribute('aria-selected', i === _current ? 'true' : 'false');
    });
  }

  function _startTimer() {
    _stopTimer();
    _timer = setInterval(() => {
      if (!_paused) _activate(_current + 1);
    }, INTERVAL);
  }

  function _stopTimer() {
    if (_timer) { clearInterval(_timer); _timer = null; }
  }

  // ── Click handler — filter grid to category ──────────────────

  function _onSlideClick(e) {
    const slide = e.currentTarget;
    const cat   = slide.dataset.cat;
    if (!cat) return;

    // Scroll grid into view
    const gridEl = document.getElementById('grid-section');
    if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth' });

    // Update store + re-render
    SL.store.currentCat  = cat;
    SL.store.searchQuery = '';
    document.getElementById('nav-search').value = '';
    document.querySelectorAll('.cat-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.cat === cat)
    );
    SL.views.renderGrid();
  }

  // ── Public API ────────────────────────────────────────────────

  function init() {
    _activate(0);
    _startTimer();

    // Slide click + keyboard
    _slides().forEach(slide => {
      slide.addEventListener('click', _onSlideClick);
      slide.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          _onSlideClick({ currentTarget: slide });
        }
      });
    });

    // Arrow keyboard nav on carousel wrap
    const wrap = document.getElementById('carousel-wrap');
    if (wrap) {
      wrap.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      });
    }
  }

  function goTo(idx) {
    _activate(idx);
    _startTimer(); // reset timer on manual nav
  }

  function next() {
    _activate(_current + 1);
    _startTimer();
  }

  function prev() {
    _activate(_current - 1);
    _startTimer();
  }

  function pause()  { _paused = true;  }
  function resume() { _paused = false; }

  return { init, goTo, next, prev, pause, resume };

})();
