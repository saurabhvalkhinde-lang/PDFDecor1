/**
 * home.js — PDFDecor home page (ad-monetized, all-free)
 */

function renderHomePage() {
  const app = document.getElementById('app');
  app.innerHTML = `
  <div class="page-enter">

    <!-- Top inline ad -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      ${renderAdInlineBanner('home-top-ad')}
    </div>

    <!-- ══════════════════════════════════════════════════════
         HERO SECTION
    ══════════════════════════════════════════════════════ -->
    <section aria-label="Hero" style="background:linear-gradient(135deg,#0f172a 0%,#1e3a8a 35%,#1d4ed8 65%,#7c3aed 100%);padding:60px 0 80px;position:relative;overflow:hidden">
      <!-- Decorative circles -->
      <div style="position:absolute;top:-80px;right:-100px;width:400px;height:400px;background:rgba(124,58,237,0.12);border-radius:50%;pointer-events:none"></div>
      <div style="position:absolute;bottom:-120px;left:-80px;width:300px;height:300px;background:rgba(37,99,235,0.1);border-radius:50%;pointer-events:none"></div>
      <div style="position:absolute;top:40%;left:45%;width:200px;height:200px;background:rgba(255,255,255,0.03);border-radius:50%;pointer-events:none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <!-- Hero text -->
          <div>
            <div class="hero-badge mb-5">
              <i class="fas fa-bolt text-yellow-300"></i>
              <span>India's #1 Free Business Document Generator</span>
            </div>
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05] mb-5" style="letter-spacing:-0.03em">
              Free Indian Business<br>
              <span style="background:linear-gradient(135deg,#facc15,#fb923c,#f97316);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Document Generator</span>
            </h1>
            <p class="text-blue-200 text-lg leading-relaxed mb-7 max-w-lg">
              GST Invoices with UPI QR · Certificates · ID Cards · Offer Letters · Receipts · Bulk PDF from CSV.
              Fill form → Live preview → Download in seconds. Always free.
            </p>
            <div class="flex flex-wrap gap-3 mb-7">
              <button onclick="navigate('invoice')"
                class="btn-primary text-base py-3.5 px-7 text-white"
                style="background:linear-gradient(135deg,#facc15,#fb923c);color:#1a1a1a;box-shadow:0 8px 28px rgba(251,146,60,0.4)">
                <i class="fas fa-rocket"></i> Start Free — Invoice
              </button>
              <button onclick="navigate('certificate')"
                class="btn-outline py-3.5 px-6"
                style="color:white;border-color:rgba(255,255,255,0.35);background:rgba(255,255,255,0.1);backdrop-filter:blur(4px)">
                <i class="fas fa-award"></i> Certificates
              </button>
              <button onclick="navigate('bulk')"
                class="btn-outline py-3.5 px-6"
                style="color:#c4b5fd;border-color:rgba(167,139,250,0.45);background:rgba(109,40,217,0.18);backdrop-filter:blur(4px)">
                <i class="fas fa-layer-group"></i> Bulk PDF
              </button>
            </div>
            <div class="flex flex-wrap gap-x-6 gap-y-2 text-blue-300 text-sm">
              <span class="flex items-center gap-1.5"><i class="fas fa-check-circle text-green-400"></i>No signup needed</span>
              <span class="flex items-center gap-1.5"><i class="fas fa-check-circle text-green-400"></i>GST + UPI QR</span>
              <span class="flex items-center gap-1.5"><i class="fas fa-check-circle text-green-400"></i>Instant PDF</span>
              <span class="flex items-center gap-1.5"><i class="fas fa-check-circle text-green-400"></i>Always free</span>
            </div>
          </div>

          <!-- Hero carousel / preview -->
          <div class="carousel-container rounded-2xl overflow-hidden" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);backdrop-filter:blur(8px);padding:16px">
            <div class="carousel-track" id="hero-carousel-track">
              ${getCarouselSlides()}
            </div>
            <div class="flex justify-center gap-2 mt-3" id="hero-carousel-dots" aria-label="Carousel navigation"></div>
          </div>

        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         STATS BAR
    ══════════════════════════════════════════════════════ -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 mb-14" aria-label="Statistics">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="stat-card"><div class="stat-value">5L+</div><div class="stat-label">PDFs Generated</div></div>
        <div class="stat-card"><div class="stat-value">50K+</div><div class="stat-label">Happy Users</div></div>
        <div class="stat-card"><div class="stat-value">10</div><div class="stat-label">Document Types</div></div>
        <div class="stat-card"><div class="stat-value">₹0</div><div class="stat-label">Forever Free</div></div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         DOCUMENT TYPES GRID
    ══════════════════════════════════════════════════════ -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14" aria-labelledby="templates-heading">
      <div class="text-center mb-9">
        <div class="section-tag"><i class="fas fa-th-large"></i> 10 Free Templates</div>
        <h2 id="templates-heading" class="text-3xl font-black text-gray-900 mt-1">What do you want to create?</h2>
        <p class="text-gray-500 mt-2 max-w-lg mx-auto text-sm">Select a document type, fill your details, preview instantly, download as PDF — all free.</p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 stagger">
        ${getDocTypeCards()}
      </div>
    </section>

    <!-- Mid-page ad -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
      ${renderAdInlineBanner('home-mid-ad')}
    </div>

    <!-- ══════════════════════════════════════════════════════
         HOW IT WORKS
    ══════════════════════════════════════════════════════ -->
    <section class="py-14 mb-0" style="background:linear-gradient(180deg,#f0f7ff 0%,#faf5ff 100%)" aria-labelledby="how-it-works-heading">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-9">
          <div class="section-tag"><i class="fas fa-play-circle"></i> Simple Process</div>
          <h2 id="how-it-works-heading" class="text-3xl font-black text-gray-900 mt-1">How It Works</h2>
          <p class="text-gray-500 mt-2 text-sm">4 easy steps · Under 2 minutes · Zero cost</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          ${getHowItWorksCards()}
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         FEATURES
    ══════════════════════════════════════════════════════ -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" aria-labelledby="features-heading">
      <div class="text-center mb-9">
        <div class="section-tag"><i class="fas fa-star"></i> Why PDFDecor</div>
        <h2 id="features-heading" class="text-3xl font-black text-gray-900 mt-1">Built for India 🇮🇳</h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        ${getFeaturesCards()}
      </div>
    </section>

    <!-- Features ad slot -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
      ${renderAdInlineBanner('home-features-ad')}
    </div>

    <!-- ══════════════════════════════════════════════════════
         TESTIMONIALS
    ══════════════════════════════════════════════════════ -->
    <section class="py-14" style="background:#f8fafc" aria-labelledby="testimonials-heading">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-9">
          <div class="section-tag"><i class="fas fa-heart"></i> Loved by Users</div>
          <h2 id="testimonials-heading" class="text-3xl font-black text-gray-900 mt-1">Trusted by Indian Businesses</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          ${getTestimonialCards()}
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════
         SAVE CTA (unauthenticated users only)
    ══════════════════════════════════════════════════════ -->
    ${!auth.isAuthenticated ? `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" aria-labelledby="save-cta-heading">
      <div style="background:linear-gradient(135deg,#1e3a8a 0%,#2563eb 50%,#7c3aed 100%);border-radius:24px;padding:40px 48px;display:flex;align-items:center;gap:24px;flex-wrap:wrap;position:relative;overflow:hidden">
        <div style="position:absolute;top:-40px;right:-40px;width:180px;height:180px;background:rgba(255,255,255,0.06);border-radius:50%"></div>
        <div class="text-5xl">💾</div>
        <div class="flex-1">
          <h2 id="save-cta-heading" class="text-2xl font-black text-white mb-2">Save & Re-edit Your Documents</h2>
          <p class="text-blue-200 text-sm leading-relaxed max-w-md">Create a free account to save your PDFs, re-edit later, and store your business profile for auto-fill on every new document.</p>
          <div class="flex flex-wrap gap-3 mt-3 text-xs text-blue-300">
            <span class="flex items-center gap-1"><i class="fas fa-check"></i>Document history</span>
            <span class="flex items-center gap-1"><i class="fas fa-check"></i>Business profile auto-fill</span>
            <span class="flex items-center gap-1"><i class="fas fa-check"></i>100% free forever</span>
          </div>
        </div>
        <button onclick="navigate('login')"
          class="flex-shrink-0 bg-white text-blue-700 font-black px-7 py-3.5 rounded-2xl text-sm hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5">
          <i class="fas fa-user-plus mr-2"></i>Create Free Account
        </button>
      </div>
    </section>` : ''}

    <!-- ══════════════════════════════════════════════════════
         FAQ
    ══════════════════════════════════════════════════════ -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16" aria-labelledby="faq-heading">
      <div class="text-center mb-9">
        <div class="section-tag"><i class="fas fa-question-circle"></i> FAQ</div>
        <h2 id="faq-heading" class="text-3xl font-black text-gray-900 mt-1">Frequently Asked Questions</h2>
      </div>
      <div class="space-y-3">${getHomeFAQs()}</div>
    </section>

    <!-- Bottom ad -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
      ${renderAdInlineBanner('home-bottom-ad')}
    </div>

    <!-- SEO Deep-Link Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14" aria-label="Document guides">
      <div class="text-center mb-6">
        <div class="section-tag mb-2"><i class="fas fa-book-open"></i> Free Guides & Tools</div>
        <h2 class="text-2xl font-black text-gray-900">Everything You Need for Indian Business Documents</h2>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        ${[
          { href:'seo/invoice-generator.html',    icon:'fas fa-file-invoice',  color:'#2563eb', bg:'#eff6ff', label:'GST Invoice Guide' },
          { href:'seo/certificate-generator.html',icon:'fas fa-award',          color:'#db2777', bg:'#fce7f3', label:'Certificate Guide' },
          { href:'seo/id-card-maker.html',         icon:'fas fa-id-card',        color:'#dc2626', bg:'#fff1f2', label:'ID Card Guide' },
          { href:'seo/receipt-generator.html',     icon:'fas fa-receipt',        color:'#059669', bg:'#f0fdf4', label:'Receipt Guide' },
          { href:'seo/offer-letter-generator.html',icon:'fas fa-briefcase',      color:'#6d28d9', bg:'#f5f3ff', label:'Offer Letter Guide' },
          { href:'seo/bulk-pdf-generator.html',    icon:'fas fa-layer-group',    color:'#7c3aed', bg:'#fdf4ff', label:'Bulk PDF Guide' },
        ].map(l => `
        <a href="${l.href}" class="group flex flex-col items-center gap-2 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center text-decoration-none" style="text-decoration:none">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:${l.bg}">
            <i class="${l.icon} text-sm" style="color:${l.color}"></i>
          </div>
          <span class="text-xs font-bold text-gray-700 leading-tight group-hover:text-blue-600 transition-colors">${l.label}</span>
        </a>`).join('')}
      </div>
    </section>

  </div>`;

  initCarousel();
  initFAQs();
}

