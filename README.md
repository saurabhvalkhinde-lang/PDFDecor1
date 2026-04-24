# PDFDecor — Free Indian Business Document Generator

> India's #1 free PDF generator · GST invoices · Certificates · ID Cards · Bulk from CSV · AdSense monetized · GA4 tracked · SEO landing pages

---

## 🚀 Project Overview

PDFDecor is a fully client-side SPA (Single Page App) for Indian businesses, HR teams, freelancers, and individuals to create professional-grade PDFs instantly — zero cost, zero signup, zero server.

All processing happens in the browser using `html2canvas` + `jsPDF`. Data stored in `localStorage` for optional history/profile. Monetized via Google AdSense (`ca-pub-2715542305151303`). Tracked with Google Analytics GA4.

---

## ✅ Completed Features

### 🎯 Positioning
- **"India's #1 Free Business Document Generator"** (not just a "PDF tool")
- India-first: GST, UPI QR, GSTIN, INR ₹, Indian address format
- Hero updated to reflect full feature set

### 📄 Core Editor (10 Document Types)
- Invoice (GST + UPI QR + 3 templates)
- Receipt, Bill, Quotation, Estimate
- Certificate, Offer Letter, Appointment Letter, ID Card, Event Pass
- Live preview (80ms debounce), form auto-fill from business profile
- **Logo upload** (local file → base64, or paste URL) in Company section
- Watermark + footer branding on all free PDFs

### 🆕 Bulk PDF Generator (`#bulk`)
- 6 doc types: Certificate, Invoice, Receipt, ID Card, Event Pass, Offer Letter
- CSV upload (drag-and-drop, auto-column mapping, up to 500 rows)
- Manual row editor (inline table, add/edit/delete)
- Sample data loader + CSV template download
- **Logo upload** from local file in bulk settings
- Live preview (any row, any setting)
- Batch generation with progress bar, per-row status, stop/retry
- Individual PDF download + ZIP bundle (JSZip)

### 💰 Monetization — Google AdSense (`ca-pub-2715542305151303`)
| Placement | Type | Trigger |
|---|---|---|
| Header leaderboard | 728×90 `<ins>` | Every page load |
| Footer leaderboard | 728×90 `<ins>` | Every page load |
| Interstitial modal | 300×250 `<ins>` | Before every PDF download (5-sec countdown) |
| Post-download toast | 256×100 `<ins>` | After PDF saves (auto-hides after 8s) |
| Sticky mobile bottom | 320×50 `<ins>` | Mobile only (dismissible) |
| Inline banners | Auto responsive `<ins>` | Between sections on all pages |
| Sidebar rectangles | 300×250 `<ins>` | Editor desktop sidebar |

**⚠️ Action needed:** Replace `data-ad-slot="auto"` with real slot IDs from your AdSense dashboard.

### 📊 Google Analytics GA4
- Script loaded in `index.html` head (`G-XXXXXXXXXX` — replace with real ID)
- Global `trackEvent(name, params)` helper available everywhere
- Events tracked:
  - `page_view` — every navigation
  - `editor_open` — template page opened (with `doc_type`)
  - `editor_pdf_download` — download completed (with `doc_type`, `template_id`)
  - `pdf_download` — pdf-engine level (with `filename`)
  - `interstitial_shown` — ad modal displayed
  - `logo_uploaded` — logo file uploaded

**⚠️ Action needed:** Replace `G-XXXXXXXXXX` with your real GA4 measurement ID in `index.html`.

### 🔍 SEO Landing Pages (`/seo/`)
| Page | Target Keywords |
|---|---|
| `seo/index.html` | free pdf generator india, business document generator |
| `seo/invoice-generator.html` | free invoice generator india, gst invoice maker, upi qr invoice |
| `seo/certificate-generator.html` | free certificate generator, bulk certificate from csv, completion certificate |
| `seo/id-card-maker.html` | free id card maker online, employee id card, student id card generator |
| `seo/receipt-generator.html` | free receipt generator india, payment receipt pdf |
| `seo/offer-letter-generator.html` | free offer letter generator india, job offer letter format |
| `seo/bulk-pdf-generator.html` | bulk pdf generator, csv to pdf, batch certificate generator |

