import { sendOrderConfirmation } from './src/lib/mail';
import dotenv from 'dotenv';
dotenv.config();

async function finalTest() {
  console.log('Sending FINAL VERIFICATION from the NEW professional account...');
  const mockOrder = {
    id: 'VERIFIED-NEW-ACCOUNT',
    total: 165.00,
    status: 'COMPLETED',
    shippingAddress: 'Northeast Store Official',
    city: 'Guwahati',
    postalCode: '781001',
    items: [
      { product: { name: 'Official Store Setup' }, quantity: 1, price: 165.00 }
    ]
  };

  try {
    // Send to your personal email to confirm it works
    await sendOrderConfirmation(mockOrder, 'yaswanthharitaluru@gmail.com', 'Yaswanth');
    console.log('--- SUCCESS ---');
    console.log('Email sent from: northeaststore.in@gmail.com');
    console.log('Delivered to: yaswanthharitaluru@gmail.com');
  } catch (err) {
    console.error('--- FAILURE ---');
    console.error(err);
  }
}

finalTest();
