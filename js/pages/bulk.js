/**
 * bulk.js — Bulk PDF Generator
 * Supports: CSV/manual list upload → live preview → bulk PDF → ZIP download
 * Document types: invoice, certificate, receipt, id-card, event-pass, offer-letter
 */

/* ══════════════════════════════════════════════════════════════
   BULK PAGE STATE
══════════════════════════════════════════════════════════════ */
let _bulkDocType  = 'certificate';
let _bulkRows     = [];       // parsed data rows
let _bulkResults  = [];       // { index, filename, status:'pending'|'done'|'error', pdfBlob }
let _bulkRunning  = false;
let _bulkAborted  = false;

/* ── Column definitions per doc type ────────────────────────── */
const BULK_SCHEMAS = {
  certificate: {
    label: 'Certificate',
    icon: 'fas fa-award',
    color: '#e84393',
    columns: ['recipientName','courseName','issueDate','issuerName','issuerTitle'],
    labels:  { recipientName:'Recipient Name *', courseName:'Course / Achievement *', issueDate:'Issue Date', issuerName:'Authorized By', issuerTitle:'Designation' },
    required: ['recipientName','courseName'],
    sampleRows: [
      { recipientName:'Priya Sharma',    courseName:'Full Stack Web Development', issueDate:'2025-01-15', issuerName:'Dr. Ravi Kumar', issuerTitle:'Director' },
      { recipientName:'Rahul Mehta',     courseName:'Data Science Fundamentals',  issueDate:'2025-01-16', issuerName:'Dr. Ravi Kumar', issuerTitle:'Director' },
      { recipientName:'Anjali Gupta',    courseName:'Digital Marketing Mastery',  issueDate:'2025-01-17', issuerName:'Dr. Ravi Kumar', issuerTitle:'Director' },
      { recipientName:'Vikram Patel',    courseName:'Project Management Pro',     issueDate:'2025-01-18', issuerName:'Dr. Ravi Kumar', issuerTitle:'Director' },
      { recipientName:'Sunita Joshi',    courseName:'UI/UX Design Sprint',        issueDate:'2025-01-19', issuerName:'Dr. Ravi Kumar', issuerTitle:'Director' },
    ],
  },
  invoice: {
    label: 'Invoice',
    icon: 'fas fa-file-invoice',
    color: '#2563eb',
    columns: ['invoiceNumber','clientName','clientEmail','clientPhone','serviceDesc','amount','taxRate','date'],
    labels:  { invoiceNumber:'Invoice No *', clientName:'Client Name *', clientEmail:'Client Email', clientPhone:'Client Phone', serviceDesc:'Service / Product *', amount:'Amount (₹) *', taxRate:'Tax Rate %', date:'Date' },
    required: ['invoiceNumber','clientName','serviceDesc','amount'],
    sampleRows: [
      { invoiceNumber:'INV-001', clientName:'Acme Corp',    clientEmail:'acme@example.com',    clientPhone:'+91 98765 00001', serviceDesc:'Web Design Services',      amount:'15000', taxRate:'18', date:'2025-01-20' },
      { invoiceNumber:'INV-002', clientName:'TechStar Ltd', clientEmail:'tech@example.com',    clientPhone:'+91 98765 00002', serviceDesc:'SEO Optimization Package', amount:'8000',  taxRate:'18', date:'2025-01-21' },
      { invoiceNumber:'INV-003', clientName:'Nova Retail',  clientEmail:'nova@example.com',    clientPhone:'+91 98765 00003', serviceDesc:'Monthly Maintenance',      amount:'5000',  taxRate:'18', date:'2025-01-22' },
    ],
  },
  receipt: {
    label: 'Receipt',
    icon: 'fas fa-receipt',
    color: '#059669',
    columns: ['receiptNumber','payerName','payerPhone','description','amountPaid','paymentMode','date'],
    labels:  { receiptNumber:'Receipt No *', payerName:'Payer Name *', payerPhone:'Payer Phone', description:'Description *', amountPaid:'Amount (₹) *', paymentMode:'Payment Mode', date:'Date' },
    required: ['receiptNumber','payerName','description','amountPaid'],
    sampleRows: [
      { receiptNumber:'REC-001', payerName:'Mohan Das',   payerPhone:'+91 9876500001', description:'Monthly Tuition Fee',  amountPaid:'3000', paymentMode:'UPI', date:'2025-01-20' },
      { receiptNumber:'REC-002', payerName:'Geeta Rani',  payerPhone:'+91 9876500002', description:'Annual Membership',    amountPaid:'2000', paymentMode:'Cash', date:'2025-01-21' },
      { receiptNumber:'REC-003', payerName:'Arjun Singh', payerPhone:'+91 9876500003', description:'Library Fee',          amountPaid:'500',  paymentMode:'NEFT', date:'2025-01-22' },
    ],
  },
  'id-card': {
    label: 'ID Card',
    icon: 'fas fa-id-card',
    color: '#dc2626',
    columns: ['employeeName','employeeId','designation','department','email','phone'],
    labels:  { employeeName:'Name *', employeeId:'ID / Roll No *', designation:'Designation *', department:'Department', email:'Email', phone:'Phone' },
    required: ['employeeName','employeeId','designation'],
    sampleRows: [
      { employeeName:'Ritu Agarwal',  employeeId:'EMP-001', designation:'Software Engineer', department:'IT',      email:'ritu@company.com',  phone:'+91 98765 11111' },
      { employeeName:'Karan Verma',   employeeId:'EMP-002', designation:'UI/UX Designer',    department:'Design',  email:'karan@company.com', phone:'+91 98765 22222' },
      { employeeName:'Meena Sharma',  employeeId:'EMP-003', designation:'HR Manager',         department:'HR',      email:'meena@company.com', phone:'+91 98765 33333' },
    ],
  },
  'event-pass': {
    label: 'Event Pass',
    icon: 'fas fa-ticket-alt',
    color: '#0d9488',
    columns: ['attendeeName','ticketId','ticketType','eventName','eventDate','seat'],
    labels:  { attendeeName:'Attendee Name *', ticketId:'Ticket ID *', ticketType:'Ticket Type', eventName:'Event Name *', eventDate:'Event Date', seat:'Seat / Zone' },
    required: ['attendeeName','ticketId','eventName'],
    sampleRows: [
      { attendeeName:'Deepak Roy',   ticketId:'TKT-001', ticketType:'VIP',     eventName:'TechFest 2025', eventDate:'2025-03-15', seat:'A-12' },
      { attendeeName:'Priti Nair',   ticketId:'TKT-002', ticketType:'General', eventName:'TechFest 2025', eventDate:'2025-03-15', seat:'B-22' },
      { attendeeName:'Sahil Khan',   ticketId:'TKT-003', ticketType:'Premium', eventName:'TechFest 2025', eventDate:'2025-03-15', seat:'A-05' },
    ],
  },
  'offer-letter': {
    label: 'Offer Letter',
    icon: 'fas fa-briefcase',
    color: '#6d28d9',
    columns: ['candidateName','designation','department','salary','joiningDate','reportingTo'],
    labels:  { candidateName:'Candidate Name *', designation:'Role / Designation *', department:'Department', salary:'CTC / Salary', joiningDate:'Joining Date', reportingTo:'Reporting To' },
    required: ['candidateName','designation'],
    sampleRows: [
      { candidateName:'Aditya Jain',   designation:'Frontend Developer',  department:'Engineering', salary:'₹8,00,000 per annum', joiningDate:'2025-02-01', reportingTo:'Ankit Sharma' },
      { candidateName:'Kavita Singh',  designation:'Product Manager',     department:'Product',     salary:'₹12,00,000 per annum', joiningDate:'2025-02-03', reportingTo:'Rajesh Gupta' },
    ],
  },
};

