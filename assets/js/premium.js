/* ═══════════════════════════════════════════════════════════════
   Stream Live V1.0 — premium.js
   Unified premium gate: subscription AND per-video purchase.
   Combines the best of all three reference implementations:
   — Real cookie persistence (File 2)
   — Per-video purchase modal (File 1)
   — Non-compulsive "maybe later" escape (Mine)
   ═══════════════════════════════════════════════════════════════ */

SL.premium = {

  _selectedPlan:  'monthly',
  _targetVideo:   null,

  PLANS: {
    monthly: { label: 'Monthly',  price: 7.99,  period: '/mo',  display: '$7.99/mo'  },
    annual:  { label: 'Annual',   price: 59.99, period: '/yr',  display: '$59.99/yr — save 37%' },
  },

  /** Open the gate modal for a specific video */
  openGate(video) {
    if (!SL.store.user) {
      SL.store.pendingAction = () => SL.premium.openGate(video);
      SL.auth.open('login', `Sign in to access "${video.title}".`);
      return;
    }

    this._targetVideo = video;
    this._selectedPlan = 'monthly';

    // Populate modal
    document.getElementById('gate-title').textContent    = video.title;
    document.getElementById('gate-subtitle').textContent = video.premium && video.purchasable
      ? 'Subscribe for unlimited access, or buy this video once.'
      : 'This video is for subscribers only.';

    // Per-video purchase section
    const buySection  = document.getElementById('gate-buy-section');
    const buyDivider  = document.getElementById('gate-purchase-divider');
    if (video.purchasable && video.price) {
      buySection.classList.remove('hidden');
      buyDivider.classList.remove('hidden');
      document.getElementById('gate-buy-title').textContent = `Buy "${video.title}"`;
      document.getElementById('gate-buy-price').textContent = `$${video.price.toFixed(2)}`;
    } else {
      buySection.classList.add('hidden');
      buyDivider.classList.add('hidden');
    }

    this._updateSubscribeBtn();
    document.getElementById('modal-gate').classList.remove('hidden');
    document.getElementById('modal-gate').classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  closeGate() {
    document.getElementById('modal-gate').classList.add('hidden');
    document.getElementById('modal-gate').classList.remove('open');
    document.body.style.overflow = '';
    this._targetVideo = null;
  },

  selectPlan(plan) {
    this._selectedPlan = plan;
    document.getElementById('ptb-monthly').classList.toggle('active', plan === 'monthly');
    document.getElementById('ptb-annual').classList.toggle('active',  plan === 'annual');
    this._updateSubscribeBtn();
  },

  _updateSubscribeBtn() {
    const plan = this.PLANS[this._selectedPlan];
    document.getElementById('subscribe-btn').textContent = `Subscribe — ${plan.display}`;
  },

  /** Complete a subscription */
  subscribe() {
    const user = SL.store.user;
    if (!user) {
      SL.store.pendingAction = () => SL.premium.subscribe();
      SL.auth.open('signup');
      return;
    }

    const plan = this.PLANS[this._selectedPlan];
    user.plan        = this._selectedPlan;
    user.planExpiry  = Date.now() + (this._selectedPlan === 'annual' ? 365 : 30) * 86400000;
    SL.store.saveUser();

    const video = this._targetVideo;
    this.closeGate();
    SL.views.renderNav();

    SL.toast.show(`✦ Premium active! ${plan.display} — enjoy everything.`);
    if (video) setTimeout(() => SL.player.open(video), 350);
  },

  /** Complete a per-video purchase */
  purchase() {
    const user  = SL.store.user;
    const video = this._targetVideo;
    if (!user || !video) return;

    if (!user.purchased) user.purchased = [];
    user.purchased.push(video.id);
    SL.store.saveUser();

    this.closeGate();
    SL.toast.show(`"${video.title}" purchased — yours to keep! 🎬`);
    setTimeout(() => SL.player.open(video), 350);
  },

  /** Open a subscribe-only page (from nav/footer links) */
  openSubscribePage() {
    if (!SL.store.user) {
      SL.store.pendingAction = () => SL.premium.openSubscribePage();
      SL.auth.open('signup', 'Create a free account to subscribe.');
      return;
    }
    if (SL.store.user.plan) {
      SL.toast.show('You already have an active premium plan! ✦', 'info');
      return;
    }
    // Open gate without a specific video
    this._targetVideo = null;
    this._selectedPlan = 'monthly';
    document.getElementById('gate-title').textContent    = 'Go Premium';
    document.getElementById('gate-subtitle').textContent = 'Unlimited access to all premium content.';
    document.getElementById('gate-buy-section').classList.add('hidden');
    document.getElementById('gate-purchase-divider').classList.add('hidden');
    this._updateSubscribeBtn();
    document.getElementById('modal-gate').classList.remove('hidden');
    document.getElementById('modal-gate').classList.add('open');
    document.body.style.overflow = 'hidden';
  },

};
