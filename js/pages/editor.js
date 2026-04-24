/**
 * editor.js — Universal document editor
 * All templates free · interstitial ad before download · sidebar ads
 */

/* ── Document schemas ─────────────────────────────────────────── */
const DOC_SCHEMAS = {
  invoice: {
    title: 'Free Invoice Generator',
    subtitle: 'GST-compliant invoices with UPI QR code — instant PDF download',
    icon: 'fas fa-file-invoice',
    color: '#2563eb',
    bg: '#eff6ff',
    filename: (d) => `Invoice_${d.invoiceNumber || 'INV-001'}.pdf`,
    templates: [
      { id:1, name:'Modern Blue',    desc:'Clean & professional', color:'#2563eb' },
      { id:2, name:'Pro Green',      desc:'Business formal',      color:'#059669' },
      { id:3, name:'Elegant Purple', desc:'Premium look',         color:'#7c3aed' },
    ],
    defaults: (bp={}) => ({
      invoiceNumber: bp.invoicePrefix ? `${bp.invoicePrefix}001` : 'INV-001',
      date: today(), dueDate: daysFromNow(30),
      companyName: bp.companyName || 'Your Company Name',
      companyAddress: bp.companyAddress || '123 Business St, Mumbai, MH 400001',
      companyPhone: bp.companyPhone || '+91 98765 43210',
      companyEmail: bp.companyEmail || 'contact@yourcompany.com',
      companyGST: bp.companyGST || '', upiId: bp.upiId || '',
      clientName: 'Client Name', clientAddress: '456 Client Ave, Delhi 110001',
      clientPhone: '+91 98765 12345', clientEmail: 'client@email.com', clientGST: '',
      items: [
        { description:'Service or Product 1', quantity:1, rate:5000, amount:5000 },
        { description:'Service or Product 2', quantity:2, rate:2500, amount:5000 },
      ],
      taxRate: bp.defaultTaxRate || 18, subtotal:10000, tax:1800, total:11800,
      notes: 'Thank you for your business! Payment due within 30 days.',
      bankName: bp.bankName || '', bankAccount: bp.bankAccount || '',
      bankIFSC: bp.bankIFSC || '', bankBranch: '',
    }),
    formSections: ['invoice-details','company-section','client-section','items-section','payment-section'],
    faqs: [
      { q:'Is this GST compliant?', a:'Yes. Add GSTIN, set tax rate (0%, 5%, 12%, 18%, 28%). The PDF is A4 print-ready with proper GST breakdown.' },
      { q:'How does UPI QR work?', a:'Enter your UPI ID in the Payment section — a scannable QR code auto-generates in the preview.' },
      { q:'Why is there a watermark?', a:'PDFDecor is free forever. The small "PDFDecor.in" watermark helps keep the service running while all features stay free.' },
    ],
  },

  receipt: {
    title: 'Free Receipt Generator',
    subtitle: 'Professional payment receipts for completed transactions',
    icon: 'fas fa-receipt', color: '#059669', bg: '#f0fdf4',
    filename: (d) => `Receipt_${d.receiptNumber || 'REC-001'}.pdf`,
    templates: [
      { id:1, name:'Classic Green', desc:'Professional',  color:'#059669' },
      { id:2, name:'Clean White',   desc:'Minimalist',    color:'#374151' },
    ],
    defaults: (bp={}) => ({
      receiptNumber:'REC-001', date:today(),
      companyName: bp.companyName || 'Your Company',
      companyAddress: bp.companyAddress || '',
      companyPhone: bp.companyPhone || '',
      companyEmail: bp.companyEmail || '',
      payerName:'Payer Name', payerAddress:'Payer Address', payerEmail:'',
      amount:5000, paymentMethod:'UPI', description:'Payment for services rendered',
    }),
    formSections:['receipt-details','company-section','payer-section'],
    faqs:[{ q:'What payment methods can I show?', a:'Any: Cash, UPI, NEFT, RTGS, Cheque, Credit Card, Debit Card — select from the dropdown.' }],
  },

  bill: {
    title: 'Free Bill Generator',
    subtitle: 'Itemised bills for products and retail services',
    icon: 'fas fa-file-alt', color: '#ea580c', bg: '#fff7ed',
    filename: (d) => `Bill_${d.billNumber || 'BILL-001'}.pdf`,
    templates: [{ id:1, name:'Orange Classic', desc:'Retail friendly', color:'#ea580c' }],
    defaults: (bp={}) => ({
      billNumber:'BILL-001', date:today(),
      companyName: bp.companyName || 'Your Company',
      companyAddress: bp.companyAddress || '',
      companyPhone: bp.companyPhone || '', companyGST: bp.companyGST || '',
      clientName:'Customer Name', clientAddress:'',
      items:[{ description:'Item 1', quantity:1, rate:500, amount:500 }, { description:'Item 2', quantity:2, rate:250, amount:500 }],
      taxRate:18, subtotal:1000, tax:180, total:1180, notes:'',
    }),
    formSections:['bill-details','company-section','client-section','items-section'],
    faqs:[{ q:'What is the difference between a bill and invoice?', a:'A bill is issued at point-of-sale (retail). An invoice is for credit transactions with a due date. Use Bill for shops, Invoice for service businesses.' }],
  },

  certificate: {
    title: 'Free Certificate Generator',
    subtitle: 'Elegant certificates for achievements, courses & appreciation',
    icon: 'fas fa-award', color: '#be185d', bg: '#fdf2f8',
    filename: (d) => `Certificate_${d.recipientName || 'Certificate'}.pdf`,
    templates: [
      { id:1, name:'Pink Elegance', desc:'Achievement', color:'#be185d' },
      { id:2, name:'Gold Border',   desc:'Excellence',  color:'#d97706' },
    ],
    defaults: () => ({
      certificateTitle:'Achievement', recipientName:'Recipient Name',
      description:'has successfully completed the program and demonstrated outstanding excellence.',
      courseName:'Professional Development Course', companyName:'Your Organisation',
      authorizedBy:'Director', date:today(),
    }),
    formSections:['certificate-details'],
    faqs:[
      { q:'Can I generate bulk certificates?', a:'Enter each recipient name and click Download. For batch generation, log in to save each one to history for quick re-generation.' },
      { q:'What sizes are available?', a:'Certificates are generated in landscape A4 format — perfect for printing, framing, or sharing digitally.' },
    ],
  },

  quotation: {
    title: 'Free Quotation Generator',
    subtitle: 'Detailed cost quotations and proposals for clients',
    icon: 'fas fa-file-contract', color: '#7c3aed', bg: '#faf5ff',
    filename: (d) => `Quotation_${d.quotationNumber || 'QUO-001'}.pdf`,
    templates: [{ id:1, name:'Purple Pro', desc:'Business formal', color:'#7c3aed' }],
    defaults: (bp={}) => ({
      quotationNumber:'QUO-001', date:today(), validUntil:daysFromNow(30),
      companyName: bp.companyName || 'Your Company',
      companyAddress: bp.companyAddress || '',
      companyPhone: bp.companyPhone || '', companyEmail: bp.companyEmail || '', companyGST: bp.companyGST || '',
      clientName:'Client Name', clientAddress:'', clientEmail:'',
      items:[{ description:'Product/Service 1', quantity:1, rate:10000, amount:10000 }, { description:'Product/Service 2', quantity:2, rate:5000, amount:10000 }],
      taxRate:18, subtotal:20000, tax:3600, total:23600,
      notes:'This quotation is valid for 30 days from the date of issue.',
    }),
    formSections:['quotation-details','company-section','client-section','items-section'],
    faqs:[],
  },

  estimate: {
    title: 'Free Estimate Generator',
    subtitle: 'Professional project estimates and cost breakdowns',
    icon: 'fas fa-calculator', color: '#d97706', bg: '#fffbeb',
    filename: (d) => `Estimate_${d.estimateNumber || 'EST-001'}.pdf`,
    templates: [{ id:1, name:'Amber Classic', desc:'Project cost', color:'#d97706' }],
    defaults: (bp={}) => ({
      estimateNumber:'EST-001', date:today(), validUntil:daysFromNow(14),
      companyName: bp.companyName || 'Your Company', companyAddress: bp.companyAddress || '',
      clientName:'Client Name', clientAddress:'',
      items:[{ description:'Task 1', quantity:1, rate:8000, amount:8000 }, { description:'Task 2', quantity:3, rate:2000, amount:6000 }],
      taxRate:18, subtotal:14000, tax:2520, total:16520, notes:'',
    }),
    formSections:['estimate-details','company-section','client-section','items-section'],
    faqs:[],
  },

  'offer-letter': {
    title: 'Free Offer Letter Generator',
    subtitle: 'Formal job offer letters for candidates — ready to send',
    icon: 'fas fa-briefcase', color: '#4f46e5', bg: '#eef2ff',
    filename: (d) => `OfferLetter_${d.candidateName || 'Candidate'}.pdf`,
    templates: [{ id:1, name:'Professional Blue', desc:'HR formal', color:'#4f46e5' }],
    defaults: (bp={}) => ({
      date:today(), companyName: bp.companyName || 'Your Company',
      companyAddress: bp.companyAddress || '', companyPhone: bp.companyPhone || '',
      candidateName:'Candidate Name', jobTitle:'Software Engineer', department:'Engineering',
      salary:'₹6,00,000 per annum', joiningDate:daysFromNow(30), hrName:'HR Manager',
      additionalTerms:'This offer is contingent upon successful background verification and submission of required documents.',
    }),
    formSections:['letter-details'],
    faqs:[{ q:'Is this legally valid?', a:'This template follows standard industry format. However, for legally binding employment contracts, consult an HR professional or lawyer.' }],
  },

  'appointment-letter': {
    title: 'Free Appointment Letter Generator',
    subtitle: 'Formal appointment letters for new employees',
    icon: 'fas fa-user-tie', color: '#0e7490', bg: '#ecfeff',
    filename: (d) => `AppointmentLetter_${d.candidateName || 'Employee'}.pdf`,
    templates: [{ id:1, name:'Teal Corporate', desc:'HR formal', color:'#0e7490' }],
    defaults: (bp={}) => ({
      date:today(), companyName: bp.companyName || 'Your Company',
      companyAddress: bp.companyAddress || '',
      candidateName:'Employee Name', jobTitle:'Software Engineer', department:'Engineering',
      salary:'₹6,00,000 per annum', joiningDate:daysFromNow(15),
      location:'Mumbai, MH', hrName:'HR Manager',
      additionalTerms:'You are requested to report on the joining date with all original educational and ID documents.',
    }),
    formSections:['letter-details'],
    faqs:[],
  },

  'id-card': {
    title: 'Free ID Card Generator',
    subtitle: 'Professional employee and student ID cards with barcode',
    icon: 'fas fa-id-card', color: '#dc2626', bg: '#fef2f2',
    filename: (d) => `IDCard_${d.employeeName || 'Employee'}.pdf`,
    templates: [
      { id:1, name:'Blue Corporate', desc:'Employee',  color:'#1e3a8a' },
      { id:2, name:'Green Staff',    desc:'Modern',    color:'#065f46' },
    ],
    defaults: (bp={}) => ({
      companyName: bp.companyName || 'Company Name',
      employeeName:'Employee Name', designation:'Software Engineer',
      department:'Engineering', employeeId:'EMP-001',
      phone:'+91 98765 43210', email:'employee@company.com',
    }),
    formSections:['idcard-details'],
    faqs:[{ q:'What size is the ID card?', a:'Cards render in standard ID card format and are included in an A4 PDF. Print and cut for physical use.' }],
  },

  'event-pass': {
    title: 'Free Event Pass Generator',
    subtitle: 'Event passes with QR code for access control',
    icon: 'fas fa-ticket-alt', color: '#0d9488', bg: '#f0fdfa',
    filename: (d) => `EventPass_${d.passHolder || 'Attendee'}.pdf`,
    templates: [{ id:1, name:'Teal Modern', desc:'Clean event', color:'#0d9488' }],
    defaults: (bp={}) => ({
      eventName:'TechConf 2025', eventDate:today(), venue:'Mumbai Convention Centre',
      companyName: bp.companyName || 'Organiser Name',
      passHolder:'Attendee Name', passType:'VIP', passNumber:'EP-001',
    }),
    formSections:['event-details'],
    faqs:[{ q:'Does the QR code on the pass work for scanning?', a:'Yes! A unique QR code is generated for each pass containing the attendee and event details.' }],
  },
};

