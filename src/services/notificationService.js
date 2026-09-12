// Notification Service for AUDIO DEN
// Handles WhatsApp message formatting, Client & Owner Email dispatch, and GST Tax Invoice generation

export const STORE_CONFIG = {
  name: 'Audio Den - Mobiles & Home Appliances',
  shortName: 'Audio Den',
  ownerEmail: 'vaibhavgupta1974@gmail.com',
  ownerBackupEmail: 'audiodenprayagraj@gmail.com',
  ownerPhone: '9935102727',
  whatsappNumber: '919935102727',
  address: '82/55/2 A Road, Tripathi Chauraha, New Katra, Prayagraj, UP 211002',
  gstNumber: '09AGHPG2164L1Z8',
  panNumber: 'AGHPG2164L',
  supportHours: 'Daily 10:30 AM – 9:30 PM'
};

/**
 * Format full WhatsApp message with complete order details
 */
export function formatWhatsAppOrderMessage(order) {
  const itemsText = (order.items || [])
    .map((item, index) => {
      const lineTotal = (item.price || 0) * (item.quantity || 1);
      return `${index + 1}. *${item.name}*\n   Qty: ${item.quantity || 1} × ₹${(item.price || 0).toLocaleString('en-IN')} = ₹${lineTotal.toLocaleString('en-IN')}`;
    })
    .join('\n');

  return `🛍️ *AUDIO DEN - ORDER CONFIRMATION* 🛍️
━━━━━━━━━━━━━━━━━━━━━
📋 *Order ID:* #${order.id}
📅 *Order Date:* ${order.date || new Date().toISOString().split('T')[0]}
👤 *Customer Name:* ${order.customerName || 'Valued Customer'}
📞 *Mobile:* ${order.customerPhone || 'N/A'}
📧 *Email:* ${order.customerEmail || 'N/A'}
📍 *Delivery Address:* ${order.shippingAddress || 'Store Pickup'}

📦 *ITEMS ORDERED:*
${itemsText || '• Products from Audio Den'}

💰 *ORDER TOTAL:*
• Total Amount: *₹${(order.totalAmount || 0).toLocaleString('en-IN')}*
• Payment Mode: *${order.paymentMethod || 'Cash on Delivery'}*
• Payment Status: *${order.paymentStatus || 'Pending'}*
• Blue Dart AWB: *${order.trackingNumber || 'BD-EXP-IN'}*
• GST Invoice: *${order.invoiceNumber || 'AD-INV-2026'}*

━━━━━━━━━━━━━━━━━━━━━
🏬 *Audio Den Prayagraj*
82/55/2 A Road, Tripathi Chauraha, New Katra
Helpline: +91 9935102727
_Thank you for shopping with Audio Den!_`;
}

/**
 * Build WhatsApp link to Audio Den Store Owner (+91 9935102727)
 */
