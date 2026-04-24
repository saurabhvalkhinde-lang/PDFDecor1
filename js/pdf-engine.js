/**
 * pdf-engine.js — PDF generation + interstitial ad system
 */

/* ══════════════════════════════════════════════════════════════
   INTERSTITIAL AD SYSTEM
══════════════════════════════════════════════════════════════ */
let _pendingDownloadFn = null;  // stores the actual PDF generation callback
let _interstitialTimer = null;

/**
 * Show the interstitial ad modal, run countdown, then execute download.
 * @param {Function} downloadFn - async function that performs actual PDF generation
 */
function showInterstitialAd(downloadFn) {
  _pendingDownloadFn = downloadFn;
  const modal      = document.getElementById('interstitial-modal');
  const countdownEl = document.getElementById('interstitial-countdown');
  const progressEl  = document.getElementById('interstitial-progress');
  const closeBtn    = document.getElementById('interstitial-close-btn');

  if (!modal) { downloadFn(); return; }

  // GA4: track interstitial shown
  trackEvent('interstitial_shown', { trigger: 'pdf_download' });

  // Reset state
  const SECONDS = 5;
  let remaining = SECONDS;
  if (countdownEl) countdownEl.textContent = remaining;
  if (progressEl)  progressEl.style.width = '0%';
  if (closeBtn)    closeBtn.classList.add('hidden');

  modal.classList.remove('hidden');

  // Start countdown
  _interstitialTimer = setInterval(() => {
    remaining--;
    if (countdownEl) countdownEl.textContent = remaining;
    const pct = Math.round(((SECONDS - remaining) / SECONDS) * 100);
    if (progressEl) progressEl.style.width = pct + '%';

    // Show skip button after 3 seconds
    if (remaining <= 2 && closeBtn) closeBtn.classList.remove('hidden');

    if (remaining <= 0) {
      clearInterval(_interstitialTimer);
      closeInterstitialAndDownload();
    }
  }, 1000);
}

function closeInterstitialAndDownload() {
  clearInterval(_interstitialTimer);
  const modal = document.getElementById('interstitial-modal');
  if (modal) modal.classList.add('hidden');

  if (_pendingDownloadFn) {
    _pendingDownloadFn();
    _pendingDownloadFn = null;
  }
}

/* ══════════════════════════════════════════════════════════════
   PDF GENERATION ENGINE
══════════════════════════════════════════════════════════════ */
async function generatePDF(elementId, filename, opts = {}) {
  const { watermarkText = 'PDFDecor.in' } = opts;

  const element = document.getElementById(elementId);
  if (!element) {
    showToast('Preview element not found.', 'error');
    return;
  }

  // Clone off-screen
  const clone = element.cloneNode(true);
  clone.style.cssText = `
    position:fixed; top:-9999px; left:-9999px;
    width:${element.offsetWidth || 794}px;
    min-height:${element.offsetHeight || 400}px;
    background:#ffffff; z-index:-1; pointer-events:none;
  `;
  clone.id = elementId + '-pdf-clone';
  document.body.appendChild(clone);

  try {
    resolveColors(clone);

    // Always inject watermark (free product)
    injectWatermark(clone, watermarkText);
    injectFooterBranding(clone);

    await new Promise(r => setTimeout(r, 350));

    const canvas = await html2canvas(clone, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      removeContainer: false,
      foreignObjectRendering: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });

    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const contentW = pageW - margin * 2;
    const contentH = pageH - margin * 2;
    const ratio = contentW / canvas.width;
    const scaledH = canvas.height * ratio;

    if (scaledH <= contentH) {
      pdf.addImage(imgData, 'JPEG', margin, margin, contentW, scaledH);
    } else {
      const pageHeightPx = Math.floor(contentH / ratio);
      let offsetY = 0;
      while (offsetY < canvas.height) {
        const sliceH = Math.min(pageHeightPx, canvas.height - offsetY);
        const pc = document.createElement('canvas');
        pc.width = canvas.width; pc.height = sliceH;
        const ctx = pc.getContext('2d');
        ctx.drawImage(canvas, 0, offsetY, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
        const sliceData = pc.toDataURL('image/jpeg', 0.92);
        if (offsetY > 0) pdf.addPage();
        pdf.addImage(sliceData, 'JPEG', margin, margin, contentW, sliceH * ratio);
        offsetY += sliceH;
      }
    }

    pdf.save(filename.endsWith('.pdf') ? filename : filename + '.pdf');
    if (auth.isAuthenticated) auth.trackGeneration('pdf');

    // GA4: track successful download
    trackEvent('pdf_download', { doc_type: filename.split('_')[0], filename });

    // Show post-download ad (bottom-right toast)
    _showPostDownloadAd();

  } catch (err) {
    console.error('[PDFDecor] PDF error:', err);
    showToast('PDF generation failed. Please try again.', 'error');
  } finally {
    if (document.body.contains(clone)) document.body.removeChild(clone);
  }
}