/* ── Editor state ─────────────────────────────────────────────── */
let editorState = { docType: null, selectedTemplate: 1, formData: {}, schema: null };

/* ── Render editor page ──────────────────────────────────────── */
function renderEditorPage(docType) {
  const schema = DOC_SCHEMAS[docType];
  if (!schema) { navigate('home'); return; }

  editorState.docType          = docType;
  editorState.schema           = schema;
  editorState.selectedTemplate = 1;
  editorState.formData         = schema.defaults(auth.user?.businessProfile || {});

  // GA4: track template page view
  trackEvent('editor_open', { doc_type: docType });

  const tplCount = schema.templates.length;

  document.getElementById('app').innerHTML = `
  <div class="page-enter">

    <!-- ── Editor top area: breadcrumb + hero banner ── -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a onclick="navigate('home')" class="flex items-center gap-1"><i class="fas fa-home text-xs"></i> Home</a>
        <span class="sep" aria-hidden="true">›</span>
        <span class="text-gray-700 font-semibold">${schema.title}</span>
      </nav>

      <!-- Hero banner -->
      <div style="background:linear-gradient(135deg,${schema.color}f0,${schema.color}a0);border-radius:20px;padding:24px 28px;margin-bottom:16px;color:white" class="flex items-center gap-5 flex-wrap">
        <div style="width:54px;height:54px;background:rgba(255,255,255,0.2);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;box-shadow:0 4px 16px rgba(0,0,0,0.15)">
          <i class="${schema.icon}"></i>
        </div>
        <div class="flex-1 min-w-0">
          <h1 class="text-2xl font-black leading-tight">${schema.title}</h1>
          <p style="font-size:13px;opacity:0.88;margin-top:3px">${schema.subtitle}</p>
        </div>
        <div class="flex items-center gap-2 flex-wrap" style="font-size:11px">
          <span style="background:rgba(255,255,255,0.22);padding:4px 12px;border-radius:100px;font-weight:600"><i class="fas fa-check mr-1.5"></i>100% Free</span>
          <span style="background:rgba(255,255,255,0.22);padding:4px 12px;border-radius:100px;font-weight:600"><i class="fas fa-eye mr-1.5"></i>Live Preview</span>
          <span style="background:rgba(255,255,255,0.22);padding:4px 12px;border-radius:100px;font-weight:600"><i class="fas fa-download mr-1.5"></i>Instant PDF</span>
        </div>
      </div>

      <!-- Top inline ad -->
      ${renderAdInlineBanner(`editor-top-ad-${docType}`)}
    </div>

    <!-- ── Main 3-column grid: form | preview | sidebar ── -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div class="grid grid-cols-1 xl:grid-cols-[420px_1fr_280px] gap-5">

        <!-- ════════════════════════════════════
             LEFT: FORM COLUMN
        ════════════════════════════════════ -->
        <div class="space-y-4" id="form-column">

          <!-- Template selector -->
          <div class="form-section-card">
            <div class="form-section-title">
              <i class="${schema.icon}" style="color:${schema.color}"></i>
              <span>Choose Layout</span>
              <span class="ml-auto text-xs text-gray-400 font-normal">${tplCount} free design${tplCount > 1 ? 's' : ''}</span>
            </div>
            <div class="grid gap-2" style="grid-template-columns:repeat(${Math.min(tplCount, 3)},1fr)">
              ${schema.templates.map(t => `
                <div class="template-card ${editorState.selectedTemplate === t.id ? 'active' : ''}"
                     onclick="selectTemplate(${t.id}, this)" role="button" tabindex="0"
                     aria-pressed="${editorState.selectedTemplate === t.id}">
                  <div class="w-full h-1.5 rounded-full mb-2" style="background:${t.color || schema.color}60"></div>
                  <div class="tpl-check"><i class="fas fa-check text-xs"></i></div>
                  <div class="font-bold text-xs ${editorState.selectedTemplate === t.id ? 'text-blue-700' : 'text-gray-700'}">${t.name}</div>
                  ${t.desc ? `<div class="text-gray-400 mt-0.5" style="font-size:9px">${t.desc}</div>` : ''}
                </div>`).join('')}
            </div>
          </div>

          <!-- Dynamic form sections -->
          <div id="form-sections">${renderFormSections(docType, schema, editorState.formData)}</div>

          <!-- Mid-form ad -->
          ${renderAdInlineBanner(`editor-mid-ad-${docType}`)}

          <!-- Action buttons -->
          <div class="form-section-card">
            <div class="flex flex-wrap gap-2">
              <button onclick="handleDownloadWithAd()" id="download-btn"
                class="btn-primary flex-1 min-w-[160px] justify-center text-sm py-3"
                aria-label="Download PDF">
                <i class="fas fa-download"></i>
                <span id="download-btn-text">Download PDF Free</span>
              </button>
              <button onclick="togglePreviewVisibility()" class="btn-outline px-4" title="Toggle preview" aria-label="Toggle live preview">
                <i class="fas fa-eye" id="preview-toggle-icon"></i>
              </button>
              <button onclick="shareViaWhatsApp({message:'Document from PDFDecor.in — ${escHtmlAttr(schema.title)}'})"
                class="btn-outline px-3 text-green-700 border-green-200 hover:bg-green-50 hover:border-green-400"
                title="Share via WhatsApp" aria-label="Share on WhatsApp">
                <i class="fab fa-whatsapp text-base"></i>
              </button>
              <button onclick="shareViaEmail({subject:'${escHtmlAttr(schema.title)} from PDFDecor'})"
                class="btn-outline px-3" title="Share via Email" aria-label="Share via email">
                <i class="fas fa-envelope"></i>
              </button>
              ${auth.isAuthenticated ? `
              <button onclick="saveCurrentToHistory()"
                class="btn-outline px-3 text-purple-700 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                title="Save to history" aria-label="Save document to history">
                <i class="fas fa-bookmark"></i>
              </button>` : ''}
            </div>
            <div class="mt-3 flex items-center justify-between flex-wrap gap-2">
              <p class="text-xs text-gray-400 flex items-center gap-1.5">
                <i class="fas fa-tint text-orange-400"></i>
                PDF includes "PDFDecor.in" watermark
              </p>
              ${!auth.isAuthenticated ? `
              <a onclick="navigate('login')" class="text-xs text-blue-600 hover:underline cursor-pointer font-semibold">
                <i class="fas fa-user-plus mr-1"></i>Sign in to save
              </a>` : ''}
            </div>
          </div>

          <!-- Editor FAQs -->
          ${schema.faqs && schema.faqs.length > 0 ? `
          <div class="space-y-2">
            <h3 class="font-bold text-gray-700 text-xs uppercase tracking-wider px-1 flex items-center gap-2">
              <i class="fas fa-question-circle text-blue-400"></i> FAQ
            </h3>
            ${schema.faqs.map((faq, i) => `
            <div class="faq-item">
              <button class="faq-question text-sm" onclick="toggleEditorFAQ(${i})">
                ${faq.q} <i class="fas fa-chevron-down text-gray-400 text-xs flex-shrink-0" id="efaq-icon-${i}"></i>
              </button>
              <div class="faq-answer text-sm" id="efaq-answer-${i}">${faq.a}</div>
            </div>`).join('')}
          </div>` : ''}

        </div>

        <!-- ════════════════════════════════════
             CENTRE: LIVE PREVIEW
        ════════════════════════════════════ -->
        <div id="preview-column" class="editor-sticky-preview">
          <!-- Preview header -->
          <div class="bg-white border border-gray-200 rounded-t-2xl px-4 py-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-red-400"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div class="w-3 h-3 rounded-full bg-green-400"></div>
              <span class="text-xs font-semibold text-gray-500 ml-2">Live Preview</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs bg-orange-50 border border-orange-200 text-orange-700 px-2.5 py-1 rounded-full font-semibold">
                <i class="fas fa-tint text-xs mr-1"></i>Watermark in PDF
              </span>
            </div>
          </div>
          <div id="pdf-preview-container" class="rounded-b-2xl">
            <div id="pdf-preview" class="pdf-doc">
              ${renderTemplate(docType, 1, editorState.formData)}
            </div>
          </div>
        </div>

        <!-- ════════════════════════════════════
             RIGHT: SIDEBAR (desktop only)
        ════════════════════════════════════ -->
        <div class="space-y-4 hide-mobile" role="complementary" aria-label="Sidebar">

          <!-- Sidebar ad 1 (300×250) -->
          <div class="ad-sidebar-box">
            <div class="ad-sidebar-header">Advertisement</div>
            <div class="ad-sidebar-body flex-col gap-2">
              <i class="fas fa-ad text-gray-200 text-4xl mb-1"></i>
              <div class="text-gray-400 font-semibold text-xs">Google AdSense</div>
              <div class="text-gray-300 text-xs">300×250 · Replace with<br>real AdSense ins tag</div>
              <!-- Real slot:
              <ins class="adsbygoogle" style="display:inline-block;width:250px;height:250px"
                data-ad-client="ca-pub-XXXX" data-ad-slot="XXXX"></ins>
              <script>(adsbygoogle=window.adsbygoogle||[]).push({});<\/script>
              -->
            </div>
          </div>

          <!-- Other documents quick nav -->
          <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div class="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <i class="fas fa-th text-blue-400"></i> Other Templates
            </div>
            <div class="space-y-0.5">
              ${Object.entries(DOC_SCHEMAS).filter(([k]) => k !== docType).slice(0, 7).map(([k, s]) => `
              <a onclick="navigate('${k}')"
                class="flex items-center gap-2.5 text-xs text-gray-600 hover:text-blue-700 cursor-pointer py-2 px-2 rounded-xl hover:bg-blue-50 transition-colors font-medium">
                <span style="width:26px;height:26px;background:${s.bg};border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                  <i class="${s.icon}" style="color:${s.color};font-size:11px"></i>
                </span>
                ${s.title.replace(' Generator','').replace('Free ','').trim()}
              </a>`).join('')}
            </div>
          </div>

          <!-- Sidebar ad 2 -->
          <div class="ad-sidebar-box">
            <div class="ad-sidebar-header">Advertisement</div>
            <div class="ad-sidebar-body" style="min-height:180px">
              <div class="text-center">
                <i class="fas fa-ad text-gray-200 text-3xl mb-2"></i>
                <div class="text-gray-400 text-xs">300×180 AdSense</div>
              </div>
            </div>
          </div>

          <!-- Save CTA (unauthenticated) -->
          ${!auth.isAuthenticated ? `
          <div class="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-5 text-center text-white">
            <div class="text-2xl mb-2">💾</div>
            <div class="font-bold text-sm mb-1">Save Your Work</div>
            <p class="text-blue-200 text-xs mb-3 leading-relaxed">Create a free account to save documents and re-edit later.</p>
            <button onclick="navigate('login')" class="bg-white text-blue-700 font-black text-xs px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors w-full">
              <i class="fas fa-user-plus mr-1"></i>Free Sign Up
            </button>
          </div>` : ''}

        </div>
      </div>

      <!-- Bottom ad (full width) -->
      <div class="mt-5">${renderAdInlineBanner(`editor-bottom-ad-${docType}`)}</div>
    </div>

    <!-- Mobile sticky download bar -->
    <div class="sticky-download-bar" id="mobile-download-bar">
      <button onclick="handleDownloadWithAd()" class="btn-primary flex-1 justify-center text-sm py-3">
        <i class="fas fa-download"></i> Download Free PDF
      </button>
      <button onclick="scrollToPreview()" class="btn-outline px-4 text-sm">
        <i class="fas fa-eye"></i>
      </button>
    </div>
  </div>`;
}