/* ════════════════════════════════════════════════════════════════
   CAROUSEL
════════════════════════════════════════════════════════════════ */
function getCarouselSlides() {
  const slides = [
    {
      color:'#2563eb', title:'Invoice', badge:'GST · UPI QR', route:'invoice',
      preview:`<div style="background:#fff;padding:16px;border-radius:8px;font-family:Arial,sans-serif;font-size:10px;min-width:200px;box-shadow:0 4px 12px rgba(0,0,0,0.1)">
        <div style="border-bottom:3px solid #2563eb;padding-bottom:8px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:flex-start">
          <div><div style="font-size:20px;font-weight:900;color:#2563eb;letter-spacing:-1px">INVOICE</div><div style="color:#9ca3af;margin-top:2px">#INV-001 · Jan 2025</div></div>
          <div style="text-align:right"><div style="font-weight:800;color:#1e3a8a;font-size:11px">Acme Pvt Ltd</div><div style="color:#9ca3af">Mumbai, MH</div></div>
        </div>
        <div style="background:#eff6ff;padding:8px;border-radius:6px;margin-bottom:10px">
          <div style="font-size:9px;font-weight:700;color:#2563eb;text-transform:uppercase;letter-spacing:0.5px">Bill To</div>
          <div style="font-weight:700;color:#111;margin-top:2px">TechCorp Ltd</div>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:10px">
          <tr style="background:#1e40af"><th style="padding:3px 5px;text-align:left;color:#fff;font-size:9px">Item</th><th style="padding:3px 5px;text-align:right;color:#fff;font-size:9px">Amt</th></tr>
          <tr><td style="padding:3px 5px;border-bottom:1px solid #f3f4f6">Service A</td><td style="padding:3px 5px;text-align:right;border-bottom:1px solid #f3f4f6">₹5,000</td></tr>
          <tr><td style="padding:3px 5px">Service B</td><td style="padding:3px 5px;text-align:right">₹3,000</td></tr>
        </table>
        <div style="background:#2563eb;border-radius:6px;padding:5px 8px;display:flex;justify-content:space-between">
          <span style="font-weight:900;color:#fff;font-size:11px">TOTAL</span>
          <span style="font-weight:900;color:#fff;font-size:12px">₹9,440</span>
        </div>
      </div>`
    },
    {
      color:'#be185d', title:'Certificate', badge:'Achievement · Award', route:'certificate',
      preview:`<div style="background:linear-gradient(135deg,#fdf2f8,#fce7f3);padding:20px;border-radius:8px;border:2px solid #f9a8d4;text-align:center;font-family:Georgia,serif;min-width:200px;box-shadow:0 4px 12px rgba(190,24,93,0.1)">
        <div style="font-size:18px;font-weight:700;color:#9d174d;letter-spacing:2px">CERTIFICATE</div>
        <div style="font-size:9px;color:#be185d;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">of Achievement</div>
        <div style="border-top:1px solid #f9a8d4;border-bottom:1px solid #f9a8d4;padding:10px 0;margin:8px 0">
          <div style="font-style:italic;font-size:10px;color:#6b7280">This is to certify that</div>
          <div style="font-size:16px;font-weight:700;color:#9d174d;margin:4px 0">Rahul Sharma</div>
          <div style="font-size:9px;color:#6b7280">has successfully completed</div>
          <div style="font-size:11px;font-weight:700;color:#374151;margin-top:3px">Web Development Course</div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
          <div style="font-size:8px;color:#6b7280">Jan 15, 2025</div>
          <div style="font-size:8px;color:#6b7280;font-style:italic">Director</div>
        </div>
      </div>`
    },
    {
      color:'#1e3a8a', title:'ID Card', badge:'Employee · Student', route:'id-card',
      preview:`<div style="background:linear-gradient(180deg,#1e3a8a 0%,#1e40af 38%,#fff 38%);border-radius:12px;min-width:140px;font-family:Arial,sans-serif;overflow:hidden;box-shadow:0 4px 16px rgba(30,58,138,0.25)">
        <div style="padding:14px;text-align:center">
          <div style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.7);letter-spacing:2px;text-transform:uppercase">ACME PVT LTD</div>
          <div style="width:44px;height:44px;background:linear-gradient(135deg,#93c5fd,#60a5fa);border-radius:50%;margin:8px auto;display:flex;align-items:center;justify-content:center;font-size:20px;border:2px solid rgba(255,255,255,0.3)">👤</div>
        </div>
        <div style="background:#fff;padding:12px;text-align:center">
          <div style="font-weight:800;color:#1e3a8a;font-size:12px">Priya Mehta</div>
          <div style="color:#6b7280;font-size:10px;margin:2px 0">Software Engineer</div>
          <div style="background:#eff6ff;border-radius:6px;padding:3px 6px;margin:6px 0;font-size:8px;color:#2563eb">Engineering · EMP-001</div>
          <div style="background:#f3f4f6;border-radius:4px;padding:4px;margin-top:4px;font-family:monospace;font-size:7px;letter-spacing:2px;color:#374151">||| |||| ||||| ||</div>
        </div>
      </div>`
    },
    {
      color:'#0d9488', title:'Event Pass', badge:'QR-secured access', route:'event-pass',
      preview:`<div style="background:linear-gradient(135deg,#0d9488,#0f766e);padding:16px;border-radius:12px;min-width:180px;font-family:Arial,sans-serif;color:#fff;box-shadow:0 4px 16px rgba(13,148,136,0.3)">
        <div style="border-bottom:1px solid rgba(255,255,255,0.25);padding-bottom:10px;margin-bottom:10px">
          <div style="font-size:8px;text-transform:uppercase;letter-spacing:2px;opacity:.75;margin-bottom:3px">Event Pass</div>
          <div style="font-size:16px;font-weight:900">TechConf 2025</div>
          <div style="font-size:10px;opacity:.8;margin-top:2px">Jan 15–16 · Mumbai</div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end">
          <div>
            <div style="font-size:9px;opacity:.75">Attendee</div>
            <div style="font-size:12px;font-weight:700">Amit Kumar</div>
            <div style="background:rgba(255,255,255,0.2);border-radius:20px;padding:2px 10px;margin-top:6px;font-size:9px;display:inline-block">VIP · #EP-001</div>
          </div>
          <div style="width:36px;height:36px;background:white;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:20px">QR</div>
        </div>
      </div>`
    },
  ];
  return slides.map(s => `
    <div class="carousel-slide">
      <div style="background:${s.color}18;border-radius:14px;padding:24px 20px;min-height:240px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;cursor:pointer;transition:background 0.2s"
           onclick="navigate('${s.route}')" role="button" tabindex="0" aria-label="Create ${s.title}">
        <div style="text-align:center">
          <div style="font-size:18px;font-weight:900;color:${s.color};letter-spacing:-0.5px">${s.title}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px">${s.badge}</div>
        </div>
        <div style="transform:scale(0.86);transform-origin:center top">${s.preview}</div>
        <button style="background:${s.color};color:white;border:none;padding:6px 18px;border-radius:100px;font-size:11px;font-weight:700;cursor:pointer;margin-top:4px">
          Create Free →
        </button>
      </div>
    </div>`).join('');
}

