import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

export async function sendOrderConfirmation(order: any, userEmail: string, userName: string) {
  const name = userName || 'Valued Customer';

  // Configure the email transporter inside the function to ensure fresh env variables
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST?.trim(),
    port: parseInt(process.env.SMTP_PORT?.trim() || '465'),
    secure: process.env.SMTP_SECURE?.trim() === 'true',
    auth: {
      user: process.env.SMTP_USER?.trim(),
      pass: process.env.SMTP_PASS?.trim(),
    },
    tls: {
      rejectUnauthorized: false 
    }
  });
  
  // HTML version for real inboxes
  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #1a1a1a; margin-bottom: 0;">THE NORTHEAST STORE</h1>
        <p style="color: #636e72; margin-top: 5px;">Authentic Foods of the Eight States</p>
      </div>
      <hr style="border: 0; border-top: 1px solid #eee;" />
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thank you for choosing The NorthEast Store! We've received your order and our team is already working on getting your treasures from the Eight States ready for shipment.</p>
      
      <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Order Summary</h3>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Total Amount:</strong> ₹${order.total.toFixed(2)}</p>
      </div>

      <h3>Items Ordered</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="text-align: left; border-bottom: 2px solid #eee;">
            <th style="padding: 10px 0;">Product</th>
            <th style="padding: 10px 0;">Qty</th>
            <th style="padding: 10px 0; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map((item: any) => `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0;">${item.product.name}</td>
              <td style="padding: 10px 0;">${item.quantity}</td>
              <td style="padding: 10px 0; text-align: right;">₹${item.price.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="margin-top: 20px;">
        <strong>Shipping To:</strong><br />
        ${order.shippingAddress}<br />
        ${order.city} - ${order.postalCode}
      </div>

      <p style="margin-top: 30px; font-size: 0.9rem; color: #636e72;">
        Stay Spicy,<br />
        <strong>The NorthEast Store Team</strong>
      </p>
    </div>
  `;

  const textContent = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           THE NORTHEAST STORE
        Order Confirmation Details
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date: ${new Date().toLocaleString()}
To: ${userEmail}
Subject: Order Placed Successfully! (Order ID: ${order.id})

Hi ${name},

Thank you for choosing The NorthEast Store! We've received your order...
(See HTML version for full details)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `;

  try {
    // 1. Try to send real email if configured
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const from = `"The NorthEast Store" <${process.env.SMTP_USER}>`;
      
      await transporter.sendMail({
        from: from,
        to: userEmail,
        bcc: process.env.SMTP_USER, // Always send a copy to the admin
        subject: `Your Order from The NorthEast Store (#${order.id.slice(-6)})`,
        text: textContent,
        html: htmlContent,
      });
      console.log(`[Email Service] Real email sent to ${userEmail}`);
    } else {
      console.log(`[Email Service] SMTP not configured. Skipping real email delivery.`);
    }

    // 2. Persistent Simulation Log
    const logPath = path.join(process.cwd(), 'order-emails.log');
    fs.appendFileSync(logPath, `\n--- NEW EMAIL SENT AT ${new Date().toLocaleString()} ---\n` + textContent);
    console.log(`[Email Service] Email recorded in simulation log.`);
    
  } catch (err) {
    console.error('[Email Service] Error in email delivery process:', err);
  }
}