/* ── Template select ─────────────────────────────────────────── */
function selectTemplate(id, el) {
  editorState.selectedTemplate = id;
  document.querySelectorAll('.template-card').forEach((c, i) => {
    const isActive = i === id - 1 || c === el;
    // Better: check data
  });
  // Re-query for better targeting
  document.querySelectorAll('.template-card').forEach(c => {
    const wasActive = c.classList.contains('active');
    c.classList.remove('active');
    const nameDiv = c.querySelector('div:not(.tpl-check)');
    if (nameDiv) nameDiv.classList.replace('text-blue-700','text-gray-700');
  });
  if (el) {
    el.classList.add('active');
    const nameDiv = el.querySelector('div:not(.tpl-check)');
    if (nameDiv) nameDiv.classList.replace('text-gray-700','text-blue-700');
  }
  refreshPreview();
}

/* ── Form sections renderer ─────────────────────────────────── */
function renderFormSections(docType, schema, data) {
  return (schema.formSections || []).map(sec => renderFormSection(docType, sec, data)).join('');
}

function renderFormSection(docType, section, data) {
  // Helper: text input row
  const inp = (field, label, type = 'text', placeholder = '') => `
    <div>
      <label class="form-label" for="field-${field}">${label}</label>
      <input class="form-input" id="field-${field}" type="${type}" value="${escHtml(data[field] || '')}"
        oninput="updateField('${field}', this.value)" placeholder="${placeholder}" autocomplete="off">
    </div>`;

  switch (section) {
    // ── Invoice ──────────────────────────────────────────────
    case 'invoice-details':
      return `<div class="form-section-card space-y-3">
        <h3 class="form-section-title"><i class="fas fa-hashtag text-blue-400 text-xs"></i> Invoice Details</h3>
        <div class="grid grid-cols-2 gap-3">
          ${inp('invoiceNumber','Invoice #','text','INV-001')}
          ${inp('date','Invoice Date','date')}
          ${inp('dueDate','Due Date','date')}
          <div>
            <label class="form-label" for="field-taxRate">Tax Rate (%)</label>
            <select class="form-input" id="field-taxRate" onchange="updateTaxRate(this.value)">
              ${[0, 5, 12, 18, 28].map(r => `<option value="${r}" ${(data.taxRate||18)==r?'selected':''}>${r}% GST</option>`).join('')}
              <option value="${data.taxRate}" ${![0,5,12,18,28].includes(Number(data.taxRate))?'selected':''}>Custom</option>
            </select>
          </div>
        </div>
      </div>`;

    // ── Receipt ───────────────────────────────────────────────
    case 'receipt-details':
      return `<div class="form-section-card space-y-3">
        <h3 class="form-section-title"><i class="fas fa-receipt text-green-500 text-xs"></i> Receipt Details</h3>
        <div class="grid grid-cols-2 gap-3">
          ${inp('receiptNumber','Receipt #')}
          ${inp('date','Date','date')}
          ${inp('amount','Amount (₹)','number','0')}
          <div>
            <label class="form-label">Payment Method</label>
            <select class="form-input" onchange="updateField('paymentMethod',this.value)">
              ${['UPI','Cash','NEFT','RTGS','Cheque','Credit Card','Debit Card','Bank Transfer'].map(m => `<option ${data.paymentMethod===m?'selected':''}>${m}</option>`).join('')}
            </select>
          </div>
        </div>
        ${inp('description','Description','text','Payment for services rendered')}
      </div>`;

    // ── Bill ─────────────────────────────────────────────────
    case 'bill-details':
      return `<div class="form-section-card space-y-3">
        <h3 class="form-section-title"><i class="fas fa-file-alt text-orange-500 text-xs"></i> Bill Details</h3>
        <div class="grid grid-cols-2 gap-3">
          ${inp('billNumber','Bill #')}
          ${inp('date','Date','date')}
          <div>
            <label class="form-label">Tax Rate (%)</label>
            <select class="form-input" onchange="updateTaxRate(this.value)">
              ${[0, 5, 12, 18, 28].map(r => `<option value="${r}" ${(data.taxRate||18)==r?'selected':''}>${r}% GST</option>`).join('')}
            </select>
          </div>
        </div>
      </div>`;

    // ── Quotation ─────────────────────────────────────────────
    case 'quotation-details':
      return `<div class="form-section-card space-y-3">
        <h3 class="form-section-title"><i class="fas fa-file-contract text-purple-500 text-xs"></i> Quotation Details</h3>
        <div class="grid grid-cols-2 gap-3">
          ${inp('quotationNumber','Quotation #')}
          ${inp('date','Date','date')}
          ${inp('validUntil','Valid Until','date')}
          <div>
            <label class="form-label">Tax Rate (%)</label>
            <select class="form-input" onchange="updateTaxRate(this.value)">
              ${[0, 5, 12, 18, 28].map(r => `<option value="${r}" ${(data.taxRate||18)==r?'selected':''}>${r}% GST</option>`).join('')}
            </select>
          </div>
        </div>
      </div>`;

    // ── Estimate ─────────────────────────────────────────────
    case 'estimate-details':
      return `<div class="form-section-card space-y-3">
        <h3 class="form-section-title"><i class="fas fa-calculator text-yellow-500 text-xs"></i> Estimate Details</h3>
        <div class="grid grid-cols-2 gap-3">
          ${inp('estimateNumber','Estimate #')}
          ${inp('date','Date','date')}
          ${inp('validUntil','Valid Until','date')}
          <div>
            <label class="form-label">Tax Rate (%)</label>
            <select class="form-input" onchange="updateTaxRate(this.value)">
              ${[0, 5, 12, 18, 28].map(r => `<option value="${r}" ${(data.taxRate||18)==r?'selected':''}>${r}% GST</option>`).join('')}
            </select>
          </div>
        </div>
      </div>`;

    // ── Company section ───────────────────────────────────────
    case 'company-section':
      return `<div class="form-section-card space-y-3">
        <h3 class="form-section-title"><i class="fas fa-building text-blue-400 text-xs"></i> Your Business</h3>

        <!-- Logo Upload -->
        <div>
          <label class="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Company Logo <span class="text-gray-400 font-normal normal-case">(optional)</span></label>
          <div class="flex items-center gap-3">
            <div id="logo-preview-wrap" class="w-12 h-12 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden flex-shrink-0">
              ${data.logo ? `<img id="logo-preview-img" src="${data.logo}" class="w-full h-full object-contain p-1">` : `<i id="logo-preview-icon" class="fas fa-image text-gray-300 text-lg"></i>`}
            </div>
            <div class="flex-1 space-y-1.5">
              <label class="cursor-pointer inline-flex items-center gap-2 text-xs font-bold px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors border border-blue-200">
                <i class="fas fa-upload text-xs"></i> Upload Logo
                <input type="file" accept="image/*" class="hidden" onchange="handleLogoUpload(this)">
              </label>
              ${inp('logo','Or paste logo URL','url','https://yoursite.com/logo.png')}
            </div>
          </div>
          ${data.logo ? `<button onclick="removeLogo()" class="text-xs text-red-500 hover:text-red-700 mt-1 flex items-center gap-1 transition-colors"><i class="fas fa-times-circle"></i> Remove logo</button>` : ''}
        </div>

        ${inp('companyName','Company / Business Name','text','Acme Pvt Ltd')}
        ${inp('companyAddress','Address','text','123 Business St, City, State PIN')}
        <div class="grid grid-cols-2 gap-3">
          ${inp('companyPhone','Phone','tel','+91 98765 43210')}
          ${inp('companyEmail','Email','email','contact@company.com')}
        </div>
        ${inp('companyGST','GSTIN (optional)','text','22AAAAA0000A1Z5')}
      </div>`;

    // ── Client section ────────────────────────────────────────
    case 'client-section':
      return `<div class="form-section-card space-y-3">
        <h3 class="form-section-title"><i class="fas fa-user text-indigo-400 text-xs"></i> Client / Customer</h3>
        ${inp('clientName','Name','text','Client Name')}
        ${inp('clientAddress','Address','text','Address, City, State PIN')}
        <div class="grid grid-cols-2 gap-3">
          ${inp('clientPhone','Phone','tel','+91 98765 12345')}
          ${inp('clientEmail','Email','email','client@example.com')}
        </div>
        ${inp('clientGST','Client GSTIN (optional)','text','')}
      </div>`;

    // ── Payer section ─────────────────────────────────────────
    case 'payer-section':
      return `<div class="form-section-card space-y-3">
        <h3 class="form-section-title"><i class="fas fa-hand-holding-usd text-green-500 text-xs"></i> Payer Details</h3>
        ${inp('payerName','Payer Name','text','Payer Name')}
        ${inp('payerAddress','Address')}
        ${inp('payerEmail','Email','email','payer@example.com')}
      </div>`;

    // ── Items section ─────────────────────────────────────────
    case 'items-section':
      return `<div class="form-section-card" id="items-section">
        <div class="flex items-center justify-between mb-3">
          <h3 class="form-section-title mb-0"><i class="fas fa-list text-gray-400 text-xs"></i> Line Items</h3>
          <button onclick="addItem()" class="btn-outline text-xs py-1.5 px-3 h-8">
            <i class="fas fa-plus text-xs"></i> Add Row
          </button>
        </div>
        <div class="overflow-x-auto -mx-1 px-1">
          <table class="items-table w-full" role="table" aria-label="Invoice items">
            <thead><tr>
              <th style="text-align:left;width:44%">Description</th>
              <th style="text-align:center;width:12%">Qty</th>
              <th style="text-align:right;width:20%">Rate (₹)</th>
              <th style="text-align:right;width:18%">Amount</th>
              <th style="width:6%"></th>
            </tr></thead>
            <tbody id="items-tbody">${renderItemRows(data.items || [])}</tbody>
          </table>
        </div>
        <div class="flex justify-end mt-4">
          <div class="totals-box">
            <div class="totals-row"><span>Subtotal</span><span id="subtotal-display" class="font-semibold">${formatCurrency(data.subtotal||0)}</span></div>
            <div class="totals-row"><span>Tax (${data.taxRate||18}%)</span><span id="tax-display">${formatCurrency(data.tax||0)}</span></div>
            <div class="totals-row total"><span>Total</span><span id="total-display" class="text-blue-700">${formatCurrency(data.total||0)}</span></div>
          </div>
        </div>
        <div class="mt-4">
          <label class="form-label">Notes (optional)</label>
          <textarea class="form-input" rows="2"
            oninput="updateField('notes',this.value)"
            placeholder="Payment terms, delivery details, thank you note…">${escHtml(data.notes||'')}</textarea>
        </div>
      </div>`;

    // ── Payment section ───────────────────────────────────────
    case 'payment-section':
      return `<div class="form-section-card space-y-3">
        <h3 class="form-section-title"><i class="fas fa-university text-green-500 text-xs"></i> Payment Info <span class="text-xs font-normal text-gray-400">(optional)</span></h3>
        <div class="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700 flex items-start gap-2">
          <i class="fas fa-qrcode mt-0.5 flex-shrink-0"></i>
          <span>Enter your <strong>UPI ID</strong> below — a scannable QR code will auto-appear in the invoice.</span>
        </div>
        ${inp('upiId','UPI ID (generates QR)','text','yourname@upi')}
        <div class="grid grid-cols-2 gap-3">
          ${inp('bankName','Bank Name','text','HDFC Bank')}
          ${inp('bankAccount','Account Number')}
          ${inp('bankIFSC','IFSC Code','text','HDFC0001234')}
          ${inp('bankBranch','Branch')}
        </div>
      </div>`;

    // ── Certificate ───────────────────────────────────────────
    case 'certificate-details':
      return `<div class="form-section-card space-y-3">
        <h3 class="form-section-title"><i class="fas fa-award text-pink-500 text-xs"></i> Certificate Details</h3>
        ${inp('certificateTitle','Certificate For','text','Achievement')}
        ${inp('recipientName','Recipient Name','text','Full Name')}
        ${inp('courseName','Course / Program Name','text','Professional Development')}
        <div>
          <label class="form-label">Description</label>
          <textarea class="form-input" rows="2"
            oninput="updateField('description',this.value)"
            placeholder="has successfully completed…">${escHtml(data.description||'')}</textarea>
        </div>
        ${inp('companyName','Issuing Organisation','text','Your Organisation')}
        ${inp('authorizedBy','Authorized By / Signatory','text','Director')}
        ${inp('date','Issue Date','date')}
      </div>`;

    // ── Letter ────────────────────────────────────────────────
    case 'letter-details':
      return `<div class="form-section-card space-y-3">
        <h3 class="form-section-title"><i class="fas fa-envelope-open-text text-indigo-500 text-xs"></i> Letter Details</h3>
        <div class="grid grid-cols-2 gap-3">
          ${inp('companyName','Company Name','text','Acme Pvt Ltd')}
          ${inp('companyPhone','Company Phone','tel','+91 98765 43210')}
        </div>
        ${inp('companyAddress','Company Address')}
        <div class="border-t border-gray-100 pt-3 grid grid-cols-2 gap-3">
          ${inp('candidateName','Candidate / Employee Name')}
          ${inp('jobTitle','Job Title / Designation','text','Software Engineer')}
          ${inp('department','Department','text','Engineering')}
          ${inp('salary','Salary / CTC','text','₹6,00,000 per annum')}
        </div>
        ${inp('joiningDate','Joining Date','date')}
        ${inp('hrName','HR Name / Authorized By','text','HR Manager')}
        <div>
          <label class="form-label">Additional Terms & Conditions</label>
          <textarea class="form-input" rows="3"
            oninput="updateField('additionalTerms',this.value)">${escHtml(data.additionalTerms||'')}</textarea>
        </div>
        ${inp('date','Letter Date','date')}
      </div>`;

    // ── ID Card ───────────────────────────────────────────────
    case 'idcard-details':
      return `<div class="form-section-card space-y-3">
        <h3 class="form-section-title"><i class="fas fa-id-card text-red-500 text-xs"></i> ID Card Details</h3>
        ${inp('companyName','Company / Institution Name','text','Company Name')}
        ${inp('employeeName','Employee / Student Name','text','Full Name')}
        <div class="grid grid-cols-2 gap-3">
          ${inp('designation','Designation / Role','text','Software Engineer')}
          ${inp('department','Department','text','Engineering')}
          ${inp('employeeId','ID / Emp Number','text','EMP-001')}
          ${inp('phone','Phone','tel','+91 98765 43210')}
        </div>
        ${inp('email','Email','email','employee@company.com')}
      </div>`;

    // ── Event Pass ────────────────────────────────────────────
    case 'event-details':
      return `<div class="form-section-card space-y-3">
        <h3 class="form-section-title"><i class="fas fa-ticket-alt text-teal-500 text-xs"></i> Event Details</h3>
        ${inp('eventName','Event Name','text','TechConf 2025')}
        <div class="grid grid-cols-2 gap-3">
          ${inp('eventDate','Event Date','date')}
          ${inp('venue','Venue','text','Mumbai Convention Centre')}
        </div>
        ${inp('companyName','Organiser Name','text','Event Organiser')}
        ${inp('passHolder','Attendee Name','text','Attendee Full Name')}
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="form-label">Pass Type</label>
            <select class="form-input" onchange="updateField('passType',this.value)">
              ${['General','VIP','VVIP','Speaker','Staff','Media','Sponsor'].map(t => `<option ${data.passType===t?'selected':''}>${t}</option>`).join('')}
            </select>
          </div>
          ${inp('passNumber','Pass Number','text','EP-001')}
        </div>
      </div>`;

    default: return '';
  }
}

