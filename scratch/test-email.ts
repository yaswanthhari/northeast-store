import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function test() {
  console.log('Testing with:', {
    user: process.env.SMTP_USER,
    pass: '****',
    host: process.env.SMTP_HOST
  });

  try {
    const info = await transporter.sendMail({
      from: `"Test" <${process.env.SMTP_USER}>`,
      to: 'yaswanthharitaluru@gmail.com',
      subject: 'Test Email from Northeast Store',
      text: 'If you see this, your email setup is working!',
    });
    console.log('Success!', info.messageId);
  } catch (err) {
    console.error('Failed!', err);
  }
}

test();