/* ══════════════════════════════════════════════════════════════
   RENDER BULK PAGE
══════════════════════════════════════════════════════════════ */
function renderBulkPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
  <div class="page-enter">

    <!-- Hero -->
    <div style="background:linear-gradient(135deg,#1e1b4b 0%,#3730a3 50%,#6d28d9 100%);padding:48px 0 56px;position:relative;overflow:hidden">
      <div style="position:absolute;top:-60px;right:-60px;width:280px;height:280px;background:rgba(167,139,250,0.1);border-radius:50%;pointer-events:none"></div>
      <div style="position:absolute;bottom:-80px;left:-40px;width:200px;height:200px;background:rgba(99,102,241,0.08);border-radius:50%;pointer-events:none"></div>
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div class="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-purple-200 text-sm font-semibold mb-5 backdrop-blur-sm">
          <i class="fas fa-layer-group"></i> Bulk PDF Generator — 100% Free
        </div>
        <h1 class="text-4xl md:text-5xl font-black text-white mb-3" style="letter-spacing:-0.03em">
          Generate <span style="background:linear-gradient(135deg,#a78bfa,#f9a8d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">100s of PDFs</span>
        </h1>
        <p class="text-purple-200 text-lg max-w-xl mx-auto mb-6">
          Upload a CSV or enter data manually. Preview, then download all PDFs in a single ZIP file instantly.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-4 text-purple-300 text-sm">
          <span class="flex items-center gap-1.5"><i class="fas fa-check-circle text-green-400"></i>CSV Upload</span>
          <span class="flex items-center gap-1.5"><i class="fas fa-check-circle text-green-400"></i>Manual Entry</span>
          <span class="flex items-center gap-1.5"><i class="fas fa-check-circle text-green-400"></i>Live Preview</span>
          <span class="flex items-center gap-1.5"><i class="fas fa-check-circle text-green-400"></i>ZIP Download</span>
          <span class="flex items-center gap-1.5"><i class="fas fa-check-circle text-green-400"></i>Up to 500 records</span>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Top Ad -->
      ${renderAdInlineBanner('bulk-top-ad')}

      <!-- Step 1: Doc Type Selector -->
      <section class="mt-8" id="bulk-step1">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-9 h-9 bg-purple-600 text-white rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0">1</div>
          <div>
            <h2 class="text-xl font-black text-gray-900">Choose Document Type</h2>
            <p class="text-sm text-gray-500">Select what kind of document you want to generate in bulk</p>
          </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3" id="bulk-type-grid">
          ${Object.entries(BULK_SCHEMAS).map(([key, schema]) => `
          <button onclick="selectBulkDocType('${key}')"
            id="bulk-type-btn-${key}"
            class="bulk-type-btn ${key === _bulkDocType ? 'selected' : ''} group border-2 rounded-2xl p-4 text-center transition-all cursor-pointer hover:border-purple-400 hover:shadow-md ${key === _bulkDocType ? 'border-purple-600 bg-purple-50 shadow-md' : 'border-gray-200 bg-white'}"
            style="${key === _bulkDocType ? `border-color:${schema.color};background:${schema.color}10;` : ''}">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
              style="background:${schema.color}20">
              <i class="${schema.icon} text-lg" style="color:${schema.color}"></i>
            </div>
            <div class="text-xs font-bold text-gray-700 leading-tight">${schema.label}</div>
          </button>`).join('')}
        </div>
      </section>

      <!-- Step 2: Data Input -->
      <section class="mt-8" id="bulk-step2">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-9 h-9 bg-purple-600 text-white rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0">2</div>
          <div>
            <h2 class="text-xl font-black text-gray-900">Add Your Data</h2>
            <p class="text-sm text-gray-500">Upload a CSV file or use the built-in editor to add rows</p>
          </div>
        </div>

        <!-- Input method tabs -->
        <div class="flex gap-2 mb-5">
          <button onclick="switchBulkInputMode('csv')" id="bulk-tab-csv"
            class="px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 border-purple-600 bg-purple-600 text-white">
            <i class="fas fa-file-csv mr-1.5"></i>CSV Upload
          </button>
          <button onclick="switchBulkInputMode('manual')" id="bulk-tab-manual"
            class="px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 border-gray-200 bg-white text-gray-600 hover:border-purple-300">
            <i class="fas fa-keyboard mr-1.5"></i>Manual Entry
          </button>
          <button onclick="loadBulkSampleData()" class="px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 border-dashed border-green-400 bg-green-50 text-green-700 hover:bg-green-100 ml-auto">
            <i class="fas fa-magic mr-1.5"></i>Load Sample Data
          </button>
        </div>

        <!-- CSV Upload Panel -->
        <div id="bulk-csv-panel">
          <div class="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-purple-400 transition-colors" id="bulk-drop-zone"
            ondragover="event.preventDefault();this.style.borderColor='#7c3aed';this.style.background='#f5f3ff'"
            ondragleave="this.style.borderColor='';this.style.background=''"
            ondrop="handleBulkDrop(event)">
            <div class="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-file-upload text-purple-600 text-2xl"></i>
            </div>
            <h3 class="font-bold text-gray-700 mb-1">Drop your CSV file here</h3>
            <p class="text-sm text-gray-500 mb-4">or click to browse · Max 500 rows · UTF-8 encoding</p>
            <label class="btn-primary cursor-pointer inline-flex items-center gap-2 text-sm py-2.5 px-6">
              <i class="fas fa-folder-open"></i> Browse CSV File
              <input type="file" accept=".csv,.txt" class="hidden" onchange="handleBulkFileInput(this)">
            </label>
            <div class="mt-4 text-xs text-gray-400">
              <span class="font-semibold">Required columns for <span id="bulk-type-label-csv"></span>:</span>
              <div id="bulk-csv-columns" class="mt-1 text-purple-600 font-mono"></div>
            </div>
          </div>

          <!-- Download CSV template button -->
          <button onclick="downloadBulkCSVTemplate()" class="mt-3 text-sm text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-2 transition-colors">
            <i class="fas fa-download"></i> Download CSV Template for <span id="bulk-template-type-label" class="ml-1"></span>
          </button>
        </div>

        <!-- Manual Entry Panel (hidden by default) -->
        <div id="bulk-manual-panel" class="hidden">
          <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div class="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
              <span class="text-sm font-bold text-gray-700">Data Table — <span id="bulk-row-count-label">0 rows</span></span>
              <div class="flex gap-2">
                <button onclick="addBulkRow()" class="text-xs px-3 py-1.5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors">
                  <i class="fas fa-plus mr-1"></i>Add Row
                </button>
                <button onclick="clearBulkRows()" class="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors">
                  <i class="fas fa-trash mr-1"></i>Clear All
                </button>
              </div>
            </div>
            <div style="overflow-x:auto;max-height:380px;overflow-y:auto">
              <table class="w-full text-sm" id="bulk-data-table">
                <thead class="bg-gray-50 sticky top-0 z-10">
                  <tr id="bulk-table-head"></tr>
                </thead>
                <tbody id="bulk-table-body"></tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <!-- Row count & validation summary -->
      <div id="bulk-validation-bar" class="hidden mt-4 flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-2 text-sm font-semibold">
          <i class="fas fa-check-circle"></i>
          <span id="bulk-valid-count">0</span> valid rows ready
        </div>
        <div class="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-2 text-sm font-semibold" id="bulk-error-badge" style="display:none!important">
          <i class="fas fa-exclamation-circle"></i>
          <span id="bulk-error-count">0</span> rows with errors
        </div>
        <button onclick="scrollToBulkPreview()" class="ml-auto text-sm text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1.5 transition-colors">
          Preview first row <i class="fas fa-eye"></i>
        </button>
      </div>

      <!-- Mid Ad -->
      <div class="my-6">
        ${renderAdInlineBanner('bulk-mid-ad')}
      </div>

      <!-- Step 3: Preview -->
      <section class="mt-2" id="bulk-step3">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-9 h-9 bg-purple-600 text-white rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0">3</div>
          <div>
            <h2 class="text-xl font-black text-gray-900">Preview & Settings</h2>
            <p class="text-sm text-gray-500">Check how your document looks and configure global settings</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <!-- Global settings (left) -->
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 class="font-black text-gray-800 mb-4 flex items-center gap-2"><i class="fas fa-cog text-purple-500"></i>Global Settings</h3>

            <!-- Org / Issuer name -->
            <div class="mb-4">
              <label class="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Organization / Issuer Name</label>
              <input id="bulk-org-name" type="text" placeholder="Your Company / School Name"
                class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none transition"
                oninput="refreshBulkPreview()">
            </div>

            <!-- Logo Upload -->
            <div class="mb-4">
              <label class="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Logo <span class="text-gray-400 font-normal normal-case">(optional)</span></label>
              <div class="flex items-center gap-2 mb-1.5">
                <div id="bulk-logo-preview" class="w-10 h-10 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <i class="fas fa-image text-gray-300 text-sm"></i>
                </div>
                <label class="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors border border-purple-200">
                  <i class="fas fa-upload text-xs"></i> Upload
                  <input type="file" accept="image/*" class="hidden" onchange="handleBulkLogoUpload(this)">
                </label>
                <button onclick="clearBulkLogo()" class="text-xs text-red-400 hover:text-red-600 px-2 py-2 transition-colors" title="Remove logo"><i class="fas fa-times"></i></button>
              </div>
              <input id="bulk-logo-url" type="url" placeholder="Or paste logo URL"
                class="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none transition"
                oninput="refreshBulkPreview()">
            </div>

            <!-- Template style -->
            <div class="mb-4">
              <label class="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Template Style</label>
              <select id="bulk-template-style" onchange="refreshBulkPreview()"
                class="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none transition bg-white">
                <option value="1">Style 1 — Classic</option>
                <option value="2">Style 2 — Modern</option>
                <option value="3">Style 3 — Elegant</option>
              </select>
            </div>

            <!-- Watermark toggle -->
            <div class="mb-4">
              <label class="flex items-center gap-3 cursor-pointer">
                <div class="relative">
                  <input type="checkbox" id="bulk-watermark" checked class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-300 peer-checked:bg-purple-600 rounded-full transition-colors"></div>
                  <div class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
                </div>
                <div>
                  <div class="text-sm font-bold text-gray-700">Include Watermark</div>
                  <div class="text-xs text-gray-400">Small "PDFDecor.in" watermark on each PDF</div>
                </div>
              </label>
            </div>

            <!-- Preview row selector -->
            <div>
              <label class="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Preview Row</label>
              <div class="flex gap-2">
                <input id="bulk-preview-row-idx" type="number" min="1" value="1" placeholder="Row #"
                  class="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-300 outline-none transition">
                <button onclick="refreshBulkPreview()" class="px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors">
                  <i class="fas fa-eye"></i> Preview
                </button>
              </div>
            </div>
          </div>

          <!-- Live preview (right) -->
          <div id="bulk-preview-wrap" class="bg-gray-100 border border-gray-200 rounded-2xl overflow-auto flex items-start justify-center p-4" style="min-height:380px">
            <div class="text-center text-gray-400 mt-20" id="bulk-preview-placeholder">
              <i class="fas fa-eye text-4xl mb-3 opacity-30"></i>
              <p class="text-sm font-semibold">Add data to see preview</p>
            </div>
            <div id="bulk-preview-doc" class="hidden" style="transform-origin:top center;transform:scale(0.6);pointer-events:none"></div>
          </div>

        </div>
      </section>

      <!-- Step 4: Generate & Download -->
      <section class="mt-8" id="bulk-step4">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-9 h-9 bg-purple-600 text-white rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0">4</div>
          <div>
            <h2 class="text-xl font-black text-gray-900">Generate & Download</h2>
            <p class="text-sm text-gray-500">All PDFs are generated in your browser and bundled into a ZIP</p>
          </div>
        </div>

        <!-- Generate button row -->
        <div class="flex flex-wrap gap-3 mb-5">
          <button onclick="startBulkGeneration()" id="bulk-generate-btn"
            class="btn-primary text-base py-3.5 px-8 flex items-center gap-2.5 disabled:opacity-50 disabled:pointer-events-none"
            style="background:linear-gradient(135deg,#6d28d9,#7c3aed)">
            <i class="fas fa-bolt"></i> Generate All PDFs
          </button>
          <button onclick="abortBulkGeneration()" id="bulk-abort-btn"
            class="hidden btn-outline py-3.5 px-6 text-red-600 border-red-300 hover:bg-red-50">
            <i class="fas fa-stop-circle mr-1.5"></i>Stop
          </button>
          <button onclick="downloadBulkZIP()" id="bulk-zip-btn"
            class="hidden btn-primary text-base py-3.5 px-8 flex items-center gap-2.5"
            style="background:linear-gradient(135deg,#059669,#10b981)">
            <i class="fas fa-file-archive"></i> Download ZIP
          </button>
        </div>

        <!-- Progress area -->
        <div id="bulk-progress-area" class="hidden bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-bold text-gray-700" id="bulk-progress-label">Generating PDFs…</span>
            <span class="text-sm font-black text-purple-700" id="bulk-progress-pct">0%</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-3">
            <div id="bulk-progress-bar"
              class="h-3 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 transition-all"
              style="width:0%;transition-duration:400ms"></div>
          </div>
          <div class="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
            <span><i class="fas fa-circle text-green-500 text-xs mr-1"></i><span id="bulk-done-count">0</span> done</span>
            <span><i class="fas fa-circle text-red-400 text-xs mr-1"></i><span id="bulk-error-count-prog">0</span> errors</span>
            <span><i class="fas fa-circle text-gray-300 text-xs mr-1"></i><span id="bulk-pending-count">0</span> remaining</span>
          </div>
        </div>

        <!-- Results table -->
        <div id="bulk-results-area" class="hidden mt-5">
          <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div class="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
              <span class="text-sm font-bold text-gray-700">Generation Results</span>
              <div class="flex gap-2">
                <button onclick="downloadBulkZIP()" id="bulk-zip-results-btn"
                  class="hidden text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5"
                  style="background:#059669;color:white">
                  <i class="fas fa-file-archive"></i> Download ZIP
                </button>
                <button onclick="retryFailedBulk()" id="bulk-retry-btn"
                  class="hidden text-xs px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 font-semibold hover:bg-orange-100 transition-colors">
                  <i class="fas fa-redo mr-1"></i>Retry Failed
                </button>
              </div>
            </div>
            <div style="max-height:320px;overflow-y:auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-50 sticky top-0">
                  <tr>
                    <th class="text-left px-4 py-2.5 text-xs font-black text-gray-500 uppercase tracking-wide">#</th>
                    <th class="text-left px-4 py-2.5 text-xs font-black text-gray-500 uppercase tracking-wide">Name / ID</th>
                    <th class="text-left px-4 py-2.5 text-xs font-black text-gray-500 uppercase tracking-wide">Filename</th>
                    <th class="text-left px-4 py-2.5 text-xs font-black text-gray-500 uppercase tracking-wide">Status</th>
                    <th class="px-4 py-2.5"></th>
                  </tr>
                </thead>
                <tbody id="bulk-results-tbody"></tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <!-- Bottom Ad -->
      <div class="mt-8">
        ${renderAdInlineBanner('bulk-bottom-ad')}
      </div>

      <!-- FAQ section -->
      <section class="mt-8 mb-12">
        <h2 class="text-2xl font-black text-gray-900 mb-5 text-center">Frequently Asked Questions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          ${[
            { q:'How many PDFs can I generate at once?', a:'Up to 500 records per batch. For large volumes, split your CSV into batches of 500 and run them one at a time.' },
            { q:'What CSV format do I need?', a:'UTF-8 encoded CSV with a header row. Click "Download CSV Template" to get the exact column names for your document type.' },
            { q:'Is there a cost?', a:'Completely free. All PDFs include a small "PDFDecor.in" watermark that helps keep the service free.' },
            { q:'Are my documents stored anywhere?', a:'No. All processing happens in your browser. Nothing is uploaded to any server. Your data stays on your device.' },
            { q:'Can I remove the watermark?', a:'The watermark keeps PDFDecor free for everyone. You can toggle it off in settings (it may be re-enabled in future versions).' },
            { q:'The ZIP is empty / some PDFs failed — why?', a:'Large batches can timeout on slow devices. Try reducing to 50 rows at a time, or use a modern desktop browser for best results.' },
          ].map(f => `
          <div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h4 class="font-bold text-gray-900 mb-2 text-sm">${f.q}</h4>
            <p class="text-gray-500 text-sm leading-relaxed">${f.a}</p>
          </div>`).join('')}
        </div>
      </section>

    </div>
  </div>`;

  // Init
  _bulkRows = [];
  _bulkResults = [];
  _initBulkUI();
}

/* ══════════════════════════════════════════════════════════════
   UI INITIALIZATION
══════════════════════════════════════════════════════════════ */
function _initBulkUI() {
  _updateBulkColumnLabels();
  _renderBulkManualTable();
  _updateBulkValidationBar();
  // Push AdSense ads
  try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}
}

function _updateBulkColumnLabels() {
  const schema = BULK_SCHEMAS[_bulkDocType];
  if (!schema) return;
  const colsEl = document.getElementById('bulk-csv-columns');
  const typeLabelEl = document.getElementById('bulk-type-label-csv');
  const tplLabelEl  = document.getElementById('bulk-template-type-label');
  if (colsEl) colsEl.textContent = schema.columns.join(', ');
  if (typeLabelEl) typeLabelEl.textContent = schema.label;
  if (tplLabelEl)  tplLabelEl.textContent  = schema.label;
}

/* ══════════════════════════════════════════════════════════════
   LOGO UPLOAD (bulk)
══════════════════════════════════════════════════════════════ */
function handleBulkLogoUpload(input) {
  const file = input.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('Please select an image file.', 'error'); return; }
  if (file.size > 2 * 1024 * 1024) { showToast('Logo must be under 2MB.', 'error'); return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    const urlInput = document.getElementById('bulk-logo-url');
    if (urlInput) urlInput.value = e.target.result;
    const preview = document.getElementById('bulk-logo-preview');
    if (preview) {
      preview.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-contain p-0.5">`;
    }
    refreshBulkPreview();
    showToast('Logo uploaded ✓', 'success');
  };
  reader.readAsDataURL(file);
}