/* ── Item rows ───────────────────────────────────────────────── */
function renderItemRows(items) {
  return items.map((it, i) => `
    <tr id="item-row-${i}" class="group">
      <td>
        <input type="text" value="${escHtml(it.description||'')}"
          oninput="updateItem(${i},'description',this.value)"
          placeholder="Item description" aria-label="Item ${i+1} description">
      </td>
      <td>
        <input type="number" value="${it.quantity||1}" min="0"
          oninput="updateItem(${i},'quantity',this.value)"
          style="text-align:center" aria-label="Quantity">
      </td>
      <td>
        <input type="number" value="${it.rate||0}" min="0"
          oninput="updateItem(${i},'rate',this.value)"
          style="text-align:right" aria-label="Rate">
      </td>
      <td style="text-align:right;padding:6px 8px;font-size:12.5px;font-weight:700;color:#374151"
          id="item-amount-${i}">${formatCurrency(it.amount||0)}</td>
      <td style="text-align:center">
        <button onclick="removeItem(${i})" class="items-remove-btn" aria-label="Remove row ${i+1}">
          <i class="fas fa-times"></i>
        </button>
      </td>
    </tr>`).join('');
}

/* ── Field update handlers ───────────────────────────────────── */
function updateField(field, value) {
  editorState.formData[field] = value;
  refreshPreview();
}

