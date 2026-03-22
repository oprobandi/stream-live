/* ═══════════════════════════════════════════════════════════════
   Stream Live V1.0 — store.js
   Central reactive state. All modules read from and write to SL.store.
   ═══════════════════════════════════════════════════════════════ */

SL.store = {

  user:          null,    // Current user object or null
  videos:        [],      // All videos (initial + uploaded)
  pendingAction: null,    // Fn to execute after auth completes
  pendingVideo:  null,    // Video pending access after auth/subscribe
  currentCat:   'All',
  searchQuery:  '',

  /** Bootstrap state from data + cookies */
  init() {
    // Load videos
    this.videos = [...SL.data.videos];

    // Restore session from cookie
    const session = SL.cookies.get('sl_session');
    if (session?.email) {
      const found = SL.data.users.find(u => u.email === session.email);
      if (found) {
        this.user = { ...found };
        // Refresh cookie TTL
        SL.cookies.set('sl_session', { email: found.email });
      }
    }
  },

  /** Live-computed filtered+searched video list */
  get filtered() {
    const { currentCat, searchQuery, user } = this;
    const q = searchQuery.toLowerCase().trim();
    return this.videos.filter(v => {
      if (currentCat === 'Mine') return user && v.uploaderId === user.id;
      if (currentCat !== 'All' && v.cat !== currentCat) return false;
      if (q && !v.title.toLowerCase().includes(q) && !v.creator.toLowerCase().includes(q)) return false;
      return true;
    });
  },

  /** Check whether the current user has purchased a specific video */
  hasPurchased(videoId) {
    return this.user?.purchased?.includes(videoId) ?? false;
  },

  /** Check if user can watch a video */
  canWatch(video) {
    if (!video.premium) return true;
    if (!this.user) return false;
    if (this.user.plan) return true;
    if (this.hasPurchased(video.id)) return true;
    return false;
  },

  /** Persist user changes back to data array and cookie */
  saveUser() {
    if (!this.user) return;
    const idx = SL.data.users.findIndex(u => u.id === this.user.id);
    if (idx !== -1) SL.data.users[idx] = { ...this.user };
    SL.cookies.set('sl_session', { email: this.user.email });
  },

};