function clearBulkLogo() {
  const urlInput = document.getElementById('bulk-logo-url');
  if (urlInput) urlInput.value = '';
  const preview = document.getElementById('bulk-logo-preview');
  if (preview) preview.innerHTML = '<i class="fas fa-image text-gray-300 text-sm"></i>';
  refreshBulkPreview();
}

/* ══════════════════════════════════════════════════════════════
   DOCUMENT TYPE SELECTION
══════════════════════════════════════════════════════════════ */
function selectBulkDocType(type) {
  if (!BULK_SCHEMAS[type]) return;
  _bulkDocType = type;
  _bulkRows    = [];
  _bulkResults = [];

  // Update button states
  Object.keys(BULK_SCHEMAS).forEach(k => {
    const btn = document.getElementById(`bulk-type-btn-${k}`);
    if (!btn) return;
    const s = BULK_SCHEMAS[k];
    if (k === type) {
      btn.style.borderColor  = s.color;
      btn.style.background   = s.color + '18';
    } else {
      btn.style.borderColor  = '';
      btn.style.background   = '';
    }
  });

  _updateBulkColumnLabels();
  _renderBulkManualTable();
  _updateBulkValidationBar();
  _clearBulkPreview();
  showToast(`Switched to ${BULK_SCHEMAS[type].label} bulk generator`, 'info');
}