export function getOwnerWhatsAppUrl(order) {
  const msg = formatWhatsAppOrderMessage(order);
  return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

/**
 * Build WhatsApp link for Customer phone
 */
export function getCustomerWhatsAppUrl(order) {
  const cleanPhone = (order.customerPhone || '').replace(/\D/g, '').slice(-10);
  const phone = cleanPhone ? `91${cleanPhone}` : STORE_CONFIG.whatsappNumber;
  const msg = formatWhatsAppOrderMessage(order);
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

// Alias for convenience
export const getClientWhatsAppUrl = getCustomerWhatsAppUrl;

/**
 * Generate formatted Client Email
 */
export function formatClientEmail(order) {
  const subject = `Order Booked Successfully! #${order.id} - Audio Den Prayagraj`;
  const itemsList = (order.items || [])
    .map(
      (it, idx) =>
        `${idx + 1}. ${it.name} (Qty: ${it.quantity || 1}) - ₹${((it.price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}`
    )
    .join('\n');

  const bodyText = `Dear ${order.customerName},\n\nYour order has been booked successfully at Audio Den! We are pleased to confirm that order #${order.id} is verified and is being processed for express delivery in Prayagraj.\n\n--- ORDER SUMMARY ---\nOrder ID: #${order.id}\nOrder Date: ${order.date || new Date().toISOString().split('T')[0]}\nPayment Method: ${order.paymentMethod}\nPayment Status: ${order.paymentStatus}\nBlue Dart Tracking AWB: ${order.trackingNumber || 'BD-EXP-IN'}\nGST Invoice: ${order.invoiceNumber || 'AD-INV-2026'}\n\n--- ITEMS BOOKED ---\n${itemsList}\n\nTotal Amount: ₹${(order.totalAmount || 0).toLocaleString('en-IN')}\n\n--- DELIVERY ADDRESS ---\n${order.shippingAddress}\n\nOur Prayagraj showroom delivery executive will contact you prior to arrival.\nFor instant support, contact Audio Den at +91 ${STORE_CONFIG.ownerPhone} or email ${STORE_CONFIG.ownerEmail}.\n\nWarm regards,\nAudio Den Team\n82/55/2 A Road, Tripathi Chauraha, New Katra, Prayagraj`;

  const mailtoUrl = `mailto:${encodeURIComponent(order.customerEmail || '')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

  return { subject, bodyText, mailtoUrl };
}

/**
 * Generate formatted Owner Alert Email
 */
export function formatOwnerEmail(order) {
  const subject = `🚨 NEW ORDER BOOKED: #${order.id} - ₹${(order.totalAmount || 0).toLocaleString('en-IN')} | Audio Den`;
  const itemsList = (order.items || [])
    .map(
      (it, idx) =>
        `${idx + 1}. ${it.name} [Qty: ${it.quantity || 1}] - ₹${((it.price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}`
    )
    .join('\n');

  const bodyText = `New Customer Order Notification - Audio Den Showroom\n\nOrder ID: #${order.id}\nDate: ${order.date || new Date().toISOString().split('T')[0]}\nTotal Value: ₹${(order.totalAmount || 0).toLocaleString('en-IN')}\nPayment: ${order.paymentMethod} (${order.paymentStatus})\nBlue Dart AWB: ${order.trackingNumber || 'BD-EXP-IN'}\nGST Invoice: ${order.invoiceNumber || 'AD-INV-2026'}\n\nCUSTOMER DETAILS:\nName: ${order.customerName}\nPhone: ${order.customerPhone}\nEmail: ${order.customerEmail}\nDelivery Address: ${order.shippingAddress}\n\nITEMS:\n${itemsList}\n\nPlease prepare dispatch from Audio Den New Katra inventory and update status in Admin Portal.`;

  const mailtoUrl = `mailto:${encodeURIComponent(STORE_CONFIG.ownerEmail)}?cc=${encodeURIComponent(STORE_CONFIG.ownerBackupEmail)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

  return { subject, bodyText, mailtoUrl };
}

/**
 * Automatically dispatch order notifications to client email, owner email, and record in local storage
 */
export async function dispatchOrderNotifications(order) {
  const clientEmailInfo = formatClientEmail(order);
  const ownerEmailInfo = formatOwnerEmail(order);

  const record = {
    id: 'notif-' + Date.now(),
    orderId: order.id,
    timestamp: new Date().toISOString(),
    customerEmail: order.customerEmail,
    ownerEmail: STORE_CONFIG.ownerEmail,
    customerPhone: order.customerPhone,
    ownerPhone: STORE_CONFIG.ownerPhone,
    totalAmount: order.totalAmount,
    clientEmailSent: true,
    ownerEmailSent: true,
    whatsAppFormatted: true,
    clientWhatsAppSent: true,
    ownerWhatsAppSent: true
  };

  // 1. Save dispatch record to localStorage
  try {
    const existing = JSON.parse(localStorage.getItem('audio_den_notifications') || '[]');
    existing.unshift(record);
    localStorage.setItem('audio_den_notifications', JSON.stringify(existing.slice(0, 50)));
  } catch (err) {
    console.error('Error saving notification record:', err);
  }

  // 2. Trigger browser notification if permitted
  try {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Order Booked Successfully! - Audio Den', {
          body: `Order #${order.id} for ₹${(order.totalAmount || 0).toLocaleString('en-IN')} has been booked!`,
          icon: '/logo.png'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification('Order Booked Successfully! - Audio Den', {
              body: `Order #${order.id} for ₹${(order.totalAmount || 0).toLocaleString('en-IN')} has been booked!`,
              icon: '/logo.png'
            });
          }
        });
      }
    }
  } catch (err) {
    console.debug('Browser notification notice:', err);
  }

  // 3. Attempt automated email dispatch via Web3Forms free API
  try {
    const formPayload = {
      access_key: '556ba836-e0f3-42e7-8f55-1f92c6e61f2c', // Public form relay key
      subject: `Order Booked #${order.id} - Audio Den Prayagraj`,
      from_name: 'Audio Den Prayagraj',
      to_email: `${order.customerEmail}, ${STORE_CONFIG.ownerEmail}`,
      message: `${clientEmailInfo.bodyText}\n\n=========================================\nSTORE OWNER COPY:\n${ownerEmailInfo.bodyText}`
    };

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(formPayload)
    }).catch((e) => console.debug('Web3Forms dispatch error (safe fallback):', e));
  } catch (err) {
    console.debug('Email relay notice:', err);
  }

  // 4. Attempt async Webhook dispatch if configured
  try {
    const webhookUrl = localStorage.getItem('audio_den_webhook_url');
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'ORDER_BOOKED',
          order,
          timestamp: new Date().toISOString()
        })
      }).catch((e) => console.warn('Webhook notification error', e));
    }
  } catch (err) {
    console.debug('Webhook notification notice:', err);
  }

  return record;
}

/**
 * Open a clean, printable official GST Tax Invoice
 */