function initCarousel() {
  const track       = document.getElementById('hero-carousel-track');
  const dotsContainer = document.getElementById('hero-carousel-dots');
  if (!track || !dotsContainer) return;
  const slides = track.querySelectorAll('.carousel-slide');
  const count  = slides.length;
  let current  = 0;

  dotsContainer.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.onclick = () => goTo(i);
    dotsContainer.appendChild(dot);
  }

  function goTo(idx) {
    current = idx;
    track.style.transform = `translateX(-${idx * 100}%)`;
    dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.className = 'carousel-dot' + (i === idx ? ' active' : '');
    });
  }

  let timer = setInterval(() => goTo((current + 1) % count), 3800);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(timer));
  track.parentElement.addEventListener('mouseleave', () => {
    timer = setInterval(() => goTo((current + 1) % count), 3800);
  });
}

/* ════════════════════════════════════════════════════════════════
   DOC TYPE CARDS
════════════════════════════════════════════════════════════════ */
const DOC_TYPES = [
  { icon:'fas fa-file-invoice', title:'Invoice',      sub:'GST · UPI QR',      path:'invoice',             color:'#2563eb', bg:'#eff6ff' },
  { icon:'fas fa-receipt',      title:'Receipt',      sub:'Payment proof',      path:'receipt',             color:'#059669', bg:'#f0fdf4' },
  { icon:'fas fa-file-alt',     title:'Bill',          sub:'Retail billing',    path:'bill',                color:'#ea580c', bg:'#fff7ed' },
  { icon:'fas fa-file-contract',title:'Quotation',    sub:'Cost proposal',     path:'quotation',           color:'#7c3aed', bg:'#faf5ff' },
  { icon:'fas fa-calculator',   title:'Estimate',     sub:'Project pricing',   path:'estimate',            color:'#d97706', bg:'#fffbeb' },
  { icon:'fas fa-award',        title:'Certificate',  sub:'Achievement',       path:'certificate',         color:'#be185d', bg:'#fdf2f8' },
  { icon:'fas fa-briefcase',    title:'Offer Letter', sub:'Job offers',        path:'offer-letter',        color:'#4f46e5', bg:'#eef2ff' },
  { icon:'fas fa-user-tie',     title:'Appointment',  sub:'HR documents',      path:'appointment-letter',  color:'#0e7490', bg:'#ecfeff' },
  { icon:'fas fa-id-card',      title:'ID Card',      sub:'Employee/Student',  path:'id-card',             color:'#dc2626', bg:'#fef2f2' },
  { icon:'fas fa-ticket-alt',   title:'Event Pass',   sub:'QR access',         path:'event-pass',          color:'#0d9488', bg:'#f0fdfa' },
];

