/**
 * login.js — Login & Signup (optional, for saving history only)
 */

function renderLoginPage() {
  if (auth.isAuthenticated) { navigate('dashboard'); return; }

  document.getElementById('app').innerHTML = `
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 page-enter">
    <div class="w-full max-w-md">

      <!-- Brand header -->
      <div class="text-center mb-6">
        <a onclick="navigate('home')" class="inline-flex items-center gap-3 mb-4 cursor-pointer group">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <i class="fas fa-file-pdf text-white text-lg"></i>
          </div>
          <span class="text-2xl font-black text-gray-900 tracking-tight">PDF<span class="text-blue-600">Decor</span></span>
        </a>
        <p class="text-gray-500 text-sm">Free PDF generator for India · Save & re-edit documents</p>
      </div>

      <!-- Why sign up info box -->
      <div class="bg-white rounded-2xl border border-blue-100 p-4 mb-4 shadow-sm">
        <p class="text-xs font-black text-blue-800 mb-3 uppercase tracking-widest flex items-center gap-1.5">
          <i class="fas fa-lightbulb text-yellow-500"></i> Why create a free account?
        </p>
        <div class="grid grid-cols-2 gap-y-2 gap-x-4">
          ${[
            ['fa-history text-purple-500', 'Save document history'],
            ['fa-magic text-blue-500', 'Business auto-fill'],
            ['fa-pencil-alt text-green-500', 'Re-edit anytime'],
            ['fa-lock text-gray-400', 'Private — browser only'],
          ].map(([icon, text]) => `
          <div class="flex items-center gap-2 text-xs text-gray-600">
            <i class="fas ${icon} text-xs w-3"></i> ${text}
          </div>`).join('')}
        </div>
      </div>

      <!-- Demo account quick-fill -->
      <div class="mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <p class="text-xs font-black text-amber-800 mb-2 uppercase tracking-widest flex items-center gap-1.5">
          <i class="fas fa-key text-amber-500"></i> Demo Account
        </p>
        <div class="flex items-center gap-3 bg-white border border-amber-100 rounded-xl px-3 py-2.5">
          <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <i class="fas fa-user text-amber-600 text-sm"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-xs font-bold text-amber-800">Demo User</div>
            <div class="text-xs text-gray-500 font-mono truncate">demo@pdfdecor.in · Demo@123</div>
          </div>
          <button onclick="fillDemo()"
            class="text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-amber-600 transition-colors flex-shrink-0">
            Use →
          </button>
        </div>
      </div>

      <!-- Auth card -->
      <div class="login-card">

        <!-- Tabs -->
        <div class="flex border-b border-gray-100" role="tablist">
          <button onclick="switchAuthMode('login')" id="tab-login" role="tab" aria-selected="true"
            class="flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 bg-blue-600 text-white transition-all">
            <i class="fas fa-sign-in-alt text-xs"></i> Sign In
          </button>
          <button onclick="switchAuthMode('signup')" id="tab-signup" role="tab" aria-selected="false"
            class="flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 transition-all">
            <i class="fas fa-user-plus text-xs"></i> Sign Up
          </button>
        </div>

        <form onsubmit="handleAuthSubmit(event)" class="p-6 space-y-4" novalidate>
          <div class="text-center mb-1">
            <h2 class="text-xl font-black text-gray-900" id="auth-title">Welcome back!</h2>
            <p class="text-gray-400 text-xs mt-1" id="auth-subtitle">Sign in to access your saved documents</p>
          </div>

          <!-- Name (signup only) -->
          <div id="name-field" class="hidden">
            <label class="form-label" for="auth-name">Your Name</label>
            <input class="form-input" id="auth-name" type="text" placeholder="Full Name" autocomplete="name" />
          </div>

          <!-- Email -->
          <div>
            <label class="form-label" for="auth-email">Email Address</label>
            <input class="form-input" id="auth-email" type="email" placeholder="you@example.com"
              required autocomplete="email" />
          </div>

          <!-- Password -->
          <div>
            <label class="form-label" for="auth-password">Password</label>
            <div class="relative">
              <input class="form-input pr-10" id="auth-password" type="password"
                placeholder="Enter password" required autocomplete="current-password" />
              <button type="button" onclick="togglePwVisibility()"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                aria-label="Toggle password visibility">
                <i class="fas fa-eye text-sm" id="pw-toggle-icon"></i>
              </button>
            </div>
          </div>

          <!-- Error message -->
          <div id="auth-error" class="hidden bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-start gap-2">
            <i class="fas fa-exclamation-circle mt-0.5 flex-shrink-0"></i>
            <span id="auth-error-text"></span>
          </div>

          <!-- Submit -->
          <button type="submit" id="auth-submit-btn"
            class="btn-primary w-full justify-center text-base py-3.5 font-black">
            <span id="auth-btn-text">Sign In</span>
          </button>

          <!-- Terms (signup only) -->
          <div id="signup-terms" class="hidden text-xs text-gray-400 text-center leading-relaxed pt-1">
            By creating an account you agree to our
            <a onclick="navigate('terms')" class="underline cursor-pointer text-blue-600 hover:text-blue-800">Terms</a> and
            <a onclick="navigate('privacy')" class="underline cursor-pointer text-blue-600 hover:text-blue-800">Privacy Policy</a>.
          </div>
        </form>

        <!-- Divider & skip -->
        <div class="px-6 pb-5">
          <div class="divider-text mb-4 text-xs">or</div>
          <a onclick="navigate('home')"
            class="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 cursor-pointer transition-all">
            <i class="fas fa-arrow-left text-xs"></i>
            Continue without account
          </a>
        </div>

      </div>

      <!-- Privacy note -->
      <p class="text-center text-xs text-gray-400 mt-4 leading-relaxed">
        <i class="fas fa-shield-alt text-green-500 mr-1"></i>
        Your data stays in your browser. We never store it on any server.
      </p>
    </div>
  </div>`;
}