/* ══════════════════════════════════════════════════════════════
   INPUT MODE SWITCH
══════════════════════════════════════════════════════════════ */
function switchBulkInputMode(mode) {
  const csvPanel    = document.getElementById('bulk-csv-panel');
  const manualPanel = document.getElementById('bulk-manual-panel');
  const tabCsv      = document.getElementById('bulk-tab-csv');
  const tabManual   = document.getElementById('bulk-tab-manual');

  if (mode === 'csv') {
    csvPanel.classList.remove('hidden');
    manualPanel.classList.add('hidden');
    tabCsv.className    = 'px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 border-purple-600 bg-purple-600 text-white';
    tabManual.className = 'px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 border-gray-200 bg-white text-gray-600 hover:border-purple-300';
  } else {
    csvPanel.classList.add('hidden');
    manualPanel.classList.remove('hidden');
    tabManual.className = 'px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 border-purple-600 bg-purple-600 text-white';
    tabCsv.className    = 'px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 border-gray-200 bg-white text-gray-600 hover:border-purple-300';
  }
}

/* ══════════════════════════════════════════════════════════════
   CSV PARSING
══════════════════════════════════════════════════════════════ */
function handleBulkFileInput(input) {
  const file = input.files[0];
  if (!file) return;
  _parseBulkCSVFile(file);
}

function handleBulkDrop(event) {
  event.preventDefault();
  const dropZone = document.getElementById('bulk-drop-zone');
  if (dropZone) { dropZone.style.borderColor = ''; dropZone.style.background = ''; }
  const file = event.dataTransfer.files[0];
  if (!file) return;
  if (!file.name.match(/\.(csv|txt)$/i)) { showToast('Please upload a .csv file', 'error'); return; }
  _parseBulkCSVFile(file);
}

function _parseBulkCSVFile(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const text = e.target.result;
      const rows = _parseCSVText(text);
      if (rows.length === 0) { showToast('CSV is empty or has no valid rows', 'error'); return; }
      if (rows.length > 500) { showToast(`CSV has ${rows.length} rows — only first 500 loaded`, 'warning'); rows.splice(500); }
      _bulkRows = rows;
      _updateBulkValidationBar();
      refreshBulkPreview();
      switchBulkInputMode('manual'); // show table after CSV load
      _renderBulkManualTable();
      showToast(`✓ Loaded ${rows.length} rows from CSV`, 'success');
    } catch(err) {
      showToast('Failed to parse CSV: ' + err.message, 'error');
    }
  };
  reader.readAsText(file, 'UTF-8');
}

function _parseCSVText(text) {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const schema  = BULK_SCHEMAS[_bulkDocType];
  const cols    = schema.columns;
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase().replace(/\s+/g,''));
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const vals   = _splitCSVLine(line);
    const row    = {};
    // Map by position first, then by header name match
    cols.forEach((col, idx) => {
      // Try exact header match
      const hIdx = headers.findIndex(h => h === col.toLowerCase() || h === col.replace(/([A-Z])/g,'_$1').toLowerCase().slice(1));
      row[col] = hIdx >= 0 ? (vals[hIdx] || '').trim().replace(/^"|"$/g, '') : (vals[idx] ? vals[idx].trim().replace(/^"|"$/g, '') : '');
    });
    results.push(row);
  }
  return results;
}

function _splitCSVLine(line) {
  const result = [];
  let cur = '', inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { inQuote = !inQuote; }
    else if (c === ',' && !inQuote) { result.push(cur); cur = ''; }
    else { cur += c; }
  }
  result.push(cur);
  return result;
}

/* ══════════════════════════════════════════════════════════════
   CSV TEMPLATE DOWNLOAD
══════════════════════════════════════════════════════════════ */
function downloadBulkCSVTemplate() {
  const schema = BULK_SCHEMAS[_bulkDocType];
  const header = schema.columns.join(',');
  const sampleLine = schema.sampleRows[0] ? schema.columns.map(c => `"${schema.sampleRows[0][c] || ''}"`).join(',') : schema.columns.map(() => '""').join(',');
  const csv    = [header, sampleLine].join('\n');
  const blob   = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url    = URL.createObjectURL(blob);
  const a      = document.createElement('a');
  a.href = url; a.download = `pdfdecor_${_bulkDocType}_template.csv`; a.click();
  URL.revokeObjectURL(url);
  showToast('CSV template downloaded!', 'success');
}

/* ══════════════════════════════════════════════════════════════
   MANUAL TABLE EDITOR
══════════════════════════════════════════════════════════════ */
function _renderBulkManualTable() {
  const schema = BULK_SCHEMAS[_bulkDocType];
  const thead  = document.getElementById('bulk-table-head');
  const tbody  = document.getElementById('bulk-table-body');
  const rowCountLabel = document.getElementById('bulk-row-count-label');
  if (!thead || !tbody) return;

  // Header
  thead.innerHTML = `
    <th class="text-left px-3 py-2.5 text-xs font-black text-gray-500 uppercase tracking-wide w-8">#</th>
    ${schema.columns.map(c => `<th class="text-left px-3 py-2.5 text-xs font-black text-gray-500 uppercase tracking-wide whitespace-nowrap">${schema.labels[c] || c}</th>`).join('')}
    <th class="px-3 py-2.5 w-10"></th>`;

  // Body
  tbody.innerHTML = _bulkRows.length === 0
    ? `<tr><td colspan="${schema.columns.length + 2}" class="text-center py-10 text-gray-400 text-sm">No rows yet — click "Add Row" or upload a CSV</td></tr>`
    : _bulkRows.map((row, i) => `
      <tr class="border-t border-gray-100 hover:bg-gray-50 transition-colors" id="bulk-row-${i}">
        <td class="px-3 py-2 text-xs text-gray-400 font-mono font-bold">${i + 1}</td>
        ${schema.columns.map(c => `
          <td class="px-2 py-1.5">
            <input type="text" value="${_esc(row[c] || '')}"
              class="w-full min-w-[100px] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-purple-300 focus:border-purple-400 outline-none transition"
              oninput="updateBulkCell(${i},'${c}',this.value)">
          </td>`).join('')}
        <td class="px-2 py-1.5">
          <button onclick="removeBulkRow(${i})" class="w-6 h-6 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors flex items-center justify-center text-xs">
            <i class="fas fa-times"></i>
          </button>
        </td>
      </tr>`).join('');

  if (rowCountLabel) rowCountLabel.textContent = `${_bulkRows.length} row${_bulkRows.length !== 1 ? 's' : ''}`;
}

