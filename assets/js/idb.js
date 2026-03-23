/* ═══════════════════════════════════════════════════════════════
   Stream Live V1.3 — idb.js
   IndexedDB persistence layer for user-uploaded videos.
   Stores the actual File blobs so src/thumb survive page reload.
   ═══════════════════════════════════════════════════════════════ */

SL.idb = {

  _db: null,
  DB_NAME:    'StreamLive',
  DB_VERSION: 1,
  STORE:      'uploads',

  /** Open (or create) the database. Called once during app init. */
  async init() {
    this._db = await new Promise((resolve, reject) => {
      const req = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      req.onupgradeneeded = ({ target: { result: db } }) => {
        if (!db.objectStoreNames.contains(this.STORE)) {
          db.createObjectStore(this.STORE, { keyPath: 'id' });
        }
      };

      req.onsuccess  = ({ target: { result } }) => resolve(result);
      req.onerror    = ({ target: { error  } }) => reject(error);
      req.onblocked  = () => console.warn('[idb] Database upgrade blocked.');
    });
  },

  /**
   * Persist a newly uploaded video.
   * @param {Object} meta      — the video object (sans src/thumb blob URLs)
   * @param {File}   videoFile — the raw video File
   * @param {File}   thumbFile — the thumbnail File, or null
   */
  async save(meta, videoFile, thumbFile = null) {
    if (!this._db) return;
    const record = {
      ...meta,
      src:   undefined,           // strip ephemeral blob URLs
      thumb: undefined,
      _videoFile: videoFile,
      _thumbFile:  thumbFile,
    };
    return this._tx('readwrite', store => store.put(record));
  },

  /** Load all persisted uploads and return them with fresh blob URLs. */
  async loadAll() {
    if (!this._db) return [];
    const records = await this._tx('readonly', store => store.getAll());
    return records.map(({ _videoFile, _thumbFile, ...meta }) => ({
      ...meta,
      src:   _videoFile ? URL.createObjectURL(_videoFile) : null,
      thumb: _thumbFile
        ? URL.createObjectURL(_thumbFile)
        : 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&q=80',
    }));
  },

  /** Remove a persisted upload by id. */
  async remove(id) {
    if (!this._db) return;
    return this._tx('readwrite', store => store.delete(id));
  },

  // ── Internal helper ───────────────────────────────────────────
  _tx(mode, fn) {
    return new Promise((resolve, reject) => {
      const tx  = this._db.transaction(this.STORE, mode);
      const req = fn(tx.objectStore(this.STORE));
      if (req) {
        req.onsuccess  = ({ target: { result } }) => resolve(result);
        req.onerror    = ({ target: { error  } }) => reject(error);
      }
      tx.oncomplete = () => { if (!req) resolve(); };
      tx.onerror    = ({ target: { error } }) => reject(error);
    });
  },

};
