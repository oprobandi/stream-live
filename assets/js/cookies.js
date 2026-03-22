/* ═══════════════════════════════════════════════════════════════
   Stream Live V1.0 — cookies.js
   Real document.cookie helpers — NOT localStorage.
   ═══════════════════════════════════════════════════════════════ */

SL.cookies = {

  /** Set a cookie with optional expiry in days */
  set(name, value, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    const encoded = encodeURIComponent(typeof value === 'object' ? JSON.stringify(value) : value);
    document.cookie = `${name}=${encoded}; expires=${expires}; path=/; SameSite=Lax`;
  },

  /** Get a cookie value (auto-parses JSON if possible) */
  get(name) {
    const match = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${name}=`));
    if (!match) return null;
    const raw = decodeURIComponent(match.split('=').slice(1).join('='));
    try { return JSON.parse(raw); } catch { return raw; }
  },

  /** Delete a cookie */
  del(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },

};