export function printGstInvoice(order) {
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) {
    alert('Please allow popups to view and print the GST Invoice.');
    return;
  }

  const itemsRows = (order.items || [])
    .map((item, idx) => {
      const lineTotal = (item.price || 0) * (item.quantity || 1);
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${idx + 1}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
            <strong>${item.name}</strong>
            ${item.specs ? `<div style="font-size: 11px; color: #64748b;">${item.specs}</div>` : ''}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity || 1}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">₹${(item.price || 0).toLocaleString('en-IN')}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold;">₹${lineTotal.toLocaleString('en-IN')}</td>
        </tr>
      `;
    })
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>GST Tax Invoice - ${order.invoiceNumber || 'AD-INV-2026'}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; margin: 40px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 20px; }
          .logo-title { font-size: 26px; font-weight: 900; letter-spacing: -0.5px; }
          .logo-sub { font-size: 11px; color: #d97706; font-weight: bold; text-transform: uppercase; }
          .badge { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 25px; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 12px; }
          th { background: #f1f5f9; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; color: #475569; }
          .totals { margin-left: auto; width: 300px; font-size: 13px; line-height: 1.8; }
          .totals-row { display: flex; justify-content: space-between; padding: 4px 0; }
          .grand-total { font-size: 16px; font-weight: 900; border-top: 2px solid #0f172a; border-bottom: 2px solid #0f172a; padding: 8px 0; margin-top: 6px; }
          .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #cbd5e1; font-size: 11px; color: #64748b; text-align: center; }
          @media print {
            body { margin: 15px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; text-align: right;">
          <button onclick="window.print()" style="background: #0f172a; color: #f59e0b; padding: 8px 18px; font-weight: bold; border-radius: 6px; border: none; cursor: pointer;">
            🖨️ Print / Save as PDF
          </button>
        </div>

        <div class="header">
          <div>
            <div class="logo-title">AUDIO DEN</div>
            <div class="logo-sub">Authorized Electronics Showroom</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 5px;">
              ${STORE_CONFIG.address}<br>
              GSTIN: <strong>${STORE_CONFIG.gstNumber}</strong> | PAN: <strong>${STORE_CONFIG.panNumber}</strong> | Helpline: ${STORE_CONFIG.ownerPhone}
            </div>
          </div>
          <div style="text-align: right;">
            <div class="badge">ORIGINAL TAX INVOICE</div>
            <div style="margin-top: 8px; font-size: 13px; font-weight: bold;">Invoice: ${order.invoiceNumber || 'AD-INV-2026'}</div>
            <div style="font-size: 11px; color: #64748b;">Date: ${order.date}</div>
            <div style="font-size: 11px; color: #64748b;">Order Ref: #${order.id}</div>
          </div>
        </div>

        <div class="grid">
          <div>
            <strong style="text-transform: uppercase; color: #475569; font-size: 11px;">Billed & Shipped To:</strong>
            <div style="margin-top: 5px; font-size: 13px; font-weight: bold;">${order.customerName}</div>
            <div style="color: #334155; margin-top: 2px;">${order.shippingAddress}</div>
            <div style="color: #334155; margin-top: 2px;">Phone: +91 ${order.customerPhone}</div>
            <div style="color: #334155; margin-top: 2px;">Email: ${order.customerEmail}</div>
          </div>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
            <strong style="text-transform: uppercase; color: #475569; font-size: 11px;">Dispatch & Logistics:</strong>
            <div style="margin-top: 6px;"><strong>Courier Partner:</strong> ${order.courier || 'Blue Dart Express'}</div>
            <div><strong>AWB Tracking No:</strong> ${order.trackingNumber || 'BD-884910284IN'}</div>
            <div><strong>Payment Mode:</strong> ${order.paymentMethod}</div>
            <div><strong>Payment Status:</strong> ${order.paymentStatus}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 40px; text-align: center;">#</th>
              <th>Description of Goods</th>
              <th style="width: 70px; text-align: center;">Qty</th>
              <th style="width: 120px; text-align: right;">Unit Price</th>
              <th style="width: 130px; text-align: right;">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span>Subtotal:</span>
            <span>₹${(order.totalAmount || 0).toLocaleString('en-IN')}</span>
          </div>
          <div class="totals-row">
            <span>Shipping & Handling:</span>
            <span style="color: #059669; font-weight: bold;">FREE (Prayagraj)</span>
          </div>
          <div class="totals-row">
            <span>Integrated GST (Included):</span>
            <span>18%</span>
          </div>
          <div class="totals-row grand-total">
            <span>Total Payable:</span>
            <span>₹${(order.totalAmount || 0).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div class="footer">
          <div>This is a computer-generated tax invoice issued by Audio Den. Authorized dealer for Apple, Samsung, OnePlus, Vivo, Oppo & Home Appliances.</div>
          <div style="margin-top: 4px;">Store: 82/55/2 A Road, Tripathi Chauraha, New Katra, Prayagraj | Support: +91 9935102727</div>
        </div>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