function updateTaxRate(value) {
  editorState.formData.taxRate = parseFloat(value) || 0;
  recalcItems();
  refreshPreview();
}

function updateItem(index, field, value) {
  const item = editorState.formData.items?.[index];
  if (!item) return;
  if (field === 'description') { item.description = value; }
  else {
    item[field] = parseFloat(value) || 0;
    if (field === 'quantity' || field === 'rate') {
      item.amount = (item.quantity || 0) * (item.rate || 0);
      const amtEl = document.getElementById(`item-amount-${index}`);
      if (amtEl) amtEl.textContent = formatCurrency(item.amount);
    }
  }
  recalcItems();
  refreshPreview();
}

function recalcItems() {
  const items    = editorState.formData.items || [];
  const subtotal = items.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0);
  const taxRate  = parseFloat(editorState.formData.taxRate) || 0;
  const tax      = subtotal * (taxRate / 100);
  const total    = subtotal + tax;
  Object.assign(editorState.formData, { subtotal, tax, total });

  const sd = document.getElementById('subtotal-display');
  const td = document.getElementById('tax-display');
  const ttl = document.getElementById('total-display');
  if (sd) sd.textContent = formatCurrency(subtotal);
  if (td) td.textContent = formatCurrency(tax);
  if (ttl) ttl.textContent = formatCurrency(total);

  // Update tax rate label in totals
  const taxRow = td?.closest('.totals-row');
  if (taxRow) taxRow.querySelector('span:first-child').textContent = `Tax (${taxRate}%)`;
}

