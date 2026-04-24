/**
 * static-pages.js — About, Help, Privacy, Terms
 */

/* ════════════════════════════════════════════════════════════════
   ABOUT PAGE
════════════════════════════════════════════════════════════════ */
function renderAboutPage() {
  document.getElementById('app').innerHTML = `
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 page-enter">

    ${renderAdInlineBanner('about-top-ad')}

    <!-- Hero -->
    <div class="text-center my-12">
      <div class="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl">
        <i class="fas fa-file-pdf text-white text-2xl"></i>
      </div>
      <div class="section-tag mb-3"><i class="fas fa-info-circle"></i> About Us</div>
      <h1 class="text-4xl font-black text-gray-900 mb-3">About PDFDecor</h1>
      <p class="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">The completely free PDF generator built for Indian businesses, freelancers, HR teams, and professionals.</p>
    </div>

    <!-- Mission & difference -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
          <i class="fas fa-bullseye text-blue-600"></i>
        </div>
        <h2 class="text-xl font-black text-gray-900 mb-3">Our Mission</h2>
        <p class="text-gray-600 leading-relaxed mb-3 text-sm">PDFDecor was built to make professional document creation free for every Indian business — from a corner shop to a large enterprise. Everyone deserves great-looking invoices, certificates, and official letters at zero cost.</p>
        <p class="text-gray-600 leading-relaxed text-sm">Everything runs in your browser. No servers. No data collection. No hidden charges. Forever free.</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div class="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
          <i class="fas fa-star text-purple-600"></i>
        </div>
        <h2 class="text-xl font-black text-gray-900 mb-3">What Makes Us Different</h2>
        <div class="space-y-3">
          ${[
            { icon:'fas fa-bolt text-yellow-500',     text:'<strong>Instant</strong> — PDF in under 3 seconds, no waiting or queuing' },
            { icon:'fas fa-lock text-green-500',       text:'<strong>Private</strong> — Data stays in your browser, never uploaded' },
            { icon:'fas fa-rupee-sign text-blue-500',  text:'<strong>Free Forever</strong> — No paid plans, no premium tiers, no fees' },
            { icon:'fas fa-flag text-orange-500',      text:'<strong>India-first</strong> — GST, UPI QR, Indian number formatting (₹)' },
          ].map(f => `
          <div class="flex items-start gap-3">
            <i class="${f.icon} mt-0.5 flex-shrink-0 text-sm"></i>
            <p class="text-sm text-gray-600">${f.text}</p>
          </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- How we stay free -->
    <div class="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-6 mb-8">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
          <i class="fas fa-heart text-red-500"></i>
        </div>
        <div>
          <h2 class="text-lg font-black text-gray-900 mb-2">How We Stay Free</h2>
          <p class="text-sm text-gray-600 leading-relaxed">PDFDecor is funded by non-intrusive advertisements (Google AdSense) shown on the site, and a small "PDFDecor.in" watermark on downloaded PDFs. This lets us keep all features completely free for everyone — no paywalls, no subscriptions, no per-document fees.</p>
        </div>
      </div>
    </div>

    <!-- Document types grid -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm">
      <h2 class="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
        <i class="fas fa-th-large text-blue-500"></i> 10 Free Document Types
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
        ${[
          ['fas fa-file-invoice','Invoice','invoice','#2563eb'],
          ['fas fa-receipt','Receipt','receipt','#059669'],
          ['fas fa-file-alt','Bill','bill','#ea580c'],
          ['fas fa-file-contract','Quotation','quotation','#7c3aed'],
          ['fas fa-calculator','Estimate','estimate','#d97706'],
          ['fas fa-award','Certificate','certificate','#be185d'],
          ['fas fa-briefcase','Offer Letter','offer-letter','#4f46e5'],
          ['fas fa-user-tie','Appointment','appointment-letter','#0e7490'],
          ['fas fa-id-card','ID Card','id-card','#dc2626'],
          ['fas fa-ticket-alt','Event Pass','event-pass','#0d9488'],
        ].map(([icon, label, route, color]) => `
        <button onclick="navigate('${route}')"
          class="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all">
          <i class="${icon} text-xl" style="color:${color}"></i>
          <span class="text-xs font-semibold text-gray-700 text-center">${label}</span>
        </button>`).join('')}
      </div>
    </div>

    <!-- CTA -->
    <div style="background:linear-gradient(135deg,#1e3a8a,#2563eb,#7c3aed);border-radius:24px;padding:44px 40px;text-align:center;position:relative;overflow:hidden">
      <div style="position:absolute;top:-30px;right:-30px;width:120px;height:120px;background:rgba(255,255,255,0.05);border-radius:50%"></div>
      <h2 class="text-2xl font-black text-white mb-3">Start Creating Today</h2>
      <p class="text-blue-200 mb-6 text-sm max-w-md mx-auto">No signup. No credit card. No hassle. 10 document types, beautiful templates, instant PDF download.</p>
      <button onclick="navigate('home')"
        class="bg-white text-blue-700 px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5">
        <i class="fas fa-arrow-right mr-2"></i>Get Started Free
      </button>
    </div>

  </div>`;
}

/* ════════════════════════════════════════════════════════════════
   HELP PAGE
════════════════════════════════════════════════════════════════ */
function renderHelpPage() {
  document.getElementById('app').innerHTML = `
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 page-enter">

    ${renderAdInlineBanner('help-top-ad')}

    <div class="text-center my-10">
      <div class="section-tag mb-3"><i class="fas fa-life-ring"></i> Support</div>
      <h1 class="text-4xl font-black text-gray-900 mb-3">Help Center</h1>
      <p class="text-gray-500">Answers to the most common questions about PDFDecor</p>
    </div>

    <!-- Quick links -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
      ${[
        { icon:'fas fa-file-invoice', label:'Create Invoice',   route:'invoice',     color:'#2563eb', bg:'#eff6ff' },
        { icon:'fas fa-award',        label:'Certificate',       route:'certificate', color:'#be185d', bg:'#fdf2f8' },
        { icon:'fas fa-id-card',      label:'ID Card',           route:'id-card',     color:'#dc2626', bg:'#fef2f2' },
        { icon:'fas fa-ticket-alt',   label:'Event Pass',        route:'event-pass',  color:'#0d9488', bg:'#f0fdfa' },
      ].map(q => `
      <button onclick="navigate('${q.route}')"
        class="bg-white border border-gray-100 rounded-2xl p-5 text-center hover:shadow-md hover:border-blue-200 transition-all group">
        <div style="width:44px;height:44px;background:${q.bg};border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 10px" class="group-hover:scale-110 transition-transform">
          <i class="${q.icon}" style="color:${q.color};font-size:18px"></i>
        </div>
        <div class="text-xs font-bold text-gray-700">${q.label}</div>
      </button>`).join('')}
    </div>

    ${renderAdInlineBanner('help-mid-ad')}

    <!-- FAQ list -->
    <div class="space-y-3 mt-8">
      ${[
        { q:'How do I create a PDF?',           a:'Choose a document type from the home page or navigation (e.g. Invoice). Fill in your details — the preview updates live. Click "Download PDF Free" when ready.' },
        { q:'Why does my PDF have a watermark?', a:'PDFDecor is 100% free. To keep the service running, PDFs include a small "PDFDecor.in" watermark at the bottom. This helps us cover costs while keeping all features free for everyone.' },
        { q:'How does the UPI QR code work?',    a:'Open the Invoice generator, scroll to "Payment Info", and enter your UPI ID (e.g. yourname@upi). The template automatically generates a scannable QR code in the preview.' },
        { q:'Can I save and re-edit documents?', a:'Yes! Create a free account (optional — no credit card needed). Your downloaded PDFs are auto-saved to history. You can re-open them, edit, and re-download anytime.' },
        { q:'Is my data safe?',                  a:'100% yes. All data stays in your browser\'s localStorage. Nothing is ever sent to any server. Your GST number, client details, and business information are completely private on your device.' },
        { q:'Does it work on mobile phones?',    a:'Yes! PDFDecor is fully responsive and works on smartphones, tablets, and desktops. The editor adapts to all screen sizes.' },
        { q:'Can I use it without signing up?',  a:'Absolutely. Create and download any document without an account. Login is completely optional — only needed to save documents for later re-editing.' },
        { q:'What quality are the PDFs?',        a:'PDFs are generated at 2.5× screen resolution in A4 format (210 × 297mm) — perfect for printing, emailing, and digital sharing. A JPEG compression of 92% is used for optimal quality and file size.' },
        { q:'Can I add my own logo?',            a:'Yes! You can upload a logo from your device (JPG, PNG, under 2MB) or paste a logo URL in the Company section of the editor. Your logo appears on all documents instantly.' },
        { q:'What is the ad before download?',   a:'PDFDecor shows a 5-second advertisement before downloading your PDF. This helps us keep the service completely free. You can click "Skip Ad" after 3 seconds.' },
      ].map((faq, i) => `
      <div class="faq-item">
        <button class="faq-question" onclick="toggleHelpFAQ(${i})">
          ${faq.q}
          <i class="fas fa-chevron-down text-gray-400 text-xs flex-shrink-0" id="hfaq-icon-${i}"></i>
        </button>
        <div class="faq-answer" id="hfaq-answer-${i}">${faq.a}</div>
      </div>`).join('')}
    </div>

    <!-- Contact -->
    <div class="mt-10 bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
      <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
        <i class="fas fa-envelope text-blue-600"></i>
      </div>
      <p class="text-gray-600 mb-4 text-sm">Still have questions? We're here to help.</p>
      <a href="mailto:support@pdfdecor.in" class="btn-primary text-sm">
        <i class="fas fa-envelope"></i> support@pdfdecor.in
      </a>
    </div>

  </div>`;
}

function toggleHelpFAQ(i) {
  const a    = document.getElementById(`hfaq-answer-${i}`);
  const icon = document.getElementById(`hfaq-icon-${i}`);
  if (!a) return;
  const isOpen = a.classList.contains('open');
  document.querySelectorAll('[id^="hfaq-answer-"]').forEach(x => x.classList.remove('open'));
  document.querySelectorAll('[id^="hfaq-icon-"]').forEach(x => x.style.transform = '');
  if (!isOpen) {
    a.classList.add('open');
    if (icon) icon.style.transform = 'rotate(180deg)';
  }
}

/* ════════════════════════════════════════════════════════════════
   PRIVACY POLICY
════════════════════════════════════════════════════════════════ */
function renderPrivacyPage() {
  document.getElementById('app').innerHTML = `
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 page-enter">

    <div class="mb-8">
      <div class="section-tag mb-3"><i class="fas fa-shield-alt"></i> Legal</div>
      <h1 class="text-3xl font-black text-gray-900 mb-2">Privacy Policy</h1>
      <p class="text-sm text-gray-400">Last updated: January 1, 2025</p>
    </div>

    <div class="bg-green-50 border border-green-200 rounded-2xl p-4 mb-8 flex items-start gap-3">
      <i class="fas fa-lock text-green-600 mt-0.5 flex-shrink-0"></i>
      <div>
        <strong class="text-green-800 text-sm">TL;DR:</strong>
        <span class="text-green-700 text-sm"> Your data stays in your browser. We never store your documents or personal information on any server.</span>
      </div>
    </div>

    <div class="space-y-6 text-gray-600 text-sm">
      ${ppSection('1. Data Storage',
        'PDFDecor stores all document data exclusively in your browser\'s <code class="bg-gray-100 px-1 rounded text-xs">localStorage</code>. Your company names, client details, GSTIN, invoice amounts, and all other document data is never transmitted to any server. It exists only in your local browser storage.'
      )}
      ${ppSection('2. Advertising',
        'We display advertisements via Google AdSense to keep PDFDecor completely free. AdSense may use cookies and data for ad personalisation based on your browsing activity. You can opt out via <a href="https://myadcenter.google.com" target="_blank" rel="noopener" class="text-blue-600 underline">Google\'s Ad Settings</a>. Ads are shown to all visitors regardless of login status.'
      )}
      ${ppSection('3. Account Data',
        'If you create an optional account, your email address and password are stored locally in your browser\'s localStorage. We do not run a backend server or user database. Your account exists only in your browser — clearing browser data removes it permanently.'
      )}
      ${ppSection('4. Third-Party Services',
        'PDFDecor uses: Google Fonts (typography, no personal tracking), Font Awesome CDN (icons), html2canvas + jsPDF (PDF generation, runs locally), QRCode.js (QR generation, runs locally). None of these services receive your document data.'
      )}
      ${ppSection('5. Cookies',
        'PDFDecor itself does not set tracking cookies. Google AdSense may set cookies for advertising purposes. You can manage cookie preferences via your browser settings.'
      )}
      ${ppSection('6. Changes',
        'We may update this Privacy Policy periodically. Continued use of PDFDecor after changes constitutes acceptance of the updated policy.'
      )}
      ${ppSection('7. Contact',
        'For privacy questions, email: <a href="mailto:privacy@pdfdecor.in" class="text-blue-600 underline">privacy@pdfdecor.in</a>'
      )}
    </div>

  </div>`;
}

/* ════════════════════════════════════════════════════════════════
   TERMS OF SERVICE
════════════════════════════════════════════════════════════════ */
function renderTermsPage() {
  document.getElementById('app').innerHTML = `
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 page-enter">

    <div class="mb-8">
      <div class="section-tag mb-3"><i class="fas fa-file-signature"></i> Legal</div>
      <h1 class="text-3xl font-black text-gray-900 mb-2">Terms of Service</h1>
      <p class="text-sm text-gray-400">Last updated: January 1, 2025</p>
    </div>

    <div class="space-y-6 text-gray-600 text-sm">
      ${ppSection('1. Free Service',
        'PDFDecor is provided completely free of charge. All 10 document types are available to all users without payment, registration, or subscription. There are no paid plans, premium tiers, or feature restrictions.'
      )}
      ${ppSection('2. Advertising & Watermarks',
        'PDFDecor is funded by Google AdSense advertisements displayed on the site and a small "PDFDecor.in" watermark on downloaded PDFs. These are inherent aspects of the free service and cannot be removed.'
      )}
      ${ppSection('3. Permitted Use',
        'PDFDecor may only be used for lawful purposes. You agree not to create fraudulent, forged, deceptive, or illegal documents using this service. You are responsible for the accuracy and legality of documents you generate.'
      )}
      ${ppSection('4. Your Content',
        'Documents you create using PDFDecor belong entirely to you. PDFDecor claims no ownership, license, or rights over any documents generated using the platform. Your data stays on your device.'
      )}
      ${ppSection('5. Disclaimers',
        'PDFDecor is provided "as is" without warranty of any kind. We do not guarantee that documents will be legally valid for all purposes or jurisdictions. For official, legally binding documents, consult a qualified professional or lawyer.'
      )}
      ${ppSection('6. Limitation of Liability',
        'PDFDecor shall not be liable for any direct, indirect, incidental, or consequential damages arising from use of the service, including but not limited to data loss or business interruption.'
      )}
      ${ppSection('7. Governing Law',
        'These terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra, India.'
      )}
      ${ppSection('8. Contact',
        'Legal enquiries: <a href="mailto:legal@pdfdecor.in" class="text-blue-600 underline">legal@pdfdecor.in</a>'
      )}
    </div>

  </div>`;
}

function ppSection(title, content) {
  return `<div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
    <h2 class="text-base font-black text-gray-900 mb-2">${title}</h2>
    <p class="leading-relaxed">${content}</p>
  </div>`;
}