function injectWatermark(el, text) {
  const wm = document.createElement('div');
  wm.innerText = text;
  wm.style.cssText = `
    position:absolute;top:50%;left:50%;
    transform:translate(-50%,-50%) rotate(-35deg);
    font-size:52px;font-weight:900;color:rgba(100,100,100,0.10);
    white-space:nowrap;pointer-events:none;z-index:9999;
    user-select:none;font-family:Arial,sans-serif;letter-spacing:4px;
  `;
  el.style.position = 'relative';
  el.appendChild(wm);
}

function injectFooterBranding(el) {
  const f = document.createElement('div');
  f.innerText = 'Generated free at PDFDecor.in';
  f.style.cssText = `
    display:block;text-align:center;font-size:9px;color:#9ca3af;
    padding:6px 0 4px;border-top:1px solid #e5e7eb;
    margin-top:8px;font-family:Arial,sans-serif;
  `;
  el.appendChild(f);
}

function resolveColors(root) {
  const props = ['color','backgroundColor','borderTopColor','borderRightColor','borderBottomColor','borderLeftColor'];
  const cv = document.createElement('canvas');
  cv.width = cv.height = 1;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  const toRGB = raw => {
    if (!raw || raw === 'transparent' || raw === 'rgba(0,0,0,0)') return raw;
    if (/^(rgb|#)/.test(raw)) return raw;
    try {
      ctx.clearRect(0,0,1,1); ctx.fillStyle = raw; ctx.fillRect(0,0,1,1);
      const [r,g,b] = ctx.getImageData(0,0,1,1).data;
      return `rgb(${r},${g},${b})`;
    } catch { return raw; }
  };
  [root, ...root.querySelectorAll('*')].forEach(el => {
    if (!(el instanceof HTMLElement)) return;
    const cs = getComputedStyle(el);
    props.forEach(p => {
      const raw = cs[p];
      if (!raw) return;
      const conv = toRGB(raw);
      if (conv && conv !== raw) el.style.setProperty(p.replace(/([A-Z])/g, c => '-'+c.toLowerCase()), conv, 'important');
    });
  });
}

/* ── QR Code ────────────────────────────────────────────────── */
async function generateQRDataUrl(text, size = 80) {
  if (!text || !window.QRCode) return null;
  try { return await QRCode.toDataURL(text, { width: size, margin: 1, color: { dark: '#000000', light: '#ffffff' } }); }
  catch { return null; }
}

/* ── Share helpers ──────────────────────────────────────────── */
function shareViaWhatsApp(data = {}) {
  window.open(`https://wa.me/?text=${encodeURIComponent(data.message || 'Please find your document from PDFDecor.in')}`, '_blank');
}
function shareViaEmail(data = {}) {
  window.location.href = `mailto:?subject=${encodeURIComponent(data.subject || 'Document from PDFDecor')}&body=${encodeURIComponent(data.body || 'Find the attached document from PDFDecor.in')}`;
}

/* ── Format helpers ─────────────────────────────────────────── */
function formatCurrency(n) {
  return '₹' + (parseFloat(n) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function formatDate(d) {
  if (!d) return '';
  try { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return d; }
}

/* ── Post-download ad ───────────────────────────────────────── */
function _showPostDownloadAd() {
  const el = document.getElementById('post-download-ad');
  if (!el) return;
  el.classList.remove('hidden');
  // Auto-hide after 8 seconds
  setTimeout(() => { el.classList.add('hidden'); }, 8000);
  try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}
}

/* ── Ad zone helpers ────────────────────────────────────────── */
function renderAdRectangle(id = '') {
  return `
    <div class="ad-rectangle" id="${id}" style="text-align:center;">
      <!-- Google AdSense Rectangle 300x250 -->
      <ins class="adsbygoogle"
           style="display:inline-block;width:300px;height:250px"
           data-ad-client="ca-pub-2715542305151303"
           data-ad-slot="auto"></ins>
      <script>(adsbygoogle=window.adsbygoogle||[]).push({});<\/script>
    </div>`;
}

function renderAdInlineBanner(id = '') {
  return `
    <div class="ad-inline-banner" id="${id}" style="text-align:center;padding:8px 0;">
      <!-- Google AdSense Inline Banner -->
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-2715542305151303"
           data-ad-slot="auto"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <script>(adsbygoogle=window.adsbygoogle||[]).push({});<\/script>
    </div>`;
}