function addItem() {
  if (!editorState.formData.items) editorState.formData.items = [];
  editorState.formData.items.push({ description:'New Item', quantity:1, rate:0, amount:0 });
  const tbody = document.getElementById('items-tbody');
  if (tbody) tbody.innerHTML = renderItemRows(editorState.formData.items);
  recalcItems();
  refreshPreview();
}

function removeItem(index) {
  if ((editorState.formData.items || []).length <= 1) {
    showToast('At least one item is required.', 'default');
    return;
  }
  editorState.formData.items.splice(index, 1);
  const tbody = document.getElementById('items-tbody');
  if (tbody) tbody.innerHTML = renderItemRows(editorState.formData.items);
  recalcItems();
  refreshPreview();
}

/* ── Preview ─────────────────────────────────────────────────── */
let _previewTimer = null;
function refreshPreview() {
  clearTimeout(_previewTimer);
  _previewTimer = setTimeout(() => {
    const el = document.getElementById('pdf-preview');
    if (el) el.innerHTML = renderTemplate(editorState.docType, editorState.selectedTemplate, editorState.formData);
  }, 80);
}

function togglePreviewVisibility() {
  const col  = document.getElementById('preview-column');
  const icon = document.getElementById('preview-toggle-icon');
  if (!col) return;
  const isHidden = col.style.display === 'none';
  col.style.display = isHidden ? '' : 'none';
  if (icon) icon.className = isHidden ? 'fas fa-eye-slash' : 'fas fa-eye';
}