function getDocTypeCards() {
  return DOC_TYPES.map((doc, i) => `
    <div class="doc-type-card fade-slide-in" onclick="navigate('${doc.path}')"
         role="button" tabindex="0" aria-label="Create ${doc.title}"
         style="animation-delay:${i * 40}ms">
      <div class="icon-wrap" style="background:linear-gradient(135deg,${doc.color}ee,${doc.color}99)">
        <i class="${doc.icon}"></i>
      </div>
      <div>
        <div class="doc-title">${doc.title}</div>
        <div class="doc-badge">
          <span class="doc-free-badge">FREE</span>
          <span class="text-gray-400">${doc.sub}</span>
        </div>
      </div>
    </div>`).join('');
}

/* ════════════════════════════════════════════════════════════════
   HOW IT WORKS
════════════════════════════════════════════════════════════════ */
function getHowItWorksCards() {
  return [
    { step:'01', icon:'fas fa-th-large', title:'Choose Document',    desc:'Pick from 10 professional document types',         color:'#2563eb' },
    { step:'02', icon:'fas fa-paint-brush', title:'Select Template', desc:'Beautiful pre-designed layouts, free to use',       color:'#7c3aed' },
    { step:'03', icon:'fas fa-keyboard', title:'Fill Your Details',  desc:'Live preview updates as you type — no delay',       color:'#059669' },
    { step:'04', icon:'fas fa-download', title:'Download PDF Free',  desc:'One click — A4, print-ready, instant download',     color:'#be185d' },
  ].map((s, i) => `
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4 items-start fade-slide-in" style="animation-delay:${i*60}ms">
      <div class="step-badge" style="background:linear-gradient(135deg,${s.color},${s.color}aa)">${s.step}</div>
      <div>
        <div class="font-black text-gray-900 text-sm mb-1.5">${s.title}</div>
        <div class="text-xs text-gray-500 leading-relaxed">${s.desc}</div>
      </div>
    </div>`).join('');
}

