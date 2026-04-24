/**
 * dashboard.js — Dashboard, History, Profile (no pro/plan gating)
 */

/* shared helper — also defined in editor.js, but dashboard can load before it */
function escHtmlD(str) {
  return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ════════════════════════════════════════════════════════════════
   DASHBOARD
════════════════════════════════════════════════════════════════ */
function renderDashboardPage() {
  if (!auth.isAuthenticated) { navigate('login'); return; }
  const user    = auth.user;
  const history = user.pdfHistory || [];
  const app     = document.getElementById('app');

  app.innerHTML = `
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">

    <!-- Header -->
    <div class="flex items-start justify-between mb-8 flex-wrap gap-4">
      <div>
        <p class="text-sm text-gray-500 mb-0.5">Welcome back 👋</p>
        <h1 class="text-3xl font-black text-gray-900">${escHtmlD(user.name || user.email.split('@')[0])}</h1>
        <p class="text-sm text-gray-400 mt-1">${escHtmlD(user.email)}</p>
      </div>
      <button onclick="navigate('invoice')" class="btn-primary">
        <i class="fas fa-plus"></i> Create New PDF
      </button>
    </div>

    <!-- Top ad -->
    ${renderAdInlineBanner('dashboard-top-ad')}

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
      <div class="stat-card">
        <div class="stat-value">${user.totalGenerated || 0}</div>
        <div class="stat-label">PDFs Generated</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${history.length}</div>
        <div class="stat-label">Saved Documents</div>
      </div>
      <div class="stat-card col-span-2 sm:col-span-1">
        <div class="stat-value" style="font-size:20px;color:#059669">Free</div>
        <div class="stat-label">Forever Plan</div>
        <div class="text-xs text-green-500 mt-1 font-semibold">No limits • No fees</div>
      </div>
    </div>

    <!-- Quick Create -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
      <h2 class="font-black text-gray-900 mb-1 text-sm flex items-center gap-2">
        <i class="fas fa-bolt text-blue-500"></i> Quick Create
      </h2>
      <p class="text-xs text-gray-400 mb-4">Jump straight into a document type</p>
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
        ${[
          { key:'invoice',     label:'Invoice',     icon:'fas fa-file-invoice', color:'#2563eb', bg:'#eff6ff' },
          { key:'receipt',     label:'Receipt',     icon:'fas fa-receipt',       color:'#059669', bg:'#f0fdf4' },
          { key:'certificate', label:'Certificate', icon:'fas fa-award',          color:'#be185d', bg:'#fdf2f8' },
          { key:'id-card',     label:'ID Card',     icon:'fas fa-id-card',        color:'#dc2626', bg:'#fef2f2' },
          { key:'event-pass',  label:'Event Pass',  icon:'fas fa-ticket-alt',     color:'#0d9488', bg:'#f0fdfa' },
        ].map(t => `
        <button onclick="navigate('${t.key}')"
          class="flex flex-col items-center gap-2 p-4 rounded-2xl border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all group">
          <div style="width:44px;height:44px;background:${t.bg};border-radius:14px;display:flex;align-items:center;justify-content:center;transition:transform 0.2s" class="group-hover:scale-110">
            <i class="${t.icon}" style="color:${t.color};font-size:16px"></i>
          </div>
          <span class="text-xs font-bold text-gray-600 capitalize">${t.label}</span>
        </button>`).join('')}
      </div>
    </div>

    <!-- Recent documents -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
      <div class="flex items-center justify-between mb-5">
        <h2 class="font-black text-gray-900 flex items-center gap-2">
          <i class="fas fa-clock text-purple-500 text-sm"></i> Recent Documents
        </h2>
        <a onclick="navigate('history')" class="text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-semibold hover:underline">View all ${history.length > 0 ? `(${history.length})` : ''} →</a>
      </div>
      ${history.length === 0
        ? `<div class="text-center py-12 text-gray-400">
            <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-folder-open text-3xl text-gray-300"></i>
            </div>
            <p class="font-semibold text-gray-500 mb-1">No documents saved yet</p>
            <p class="text-sm mb-5">Download a PDF to auto-save it here</p>
            <button onclick="navigate('invoice')" class="btn-primary text-sm">
              <i class="fas fa-plus"></i> Create Your First Document
            </button>
          </div>`
        : `<div class="space-y-2">${history.slice(0, 5).map(item => renderHistoryRow(item, false)).join('')}</div>`
      }
    </div>

    <!-- Nav cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      ${[
        { route:'profile',  icon:'fas fa-user', color:'#2563eb', bg:'#eff6ff', title:'My Profile', desc:'Update business profile for auto-fill across all documents' },
        { route:'history',  icon:'fas fa-history', color:'#7c3aed', bg:'#faf5ff', title:'Document History', desc:'View and re-download all your saved documents' },
        { route:'home',     icon:'fas fa-th-large', color:'#059669', bg:'#f0fdf4', title:'All Templates', desc:'Explore all 10 free document types and create new PDFs' },
      ].map(c => `
      <div class="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group" onclick="navigate('${c.route}')">
        <div class="flex items-center gap-3 mb-3">
          <div style="width:40px;height:40px;background:${c.bg};border-radius:12px;display:flex;align-items:center;justify-content:center" class="group-hover:scale-110 transition-transform">
            <i class="${c.icon}" style="color:${c.color}"></i>
          </div>
          <div class="font-black text-gray-900 text-sm">${c.title}</div>
          <i class="fas fa-arrow-right text-gray-300 text-xs ml-auto group-hover:text-gray-500 transition-colors"></i>
        </div>
        <p class="text-xs text-gray-500 leading-relaxed">${c.desc}</p>
      </div>`).join('')}
    </div>

    <!-- Bottom ad -->
    ${renderAdInlineBanner('dashboard-bottom-ad')}
  </div>`;
}

/* ════════════════════════════════════════════════════════════════
   HISTORY
════════════════════════════════════════════════════════════════ */
function renderHistoryPage() {
  if (!auth.isAuthenticated) { navigate('login'); return; }
  const user    = auth.user;
  const history = user.pdfHistory || [];
  const app     = document.getElementById('app');

  app.innerHTML = `
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">

    <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div>
        <h1 class="text-2xl font-black text-gray-900 flex items-center gap-3">
          <i class="fas fa-history text-purple-600"></i> My Documents
        </h1>
        <p class="text-sm text-gray-500 mt-1">${history.length} saved document${history.length !== 1 ? 's' : ''}</p>
      </div>
      <button onclick="navigate('home')" class="btn-primary text-sm">
        <i class="fas fa-plus"></i> Create New
      </button>
    </div>

    ${renderAdInlineBanner('history-top-ad')}

    ${history.length === 0
      ? `<div class="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm mt-4">
          <div class="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <i class="fas fa-inbox text-4xl text-gray-300"></i>
          </div>
          <h3 class="text-lg font-black text-gray-700 mb-2">No documents yet</h3>
          <p class="text-gray-500 text-sm mb-6 max-w-sm mx-auto">Create and download PDFs to automatically save them here for re-editing later.</p>
          <button onclick="navigate('home')" class="btn-primary">
            <i class="fas fa-plus"></i> Create Your First Document
          </button>
        </div>`
      : `<div class="space-y-2 mt-4">${history.map(item => renderHistoryRow(item, true)).join('')}</div>`
    }
  </div>`;
}

function renderHistoryRow(item, showActions = false) {
  const docLabel = item.type.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
  const color    = getDocTypeColor(item.type);
  const bg       = getDocTypeBg ? getDocTypeBg(item.type) : color + '22';
  const icon     = getDocTypeIcon(item.type);
  const date     = new Date(item.createdAt || Date.now()).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });

  return `<div class="history-row" onclick="openHistoryItem('${item.id}')" role="button" tabindex="0" aria-label="Open ${docLabel}">
    <div style="width:40px;height:40px;background:${bg};border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
      <i class="${icon}" style="color:${color};font-size:15px"></i>
    </div>
    <div class="flex-1 min-w-0">
      <div class="font-bold text-gray-900 text-sm truncate">${escHtmlD(item.title || docLabel)}</div>
      <div class="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
        <span class="feature-badge blue" style="font-size:9px;padding:1px 6px">${docLabel}</span>
        <span>${date}</span>
      </div>
    </div>
    ${showActions
      ? `<div class="flex items-center gap-2 flex-shrink-0" onclick="event.stopPropagation()">
          <button onclick="openHistoryItem('${item.id}')"
            class="btn-outline text-xs py-1.5 px-3 h-8">
            <i class="fas fa-pencil-alt text-xs mr-1"></i>Edit
          </button>
          <button onclick="deleteHistoryItem('${item.id}')"
            class="btn-outline text-xs py-1.5 px-3 h-8 text-red-600 border-red-200 hover:bg-red-50">
            <i class="fas fa-trash text-xs"></i>
          </button>
        </div>`
      : `<i class="fas fa-chevron-right text-gray-300 text-xs flex-shrink-0"></i>`
    }
  </div>`;
}

