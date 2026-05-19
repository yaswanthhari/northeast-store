import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import type { ContactFormData, Order, OrderItem } from '@/types/store';

// Helper to extract a valid email address from a string (e.g. "Name <email@domain.com>" -> "email@domain.com")
const getValidEmail = (input: string | undefined, fallback: string): string => {
  if (!input) return fallback;
  const match = input.match(/<([^>]+)>/);
  if (match && match[1]) return match[1].trim();
  const trimmed = input.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return trimmed;
  return fallback;
};
// ✅ Fix
export async function sendOrderConfirmation(order: Order, userEmail: string, userName: string) {
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
  
  // HTML version for real inboxes (Designed to look professional and premium)
  const baseUrl = 'https://northeast-store.vercel.app';
  const htmlContent = `
    <div style="font-family: 'Outfit', 'Inter', sans-serif; max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
      <!-- Gold & Green Premium Header -->
      <div style="background: linear-gradient(135deg, #12402b 0%, #0d281b 100%); padding: 30px 20px; text-align: center; border-bottom: 4px solid #d4af37;">
        <h1 style="color: #d4af37; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">The NorthEast Store</h1>
        <p style="color: #a0aec0; margin: 5px 0 0 0; font-size: 14px; letter-spacing: 0.5px;">Authentic Treasures from the Eight States</p>
      </div>

      <div style="padding: 30px 25px;">
        <h2 style="color: #2d3748; margin-top: 0; font-size: 20px;">Hi ${name},</h2>
        <p style="color: #4a5568; line-height: 1.6; font-size: 15px;">
          Thank you for your purchase! We've received your order and our culinary team is already gathering your authentic items from the Northeast for shipment.
        </p>

        <!-- Order Summary Card -->
        <div style="background: #f7fafc; border: 1px solid #edf2f7; border-radius: 12px; padding: 20px; margin: 25px 0;">
          <h3 style="color: #12402b; margin-top: 0; border-bottom: 2px solid #edf2f7; padding-bottom: 10px; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Order Details</h3>
          <table style="width: 100%; font-size: 14px; color: #4a5568;">
            <tr>
              <td style="padding: 5px 0;"><strong>Order ID:</strong></td>
              <td style="padding: 5px 0; text-align: right; font-family: monospace;">${order.id}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0;"><strong>Status:</strong></td>
              <td style="padding: 5px 0; text-align: right;"><span style="background: #fef3c7; color: #d97706; padding: 2px 8px; border-radius: 50px; font-size: 12px; font-weight: 700;">${order.status}</span></td>
            </tr>
            <tr>
              <td style="padding: 5px 0;"><strong>Total Amount:</strong></td>
              <td style="padding: 5px 0; text-align: right; color: #12402b; font-weight: 700; font-size: 16px;">₹${order.total.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <!-- Premium Products Table with Images -->
        <h3 style="color: #2d3748; font-size: 16px; margin-bottom: 15px;">Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
          <thead>
            <tr style="border-bottom: 2px solid #edf2f7; text-align: left; font-size: 13px; color: #718096; text-transform: uppercase;">
              <th style="padding: 10px 0;">Product</th>
              <th style="padding: 10px 0; text-align: center;">Qty</th>
              <th style="padding: 10px 0; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map((item: OrderItem) => {
              // Convert local path to absolute URL
              const imgUrl = item.product.image.startsWith('http') ? item.product.image : `${baseUrl}${item.product.image}`;
              return `
                <tr style="border-bottom: 1px solid #edf2f7;">
                  <td style="padding: 15px 0; display: flex; align-items: center;">
                    <img src="${imgUrl}" alt="${item.product.name}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 8px; margin-right: 12px; border: 1px solid #edf2f7;" />
                    <div>
                      <span style="font-weight: 600; color: #2d3748; font-size: 14px; display: block;">${item.product.name}</span>
                      <span style="font-size: 12px; color: #718096;">State: ${item.product.state}</span>
                    </div>
                  </td>
                  <td style="padding: 15px 0; text-align: center; color: #4a5568; font-weight: 600; font-size: 14px;">${item.quantity}</td>
                  <td style="padding: 15px 0; text-align: right; color: #2d3748; font-weight: 600; font-size: 14px;">₹${item.price.toFixed(2)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <!-- Shipping Destination Card -->
        <div style="border-left: 4px solid #d4af37; background: #fafafa; padding: 15px; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
          <strong style="color: #2d3748; font-size: 14px; display: block; margin-bottom: 5px;">Shipping Destination</strong>
          <span style="color: #4a5568; font-size: 14px; line-height: 1.5;">
            ${order.shippingAddress}, ${order.city} - ${order.postalCode}
          </span>
        </div>

        <hr style="border: 0; border-top: 1px solid #edf2f7; margin-bottom: 25px;" />

        <div style="text-align: center; color: #718096; font-size: 13px; line-height: 1.6;">
          <p style="margin: 0 0 5px 0; font-weight: 700; color: #12402b;">Stay Spicy,</p>
          <p style="margin: 0; font-weight: 800; color: #2d3748; font-size: 14px;">The NorthEast Store Team</p>
        </div>
      </div>
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

  // --- FAIL-SAFE TRANSPORTER CONFIG ---
  const host = process.env.SMTP_HOST?.trim() || 'smtp.gmail.com';
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const fromHeader = process.env.SMTP_FROM || `"The NorthEast Store" <${user}>`;

  if (!user || !pass) {
    console.error('[Email Service] CRITICAL ERROR: SMTP_USER or SMTP_PASS is missing in environment variables!');
    return;
  }

  // Derive safe, valid email addresses for headers
  const defaultBusinessEmail = 'northeaststore.in@gmail.com';
  const verifiedSenderEmail = getValidEmail(process.env.SMTP_FROM, defaultBusinessEmail);
  const replyToEmail = verifiedSenderEmail;
  const bccEmail = verifiedSenderEmail;

  // Define the two ways to connect
  const connectionOptions = [
    { port: 465, secure: true },  // SSL
    { port: 587, secure: false }, // TLS
  ];

  let lastError: unknown = null;
  for (const option of connectionOptions) {
    try {
      console.log(`[Email Service] Attempting delivery via Port ${option.port}...`);
      
      const transporter = nodemailer.createTransport({
        host,
        port: option.port,
        secure: option.secure,
        auth: { user, pass },
        tls: { rejectUnauthorized: false }
      });

      await transporter.sendMail({
        from: fromHeader,
        to: userEmail,
        replyTo: replyToEmail,
        bcc: bccEmail, 
        subject: `Your Order from The NorthEast Store (#${order.id.slice(-6)})`,
        text: textContent,
        html: htmlContent,
        headers: {
          'X-Priority': '1 (Highest)',
          'X-MSMail-Priority': 'High',
          'Importance': 'high'
        }
      });

      console.log(`[Email Service] SUCCESS! Email sent via Port ${option.port}.`);
      
      // Also log to our persistent file for audit
      const logPath = path.join(process.cwd(), 'order-emails.log');
      fs.appendFileSync(logPath, `\n--- SUCCESS VIA PORT ${option.port} AT ${new Date().toLocaleString()} ---\nTo: ${userEmail}\n`);
      
      return; // Exit if successful
    // ✅ Fix
// ✅ Fix
} catch (error) {
  console.warn(`[Email Service] Port ${option.port} failed: ${(error as Error).message}`);
  lastError = error;
}
  }

  // If we get here, both ports failed
  console.error('[Email Service] ALL DELIVERY ATTEMPTS FAILED:', lastError);
}

export async function sendContactEmail(contactData: ContactFormData) {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const host = process.env.SMTP_HOST?.trim() || 'smtp.gmail.com';
  const fromHeader = process.env.SMTP_FROM || `"Contact Form" <${user}>`;

  if (!user || !pass) return;

  const defaultBusinessEmail = 'northeaststore.in@gmail.com';
  const verifiedSenderEmail = getValidEmail(process.env.SMTP_FROM, defaultBusinessEmail);
  const businessRecipient = verifiedSenderEmail;

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <h2 style="color: #12402b;">New Message from Contact Form</h2>
      <p><strong>Name:</strong> ${contactData.name}</p>
      <p><strong>Email:</strong> ${contactData.email}</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${contactData.message}</p>
    </div>
  `;

  const connectionOptions = [
    { port: 465, secure: true },
    { port: 587, secure: false },
  ];

  for (const option of connectionOptions) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port: option.port,
        secure: option.secure,
        auth: { user, pass },
        tls: { rejectUnauthorized: false }
      });

      await transporter.sendMail({
        from: fromHeader,
        to: businessRecipient,
        replyTo: contactData.email,
        subject: `[CONTACT FORM] Message from ${contactData.name}`,
        html: htmlContent,
      });
      return;
    } catch (err) {
      continue;
    }
  }
}

export async function sendResetPasswordEmail(
  toEmail: string,
  userName: string,
  otp: string
) {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const host = process.env.SMTP_HOST?.trim() || 'smtp.gmail.com';
  const fromHeader = process.env.SMTP_FROM || `"The NorthEast Store" <${user}>`;

  if (!user || !pass) {
    console.error('[Email] SMTP credentials missing — cannot send reset email');
    return;
  }

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #12402b, #0d281b); padding: 24px; text-align: center;">
        <h1 style="color: #d4af37; margin: 0; font-size: 20px;">The NorthEast Store</h1>
      </div>
      <div style="padding: 30px 25px;">
        <h2 style="color: #2d3748;">Hi ${userName},</h2>
        <p style="color: #4a5568;">We received a request to reset your password. Use the OTP below — it expires in <strong>15 minutes</strong>.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #12402b; background: #f0fff4; padding: 16px 24px; border-radius: 8px; border: 2px dashed #12402b;">
            ${otp}
          </span>
        </div>
        <p style="color: #718096; font-size: 13px;">If you did not request a password reset, you can safely ignore this email.</p>
      </div>
    </div>
  `;

  const connectionOptions = [
    { port: 465, secure: true },
    { port: 587, secure: false },
  ];

  for (const option of connectionOptions) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port: option.port,
        secure: option.secure,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
      });

      await transporter.sendMail({
        from: fromHeader,
        to: toEmail,
        subject: `Your Password Reset OTP — The NorthEast Store`,
        html: htmlContent,
      });

      console.log(`[Email] Reset OTP sent to ${toEmail} via port ${option.port}`);
      return;
    // ✅ Fix
     // ✅ Fix
} catch (error) {
  console.warn(`[Email] Port ${option.port} failed: ${(error as Error).message}`);
}
  }

  console.error('[Email] All delivery attempts failed for reset email');
}