function scrollToPreview() {
  const col = document.getElementById('preview-column');
  if (col) col.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Download with interstitial ad ──────────────────────────── */
function handleDownloadWithAd() {
  // Make sure preview is visible for capture
  const col = document.getElementById('preview-column');
  if (col && col.style.display === 'none') col.style.display = '';

  const schema   = editorState.schema;
  const filename = schema.filename(editorState.formData);

  showInterstitialAd(async () => {
    const btn     = document.getElementById('download-btn');
    const btnText = document.getElementById('download-btn-text');
    const mobileBtn = document.querySelector('#mobile-download-bar .btn-primary');

    if (btn) btn.disabled = true;
    if (mobileBtn) mobileBtn.disabled = true;
    if (btnText) btnText.innerHTML = '<span class="spinner"></span> Generating PDF…';

    await new Promise(r => setTimeout(r, 200));

    await generatePDF('pdf-preview', filename);

    if (auth.isAuthenticated) {
      auth.savePDFToHistory({
        type: editorState.docType,
        templateId: editorState.selectedTemplate,
        data: { ...editorState.formData },
        title: filename.replace('.pdf',''),
      });
      auth.trackGeneration('pdf');
    }

    if (btn) btn.disabled = false;
    if (mobileBtn) mobileBtn.disabled = false;
    if (btnText) btnText.innerHTML = '<i class="fas fa-download"></i> Download PDF Free';
    showToast('PDF downloaded successfully! 🎉', 'success');
    // GA4 tracking
    trackEvent('editor_pdf_download', { doc_type: editorState.docType, template_id: editorState.selectedTemplate });
  });
}

function saveCurrentToHistory() {
  if (!auth.isAuthenticated) { navigate('login'); return; }
  const schema   = editorState.schema;
  const filename = schema.filename(editorState.formData);
  auth.savePDFToHistory({
    type: editorState.docType,
    templateId: editorState.selectedTemplate,
    data: { ...editorState.formData },
    title: filename.replace('.pdf',''),
  });
  showToast('Document saved to history!', 'success');
}

/* ── Logo upload (local file → base64) ──────────────────────── */
function handleLogoUpload(input) {
  const file = input.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('Please select an image file.', 'error'); return; }
  if (file.size > 2 * 1024 * 1024) { showToast('Logo must be under 2MB.', 'error'); return; }

  const reader = new FileReader();
  reader.onload = (e) => {
    const base64 = e.target.result;
    // Store in formData
    editorState.formData.logo = base64;

    // Update preview thumbnail
    const wrap = document.getElementById('logo-preview-wrap');
    const icon = document.getElementById('logo-preview-icon');
    if (icon) icon.remove();
    if (wrap) {
      let img = document.getElementById('logo-preview-img');
      if (!img) { img = document.createElement('img'); img.id = 'logo-preview-img'; img.className = 'w-full h-full object-contain p-1'; wrap.appendChild(img); }
      img.src = base64;
    }

    // Refresh preview
    refreshPreview();
    showToast('Logo uploaded ✓', 'success');
    trackEvent('logo_uploaded', { doc_type: editorState.docType });
  };
  reader.readAsDataURL(file);
}