function addBulkRow() {
  const schema = BULK_SCHEMAS[_bulkDocType];
  const emptyRow = {};
  schema.columns.forEach(c => { emptyRow[c] = ''; });
  _bulkRows.push(emptyRow);
  _renderBulkManualTable();
  _updateBulkValidationBar();
  // Scroll to new row
  const tbody = document.getElementById('bulk-table-body');
  if (tbody) tbody.scrollTop = tbody.scrollHeight;
}

function removeBulkRow(i) {
  _bulkRows.splice(i, 1);
  _renderBulkManualTable();
  _updateBulkValidationBar();
}

function clearBulkRows() {
  if (!confirm('Clear all rows?')) return;
  _bulkRows = [];
  _renderBulkManualTable();
  _updateBulkValidationBar();
  _clearBulkPreview();
}

function updateBulkCell(rowIdx, col, val) {
  if (_bulkRows[rowIdx]) _bulkRows[rowIdx][col] = val;
  _updateBulkValidationBar();
}

function loadBulkSampleData() {
  const schema = BULK_SCHEMAS[_bulkDocType];
  _bulkRows = schema.sampleRows.map(r => ({ ...r }));
  _renderBulkManualTable();
  _updateBulkValidationBar();
  refreshBulkPreview();
  switchBulkInputMode('manual');
  showToast(`Loaded ${_bulkRows.length} sample rows`, 'success');
}

/* ══════════════════════════════════════════════════════════════
   VALIDATION BAR
══════════════════════════════════════════════════════════════ */
function _updateBulkValidationBar() {
  const bar      = document.getElementById('bulk-validation-bar');
  const validEl  = document.getElementById('bulk-valid-count');
  const errBadge = document.getElementById('bulk-error-badge');
  const errEl    = document.getElementById('bulk-error-count');
  if (!bar) return;

  if (_bulkRows.length === 0) { bar.classList.add('hidden'); return; }
  bar.classList.remove('hidden');

  const schema = BULK_SCHEMAS[_bulkDocType];
  let valid = 0, errors = 0;
  _bulkRows.forEach(row => {
    const missing = schema.required.filter(c => !row[c] || !row[c].trim());
    if (missing.length === 0) valid++; else errors++;
  });
  if (validEl) validEl.textContent = valid;
  if (errEl)   errEl.textContent   = errors;
  if (errBadge) errBadge.style.display = errors > 0 ? '' : 'none';
}

/* ══════════════════════════════════════════════════════════════
   LIVE PREVIEW
══════════════════════════════════════════════════════════════ */
function refreshBulkPreview() {
  if (_bulkRows.length === 0) { _clearBulkPreview(); return; }
  const idxInput = document.getElementById('bulk-preview-row-idx');
  let rowIdx = idxInput ? parseInt(idxInput.value, 10) - 1 : 0;
  if (isNaN(rowIdx) || rowIdx < 0) rowIdx = 0;
  if (rowIdx >= _bulkRows.length) rowIdx = _bulkRows.length - 1;

  const row        = _bulkRows[rowIdx];
  const orgName    = (document.getElementById('bulk-org-name')?.value || 'Your Organization').trim();
  const logoUrl    = document.getElementById('bulk-logo-url')?.value?.trim() || '';
  const tplStyle   = parseInt(document.getElementById('bulk-template-style')?.value || '1', 10);
  const previewDoc = document.getElementById('bulk-preview-doc');
  const placeholder = document.getElementById('bulk-preview-placeholder');

  if (!previewDoc) return;

  const html = _buildBulkDocHTML(_bulkDocType, row, { orgName, logoUrl, tplStyle });
  previewDoc.innerHTML = html;
  previewDoc.classList.remove('hidden');
  if (placeholder) placeholder.classList.add('hidden');
}

function _clearBulkPreview() {
  const previewDoc  = document.getElementById('bulk-preview-doc');
  const placeholder = document.getElementById('bulk-preview-placeholder');
  if (previewDoc)  { previewDoc.innerHTML = ''; previewDoc.classList.add('hidden'); }
  if (placeholder) placeholder.classList.remove('hidden');
}

function scrollToBulkPreview() {
  document.getElementById('bulk-step3')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ══════════════════════════════════════════════════════════════
   DOCUMENT HTML BUILDERS (per doc type)
══════════════════════════════════════════════════════════════ */
function _buildBulkDocHTML(type, row, opts = {}) {
  const { orgName = 'Your Organization', logoUrl = '', tplStyle = 1 } = opts;
  const today = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });

  switch(type) {
    case 'certificate':  return _bulkCertHTML(row, orgName, logoUrl, tplStyle, today);
    case 'invoice':      return _bulkInvoiceHTML(row, orgName, logoUrl, tplStyle, today);
    case 'receipt':      return _bulkReceiptHTML(row, orgName, logoUrl, tplStyle, today);
    case 'id-card':      return _bulkIDCardHTML(row, orgName, logoUrl, tplStyle, today);
    case 'event-pass':   return _bulkEventPassHTML(row, orgName, logoUrl, tplStyle, today);
    case 'offer-letter': return _bulkOfferLetterHTML(row, orgName, logoUrl, tplStyle, today);
    default:             return `<div style="padding:20px;color:#666">No preview available</div>`;
  }
}

function _bulkCertHTML(row, orgName, logoUrl, style, today) {
  const palettes = [
    { bg:'#fffbeb', border:'#f59e0b', accent:'#92400e', ribbon:'#f59e0b' },
    { bg:'#eff6ff', border:'#3b82f6', accent:'#1e40af', ribbon:'#2563eb' },
    { bg:'#f5f3ff', border:'#7c3aed', accent:'#4c1d95', ribbon:'#6d28d9' },
  ];
  const p = palettes[(style - 1) % 3];
  const issueDate = row.issueDate ? new Date(row.issueDate).toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' }) : today;
  return `
<div class="pdf-doc" style="background:${p.bg};border:3px solid ${p.border};border-radius:4px;padding:48px 40px;min-height:520px;position:relative;text-align:center;font-family:Georgia,serif">
  ${logoUrl ? `<img src="${_esc(logoUrl)}" style="height:50px;margin:0 auto 12px;display:block;object-fit:contain" onerror="this.style.display='none'">` : ''}
  <div style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${p.accent};margin-bottom:6px;font-family:Arial,sans-serif">Certificate of Completion</div>
  <div style="width:60px;height:2px;background:${p.ribbon};margin:0 auto 20px"></div>
  <div style="font-size:13px;color:#6b7280;font-family:Arial,sans-serif;margin-bottom:10px">This is to certify that</div>
  <div style="font-size:32px;font-weight:bold;color:${p.accent};margin:8px 0 12px;font-family:'Palatino Linotype',Georgia,serif">${_esc(row.recipientName || 'Recipient Name')}</div>
  <div style="width:200px;height:1px;background:${p.border};margin:0 auto 16px"></div>
  <div style="font-size:12px;color:#6b7280;font-family:Arial,sans-serif;max-width:400px;margin:0 auto 6px">has successfully completed</div>
  <div style="font-size:18px;font-weight:bold;color:#1f2937;margin:8px 0 20px;font-family:Arial,sans-serif">${_esc(row.courseName || 'Course Name')}</div>
  <div style="font-size:11px;color:#9ca3af;font-family:Arial,sans-serif;margin-bottom:28px">Issued on: ${issueDate}</div>
  <div style="display:flex;justify-content:center;gap:80px;margin-top:24px">
    <div style="text-align:center">
      <div style="width:120px;border-top:1px solid ${p.border};padding-top:8px;margin:0 auto">
        <div style="font-size:12px;font-weight:bold;color:#374151;font-family:Arial,sans-serif">${_esc(row.issuerName || orgName)}</div>
        <div style="font-size:10px;color:#6b7280;font-family:Arial,sans-serif">${_esc(row.issuerTitle || 'Authorized Signatory')}</div>
      </div>
    </div>
  </div>
  <div style="position:absolute;bottom:14px;right:14px;font-size:9px;color:${p.border};opacity:0.6;font-family:Arial,sans-serif">${_esc(orgName)}</div>
</div>`;
}