/* ════════════════════════════════════════════════════════════════
   FEATURES
════════════════════════════════════════════════════════════════ */
function getFeaturesCards() {
  return [
    { icon:'fas fa-bolt',        color:'#2563eb', bg:'#eff6ff', title:'Lightning Fast',   desc:'PDF in under 3 seconds, entirely in your browser' },
    { icon:'fas fa-shield-alt',  color:'#059669', bg:'#f0fdf4', title:'GST Compliant',    desc:'GSTIN, CGST/SGST/IGST auto-calculation built-in' },
    { icon:'fas fa-mobile-alt',  color:'#be185d', bg:'#fdf2f8', title:'Mobile Friendly',  desc:'Works perfectly on phones, tablets, and desktops' },
    { icon:'fas fa-lock',        color:'#0e7490', bg:'#ecfeff', title:'100% Private',     desc:'Data stays in your browser — nothing sent to servers' },
    { icon:'fas fa-qrcode',      color:'#dc2626', bg:'#fef2f2', title:'UPI QR Code',      desc:'Auto-generate payment QR code for all invoices' },
    { icon:'fas fa-print',       color:'#d97706', bg:'#fffbeb', title:'Print Ready',      desc:'A4 format, 2.5× resolution, proper page margins' },
    { icon:'fas fa-share-alt',   color:'#7c3aed', bg:'#faf5ff', title:'WhatsApp Share',   desc:'Share PDFs directly via WhatsApp in one click' },
    { icon:'fas fa-database',    color:'#4f46e5', bg:'#eef2ff', title:'Save & Re-edit',   desc:'Sign in to save documents and re-edit anytime' },
  ].map(f => `
    <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
      <div style="width:44px;height:44px;background:${f.bg};border-radius:13px;display:flex;align-items:center;justify-content:center;margin-bottom:14px;box-shadow:0 2px 8px ${f.color}22">
        <i class="${f.icon}" style="color:${f.color};font-size:17px"></i>
      </div>
      <div class="font-black text-gray-900 text-sm mb-1.5">${f.title}</div>
      <div class="text-xs text-gray-500 leading-relaxed">${f.desc}</div>
    </div>`).join('');
}