function openHistoryItem(id) {
  const item   = auth.getPDFFromHistory(id);
  if (!item) return;
  const schema = DOC_SCHEMAS[item.type];
  if (!schema) return;
  editorState.docType          = item.type;
  editorState.schema           = schema;
  editorState.selectedTemplate = item.templateId || 1;
  editorState.formData         = { ...schema.defaults(auth.user?.businessProfile || {}), ...item.data };
  renderEditorPage(item.type);
  setTimeout(() => refreshPreview(), 100);
}

function deleteHistoryItem(id) {
  if (!confirm('Delete this document? This cannot be undone.')) return;
  auth.deletePDFFromHistory(id);
  renderHistoryPage();
  showToast('Document deleted.', 'default');
}

/* ════════════════════════════════════════════════════════════════
   PROFILE
════════════════════════════════════════════════════════════════ */
function renderProfilePage() {
  if (!auth.isAuthenticated) { navigate('login'); return; }
  const user = auth.user;
  const bp   = user.businessProfile || {};
  const app  = document.getElementById('app');

  app.innerHTML = `
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">

    <div class="flex items-center justify-between mb-8 flex-wrap gap-4">
      <div>
        <h1 class="text-2xl font-black text-gray-900">My Profile</h1>
        <p class="text-sm text-gray-400 mt-1">Manage your account and business details</p>
      </div>
      <a onclick="navigate('dashboard')" class="btn-outline text-sm">
        <i class="fas fa-arrow-left text-xs"></i> Dashboard
      </a>
    </div>

    <!-- Account card -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
      <h2 class="font-black text-gray-900 mb-4 text-sm flex items-center gap-2">
        <i class="fas fa-user-circle text-blue-500"></i> Account
      </h2>
      <div class="flex items-center gap-5 mb-5">
        <div class="avatar" style="width:54px;height:54px;font-size:18px;border-radius:16px">
          ${(user.name || user.email).slice(0,2).toUpperCase()}
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-black text-gray-900 text-lg">${escHtmlD(user.name || 'User')}</div>
          <div class="text-sm text-gray-500 truncate">${escHtmlD(user.email)}</div>
          <div class="mt-1.5 flex items-center gap-2">
            <span class="feature-badge green text-xs">
              <i class="fas fa-check-circle text-xs"></i>Free Forever
            </span>
            <span class="feature-badge blue text-xs">
              <i class="fas fa-lock text-xs"></i>Data On-Device
            </span>
          </div>
        </div>
      </div>
      <div class="flex gap-3 flex-wrap">
        <button onclick="navigate('history')" class="btn-outline text-sm">
          <i class="fas fa-history text-purple-500 text-xs"></i> My Documents
        </button>
        <button onclick="auth.logout()" class="btn-outline text-sm text-red-600 border-red-200 hover:bg-red-50">
          <i class="fas fa-sign-out-alt text-xs"></i> Sign Out
        </button>
      </div>
    </div>

    <!-- Business profile -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
      <div class="mb-5">
        <h2 class="font-black text-gray-900 flex items-center gap-2">
          <i class="fas fa-building text-blue-500 text-sm"></i> Business Profile
        </h2>
        <p class="text-sm text-gray-500 mt-1">Save once — auto-filled in all future documents.</p>
      </div>

      <!-- Basic info -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        ${profileField('companyName',    'Company / Business Name',  bp.companyName    || '', 'Acme Pvt Ltd')}
        ${profileField('companyEmail',   'Business Email',           bp.companyEmail   || '', 'contact@acme.com', 'email')}
        ${profileField('companyPhone',   'Business Phone',           bp.companyPhone   || '', '+91 98765 43210', 'tel')}
        ${profileField('companyAddress', 'Business Address',         bp.companyAddress || '', '123 Business Street, City, State')}
      </div>

      <!-- Tax & payment -->
      <div class="border-t border-gray-100 pt-4 mb-4">
        <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <i class="fas fa-receipt text-gray-300"></i> Tax & Payments
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${profileField('companyGST',     'GSTIN',            bp.companyGST     || '', '22AAAAA0000A1Z5')}
          ${profileField('upiId',          'UPI ID',           bp.upiId          || '', 'yourname@upi')}
          ${profileField('invoicePrefix',  'Invoice Prefix',   bp.invoicePrefix  || '', 'INV')}
          <div>
            <label class="form-label">Default Tax Rate</label>
            <select class="form-input" id="profile-defaultTaxRate">
              ${[0, 5, 12, 18, 28].map(r => `<option value="${r}" ${(bp.defaultTaxRate||18)==r?'selected':''}>${r}% GST</option>`).join('')}
            </select>
          </div>
        </div>
      </div>

      <!-- Bank details -->
      <div class="border-t border-gray-100 pt-4 mb-5">
        <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <i class="fas fa-university text-gray-300"></i> Bank Details (optional)
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          ${profileField('bankName',    'Bank Name',   bp.bankName    || '', 'HDFC Bank')}
          ${profileField('bankAccount', 'Account No',  bp.bankAccount || '', '')}
          ${profileField('bankIFSC',    'IFSC Code',   bp.bankIFSC    || '', 'HDFC0001234')}
        </div>
      </div>

      <div class="flex gap-3 flex-wrap">
        <button onclick="saveProfile()" class="btn-primary">
          <i class="fas fa-save"></i> Save Profile
        </button>
        <button onclick="navigate('invoice')" class="btn-outline text-sm">
          <i class="fas fa-file-invoice text-blue-500 text-xs"></i> Create Invoice
        </button>
      </div>
    </div>

    ${renderAdInlineBanner('profile-ad')}

    <!-- Data & Privacy -->
    <div class="bg-green-50 border border-green-200 rounded-2xl p-5">
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
          <i class="fas fa-shield-alt text-green-600 text-sm"></i>
        </div>
        <div>
          <h3 class="font-black text-green-900 text-sm mb-1">Your Data is Private</h3>
          <p class="text-xs text-green-700 leading-relaxed">All your business details, client information, and document history are stored only in your browser's localStorage. Nothing is ever sent to any server. Clear browser data to remove everything.</p>
        </div>
      </div>
    </div>

  </div>`;
}

function profileField(field, label, value, placeholder = '', type = 'text') {
  return `<div>
    <label class="form-label" for="profile-${field}">${label}</label>
    <input class="form-input" id="profile-${field}" type="${type}"
      value="${escHtmlD(String(value))}" placeholder="${placeholder}">
  </div>`;
}

function saveProfile() {
  const fields = ['companyName','companyEmail','companyPhone','companyAddress','companyGST','upiId','invoicePrefix','defaultTaxRate','bankName','bankAccount','bankIFSC'];
  const profile = {};
  fields.forEach(f => {
    const el = document.getElementById(`profile-${f}`);
    if (el) profile[f] = el.value;
  });
  if (profile.defaultTaxRate) profile.defaultTaxRate = parseFloat(profile.defaultTaxRate) || 18;
  auth.updateBusinessProfile(profile);
  showToast('Profile saved successfully! ✓', 'success');

  // Visual feedback on button
  const btn = event?.target?.closest('button');
  if (btn) {
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Saved!';
    btn.style.background = 'linear-gradient(135deg,#059669,#047857)';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 2000);
  }
}
