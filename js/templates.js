/**
 * templates.js — All PDF visual template renderers
 * Each template returns an HTML string for the preview pane
 */

/* ══════════════════════════════════════════════════════════════════
   INVOICE TEMPLATES
═══════════════════════════════════════════════════════════════════ */
const InvoiceTemplates = {
  1: (d) => `
    <div style="font-family:Arial,sans-serif;background:#fff;padding:40px;min-height:900px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #2563eb;padding-bottom:20px;margin-bottom:20px">
        <div>
          <div style="font-size:32px;font-weight:900;color:#2563eb;letter-spacing:-1px">INVOICE</div>
          <div style="font-size:13px;color:#6b7280;margin-top:4px">${d.invoiceNumber || 'INV-001'} &nbsp;·&nbsp; ${formatDate(d.date)}</div>
          ${d.dueDate ? `<div style="font-size:12px;color:#ef4444;margin-top:2px">Due: ${formatDate(d.dueDate)}</div>` : ''}
        </div>
        <div style="text-align:right">
          ${d.logo ? `<img src="${d.logo}" style="height:50px;object-fit:contain;margin-bottom:8px">` : `<div style="font-size:20px;font-weight:900;color:#1e3a8a">${d.companyName || 'Your Company'}</div>`}
          <div style="font-size:11px;color:#6b7280;line-height:1.5">${d.companyAddress || ''}<br>${d.companyPhone || ''}<br>${d.companyEmail || ''}</div>
          ${d.companyGST ? `<div style="font-size:11px;color:#374151;margin-top:2px">GSTIN: ${d.companyGST}</div>` : ''}
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:24px">
        <div style="background:#f0f7ff;border-radius:8px;padding:14px 18px;flex:1;margin-right:12px">
          <div style="font-size:10px;font-weight:700;color:#2563eb;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Bill To</div>
          <div style="font-size:14px;font-weight:700;color:#111">${d.clientName || 'Client Name'}</div>
          <div style="font-size:12px;color:#6b7280;margin-top:2px">${d.clientAddress || ''}</div>
          <div style="font-size:12px;color:#6b7280">${d.clientPhone || ''}</div>
          ${d.clientGST ? `<div style="font-size:11px;color:#374151">GSTIN: ${d.clientGST}</div>` : ''}
        </div>
        ${d.upiId ? `<div style="background:#f0fdf4;border-radius:8px;padding:14px 18px;text-align:center;min-width:110px">
          <div style="font-size:10px;font-weight:700;color:#059669;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Pay via UPI</div>
          <div style="font-size:10px;color:#374151;word-break:break-all">${d.upiId}</div>
        </div>` : ''}
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        <thead><tr style="background:#1e40af">
          <th style="padding:10px 12px;text-align:left;font-size:11px;color:#fff;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;border-radius:4px 0 0 0">Description</th>
          <th style="padding:10px 12px;text-align:center;font-size:11px;color:#fff;font-weight:700;text-transform:uppercase">Qty</th>
          <th style="padding:10px 12px;text-align:right;font-size:11px;color:#fff;font-weight:700;text-transform:uppercase">Rate</th>
          <th style="padding:10px 12px;text-align:right;font-size:11px;color:#fff;font-weight:700;text-transform:uppercase;border-radius:0 4px 0 0">Amount</th>
        </tr></thead>
        <tbody>
          ${(d.items||[]).map((it,i) => `<tr style="background:${i%2===0?'#f9fafb':'#fff'}">
            <td style="padding:9px 12px;font-size:13px;color:#111;border-bottom:1px solid #e5e7eb">${it.description||''}</td>
            <td style="padding:9px 12px;text-align:center;font-size:13px;color:#374151;border-bottom:1px solid #e5e7eb">${it.quantity||0}</td>
            <td style="padding:9px 12px;text-align:right;font-size:13px;color:#374151;border-bottom:1px solid #e5e7eb">${formatCurrency(it.rate)}</td>
            <td style="padding:9px 12px;text-align:right;font-size:13px;font-weight:600;color:#111;border-bottom:1px solid #e5e7eb">${formatCurrency(it.amount)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <div style="display:flex;justify-content:flex-end;margin-bottom:20px">
        <div style="width:220px">
          <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#6b7280"><span>Subtotal</span><span>${formatCurrency(d.subtotal)}</span></div>
          <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#6b7280"><span>Tax (${d.taxRate||18}%)</span><span>${formatCurrency(d.tax)}</span></div>
          <div style="display:flex;justify-content:space-between;padding:8px 12px;background:#2563eb;border-radius:8px;margin-top:6px">
            <span style="font-size:14px;font-weight:900;color:#fff">TOTAL</span>
            <span style="font-size:16px;font-weight:900;color:#fff">${formatCurrency(d.total)}</span>
          </div>
        </div>
      </div>
      ${d.notes ? `<div style="background:#fafafa;border-left:3px solid #2563eb;padding:10px 14px;border-radius:0 8px 8px 0;font-size:12px;color:#374151">${d.notes}</div>` : ''}
    </div>`,

  2: (d) => `
    <div style="font-family:Arial,sans-serif;background:#fff;padding:40px;min-height:900px">
      <div style="background:#065f46;padding:28px;border-radius:12px;margin-bottom:24px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-size:28px;font-weight:900;color:#fff">INVOICE</div>
            <div style="font-size:13px;color:#a7f3d0;margin-top:2px">${d.invoiceNumber||'INV-001'} · ${formatDate(d.date)}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:18px;font-weight:900;color:#fff">${d.companyName||'Company'}</div>
            <div style="font-size:11px;color:#a7f3d0">${d.companyEmail||''}</div>
          </div>
        </div>
      </div>
      <div style="display:flex;gap:16px;margin-bottom:24px">
        <div style="flex:1;border:1px solid #d1fae5;border-radius:8px;padding:14px">
          <div style="font-size:10px;font-weight:700;color:#059669;text-transform:uppercase;margin-bottom:6px">From</div>
          <div style="font-size:13px;font-weight:700">${d.companyName||''}</div>
          <div style="font-size:11px;color:#6b7280">${d.companyAddress||''}</div>
          ${d.companyGST?`<div style="font-size:10px;color:#374151">GSTIN: ${d.companyGST}</div>`:''}
        </div>
        <div style="flex:1;border:1px solid #d1fae5;border-radius:8px;padding:14px">
          <div style="font-size:10px;font-weight:700;color:#059669;text-transform:uppercase;margin-bottom:6px">To</div>
          <div style="font-size:13px;font-weight:700">${d.clientName||''}</div>
          <div style="font-size:11px;color:#6b7280">${d.clientAddress||''}</div>
          ${d.clientGST?`<div style="font-size:10px;color:#374151">GSTIN: ${d.clientGST}</div>`:''}
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        <thead><tr style="background:#ecfdf5;border-bottom:2px solid #059669">
          <th style="padding:10px 12px;text-align:left;font-size:11px;color:#065f46;font-weight:700">DESCRIPTION</th>
          <th style="padding:10px 12px;text-align:center;font-size:11px;color:#065f46;font-weight:700">QTY</th>
          <th style="padding:10px 12px;text-align:right;font-size:11px;color:#065f46;font-weight:700">RATE</th>
          <th style="padding:10px 12px;text-align:right;font-size:11px;color:#065f46;font-weight:700">AMOUNT</th>
        </tr></thead>
        <tbody>
          ${(d.items||[]).map((it,i) => `<tr style="border-bottom:1px solid #f0fdf4">
            <td style="padding:9px 12px;font-size:13px">${it.description||''}</td>
            <td style="padding:9px 12px;text-align:center;font-size:13px">${it.quantity||0}</td>
            <td style="padding:9px 12px;text-align:right;font-size:13px">${formatCurrency(it.rate)}</td>
            <td style="padding:9px 12px;text-align:right;font-size:13px;font-weight:600">${formatCurrency(it.amount)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <div style="display:flex;justify-content:flex-end">
        <div style="width:200px;background:#f0fdf4;border-radius:10px;padding:14px">
          <div style="display:flex;justify-content:space-between;font-size:12px;color:#6b7280;margin-bottom:4px"><span>Subtotal</span><span>${formatCurrency(d.subtotal)}</span></div>
          <div style="display:flex;justify-content:space-between;font-size:12px;color:#6b7280;margin-bottom:8px"><span>Tax ${d.taxRate||18}%</span><span>${formatCurrency(d.tax)}</span></div>
          <div style="display:flex;justify-content:space-between;font-size:15px;font-weight:900;color:#065f46;border-top:2px solid #059669;padding-top:8px"><span>Total</span><span>${formatCurrency(d.total)}</span></div>
        </div>
      </div>
    </div>`,

  3: (d) => `
    <div style="font-family:Arial,sans-serif;background:#fff;padding:40px;min-height:900px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px">
        <div><div style="font-size:36px;font-weight:300;color:#7c3aed;letter-spacing:4px">INVOICE</div>
          <div style="width:40px;height:3px;background:#7c3aed;margin-top:4px"></div></div>
        <div style="text-align:right"><div style="font-size:16px;font-weight:700;color:#111">${d.companyName||'Company'}</div>
          <div style="font-size:11px;color:#9ca3af;margin-top:2px">${d.companyAddress||''}</div>
          <div style="font-size:12px;color:#7c3aed;margin-top:4px">${d.invoiceNumber||'INV-001'}</div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px">
        <div style="padding:16px;border:1px solid #f3e8ff;border-radius:8px">
          <div style="font-size:9px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px">Billed To</div>
          <div style="font-size:14px;font-weight:700;color:#111">${d.clientName||''}</div>
          <div style="font-size:12px;color:#6b7280;margin-top:3px">${d.clientAddress||''}</div>
        </div>
        <div style="padding:16px;background:#faf5ff;border-radius:8px">
          <div style="font-size:9px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px">Invoice Info</div>
          <div style="font-size:12px;color:#6b7280">Date: <span style="color:#111;font-weight:600">${formatDate(d.date)}</span></div>
          ${d.dueDate?`<div style="font-size:12px;color:#6b7280;margin-top:3px">Due: <span style="color:#ef4444;font-weight:600">${formatDate(d.dueDate)}</span></div>`:''}
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        <thead><tr><th style="padding:10px 12px;text-align:left;font-size:10px;color:#7c3aed;font-weight:700;text-transform:uppercase;border-bottom:2px solid #7c3aed">Item</th>
          <th style="padding:10px 12px;text-align:center;font-size:10px;color:#7c3aed;font-weight:700;text-transform:uppercase;border-bottom:2px solid #7c3aed">Qty</th>
          <th style="padding:10px 12px;text-align:right;font-size:10px;color:#7c3aed;font-weight:700;text-transform:uppercase;border-bottom:2px solid #7c3aed">Rate</th>
          <th style="padding:10px 12px;text-align:right;font-size:10px;color:#7c3aed;font-weight:700;text-transform:uppercase;border-bottom:2px solid #7c3aed">Total</th>
        </tr></thead>
        <tbody>
          ${(d.items||[]).map(it => `<tr style="border-bottom:1px solid #f5f3ff">
            <td style="padding:9px 12px;font-size:13px">${it.description||''}</td>
            <td style="padding:9px 12px;text-align:center;font-size:13px">${it.quantity||0}</td>
            <td style="padding:9px 12px;text-align:right;font-size:13px">${formatCurrency(it.rate)}</td>
            <td style="padding:9px 12px;text-align:right;font-size:13px;font-weight:600;color:#7c3aed">${formatCurrency(it.amount)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <div style="display:flex;justify-content:flex-end"><div style="width:200px">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#6b7280;padding:4px 0"><span>Subtotal</span><span>${formatCurrency(d.subtotal)}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#6b7280;padding:4px 0"><span>Tax</span><span>${formatCurrency(d.tax)}</span></div>
        <div style="border-top:2px solid #7c3aed;margin-top:6px;padding-top:8px;display:flex;justify-content:space-between"><span style="font-size:15px;font-weight:900;color:#7c3aed">Total</span><span style="font-size:15px;font-weight:900;color:#7c3aed">${formatCurrency(d.total)}</span></div>
      </div></div>
    </div>`,
};

/* ══════════════════════════════════════════════════════════════════
   RECEIPT TEMPLATES
═══════════════════════════════════════════════════════════════════ */
const ReceiptTemplates = {
  1: (d) => `
    <div style="font-family:Arial,sans-serif;background:#fff;padding:40px;min-height:700px">
      <div style="background:#065f46;padding:24px;border-radius:10px;margin-bottom:20px;text-align:center">
        <div style="font-size:28px;font-weight:900;color:#fff;letter-spacing:3px">RECEIPT</div>
        <div style="font-size:13px;color:#a7f3d0;margin-top:4px">${d.receiptNumber||'REC-001'} · ${formatDate(d.date)}</div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:20px">
        <div><div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;margin-bottom:4px">Received From</div>
          <div style="font-size:16px;font-weight:700;color:#111">${d.payerName||'Payer Name'}</div>
          <div style="font-size:12px;color:#6b7280">${d.payerAddress||''}</div></div>
        <div style="text-align:right"><div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;margin-bottom:4px">Received By</div>
          <div style="font-size:14px;font-weight:700;color:#111">${d.companyName||'Company'}</div>
          <div style="font-size:12px;color:#6b7280">${d.companyPhone||''}</div></div>
      </div>
      <div style="background:#f0fdf4;border-radius:10px;padding:20px;text-align:center;margin-bottom:16px">
        <div style="font-size:11px;font-weight:700;color:#059669;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Amount Received</div>
        <div style="font-size:36px;font-weight:900;color:#065f46">${formatCurrency(d.amount)}</div>
        ${d.paymentMethod ? `<div style="font-size:12px;color:#059669;margin-top:4px">via ${d.paymentMethod}</div>` : ''}
      </div>
      ${d.description?`<div style="border-left:3px solid #059669;padding:10px 14px;background:#fafafa;border-radius:0 8px 8px 0;font-size:13px;color:#374151;margin-bottom:16px">${d.description}</div>`:''}
      <div style="text-align:center;border-top:1px dashed #d1d5db;padding-top:14px;font-size:11px;color:#9ca3af">Thank you for your payment</div>
    </div>`,

  2: (d) => `
    <div style="font-family:Arial,sans-serif;background:#fff;border:2px solid #e5e7eb;border-radius:12px;padding:36px;min-height:600px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
        <div><div style="font-size:24px;font-weight:900;color:#111">Payment Receipt</div>
          <div style="font-size:12px;color:#9ca3af;margin-top:2px">#${d.receiptNumber||'001'}</div></div>
        <div style="background:#ecfdf5;border-radius:50%;width:56px;height:56px;display:flex;align-items:center;justify-content:center">
          <span style="font-size:24px">✅</span></div></div>
      <div style="background:#f9fafb;border-radius:8px;padding:16px;margin-bottom:20px">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-size:12px;color:#6b7280">From</span><span style="font-size:13px;font-weight:600">${d.payerName||''}</span></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-size:12px;color:#6b7280">Date</span><span style="font-size:13px;font-weight:600">${formatDate(d.date)}</span></div>
        <div style="display:flex;justify-content:space-between"><span style="font-size:12px;color:#6b7280">Method</span><span style="font-size:13px;font-weight:600">${d.paymentMethod||'Cash'}</span></div>
      </div>
      <div style="text-align:center;padding:20px;background:linear-gradient(135deg,#f0fdf4,#ecfdf5);border-radius:12px">
        <div style="font-size:13px;color:#059669;font-weight:600">Total Received</div>
        <div style="font-size:40px;font-weight:900;color:#065f46;margin:4px 0">${formatCurrency(d.amount)}</div>
      </div>
    </div>`,
};

/* ══════════════════════════════════════════════════════════════════
   BILL TEMPLATES
═══════════════════════════════════════════════════════════════════ */
const BillTemplates = {
  1: (d) => `
    <div style="font-family:Arial,sans-serif;background:#fff;padding:40px;min-height:900px">
      <div style="border-bottom:3px solid #ea580c;padding-bottom:16px;margin-bottom:20px;display:flex;justify-content:space-between">
        <div><div style="font-size:30px;font-weight:900;color:#ea580c">BILL</div>
          <div style="font-size:12px;color:#6b7280">${d.billNumber||'BILL-001'} · ${formatDate(d.date)}</div></div>
        <div style="text-align:right"><div style="font-size:16px;font-weight:700">${d.companyName||'Company'}</div>
          <div style="font-size:11px;color:#6b7280">${d.companyAddress||''}</div></div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:20px">
        <div style="background:#fff7ed;border-radius:8px;padding:14px;flex:1;margin-right:12px">
          <div style="font-size:10px;font-weight:700;color:#ea580c;text-transform:uppercase;margin-bottom:6px">Bill To</div>
          <div style="font-size:14px;font-weight:700">${d.clientName||'Client'}</div>
          <div style="font-size:12px;color:#6b7280">${d.clientAddress||''}</div>
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
        <thead><tr style="background:#ea580c">
          <th style="padding:9px 12px;text-align:left;font-size:11px;color:#fff;font-weight:700">Description</th>
          <th style="padding:9px 12px;text-align:center;font-size:11px;color:#fff;font-weight:700">Qty</th>
          <th style="padding:9px 12px;text-align:right;font-size:11px;color:#fff;font-weight:700">Rate</th>
          <th style="padding:9px 12px;text-align:right;font-size:11px;color:#fff;font-weight:700">Amount</th>
        </tr></thead>
        <tbody>
          ${(d.items||[]).map((it,i)=>`<tr style="background:${i%2===0?'#fff7ed':'#fff'};border-bottom:1px solid #fed7aa">
            <td style="padding:8px 12px;font-size:13px">${it.description||''}</td>
            <td style="padding:8px 12px;text-align:center;font-size:13px">${it.quantity||0}</td>
            <td style="padding:8px 12px;text-align:right;font-size:13px">${formatCurrency(it.rate)}</td>
            <td style="padding:8px 12px;text-align:right;font-size:13px;font-weight:600">${formatCurrency(it.amount)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <div style="display:flex;justify-content:flex-end"><div style="width:200px">
        <div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0;color:#6b7280"><span>Subtotal</span><span>${formatCurrency(d.subtotal)}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0;color:#6b7280"><span>Tax</span><span>${formatCurrency(d.tax)}</span></div>
        <div style="background:#ea580c;border-radius:8px;padding:8px 12px;margin-top:6px;display:flex;justify-content:space-between">
          <span style="font-size:14px;font-weight:900;color:#fff">TOTAL</span>
          <span style="font-size:14px;font-weight:900;color:#fff">${formatCurrency(d.total)}</span>
        </div>
      </div></div>
    </div>`,
};

/* ══════════════════════════════════════════════════════════════════
   CERTIFICATE TEMPLATES
═══════════════════════════════════════════════════════════════════ */
const CertificateTemplates = {
  1: (d) => `
    <div style="font-family:'Georgia',serif;background:linear-gradient(135deg,#fdf2f8,#fce7f3,#fff);padding:50px;min-height:600px;position:relative;text-align:center;border:1px solid #f9a8d4">
      <div style="border:3px double #ec4899;padding:30px;border-radius:4px">
        <div style="font-size:11px;letter-spacing:4px;color:#9d174d;text-transform:uppercase;margin-bottom:12px">Certificate of</div>
        <div style="font-size:40px;font-weight:700;color:#831843;margin-bottom:8px">${d.certificateTitle||'Achievement'}</div>
        <div style="width:60px;height:2px;background:#ec4899;margin:0 auto 20px"></div>
        <div style="font-size:14px;color:#6b7280;font-style:italic;margin-bottom:12px">This is to certify that</div>
        <div style="font-size:32px;font-weight:700;color:#9d174d;font-style:italic;border-bottom:2px solid #f9a8d4;display:inline-block;padding-bottom:4px;margin-bottom:16px">${d.recipientName||'Recipient Name'}</div>
        <div style="font-size:14px;color:#374151;line-height:1.8;max-width:480px;margin:0 auto 20px">${d.description||'has successfully completed the program and demonstrated excellence.'}</div>
        ${d.courseName?`<div style="font-size:16px;font-weight:700;color:#9d174d;margin-bottom:16px">"${d.courseName}"</div>`:''}
        <div style="display:flex;justify-content:space-around;margin-top:30px">
          <div><div style="width:100px;height:1px;background:#d1d5db;margin-bottom:6px"></div>
            <div style="font-size:11px;color:#6b7280">${d.authorizedBy||'Director'}</div>
            <div style="font-size:10px;color:#9ca3af">${formatDate(d.date)||''}</div></div>
          <div><div style="width:100px;height:1px;background:#d1d5db;margin-bottom:6px"></div>
            <div style="font-size:11px;color:#6b7280">${d.companyName||'Organisation'}</div>
          </div>
        </div>
      </div>
    </div>`,

  2: (d) => `
    <div style="font-family:'Georgia',serif;background:linear-gradient(135deg,#fffbeb,#fef3c7);padding:50px;min-height:600px;text-align:center;border:4px solid #d97706;position:relative">
      <div style="position:absolute;top:12px;left:12px;right:12px;bottom:12px;border:1px solid #fbbf24;border-radius:4px;pointer-events:none"></div>
      <div style="font-size:10px;letter-spacing:6px;color:#92400e;text-transform:uppercase;margin-bottom:8px">✦ Official Certification ✦</div>
      <div style="font-size:44px;font-weight:700;color:#78350f;text-shadow:1px 1px 0 #fbbf24">Certificate</div>
      <div style="font-size:14px;color:#92400e;margin-bottom:20px;font-style:italic">of Excellence</div>
      <div style="font-size:14px;color:#6b7280;margin-bottom:10px;font-style:italic">Proudly presented to</div>
      <div style="font-size:36px;font-weight:700;color:#78350f;font-style:italic;margin-bottom:12px">${d.recipientName||'Recipient Name'}</div>
      <div style="font-size:14px;color:#374151;line-height:1.8;max-width:440px;margin:0 auto 24px">${d.description||'For outstanding performance and dedication.'}</div>
      ${d.courseName?`<div style="font-size:15px;font-weight:700;color:#92400e;background:#fffbeb;border:1px solid #fcd34d;border-radius:6px;display:inline-block;padding:6px 18px;margin-bottom:20px">${d.courseName}</div>`:''}
      <div style="display:flex;justify-content:space-around;margin-top:24px">
        <div style="text-align:center"><div style="font-size:14px;font-weight:700;color:#78350f">${d.authorizedBy||'Authorized By'}</div>
          <div style="width:100px;height:1px;background:#d97706;margin:6px auto"></div>
          <div style="font-size:11px;color:#92400e">Signature</div></div>
        <div style="text-align:center"><div style="font-size:14px;font-weight:700;color:#78350f">${formatDate(d.date)}</div>
          <div style="width:100px;height:1px;background:#d97706;margin:6px auto"></div>
          <div style="font-size:11px;color:#92400e">Date</div></div>
      </div>
    </div>`,
};

/* ══════════════════════════════════════════════════════════════════
   QUOTATION TEMPLATES
═══════════════════════════════════════════════════════════════════ */
const QuotationTemplates = {
  1: (d) => `
    <div style="font-family:Arial,sans-serif;background:#fff;padding:40px;min-height:900px">
      <div style="background:linear-gradient(135deg,#6d28d9,#7c3aed);padding:28px;border-radius:12px;margin-bottom:24px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div><div style="font-size:28px;font-weight:900;color:#fff;letter-spacing:2px">QUOTATION</div>
            <div style="font-size:12px;color:#c4b5fd;margin-top:2px">${d.quotationNumber||'QUO-001'} · ${formatDate(d.date)}</div>
            ${d.validUntil?`<div style="font-size:11px;color:#fbbf24;margin-top:2px">Valid until: ${formatDate(d.validUntil)}</div>`:''}
          </div>
          <div style="text-align:right"><div style="font-size:16px;font-weight:700;color:#fff">${d.companyName||'Company'}</div>
            <div style="font-size:11px;color:#c4b5fd">${d.companyEmail||''}</div></div>
        </div>
      </div>
      <div style="display:flex;gap:16px;margin-bottom:24px">
        <div style="flex:1;border:1px solid #ede9fe;border-radius:8px;padding:14px">
          <div style="font-size:10px;font-weight:700;color:#7c3aed;text-transform:uppercase;margin-bottom:6px">Prepared For</div>
          <div style="font-size:13px;font-weight:700">${d.clientName||''}</div>
          <div style="font-size:11px;color:#6b7280">${d.clientAddress||''}</div>
        </div>
        <div style="flex:1;border:1px solid #ede9fe;border-radius:8px;padding:14px;background:#faf5ff">
          <div style="font-size:10px;font-weight:700;color:#7c3aed;text-transform:uppercase;margin-bottom:6px">Quotation Details</div>
          <div style="font-size:12px;color:#6b7280">No: <strong>${d.quotationNumber||''}</strong></div>
          <div style="font-size:12px;color:#6b7280;margin-top:3px">Date: <strong>${formatDate(d.date)}</strong></div>
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        <thead><tr style="background:#7c3aed">
          <th style="padding:10px 12px;text-align:left;font-size:11px;color:#fff;font-weight:700">Description</th>
          <th style="padding:10px 12px;text-align:center;font-size:11px;color:#fff;font-weight:700">Qty</th>
          <th style="padding:10px 12px;text-align:right;font-size:11px;color:#fff;font-weight:700">Rate</th>
          <th style="padding:10px 12px;text-align:right;font-size:11px;color:#fff;font-weight:700">Amount</th>
        </tr></thead>
        <tbody>
          ${(d.items||[]).map((it,i)=>`<tr style="background:${i%2===0?'#faf5ff':'#fff'};border-bottom:1px solid #ede9fe">
            <td style="padding:9px 12px;font-size:13px">${it.description||''}</td>
            <td style="padding:9px 12px;text-align:center;font-size:13px">${it.quantity||0}</td>
            <td style="padding:9px 12px;text-align:right;font-size:13px">${formatCurrency(it.rate)}</td>
            <td style="padding:9px 12px;text-align:right;font-size:13px;font-weight:600;color:#7c3aed">${formatCurrency(it.amount)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <div style="display:flex;justify-content:flex-end"><div style="width:200px">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#6b7280;padding:4px 0"><span>Subtotal</span><span>${formatCurrency(d.subtotal)}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#6b7280;padding:4px 0"><span>Tax</span><span>${formatCurrency(d.tax)}</span></div>
        <div style="background:#7c3aed;border-radius:8px;padding:10px 12px;margin-top:8px;display:flex;justify-content:space-between">
          <span style="font-size:14px;font-weight:900;color:#fff">Total</span>
          <span style="font-size:14px;font-weight:900;color:#fff">${formatCurrency(d.total)}</span>
        </div>
      </div></div>
      ${d.notes?`<div style="margin-top:16px;background:#faf5ff;border-left:3px solid #7c3aed;padding:10px 14px;font-size:12px;color:#374151;border-radius:0 8px 8px 0">${d.notes}</div>`:''}
    </div>`,
};

/* ══════════════════════════════════════════════════════════════════
   OFFER LETTER TEMPLATES
═══════════════════════════════════════════════════════════════════ */
const OfferLetterTemplates = {
  1: (d) => `
    <div style="font-family:Arial,sans-serif;background:#fff;padding:48px;min-height:900px">
      <div style="border-bottom:2px solid #4f46e5;padding-bottom:16px;margin-bottom:28px;display:flex;justify-content:space-between;align-items:flex-end">
        <div><div style="font-size:20px;font-weight:900;color:#312e81">${d.companyName||'Company Name'}</div>
          <div style="font-size:11px;color:#6b7280">${d.companyAddress||''} · ${d.companyPhone||''}</div></div>
        <div style="text-align:right"><div style="font-size:9px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px">Date</div>
          <div style="font-size:13px;font-weight:600;color:#111">${formatDate(d.date)}</div></div>
      </div>
      <div style="margin-bottom:20px"><div style="font-size:11px;color:#6b7280;margin-bottom:8px">Dear ${d.candidateName||'Candidate Name'},</div>
        <div style="font-size:20px;font-weight:700;color:#312e81;border-bottom:1px solid #c7d2fe;padding-bottom:8px;margin-bottom:16px">Letter of Offer</div></div>
      <p style="font-size:13px;color:#374151;line-height:1.8;margin-bottom:16px">We are pleased to offer you the position of <strong>${d.jobTitle||'Job Title'}</strong> at <strong>${d.companyName||'Company'}</strong>. We were impressed with your qualifications and believe you will be a valuable addition to our team.</p>
      <div style="background:#f5f3ff;border-radius:10px;padding:20px;margin-bottom:20px">
        <div style="font-size:12px;font-weight:700;color:#4f46e5;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">Key Terms</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div style="background:white;border-radius:8px;padding:12px"><div style="font-size:10px;color:#9ca3af;text-transform:uppercase;margin-bottom:3px">Position</div><div style="font-size:13px;font-weight:700;color:#111">${d.jobTitle||''}</div></div>
          <div style="background:white;border-radius:8px;padding:12px"><div style="font-size:10px;color:#9ca3af;text-transform:uppercase;margin-bottom:3px">Department</div><div style="font-size:13px;font-weight:700;color:#111">${d.department||''}</div></div>
          <div style="background:white;border-radius:8px;padding:12px"><div style="font-size:10px;color:#9ca3af;text-transform:uppercase;margin-bottom:3px">Annual CTC</div><div style="font-size:13px;font-weight:700;color:#059669">${d.salary||''}</div></div>
          <div style="background:white;border-radius:8px;padding:12px"><div style="font-size:10px;color:#9ca3af;text-transform:uppercase;margin-bottom:3px">Joining Date</div><div style="font-size:13px;font-weight:700;color:#111">${formatDate(d.joiningDate)||''}</div></div>
        </div>
      </div>
      <p style="font-size:13px;color:#374151;line-height:1.8;margin-bottom:20px">${d.additionalTerms||'This offer is contingent upon successful background verification and submission of required documents.'}</p>
      <div style="margin-top:32px;display:flex;justify-content:space-between">
        <div><div style="font-size:11px;color:#6b7280;margin-bottom:20px">Authorised Signatory</div>
          <div style="width:120px;height:1px;background:#d1d5db"></div>
          <div style="font-size:12px;font-weight:700;color:#111;margin-top:4px">${d.hrName||'HR Manager'}</div>
          <div style="font-size:11px;color:#6b7280">${d.companyName||''}</div></div>
        <div style="text-align:right"><div style="font-size:11px;color:#6b7280;margin-bottom:20px">Candidate Acceptance</div>
          <div style="width:120px;height:1px;background:#d1d5db;margin-left:auto"></div>
          <div style="font-size:12px;font-weight:700;color:#111;margin-top:4px">${d.candidateName||''}</div></div>
      </div>
    </div>`,
};

/* ══════════════════════════════════════════════════════════════════
   APPOINTMENT LETTER TEMPLATES
═══════════════════════════════════════════════════════════════════ */
const AppointmentLetterTemplates = {
  1: (d) => `
    <div style="font-family:Arial,sans-serif;background:#fff;padding:48px;min-height:900px">
      <div style="background:#0e7490;padding:20px 28px;border-radius:10px;margin-bottom:28px;display:flex;justify-content:space-between;align-items:center">
        <div><div style="font-size:20px;font-weight:900;color:#fff">${d.companyName||'Company Name'}</div>
          <div style="font-size:11px;color:#a5f3fc">${d.companyAddress||''}</div></div>
        <div style="font-size:11px;color:#a5f3fc;text-align:right">${formatDate(d.date)}</div>
      </div>
      <div style="margin-bottom:20px"><div style="font-size:22px;font-weight:900;color:#0e7490;margin-bottom:4px">Appointment Letter</div>
        <div style="width:50px;height:2px;background:#06b6d4"></div></div>
      <p style="font-size:13px;color:#374151;line-height:1.8;margin-bottom:16px">Dear <strong>${d.candidateName||'Candidate'}</strong>,</p>
      <p style="font-size:13px;color:#374151;line-height:1.8;margin-bottom:20px">With reference to your interview and subsequent discussions, we are pleased to appoint you as <strong>${d.jobTitle||'Position'}</strong> with effect from <strong>${formatDate(d.joiningDate)||''}</strong>.</p>
      <div style="border:1px solid #cffafe;border-radius:10px;padding:20px;margin-bottom:20px">
        <div style="font-size:12px;font-weight:700;color:#0e7490;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">Appointment Details</div>
        <table style="width:100%;font-size:13px;border-collapse:collapse">
          <tr><td style="padding:6px 0;color:#6b7280;width:40%">Designation</td><td style="font-weight:600;color:#111">${d.jobTitle||''}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Department</td><td style="font-weight:600;color:#111">${d.department||''}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Gross Salary</td><td style="font-weight:600;color:#059669">${d.salary||''}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Date of Joining</td><td style="font-weight:600;color:#111">${formatDate(d.joiningDate)||''}</td></tr>
          ${d.location?`<tr><td style="padding:6px 0;color:#6b7280">Location</td><td style="font-weight:600;color:#111">${d.location}</td></tr>`:''}
        </table>
      </div>
      <p style="font-size:13px;color:#374151;line-height:1.8;margin-bottom:28px">${d.additionalTerms||'You are requested to report on the above joining date with all original certificates and documents.'}</p>
      <div><div style="width:120px;height:1px;background:#d1d5db;margin-bottom:6px"></div>
        <div style="font-size:13px;font-weight:700">${d.hrName||'HR Manager'}</div>
        <div style="font-size:12px;color:#6b7280">${d.companyName||''}</div></div>
    </div>`,
};

/* ══════════════════════════════════════════════════════════════════
   ID CARD TEMPLATES
═══════════════════════════════════════════════════════════════════ */
const IDCardTemplates = {
  1: (d) => `
    <div style="font-family:Arial,sans-serif;background:#fff;padding:40px;min-height:400px;display:flex;justify-content:center">
      <div style="width:320px;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.15)">
        <div style="background:linear-gradient(135deg,#1e3a8a,#2563eb);padding:20px;text-align:center">
          <div style="font-size:14px;font-weight:900;color:#fff;letter-spacing:2px">${(d.companyName||'COMPANY').toUpperCase()}</div>
          <div style="font-size:9px;color:#93c5fd;text-transform:uppercase;letter-spacing:1px;margin-top:2px">Employee ID Card</div>
        </div>
        <div style="background:#fff;padding:20px;text-align:center">
          <div style="width:72px;height:72px;border-radius:50%;background:#e0e7ff;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;font-size:28px;border:3px solid #2563eb">
            ${d.photo ? `<img src="${d.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">` : '👤'}
          </div>
          <div style="font-size:16px;font-weight:900;color:#111;margin-bottom:2px">${d.employeeName||'Employee Name'}</div>
          <div style="font-size:12px;color:#6b7280;margin-bottom:2px">${d.designation||'Designation'}</div>
          <div style="font-size:11px;color:#9ca3af;margin-bottom:14px">${d.department||''}</div>
          <div style="background:#f0f4ff;border-radius:8px;padding:10px;text-align:left;margin-bottom:10px">
            <div style="font-size:11px;color:#6b7280;margin-bottom:3px">Employee ID: <strong style="color:#111">${d.employeeId||'EMP-001'}</strong></div>
            ${d.phone?`<div style="font-size:11px;color:#6b7280">Phone: <strong style="color:#111">${d.phone}</strong></div>`:''}
            ${d.email?`<div style="font-size:11px;color:#6b7280;word-break:break-all">Email: <strong style="color:#111">${d.email}</strong></div>`:''}
          </div>
          <div style="font-size:14px;font-family:monospace;letter-spacing:3px;color:#374151;background:#f9fafb;border-radius:6px;padding:6px">
            ||| |||| ||||| |||
          </div>
        </div>
        <div style="background:#1e3a8a;padding:8px;text-align:center">
          <div style="font-size:9px;color:#93c5fd">If found, please return to: ${d.companyPhone||d.companyName||''}</div>
        </div>
      </div>
    </div>`,

  2: (d) => `
    <div style="font-family:Arial,sans-serif;background:#fff;padding:40px;min-height:400px;display:flex;justify-content:center">
      <div style="width:320px;border:2px solid #059669;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.1)">
        <div style="background:linear-gradient(135deg,#064e3b,#059669);padding:16px 20px;display:flex;align-items:center;gap:12px">
          <div style="width:40px;height:40px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;color:#fff">🏢</div>
          <div><div style="font-size:14px;font-weight:900;color:#fff">${d.companyName||'Company'}</div>
            <div style="font-size:9px;color:#a7f3d0;text-transform:uppercase;letter-spacing:1px">Staff Identity Card</div></div>
        </div>
        <div style="padding:18px;text-align:center;background:#f0fdf4">
          <div style="width:64px;height:64px;border-radius:50%;background:#d1fae5;margin:0 auto 10px;display:flex;align-items:center;justify-content:center;font-size:24px;border:2px solid #059669">👤</div>
          <div style="font-size:15px;font-weight:900;color:#111;margin-bottom:2px">${d.employeeName||'Employee Name'}</div>
          <div style="font-size:11px;font-weight:700;color:#059669;margin-bottom:8px">${d.designation||'Designation'}</div>
          <div style="background:white;border-radius:8px;padding:10px;text-align:left">
            <div style="font-size:11px;color:#6b7280;margin-bottom:3px"><span style="font-weight:700">ID:</span> ${d.employeeId||'EMP-001'}</div>
            <div style="font-size:11px;color:#6b7280;margin-bottom:3px"><span style="font-weight:700">Dept:</span> ${d.department||''}</div>
            ${d.phone?`<div style="font-size:11px;color:#6b7280"><span style="font-weight:700">Phone:</span> ${d.phone}</div>`:''}
          </div>
        </div>
      </div>
    </div>`,
};

/* ══════════════════════════════════════════════════════════════════
   EVENT PASS TEMPLATES
═══════════════════════════════════════════════════════════════════ */
const EventPassTemplates = {
  1: (d) => `
    <div style="font-family:Arial,sans-serif;background:#fff;padding:40px;min-height:400px;display:flex;justify-content:center">
      <div style="width:380px;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.15)">
        <div style="background:linear-gradient(135deg,#0d9488,#0f766e);padding:24px">
          <div style="font-size:9px;text-transform:uppercase;letter-spacing:3px;color:rgba(255,255,255,0.7);margin-bottom:4px">Event Pass</div>
          <div style="font-size:24px;font-weight:900;color:#fff;margin-bottom:4px">${d.eventName||'Event Name'}</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.8)">${d.eventDate||''} · ${d.venue||''}</div>
        </div>
        <div style="background:#fff;padding:20px;display:flex;align-items:center;gap:16px">
          <div style="flex:1">
            <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;margin-bottom:3px">Attendee</div>
            <div style="font-size:16px;font-weight:900;color:#111">${d.passHolder||'Attendee Name'}</div>
            ${d.passType?`<div style="font-size:11px;font-weight:700;color:#0d9488;background:#ccfbf1;border-radius:20px;display:inline-block;padding:2px 10px;margin-top:4px">${d.passType}</div>`:''}
            ${d.passNumber?`<div style="font-size:11px;color:#9ca3af;margin-top:6px">#${d.passNumber}</div>`:''}
          </div>
          <div style="text-align:center">
            <div style="font-size:10px;color:#9ca3af;margin-bottom:4px">QR / Barcode</div>
            <div style="width:60px;height:60px;background:#f3f4f6;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:8px;font-family:monospace;color:#374151;line-height:1.2">
              █▀▀▄<br>█  █<br>▄▀▀█<br>▄▀▄█
            </div>
          </div>
        </div>
        <div style="background:#f0fdfa;border-top:2px dashed #99f6e4;padding:12px 20px;display:flex;justify-content:space-between;align-items:center">
          <div style="font-size:10px;color:#0d9488">Tear here ✂</div>
          <div style="font-size:11px;color:#374151;font-weight:600">${d.companyName||'Organiser'}</div>
        </div>
      </div>
    </div>`,
};

/* ══════════════════════════════════════════════════════════════════
   ESTIMATE TEMPLATES
═══════════════════════════════════════════════════════════════════ */
const EstimateTemplates = {
  1: (d) => `
    <div style="font-family:Arial,sans-serif;background:#fff;padding:40px;min-height:900px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px">
        <div><div style="font-size:30px;font-weight:300;color:#d97706;letter-spacing:3px">ESTIMATE</div>
          <div style="width:40px;height:3px;background:#d97706;margin-top:4px"></div>
          <div style="font-size:12px;color:#6b7280;margin-top:6px">${d.estimateNumber||'EST-001'} · ${formatDate(d.date)}</div></div>
        <div style="text-align:right"><div style="font-size:16px;font-weight:700">${d.companyName||'Company'}</div>
          <div style="font-size:11px;color:#6b7280">${d.companyAddress||''}</div></div>
      </div>
      <div style="display:flex;gap:16px;margin-bottom:24px">
        <div style="flex:1;border:1px solid #fde68a;border-radius:8px;padding:14px">
          <div style="font-size:10px;font-weight:700;color:#d97706;text-transform:uppercase;margin-bottom:6px">Prepared For</div>
          <div style="font-size:13px;font-weight:700">${d.clientName||''}</div>
          <div style="font-size:11px;color:#6b7280">${d.clientAddress||''}</div>
        </div>
        ${d.validUntil?`<div style="flex:1;background:#fffbeb;border-radius:8px;padding:14px">
          <div style="font-size:10px;font-weight:700;color:#d97706;text-transform:uppercase;margin-bottom:6px">Valid Until</div>
          <div style="font-size:15px;font-weight:700;color:#92400e">${formatDate(d.validUntil)}</div>
        </div>`:''}
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        <thead><tr style="background:#d97706">
          <th style="padding:10px 12px;text-align:left;font-size:11px;color:#fff;font-weight:700">Description</th>
          <th style="padding:10px 12px;text-align:center;font-size:11px;color:#fff;font-weight:700">Qty</th>
          <th style="padding:10px 12px;text-align:right;font-size:11px;color:#fff;font-weight:700">Rate</th>
          <th style="padding:10px 12px;text-align:right;font-size:11px;color:#fff;font-weight:700">Amount</th>
        </tr></thead>
        <tbody>
          ${(d.items||[]).map((it,i)=>`<tr style="background:${i%2===0?'#fffbeb':'#fff'};border-bottom:1px solid #fde68a">
            <td style="padding:9px 12px;font-size:13px">${it.description||''}</td>
            <td style="padding:9px 12px;text-align:center;font-size:13px">${it.quantity||0}</td>
            <td style="padding:9px 12px;text-align:right;font-size:13px">${formatCurrency(it.rate)}</td>
            <td style="padding:9px 12px;text-align:right;font-size:13px;font-weight:600;color:#d97706">${formatCurrency(it.amount)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <div style="display:flex;justify-content:flex-end"><div style="width:200px">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#6b7280;padding:4px 0"><span>Subtotal</span><span>${formatCurrency(d.subtotal)}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#6b7280;padding:4px 0"><span>Tax</span><span>${formatCurrency(d.tax)}</span></div>
        <div style="background:#d97706;border-radius:8px;padding:10px 12px;margin-top:8px;display:flex;justify-content:space-between">
          <span style="font-size:14px;font-weight:900;color:#fff">Total</span>
          <span style="font-size:14px;font-weight:900;color:#fff">${formatCurrency(d.total)}</span>
        </div>
      </div></div>
    </div>`,
};

/* ── Registry ──────────────────────────────────────────────────── */
const TEMPLATE_REGISTRY = {
  invoice: InvoiceTemplates,
  receipt: ReceiptTemplates,
  bill: BillTemplates,
  certificate: CertificateTemplates,
  quotation: QuotationTemplates,
  estimate: EstimateTemplates,
  'offer-letter': OfferLetterTemplates,
  'appointment-letter': AppointmentLetterTemplates,
  'id-card': IDCardTemplates,
  'event-pass': EventPassTemplates,
};

const TEMPLATE_COUNTS = {
  invoice: 3, receipt: 2, bill: 1, certificate: 2, quotation: 1,
  estimate: 1, 'offer-letter': 1, 'appointment-letter': 1, 'id-card': 2, 'event-pass': 1,
};

function renderTemplate(docType, templateId, data) {
  const registry = TEMPLATE_REGISTRY[docType];
  if (!registry) return '<div class="p-8 text-center text-gray-400">Template not found.</div>';
  const tplFn = registry[templateId] || registry[Object.keys(registry)[0]];
  return tplFn(data || {});
}

function getTemplateCount(docType) {
  return TEMPLATE_COUNTS[docType] || 1;
}
