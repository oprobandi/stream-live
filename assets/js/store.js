/* ═══════════════════════════════════════════════════════════════
   Stream Live V1.3 — store.js
   Central reactive state. All modules read from and write to SL.store.
   V1.3: init() is now async — bootstraps IndexedDB uploads before render.
   ═══════════════════════════════════════════════════════════════ */

SL.store = {

  user:          null,    // Current user object or null
  videos:        [],      // All videos (seed + persisted uploads)
  pendingAction: null,    // Fn to execute after auth completes
  pendingVideo:  null,    // Video pending access after auth/subscribe
  currentCat:   'All',
  searchQuery:  '',

  /** Bootstrap state from data + cookies + IndexedDB */
  async init() {
    // Load seed videos
    this.videos = [...SL.data.videos];

    // Restore session from cookie
    const session = SL.cookies.get('sl_session');
    if (session?.email) {
      const found = SL.data.users.find(u => u.email === session.email);
      if (found) {
        this.user = { ...found };
        SL.cookies.set('sl_session', { email: found.email });
      }
    }

    // Load persisted user uploads from IndexedDB
    try {
      await SL.idb.init();
      const saved = await SL.idb.loadAll();
      // Prepend (newest first), skip any id collision with seed data
      for (const v of saved) {
        if (!this.videos.find(x => x.id === v.id)) {
          this.videos.unshift(v);
        }
      }
    } catch (err) {
      console.warn('[store] IndexedDB unavailable — uploads will not persist:', err);
    }
  },

  /** Live-computed filtered + searched video list */
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