/* ════════════════════════════════════════════════════════════════
   TESTIMONIALS
════════════════════════════════════════════════════════════════ */
function getTestimonialCards() {
  return [
    { name:'Rajesh Patel',    role:'Shop Owner, Ahmedabad',  init:'RP', color:'#2563eb', text:'I create 20+ invoices daily. PDFDecor saves me 2 hours every day. The GST calculation is perfect!' },
    { name:'Sneha Kulkarni', role:'HR Manager, Pune',        init:'SK', color:'#be185d', text:'Generated certificates for 200 employees in minutes. Amazing templates and completely free!' },
    { name:'Amit Verma',     role:'Freelancer, Delhi',       init:'AV', color:'#059669', text:'Clean invoices with UPI QR codes. Clients pay faster now. Best free tool for freelancers.' },
  ].map(t => `
    <div class="testimonial-card">
      <div class="text-yellow-400 text-sm mb-3">★★★★★</div>
      <p class="text-sm text-gray-600 leading-relaxed mb-4">"${t.text}"</p>
      <div class="flex items-center gap-3">
        <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,${t.color}ee,${t.color}88);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;color:white;flex-shrink:0">${t.init}</div>
        <div>
          <div class="font-bold text-sm text-gray-900">${t.name}</div>
          <div class="text-xs text-gray-400">${t.role}</div>
        </div>
      </div>
    </div>`).join('');
}

