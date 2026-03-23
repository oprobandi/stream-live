/* ═══════════════════════════════════════════════════════════════
   Stream Live V1.3 — auth.js
   Handles login, signup, logout, and the auth modal.
   V1.3: keyboard focus trap via SL.a11y.
   ═══════════════════════════════════════════════════════════════ */

SL.auth = {

  _mode: 'login',

  open(mode = 'login', noticeText = null) {
    this.setMode(mode);
    const notice   = document.getElementById('auth-notice');
    const noticeEl = document.getElementById('auth-notice-text');
    if (noticeText) {
      noticeEl.textContent = noticeText;
      notice.classList.remove('hidden');
    } else {
      notice.classList.add('hidden');
    }
    this._clearErrors();
    const modal = document.getElementById('modal-auth');
    modal.classList.remove('hidden');
    modal.classList.add('open');
    SL.a11y.trapFocus(modal);
    setTimeout(() => {
      const el = document.getElementById(mode === 'login' ? 'login-email' : 'signup-name');
      el && el.focus();
    }, 120);
  },

  close() {
    const modal = document.getElementById('modal-auth');
    modal.classList.add('hidden');
    modal.classList.remove('open');
    SL.a11y.releaseFocus();
    this._clearErrors();
    this._clearFields();
  },

  setMode(mode) {
    this._mode = mode;
    const isLogin = mode === 'login';
    document.getElementById('auth-heading').textContent = isLogin ? 'Welcome back' : 'Create your account';
    document.getElementById('auth-sub').textContent = isLogin
      ? 'Sign in to continue — no account needed for free content.'
      : 'Free account. No credit card required.';
    document.getElementById('tab-login').classList.toggle('active', isLogin);
    document.getElementById('tab-signup').classList.toggle('active', !isLogin);
    document.getElementById('auth-form-login').classList.toggle('hidden', !isLogin);
    document.getElementById('auth-form-signup').classList.toggle('hidden', isLogin);
  },

  login() {
    this._clearErrors();
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errEl    = document.getElementById('login-error');

    if (!email || !password) return this._showError(errEl, 'Please fill in all fields.');
    const user = SL.data.users.find(u => u.email === email && u.password === password);
    if (!user) return this._showError(errEl, 'Invalid email or password.');
    this._completeAuth({ ...user });
  },

  signup() {
    this._clearErrors();
    const name     = document.getElementById('signup-name').value.trim();
    const email    = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm  = document.getElementById('signup-confirm').value;
    const errEl    = document.getElementById('signup-error');

    if (!name || !email || !password || !confirm) return this._showError(errEl, 'All fields are required.');
    if (password.length < 8)  return this._showError(errEl, 'Password must be at least 8 characters.');
    if (password !== confirm) return this._showError(errEl, 'Passwords do not match.');
    if (SL.data.users.find(u => u.email === email)) return this._showError(errEl, 'That email is already registered.');

    const newUser = {
      id: Date.now(), name, email, password,
      plan: null, planExpiry: null,
      avatar: name[0].toUpperCase(),
      uploads: [], purchased: [],
    };
    SL.data.users.push(newUser);
    this._completeAuth(newUser);
  },

  logout() {
    SL.store.user = null;
    SL.cookies.del('sl_session');
    SL.views.renderNav();
    SL.views.renderGrid();
    document.getElementById('cat-mine').classList.add('hidden');
    if (SL.store.currentCat === 'Mine') {
      SL.store.currentCat = 'All';
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === 'All'));
    }
    SL.toast.show('Signed out successfully.', 'info');
  },

  _completeAuth(user) {
    SL.store.user = user;
    SL.store.saveUser();
    this.close();
    SL.views.renderNav();
    SL.views.renderGrid();
    document.getElementById('cat-mine').classList.remove('hidden');
    SL.toast.show(`Welcome${user.plan ? ' back' : ''}, ${user.name}! 👋`);

    if (SL.store.pendingAction) {
      const action = SL.store.pendingAction;
      SL.store.pendingAction = null;
      setTimeout(action, 300);
    }
  },

  _showError(el, msg) {
    el.textContent = msg;
    el.classList.remove('hidden');
  },

  _clearErrors() {
    ['login-error', 'signup-error'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.textContent = ''; el.classList.add('hidden'); }
    });
  },

  _clearFields() {
    ['login-email','login-password','signup-name','signup-email','signup-password','signup-confirm']
      .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  },

};