function removeLogo() {
  editorState.formData.logo = '';
  // Re-render company section
  const section = document.querySelector('[data-section="company-section"]');
  if (section) section.outerHTML = renderFormSection('company-section', editorState.formData);
  refreshPreview();
  showToast('Logo removed', 'info');
}

/* ── Editor FAQ toggle ───────────────────────────────────────── */
function toggleEditorFAQ(i) {
  const answer = document.getElementById(`efaq-answer-${i}`);
  const icon   = document.getElementById(`efaq-icon-${i}`);
  if (!answer) return;
  const isOpen = answer.classList.contains('open');
  document.querySelectorAll('[id^="efaq-answer-"]').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('[id^="efaq-icon-"]').forEach(ic => ic.style.transform = '');
  if (!isOpen) {
    answer.classList.add('open');
    if (icon) icon.style.transform = 'rotate(180deg)';
  }
}

/* ── Helpers ─────────────────────────────────────────────────── */
function today()         { return new Date().toISOString().split('T')[0]; }
function daysFromNow(n)  { return new Date(Date.now() + n*24*3600*1000).toISOString().split('T')[0]; }
function escHtml(str)    { return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function escHtmlAttr(s)  { return String(s||'').replace(/'/g,'&#39;').replace(/"/g,'&quot;'); }

function getDocTypeIcon(type) {
  return {
    invoice:'fas fa-file-invoice', receipt:'fas fa-receipt', bill:'fas fa-file-alt',
    certificate:'fas fa-award', quotation:'fas fa-file-contract', estimate:'fas fa-calculator',
    'offer-letter':'fas fa-briefcase', 'appointment-letter':'fas fa-user-tie',
    'id-card':'fas fa-id-card', 'event-pass':'fas fa-ticket-alt'
  }[type] || 'fas fa-file';
}
function getDocTypeColor(type) {
  return {
    invoice:'#2563eb', receipt:'#059669', bill:'#ea580c', certificate:'#be185d',
    quotation:'#7c3aed', estimate:'#d97706', 'offer-letter':'#4f46e5',
    'appointment-letter':'#0e7490', 'id-card':'#dc2626', 'event-pass':'#0d9488'
  }[type] || '#6b7280';
}
function getDocTypeBg(type) {
  return {
    invoice:'#eff6ff', receipt:'#f0fdf4', bill:'#fff7ed', certificate:'#fdf2f8',
    quotation:'#faf5ff', estimate:'#fffbeb', 'offer-letter':'#eef2ff',
    'appointment-letter':'#ecfeff', 'id-card':'#fef2f2', 'event-pass':'#f0fdfa'
  }[type] || '#f9fafb';
}