function _bulkInvoiceHTML(row, orgName, logoUrl, style, today) {
  const colors = ['#2563eb','#059669','#7c3aed'];
  const c = colors[(style - 1) % 3];
  const amt = parseFloat(row.amount || 0);
  const tax = parseFloat(row.taxRate || 18);
  const taxAmt = amt * tax / 100;
  const total = amt + taxAmt;
  const issueDate = row.date ? new Date(row.date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : today;
  return `
<div class="pdf-doc" style="background:#fff;font-family:Arial,sans-serif;padding:0;min-height:600px">
  <div style="background:${c};padding:24px 28px;color:white;display:flex;justify-content:space-between;align-items:center">
    ${logoUrl ? `<img src="${_esc(logoUrl)}" style="height:40px;object-fit:contain;background:white;padding:4px;border-radius:4px" onerror="this.style.display='none'">` : `<div style="font-size:20px;font-weight:900">${_esc(orgName)}</div>`}
    <div style="text-align:right">
      <div style="font-size:22px;font-weight:900">INVOICE</div>
      <div style="font-size:13px;opacity:0.85">#${_esc(row.invoiceNumber || 'INV-001')}</div>
    </div>
  </div>
  <div style="padding:24px 28px">
    <div style="display:flex;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:16px">
      <div><div style="font-size:10px;font-weight:bold;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Bill To</div>
        <div style="font-weight:bold;font-size:15px;color:#111">${_esc(row.clientName || 'Client Name')}</div>
        ${row.clientEmail ? `<div style="font-size:11px;color:#6b7280">${_esc(row.clientEmail)}</div>` : ''}
        ${row.clientPhone ? `<div style="font-size:11px;color:#6b7280">${_esc(row.clientPhone)}</div>` : ''}
      </div>
      <div style="text-align:right"><div style="font-size:10px;font-weight:bold;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Date</div>
        <div style="font-size:13px;color:#374151">${issueDate}</div>
      </div>
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
      <thead><tr style="background:#f8fafc">
        <th style="text-align:left;padding:8px 10px;font-size:11px;color:#6b7280;font-weight:bold;border-bottom:1px solid #e5e7eb">Description</th>
        <th style="text-align:right;padding:8px 10px;font-size:11px;color:#6b7280;font-weight:bold;border-bottom:1px solid #e5e7eb">Amount</th>
      </tr></thead>
      <tbody><tr>
        <td style="padding:10px;font-size:13px;color:#374151;border-bottom:1px solid #f3f4f6">${_esc(row.serviceDesc || 'Service')}</td>
        <td style="padding:10px;text-align:right;font-size:13px;color:#374151;border-bottom:1px solid #f3f4f6">₹${amt.toLocaleString('en-IN',{minimumFractionDigits:2})}</td>
      </tr></tbody>
    </table>
    <div style="display:flex;justify-content:flex-end">
      <div style="width:220px">
        <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:12px;color:#6b7280">
          <span>Subtotal</span><span>₹${amt.toLocaleString('en-IN',{minimumFractionDigits:2})}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:12px;color:#6b7280">
          <span>GST (${tax}%)</span><span>₹${taxAmt.toLocaleString('en-IN',{minimumFractionDigits:2})}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:8px 10px;background:${c};color:white;border-radius:6px;font-weight:bold;font-size:14px;margin-top:4px">
          <span>Total</span><span>₹${total.toLocaleString('en-IN',{minimumFractionDigits:2})}</span>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

function _bulkReceiptHTML(row, orgName, logoUrl, style, today) {
  const colors = ['#059669','#374151','#2563eb'];
  const c = colors[(style - 1) % 3];
  const issueDate = row.date ? new Date(row.date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : today;
  return `
<div class="pdf-doc" style="background:#fff;font-family:Arial,sans-serif;padding:0">
  <div style="background:${c};color:white;padding:20px 28px;display:flex;justify-content:space-between;align-items:center">
    <div><div style="font-size:18px;font-weight:900">${_esc(orgName)}</div>
      <div style="font-size:11px;opacity:0.8">Payment Receipt</div></div>
    <div style="text-align:right"><div style="font-size:11px;opacity:0.75">Receipt No</div><div style="font-weight:bold">${_esc(row.receiptNumber || 'REC-001')}</div></div>
  </div>
  <div style="padding:24px 28px">
    <div style="background:#f8fafc;border-radius:8px;padding:16px;margin-bottom:16px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px">
      <div><div style="font-size:10px;font-weight:bold;color:#9ca3af;text-transform:uppercase;margin-bottom:3px">Received From</div>
        <div style="font-weight:bold;color:#111;font-size:15px">${_esc(row.payerName || 'Payer Name')}</div>
        ${row.payerPhone ? `<div style="font-size:11px;color:#6b7280">${_esc(row.payerPhone)}</div>` : ''}
      </div>
      <div style="text-align:right"><div style="font-size:10px;font-weight:bold;color:#9ca3af;text-transform:uppercase;margin-bottom:3px">Date</div>
        <div style="font-size:13px;color:#374151">${issueDate}</div>
        ${row.paymentMode ? `<div style="font-size:11px;color:#6b7280">via ${_esc(row.paymentMode)}</div>` : ''}
      </div>
    </div>
    <div style="margin-bottom:16px;padding:14px 16px;border:1px solid #e5e7eb;border-radius:8px">
      <div style="font-size:11px;font-weight:bold;color:#6b7280;text-transform:uppercase;margin-bottom:4px">For</div>
      <div style="font-size:14px;color:#374151">${_esc(row.description || 'Payment')}</div>
    </div>
    <div style="background:${c};color:white;border-radius:8px;padding:16px;text-align:center">
      <div style="font-size:11px;opacity:0.8;margin-bottom:4px">Amount Received</div>
      <div style="font-size:28px;font-weight:900">₹${parseFloat(row.amountPaid || 0).toLocaleString('en-IN',{minimumFractionDigits:2})}</div>
    </div>
    <div style="margin-top:28px;text-align:right"><div style="display:inline-block;text-align:center">
      <div style="width:120px;border-top:1px solid #9ca3af;padding-top:6px;font-size:11px;color:#6b7280">Authorized Signature</div>
    </div></div>
  </div>
</div>`;
}

function _bulkIDCardHTML(row, orgName, logoUrl, style, today) {
  const gradients = [
    'linear-gradient(135deg,#1e40af,#3b82f6)',
    'linear-gradient(135deg,#065f46,#10b981)',
    'linear-gradient(135deg,#6d28d9,#8b5cf6)',
  ];
  const g = gradients[(style - 1) % 3];
  return `
<div class="pdf-doc" style="background:#fff;font-family:Arial,sans-serif;padding:16px;min-height:auto;max-width:320px;margin:0 auto">
  <div style="background:${g};color:white;border-radius:12px 12px 0 0;padding:20px 16px 14px;text-align:center">
    ${logoUrl ? `<img src="${_esc(logoUrl)}" style="height:36px;margin:0 auto 8px;display:block;object-fit:contain;filter:brightness(0) invert(1)" onerror="this.style.display='none'">` : `<div style="font-size:14px;font-weight:900;letter-spacing:1px;margin-bottom:8px">${_esc(orgName)}</div>`}
    <div style="width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,0.25);margin:0 auto 8px;display:flex;align-items:center;justify-content:center">
      <span style="font-size:24px">👤</span>
    </div>
    <div style="font-size:16px;font-weight:bold">${_esc(row.employeeName || 'Employee Name')}</div>
    <div style="font-size:11px;opacity:0.85;margin-top:3px">${_esc(row.designation || 'Designation')}</div>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;padding:16px">
    ${[
      { label:'ID', val: row.employeeId || 'ID-001' },
      { label:'Department', val: row.department || '' },
      { label:'Email', val: row.email || '' },
      { label:'Phone', val: row.phone || '' },
    ].filter(f => f.val).map(f => `
    <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #f3f4f6;font-size:11px">
      <span style="color:#9ca3af;font-weight:bold">${f.label}</span>
      <span style="color:#374151">${_esc(f.val)}</span>
    </div>`).join('')}
    <div style="margin-top:10px;text-align:center;font-size:10px;color:#9ca3af">${_esc(orgName)}</div>
  </div>
</div>`;
}

function _bulkEventPassHTML(row, orgName, logoUrl, style, today) {
  const colors = [
    { bg:'#0d9488', light:'#ccfbf1' },
    { bg:'#7c3aed', light:'#f5f3ff' },
    { bg:'#dc2626', light:'#fef2f2' },
  ];
  const col = colors[(style - 1) % 3];
  const evtDate = row.eventDate ? new Date(row.eventDate).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : today;
  return `
<div class="pdf-doc" style="background:#fff;font-family:Arial,sans-serif;padding:0;max-width:400px;margin:0 auto;border-radius:12px;overflow:hidden;border:2px solid ${col.bg}">
  <div style="background:${col.bg};color:white;padding:20px 20px 14px;text-align:center">
    ${logoUrl ? `<img src="${_esc(logoUrl)}" style="height:30px;margin:0 auto 8px;display:block;object-fit:contain;filter:brightness(0) invert(1)" onerror="this.style.display='none'">` : `<div style="font-size:11px;font-weight:bold;opacity:0.85;margin-bottom:6px">${_esc(orgName)}</div>`}
    <div style="font-size:8px;letter-spacing:3px;text-transform:uppercase;opacity:0.7;margin-bottom:4px">Event Pass</div>
    <div style="font-size:19px;font-weight:900">${_esc(row.eventName || 'Event Name')}</div>
    <div style="font-size:12px;opacity:0.85;margin-top:4px">${evtDate}</div>
  </div>
  <div style="padding:16px 20px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <div><div style="font-size:10px;color:#9ca3af;font-weight:bold;text-transform:uppercase;margin-bottom:3px">Attendee</div>
        <div style="font-weight:bold;font-size:15px;color:#111">${_esc(row.attendeeName || 'Attendee Name')}</div>
      </div>
      <div style="text-align:right"><div style="font-size:10px;color:#9ca3af;font-weight:bold;text-transform:uppercase;margin-bottom:3px">Type</div>
        <div style="background:${col.bg};color:white;border-radius:20px;padding:3px 10px;font-size:11px;font-weight:bold">${_esc(row.ticketType || 'General')}</div>
      </div>
    </div>
    <div style="background:${col.light};border-radius:8px;padding:12px;display:flex;justify-content:space-between;font-size:12px">
      <div><div style="color:#6b7280;font-size:10px;font-weight:bold;margin-bottom:2px">TICKET ID</div>
        <div style="font-weight:bold;color:#111;font-family:monospace">${_esc(row.ticketId || 'TKT-001')}</div>
      </div>
      ${row.seat ? `<div style="text-align:right"><div style="color:#6b7280;font-size:10px;font-weight:bold;margin-bottom:2px">SEAT</div>
        <div style="font-weight:bold;color:#111">${_esc(row.seat)}</div></div>` : ''}
    </div>
  </div>
</div>`;
}

function _bulkOfferLetterHTML(row, orgName, logoUrl, style, today) {
  const joiningDate = row.joiningDate ? new Date(row.joiningDate).toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' }) : today;
  const colors = ['#2563eb','#7c3aed','#059669'];
  const c = colors[(style - 1) % 3];
  return `
<div class="pdf-doc" style="background:#fff;font-family:Arial,sans-serif;padding:32px 36px;min-height:600px">
  <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid ${c};padding-bottom:16px;margin-bottom:20px">
    ${logoUrl ? `<img src="${_esc(logoUrl)}" style="height:40px;object-fit:contain" onerror="this.style.display='none'">` : `<div style="font-size:18px;font-weight:900;color:${c}">${_esc(orgName)}</div>`}
    <div style="text-align:right;font-size:11px;color:#6b7280">
      <div style="font-weight:bold;font-size:14px;color:#111">Offer Letter</div>
      <div>Date: ${today}</div>
    </div>
  </div>
  <div style="margin-bottom:16px">
    <div style="font-size:13px;color:#374151;margin-bottom:12px">Dear <strong>${_esc(row.candidateName || 'Candidate')}</strong>,</div>
    <p style="font-size:12px;color:#374151;line-height:1.7;margin-bottom:10px">We are pleased to offer you the position of <strong>${_esc(row.designation || 'Position')}</strong>${row.department ? ` in the <strong>${_esc(row.department)}</strong> department` : ''} at <strong>${_esc(orgName)}</strong>.</p>
    ${row.salary ? `<p style="font-size:12px;color:#374151;line-height:1.7;margin-bottom:10px">The compensation for this role will be <strong>${_esc(row.salary)}</strong>.</p>` : ''}
    ${row.joiningDate ? `<p style="font-size:12px;color:#374151;line-height:1.7;margin-bottom:10px">Your expected date of joining is <strong>${joiningDate}</strong>.</p>` : ''}
    ${row.reportingTo ? `<p style="font-size:12px;color:#374151;line-height:1.7;margin-bottom:10px">You will be reporting to <strong>${_esc(row.reportingTo)}</strong>.</p>` : ''}
    <p style="font-size:12px;color:#374151;line-height:1.7;">Please sign and return a copy of this letter to confirm your acceptance. We look forward to having you on board.</p>
  </div>
  <div style="display:flex;justify-content:space-between;margin-top:36px;flex-wrap:wrap;gap:20px">
    <div><div style="width:140px;border-top:1px solid #9ca3af;padding-top:6px;text-align:center;font-size:10px;color:#6b7280">
      Candidate Signature<br>${_esc(row.candidateName || '')}
    </div></div>
    <div><div style="width:140px;border-top:1px solid #9ca3af;padding-top:6px;text-align:center;font-size:10px;color:#6b7280">
      Authorized Signature<br>${_esc(orgName)}
    </div></div>
  </div>
</div>`;
}

/* ══════════════════════════════════════════════════════════════
   BULK GENERATION ENGINE
══════════════════════════════════════════════════════════════ */
async function startBulkGeneration() {
  const schema = BULK_SCHEMAS[_bulkDocType];
  const validRows = _bulkRows.filter(row => schema.required.every(c => row[c] && row[c].trim()));

  if (validRows.length === 0) {
    showToast('No valid rows to generate. Check required fields.', 'error');
    return;
  }

  if (_bulkRunning) return;
  _bulkRunning = true;
  _bulkAborted = false;

  // Show interstitial ad before starting bulk generation
  showInterstitialAd(async () => {
    await _runBulkGeneration(validRows);
  });
}

async function _runBulkGeneration(validRows) {
  const orgName  = (document.getElementById('bulk-org-name')?.value || 'Your Organization').trim();
  const logoUrl  = document.getElementById('bulk-logo-url')?.value?.trim() || '';
  const tplStyle = parseInt(document.getElementById('bulk-template-style')?.value || '1', 10);
  const addWM    = document.getElementById('bulk-watermark')?.checked !== false;

  // Setup results
  _bulkResults = validRows.map((row, i) => ({
    index: i,
    row,
    filename: _getBulkFilename(_bulkDocType, row, i),
    status: 'pending',
    pdfBlob: null,
  }));

  // Show UI
  const progressArea = document.getElementById('bulk-progress-area');
  const resultsArea  = document.getElementById('bulk-results-area');
  const genBtn       = document.getElementById('bulk-generate-btn');
  const abortBtn     = document.getElementById('bulk-abort-btn');
  const zipBtn       = document.getElementById('bulk-zip-btn');

  if (progressArea) progressArea.classList.remove('hidden');
  if (resultsArea)  resultsArea.classList.remove('hidden');
  if (genBtn)       genBtn.classList.add('hidden');
  if (abortBtn)     abortBtn.classList.remove('hidden');
  if (zipBtn)       zipBtn.classList.add('hidden');

  _renderBulkResultsTable();
  _updateBulkProgress();

  // Process rows sequentially (browser memory safe)
  for (let i = 0; i < _bulkResults.length; i++) {
    if (_bulkAborted) break;

    const result = _bulkResults[i];
    result.status = 'generating';
    _updateBulkResultRow(i);

    try {
      const html = _buildBulkDocHTML(_bulkDocType, result.row, { orgName, logoUrl, tplStyle });
      result.pdfBlob = await _renderRowToPDF(html, addWM);
      result.status = 'done';
    } catch(err) {
      result.status = 'error';
      result.error  = err.message || 'Failed';
    }

    _updateBulkResultRow(i);
    _updateBulkProgress();
    await _sleep(80); // small delay to keep UI responsive
  }

  // Done
  _bulkRunning = false;
  if (genBtn)  genBtn.classList.remove('hidden');
  if (abortBtn) abortBtn.classList.add('hidden');

  const doneCount = _bulkResults.filter(r => r.status === 'done').length;
  if (doneCount > 0) {
    if (zipBtn) zipBtn.classList.remove('hidden');
    const zipResultsBtn = document.getElementById('bulk-zip-results-btn');
    if (zipResultsBtn) zipResultsBtn.classList.remove('hidden');
    showToast(`✓ ${doneCount} PDFs generated! Click Download ZIP.`, 'success', 5000);
  }

  const failCount = _bulkResults.filter(r => r.status === 'error').length;
  if (failCount > 0) {
    document.getElementById('bulk-retry-btn')?.classList.remove('hidden');
    showToast(`${failCount} PDFs failed. Click Retry Failed.`, 'warning', 5000);
  }
}

async function _renderRowToPDF(html, addWatermark) {
  // Create off-screen container
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:794px;background:#fff;z-index:-999;pointer-events:none';
  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    if (addWatermark) injectWatermark(container, 'PDFDecor.in');
    injectFooterBranding(container);

    await _sleep(150);

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.88);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    const pw  = pdf.internal.pageSize.getWidth();
    const ph  = pdf.internal.pageSize.getHeight();
    const m   = 8;
    const cw  = pw - m * 2;
    const ratio = cw / canvas.width;
    const ch  = canvas.height * ratio;

    if (ch <= ph - m * 2) {
      pdf.addImage(imgData, 'JPEG', m, m, cw, ch);
    } else {
      const pageHpx = Math.floor((ph - m * 2) / ratio);
      let oy = 0;
      while (oy < canvas.height) {
        const sh = Math.min(pageHpx, canvas.height - oy);
        const pc = document.createElement('canvas');
        pc.width = canvas.width; pc.height = sh;
        pc.getContext('2d').drawImage(canvas, 0, oy, canvas.width, sh, 0, 0, canvas.width, sh);
        if (oy > 0) pdf.addPage();
        pdf.addImage(pc.toDataURL('image/jpeg', 0.88), 'JPEG', m, m, cw, sh * ratio);
        oy += sh;
      }
    }

    return new Blob([pdf.output('arraybuffer')], { type: 'application/pdf' });
  } finally {
    if (document.body.contains(container)) document.body.removeChild(container);
  }
}

function abortBulkGeneration() {
  _bulkAborted = true;
  _bulkRunning = false;
  showToast('Generation stopped.', 'warning');
  document.getElementById('bulk-abort-btn')?.classList.add('hidden');
  document.getElementById('bulk-generate-btn')?.classList.remove('hidden');
}

async function retryFailedBulk() {
  const failed = _bulkResults.filter(r => r.status === 'error');
  if (failed.length === 0) return;

  const orgName  = (document.getElementById('bulk-org-name')?.value || 'Your Organization').trim();
  const logoUrl  = document.getElementById('bulk-logo-url')?.value?.trim() || '';
  const tplStyle = parseInt(document.getElementById('bulk-template-style')?.value || '1', 10);
  const addWM    = document.getElementById('bulk-watermark')?.checked !== false;

  for (const result of failed) {
    if (_bulkAborted) break;
    result.status = 'generating';
    _updateBulkResultRow(result.index);
    try {
      const html = _buildBulkDocHTML(_bulkDocType, result.row, { orgName, logoUrl, tplStyle });
      result.pdfBlob = await _renderRowToPDF(html, addWM);
      result.status = 'done';
    } catch(err) {
      result.status = 'error';
      result.error  = err.message || 'Failed';
    }
    _updateBulkResultRow(result.index);
    _updateBulkProgress();
    await _sleep(80);
  }

  const doneCount = _bulkResults.filter(r => r.status === 'done').length;
  showToast(`Retry done. ${doneCount} PDFs ready.`, 'success');
}

/* ══════════════════════════════════════════════════════════════
   PROGRESS & RESULTS TABLE
══════════════════════════════════════════════════════════════ */
function _updateBulkProgress() {
  const total     = _bulkResults.length;
  const done      = _bulkResults.filter(r => r.status === 'done').length;
  const errors    = _bulkResults.filter(r => r.status === 'error').length;
  const remaining = _bulkResults.filter(r => r.status === 'pending' || r.status === 'generating').length;
  const pct       = total > 0 ? Math.round(((done + errors) / total) * 100) : 0;

  const bar   = document.getElementById('bulk-progress-bar');
  const pctEl = document.getElementById('bulk-progress-pct');
  const labelEl = document.getElementById('bulk-progress-label');
  const doneEl  = document.getElementById('bulk-done-count');
  const errEl   = document.getElementById('bulk-error-count-prog');
  const pendEl  = document.getElementById('bulk-pending-count');

  if (bar)    bar.style.width = pct + '%';
  if (pctEl)  pctEl.textContent = pct + '%';
  if (labelEl) labelEl.textContent = pct < 100 ? `Generating PDFs… (${done + errors}/${total})` : `Complete — ${done} PDFs generated`;
  if (doneEl) doneEl.textContent = done;
  if (errEl)  errEl.textContent  = errors;
  if (pendEl) pendEl.textContent = remaining;
}

function _renderBulkResultsTable() {
  const tbody = document.getElementById('bulk-results-tbody');
  if (!tbody) return;
  tbody.innerHTML = _bulkResults.map((r, i) => _bulkResultRowHTML(r, i)).join('');
}

function _updateBulkResultRow(i) {
  const tr = document.querySelector(`#bulk-results-tbody tr[data-idx="${i}"]`);
  if (!tr) { _renderBulkResultsTable(); return; }
  tr.outerHTML = _bulkResultRowHTML(_bulkResults[i], i);
}

function _bulkResultRowHTML(r, i) {
  const schema = BULK_SCHEMAS[_bulkDocType];
  const nameField = schema.columns[0];
  const displayName = r.row[nameField] || `Row ${i + 1}`;
  const statusHTML = {
    'pending':    `<span class="text-xs text-gray-400 font-medium">Pending</span>`,
    'generating': `<span class="text-xs text-indigo-600 font-bold flex items-center gap-1"><span class="w-2 h-2 bg-indigo-500 rounded-full animate-pulse inline-block"></span>Generating…</span>`,
    'done':       `<span class="text-xs text-green-600 font-bold flex items-center gap-1"><i class="fas fa-check-circle text-green-500"></i>Done</span>`,
    'error':      `<span class="text-xs text-red-500 font-bold flex items-center gap-1"><i class="fas fa-exclamation-circle text-red-400"></i>Failed</span>`,
  }[r.status] || '';
  const actionHTML = r.status === 'done'
    ? `<button onclick="downloadSingleBulkPDF(${i})" title="Download" class="text-xs px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors font-semibold"><i class="fas fa-download mr-1"></i>PDF</button>`
    : '';

  return `<tr data-idx="${i}" class="border-t border-gray-100 hover:bg-gray-50 transition-colors">
    <td class="px-4 py-2.5 text-xs text-gray-400 font-mono font-bold">${i + 1}</td>
    <td class="px-4 py-2.5 text-sm font-medium text-gray-800">${_esc(displayName)}</td>
    <td class="px-4 py-2.5 text-xs text-gray-500 font-mono">${_esc(r.filename)}</td>
    <td class="px-4 py-2.5">${statusHTML}</td>
    <td class="px-4 py-2.5">${actionHTML}</td>
  </tr>`;
}

/* ══════════════════════════════════════════════════════════════
   ZIP DOWNLOAD
══════════════════════════════════════════════════════════════ */
async function downloadBulkZIP() {
  const done = _bulkResults.filter(r => r.status === 'done' && r.pdfBlob);
  if (done.length === 0) { showToast('No PDFs ready to download.', 'error'); return; }

  if (!window.JSZip) { showToast('JSZip library not loaded. Please refresh.', 'error'); return; }

  showToast(`Bundling ${done.length} PDFs into ZIP…`, 'info');

  try {
    const zip = new window.JSZip();
    const folder = zip.folder(`PDFDecor_${_bulkDocType}_bulk`);
    done.forEach(r => { folder.file(r.filename, r.pdfBlob); });

    const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `PDFDecor_${_bulkDocType}_${done.length}pdfs.zip`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`✓ ZIP downloaded with ${done.length} PDFs!`, 'success', 5000);
  } catch(err) {
    showToast('ZIP creation failed: ' + err.message, 'error');
  }
}

function downloadSingleBulkPDF(i) {
  const result = _bulkResults[i];
  if (!result || !result.pdfBlob) { showToast('PDF not ready.', 'error'); return; }
  const url = URL.createObjectURL(result.pdfBlob);
  const a   = document.createElement('a');
  a.href = url; a.download = result.filename; a.click();
  URL.revokeObjectURL(url);
}

/* ══════════════════════════════════════════════════════════════
   UTILITIES
══════════════════════════════════════════════════════════════ */
function _getBulkFilename(type, row, idx) {
  const schema = BULK_SCHEMAS[type];
  const nameField = schema.columns[0];
  const safeName  = (row[nameField] || `record_${idx + 1}`).replace(/[^a-z0-9_\-\. ]/gi, '_').trim();
  const label     = type.replace(/-/g, '_');
  return `${label}_${safeName}.pdf`;
}

function _esc(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function _sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