/* ════════════════════════════════════════════════════════════════
   FAQ
════════════════════════════════════════════════════════════════ */
function getHomeFAQs() {
  const faqs = [
    { q:'Is PDFDecor completely free?', a:'Yes! All 10 document types are 100% free with unlimited PDF generation. Downloaded PDFs include a small "PDFDecor.in" watermark. There are no paid plans, subscriptions, or premium tiers — everything is free for everyone, forever.' },
    { q:'Do I need to create an account?', a:'No signup is required to create and download PDFs. An optional account lets you save documents for later re-editing and stores your business profile for auto-fill. All core features work without login.' },
    { q:'Does PDFDecor support GST invoicing?', a:'Yes! All financial documents support GSTIN fields, multiple tax rates (0%, 5%, 12%, 18%, 28%), CGST/SGST/IGST breakdown, Indian number formatting (₹), and UPI QR code generation.' },
    { q:'Why do PDFs have a watermark?', a:'PDFDecor is completely free. To keep the service running, downloaded PDFs include a small "PDFDecor.in" watermark. Ads are also shown on the site. These help us cover costs while keeping everything free.' },
    { q:'Is my business data safe?', a:'100% yes. All data stays in your browser\'s localStorage. Nothing is ever sent to any server. Your GST number, client details, amounts, and business information are completely private on your device.' },
    { q:'Can I use it on my phone?', a:'Absolutely! PDFDecor is fully responsive and works on any device — smartphones, tablets, and desktops. The PDF generator adapts to all screen sizes.' },
  ];
  return faqs.map((faq, i) => `
    <div class="faq-item">
      <button class="faq-question" onclick="toggleFAQ(${i})" aria-expanded="false" aria-controls="faq-answer-${i}">
        <span>${faq.q}</span>
        <i class="fas fa-chevron-down text-gray-400 text-sm" id="faq-icon-${i}"></i>
      </button>
      <div class="faq-answer" id="faq-answer-${i}" role="region">${faq.a}</div>
    </div>`).join('');
}

function toggleFAQ(id) {
  const answer = document.getElementById(`faq-answer-${id}`);
  const icon   = document.getElementById(`faq-icon-${id}`);
  if (!answer) return;
  const isOpen = answer.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('[id^="faq-icon-"]').forEach(ic => ic.style.transform = '');
  // Open clicked (if was closed)
  if (!isOpen) {
    answer.classList.add('open');
    if (icon) icon.style.transform = 'rotate(180deg)';
  }
}

function initFAQs() {
  // Open first FAQ by default
  const first = document.getElementById('faq-answer-0');
  const icon  = document.getElementById('faq-icon-0');
  if (first) { first.classList.add('open'); if (icon) icon.style.transform = 'rotate(180deg)'; }
}