/* ── Auth mode switching ─────────────────────────────────────── */
let _authMode = 'login';

function switchAuthMode(mode) {
  _authMode = mode;
  const isLogin = mode === 'login';

  // Tab styles
  const activeClass   = 'flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 bg-blue-600 text-white transition-all';
  const inactiveClass = 'flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 transition-all';

  const tabLogin  = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  if (tabLogin)  { tabLogin.className  = isLogin ? activeClass : inactiveClass; tabLogin.setAttribute('aria-selected', isLogin); }
  if (tabSignup) { tabSignup.className = !isLogin ? activeClass : inactiveClass; tabSignup.setAttribute('aria-selected', !isLogin); }

  const title     = document.getElementById('auth-title');
  const subtitle  = document.getElementById('auth-subtitle');
  const btnText   = document.getElementById('auth-btn-text');
  const nameField = document.getElementById('name-field');
  const terms     = document.getElementById('signup-terms');
  const errorEl   = document.getElementById('auth-error');
  const pwInput   = document.getElementById('auth-password');

  if (title)     title.textContent    = isLogin ? 'Welcome back!'          : 'Create free account';
  if (subtitle)  subtitle.textContent = isLogin ? 'Sign in to your account' : 'Save & re-edit your documents for free';
  if (btnText)   btnText.textContent  = isLogin ? 'Sign In'                 : 'Create Account';
  if (nameField) nameField.classList.toggle('hidden', isLogin);
  if (terms)     terms.classList.toggle('hidden', isLogin);
  if (errorEl)   errorEl.classList.add('hidden');
  if (pwInput)   pwInput.setAttribute('autocomplete', isLogin ? 'current-password' : 'new-password');
}

function fillDemo() {
  switchAuthMode('login');
  const emailEl = document.getElementById('auth-email');
  const pwEl    = document.getElementById('auth-password');
  if (emailEl) { emailEl.value = 'demo@pdfdecor.in'; emailEl.dispatchEvent(new Event('input')); }
  if (pwEl)    { pwEl.value    = 'Demo@123';           pwEl.dispatchEvent(new Event('input')); }
}

function togglePwVisibility() {
  const pw   = document.getElementById('auth-password');
  const icon = document.getElementById('pw-toggle-icon');
  if (!pw) return;
  if (pw.type === 'password') {
    pw.type = 'text';
    if (icon) icon.className = 'fas fa-eye-slash text-sm';
  } else {
    pw.type = 'password';
    if (icon) icon.className = 'fas fa-eye text-sm';
  }
}

function handleAuthSubmit(e) {
  e.preventDefault();
  const btn      = document.getElementById('auth-submit-btn');
  const btnText  = document.getElementById('auth-btn-text');
  const errorEl  = document.getElementById('auth-error');
  const errorTxt = document.getElementById('auth-error-text');
  const email    = document.getElementById('auth-email')?.value?.trim();
  const password = document.getElementById('auth-password')?.value;

  if (!email || !password) {
    if (errorTxt) errorTxt.textContent = 'Please fill in all required fields.';
    if (errorEl)  errorEl.classList.remove('hidden');
    return;
  }

  btn.disabled = true;
  if (btnText) btnText.innerHTML = '<span class="spinner"></span>';
  if (errorEl) errorEl.classList.add('hidden');

  setTimeout(() => {
    let result;
    if (_authMode === 'login') {
      result = auth.login(email, password);
    } else {
      const name = document.getElementById('auth-name')?.value?.trim();
      result = auth.signup(email, password, name);
    }

    btn.disabled = false;
    if (btnText) btnText.textContent = _authMode === 'login' ? 'Sign In' : 'Create Account';

    if (result.success) {
      showToast(`Welcome to PDFDecor, ${auth.user?.name || 'there'}! 🎉`, 'success');
      navigate('dashboard');
    } else {
      if (errorTxt) errorTxt.textContent = result.error || 'Authentication failed. Please try again.';
      if (errorEl)  errorEl.classList.remove('hidden');
    }
  }, 500);
}
