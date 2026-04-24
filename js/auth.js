/**
 * auth.js — PDFDecor Authentication (simplified, free-only)
 * Login is optional — only needed to save/access document history
 * No plans, no pro, no pricing, no admin
 */

const STORAGE_KEY_USER   = 'pdfdecor_user';
const STORAGE_KEY_USERS  = 'pdfdecor_users';
const STORAGE_KEY_SEEDED = 'pdfdecor_seeded_v4';

/* ── Seed a demo account at first load ─────────────────────── */
function seedDemoAccounts() {
  if (localStorage.getItem(STORAGE_KEY_SEEDED)) return;
  const registry = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '{}');
  if (!registry['demo@pdfdecor.in']) {
    registry['demo@pdfdecor.in'] = {
      email: 'demo@pdfdecor.in',
      name: 'Demo User',
      password: 'Demo@123',
      pdfHistory: [],
      invoiceCounter: 1,
      businessProfile: {},
      totalGenerated: 0,
      lastActivity: new Date().toISOString(),
    };
  }
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(registry));
  localStorage.setItem(STORAGE_KEY_SEEDED, '1');
}

/* ── Auth object ────────────────────────────────────────────── */
let _currentUser = null;

function Auth() {
  seedDemoAccounts();
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (raw) _currentUser = JSON.parse(raw);
  } catch { _currentUser = null; }
}

Auth.prototype = {
  get user()            { return _currentUser; },
  get isAuthenticated() { return !!_currentUser; },

  login(email, password) {
    const key = email.trim().toLowerCase();
    const registry = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '{}');
    const stored = registry[key];
    if (!stored)                   return { success: false, error: 'No account found with this email.' };
    if (stored.password !== password) return { success: false, error: 'Incorrect password.' };
    const { password: _pw, ...session } = stored;
    _currentUser = session;
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(session));
    updateNavAuth();
    return { success: true };
  },

  signup(email, password, name) {
    const key = email.trim().toLowerCase();
    const registry = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '{}');
    if (registry[key])         return { success: false, error: 'An account with this email already exists.' };
    if (password.length < 6)   return { success: false, error: 'Password must be at least 6 characters.' };
    registry[key] = {
      email: key,
      name: name || email.split('@')[0],
      password,
      pdfHistory: [],
      invoiceCounter: 1,
      businessProfile: {},
      totalGenerated: 0,
      lastActivity: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(registry));
    return this.login(key, password);
  },

  logout() {
    _currentUser = null;
    localStorage.removeItem(STORAGE_KEY_USER);
    updateNavAuth();
    navigate('home');
  },

  /* Business profile */
  updateBusinessProfile(profile) {
    if (!_currentUser) return;
    _currentUser.businessProfile = { ..._currentUser.businessProfile, ...profile };
    this._persist();
  },

  /* Document history */
  savePDFToHistory(item) {
    if (!_currentUser) return null;
    const id = 'h_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    const entry = { ...item, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    if (!Array.isArray(_currentUser.pdfHistory)) _currentUser.pdfHistory = [];
    _currentUser.pdfHistory.unshift(entry);
    if (_currentUser.pdfHistory.length > 100) _currentUser.pdfHistory = _currentUser.pdfHistory.slice(0, 100);
    this._persist();
    return id;
  },

  deletePDFFromHistory(id) {
    if (!_currentUser?.pdfHistory) return;
    _currentUser.pdfHistory = _currentUser.pdfHistory.filter(h => h.id !== id);
    this._persist();
  },

  getPDFFromHistory(id) {
    return _currentUser?.pdfHistory?.find(h => h.id === id) || null;
  },

  trackGeneration(type) {
    if (!_currentUser) return;
    _currentUser.totalGenerated = (_currentUser.totalGenerated || 0) + 1;
    _currentUser.lastActivity = new Date().toISOString();
    this._persist();
  },

  getNextInvoiceNumber() {
    if (!_currentUser) return 'INV-001';
    const prefix = _currentUser.businessProfile?.invoicePrefix || 'INV';
    const n = (_currentUser.invoiceCounter || 1);
    _currentUser.invoiceCounter = n + 1;
    this._persist();
    return `${prefix}-${String(n).padStart(3, '0')}`;
  },

  _persist() {
    if (!_currentUser) return;
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(_currentUser));
    try {
      const registry = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '{}');
      if (registry[_currentUser.email]) {
        registry[_currentUser.email] = { ...registry[_currentUser.email], ..._currentUser };
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(registry));
      }
    } catch { /* ignore */ }
  }
};

const auth = new Auth();

/* ── Nav auth area ──────────────────────────────────────────── */
function updateNavAuth() {
  const area = document.getElementById('nav-auth-area');
  if (!area) return;

  if (auth.isAuthenticated) {
    const initials = (auth.user.name || auth.user.email).slice(0, 2).toUpperCase();
    area.innerHTML = `
      <div class="relative group">
        <div class="avatar" title="${auth.user.email}">${initials}</div>
        <div class="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          <div class="px-4 py-2 border-b border-gray-100">
            <p class="text-xs font-bold text-gray-900 truncate">${auth.user.name || auth.user.email}</p>
            <p class="text-xs text-gray-400 truncate">${auth.user.email}</p>
          </div>
          <a onclick="navigate('dashboard')" class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"><i class="fas fa-tachometer-alt w-4 text-blue-500"></i> Dashboard</a>
          <a onclick="navigate('history')"   class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"><i class="fas fa-history w-4 text-purple-500"></i> My Documents</a>
          <a onclick="navigate('profile')"   class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"><i class="fas fa-user w-4 text-green-500"></i> Profile</a>
          <div class="border-t border-gray-100 mt-1 pt-1">
            <a onclick="auth.logout()" class="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"><i class="fas fa-sign-out-alt w-4"></i> Sign Out</a>
          </div>
        </div>
      </div>`;
  } else {
    area.innerHTML = `
      <a onclick="navigate('login')" class="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
        <i class="fas fa-sign-in-alt"></i> Sign In
      </a>
      <a onclick="navigate('login')" class="btn-primary text-sm py-2 px-4">
        <i class="fas fa-user-plus"></i> <span class="hidden sm:inline">Free</span> Sign Up
      </a>`;
  }
}

/* ── Toast & UI helpers ─────────────────────────────────────── */
function showToast(msg, type = 'default', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  const icons = { default: 'info-circle', success: 'check-circle', error: 'exclamation-circle' };
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas fa-${icons[type] || 'info-circle'}"></i> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastIn 0.3s ease-out reverse';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function toggleMobileMenu() {
  document.getElementById('mobile-menu')?.classList.toggle('hidden');
}
