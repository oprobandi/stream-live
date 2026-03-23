/* ═══════════════════════════════════════════════════════════════
   Stream Live V1.3 — upload.js
   Handles the full upload flow: drag-drop, form, progress bar,
   and adding the new video to the grid on completion.
   V1.3: persists uploads to IndexedDB so they survive page reload.
   ═══════════════════════════════════════════════════════════════ */

SL.upload = {

  _file:       null,
  _thumbFile:  null,
  _thumbUrl:   null,
  _isPremium:  false,
  _uploading:  false,

  open() {
    if (!SL.store.user) {
      SL.store.pendingAction = () => SL.upload.open();
      SL.auth.open('login', 'Sign in to upload your videos.');
      return;
    }
    this._reset();
    const modal = document.getElementById('modal-upload');
    modal.classList.remove('hidden');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    SL.a11y.trapFocus(modal);
  },

  close() {
    if (this._uploading) return;
    const modal = document.getElementById('modal-upload');
    modal.classList.add('hidden');
    modal.classList.remove('open');
    document.body.style.overflow = '';
    SL.a11y.releaseFocus();
    this._reset();
  },

  _reset() {
    this._file = null;
    this._thumbFile = null;
    this._thumbUrl = null;
    this._isPremium = false;
    this._uploading = false;

    document.getElementById('upload-zone').classList.remove('hidden');
    document.getElementById('upload-form').classList.add('hidden');
    document.getElementById('upload-progress').classList.add('hidden');
    document.getElementById('file-input').value = '';
    document.getElementById('upload-title').value = '';
    document.getElementById('upload-desc').value = '';
    document.getElementById('upload-cat').value = 'Nature';
    document.getElementById('upload-thumb').value = '';
    document.getElementById('premium-price-wrap').classList.add('hidden');
    document.getElementById('premium-toggle').classList.remove('on');
    document.getElementById('progress-fill').style.width = '0%';
    document.getElementById('upload-pct').textContent = '0%';
  },

  // ── Drag & Drop ────────────────────────────────────────────────
  onDragOver(e) {
    e.preventDefault();
    document.getElementById('upload-zone').classList.add('dragover');
  },

  onDragLeave(e) {
    e.preventDefault();
    document.getElementById('upload-zone').classList.remove('dragover');
  },

  onDrop(e) {
    e.preventDefault();
    document.getElementById('upload-zone').classList.remove('dragover');
    const file = e.dataTransfer?.files?.[0];
    if (file) this._handleFile(file);
  },

  onFileSelect(e) {
    const file = e.target.files?.[0];
    if (file) this._handleFile(file);
  },

  onThumbSelect(e) {
    const file = e.target.files?.[0];
    if (file) {
      this._thumbFile = file;
      this._thumbUrl  = URL.createObjectURL(file);
    }
  },

  _handleFile(file) {
    if (!file.type.startsWith('video/')) {
      SL.toast.show('Please select a video file.', 'error');
      return;
    }
    this._file = file;
    document.getElementById('upload-filename').textContent = file.name;
    document.getElementById('upload-zone').classList.add('hidden');
    document.getElementById('upload-form').classList.remove('hidden');
    setTimeout(() => document.getElementById('upload-title').focus(), 80);
  },

  cancel() {
    document.getElementById('upload-zone').classList.remove('hidden');
    document.getElementById('upload-form').classList.add('hidden');
    this._file = null;
    this._thumbFile = null;
    this._thumbUrl = null;
    document.getElementById('file-input').value = '';
  },

  togglePremium() {
    this._isPremium = !this._isPremium;
    document.getElementById('premium-toggle').classList.toggle('on', this._isPremium);
    document.getElementById('premium-price-wrap').classList.toggle('hidden', !this._isPremium);
  },

  // ── Submit ─────────────────────────────────────────────────────
  submit() {
    const title = document.getElementById('upload-title').value.trim();
    const desc  = document.getElementById('upload-desc').value.trim();
    if (!title) { SL.toast.show('Please add a title.', 'error'); return; }
    if (!desc)  { SL.toast.show('Please add a description.', 'error'); return; }
    if (!this._file) { SL.toast.show('No file selected.', 'error'); return; }

    this._uploading = true;
    document.getElementById('upload-form').classList.add('hidden');
    document.getElementById('upload-progress').classList.remove('hidden');

    let pct = 0;
    const tick = setInterval(() => {
      pct = Math.min(100, pct + Math.random() * 14 + 4);
      document.getElementById('progress-fill').style.width = pct + '%';
      document.getElementById('upload-pct').textContent = Math.round(pct) + '%';
      if (pct >= 100) {
        clearInterval(tick);
        setTimeout(() => this._finalize(title, desc), 500);
      }
    }, 180);
  },

  _finalize(title, desc) {
    const user     = SL.store.user;
    const price    = this._isPremium ? parseFloat(document.getElementById('upload-price').value) : null;
    const thumbUrl = this._thumbUrl
      || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&q=80';

    const newVideo = {
      id:          Date.now(),
      title,
      desc,
      creator:     user.name,
      uploaderId:  user.id,
      views:       0,
      duration:    '0:00',
      cat:         document.getElementById('upload-cat').value,
      thumb:       thumbUrl,
      premium:     this._isPremium,
      purchasable: this._isPremium && price !== null,
      price,
      src:         this._file ? URL.createObjectURL(this._file) : null,
      uploaded:    Date.now(),
    };

    SL.store.videos.unshift(newVideo);

    // Track in user uploads
    if (!user.uploads) user.uploads = [];
    user.uploads.push(newVideo.id);
    SL.store.saveUser();

    // Persist to IndexedDB — survives page reload
    SL.idb.save(newVideo, this._file, this._thumbFile).catch(err => {
      console.warn('[upload] Could not persist to IndexedDB:', err);
    });

    this._uploading = false;
    this.close();
    SL.views.renderGrid();
    SL.store.currentCat = 'Mine';
    document.querySelectorAll('.cat-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.cat === 'Mine')
    );
    SL.views.renderGrid();
    SL.toast.show(`"${title}" is live! 🎬`);
  },

};