Each page has: 1000+ words, structured data (JSON-LD), canonical URL, OG/Twitter tags, AdSense placements, cross-links, CTA to app.

`sitemap.xml` included in root.

### 🖼️ Logo Upload
- Editor: Company section has file upload button (image/* → base64) + URL field
- Bulk: Settings panel has file upload + URL field
- Live preview updates immediately after upload
- Max 2MB, any image format
- Stored as base64 in formData (no server upload)

---

## 📂 File Structure

```
index.html                   SPA shell, AdSense, GA4, interstitial modal, sticky ad
sitemap.xml                  XML sitemap for all pages
css/
  style.css                  Complete stylesheet
js/
  auth.js                    LocalStorage auth, history, business profile
  pdf-engine.js              Interstitial + post-download ads, html2canvas/jsPDF engine, GA4
  templates.js               HTML renderers for all 10 document types
  router.js                  18+ route hash router with GA4 page_view tracking
  app.js                     Bootstrap
  pages/
    home.js                  Hero (India-first positioning), SEO deep-links, doc cards, FAQs
    editor.js                Universal editor with logo upload, GA4 tracking
    bulk.js                  Bulk PDF (CSV, manual, preview, ZIP, logo upload)
    login.js                 Login / signup
    dashboard.js             Dashboard, history, profile
    static-pages.js          About, Help, Privacy, Terms
seo/
  seo-style.css              Shared SEO page stylesheet
  index.html                 SEO hub — all tools overview
  invoice-generator.html     GST Invoice guide & CTA
  certificate-generator.html Certificate guide (incl. bulk)
  id-card-maker.html         ID Card guide (incl. bulk)
  receipt-generator.html     Receipt guide
  offer-letter-generator.html Offer Letter guide
  bulk-pdf-generator.html    Bulk PDF guide
```

---

## 🔗 App Routes (Hash SPA)

`#home` · `#invoice` · `#receipt` · `#bill` · `#quotation` · `#estimate` · `#certificate` · `#offer-letter` · `#appointment-letter` · `#id-card` · `#event-pass` · **`#bulk`** · `#login` · `#dashboard` · `#history` · `#profile` · `#about` · `#help` · `#privacy` · `#terms`

---

## 🛠️ Tech Stack

| Library | Version | Purpose |
|---|---|---|
| Tailwind CSS | CDN | Styling |
| Font Awesome | 6.4.0 | Icons |
| jsPDF | 2.5.1 | PDF generation |
| html2canvas | 1.4.1 | DOM → canvas |
| QRCode.js | 1.5.3 | UPI QR codes |
| JSZip | 3.10.1 | Bulk ZIP download |
| Google AdSense | — | Monetization |
| Google Analytics GA4 | — | Analytics |

---

## 🏃 Setup Checklist (Before Going Live)

1. **AdSense**: Replace all `data-ad-slot="auto"` with real slot IDs from AdSense dashboard
2. **GA4**: Replace `G-XXXXXXXXXX` with your GA4 Measurement ID in `index.html`
3. **SEO pages**: Update `canonical` URLs in all `seo/*.html` to match your real domain
4. **Sitemap**: Update `sitemap.xml` URLs to your real domain
5. **Deploy**: Go to **Publish tab** → click Publish

---

## 🔮 Next Steps (Prioritised)

1. **Add real AdSense slot IDs** (immediate revenue impact)
2. **Connect GA4** (visibility into what's working)
3. **Submit sitemap.xml** to Google Search Console
4. **Add more templates** (5 per doc type → more retention)
5. **YouTube SEO videos** ("how to make GST invoice free" etc.)
6. **Firebase auth** (optional — for real cloud history)
7. **WhatsApp share** button on PDF download success

---

*© 2025 PDFDecor — Made with ❤️ for India 🇮🇳*
