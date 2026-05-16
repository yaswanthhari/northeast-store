import { sendOrderConfirmation } from './src/lib/mail';
import dotenv from 'dotenv';
dotenv.config();

async function testNewAccount() {
  console.log('Testing NEW professional email account...');
  const mockOrder = {
    id: 'TEST-NEW-ACCOUNT',
    total: 99.00,
    status: 'VERIFIED',
    shippingAddress: 'Northeast Store HQ',
    city: 'Guwahati',
    postalCode: '781001',
    items: [
      { product: { name: 'Professional Setup' }, quantity: 1, price: 99.00 }
    ]
  };

  try {
    await sendOrderConfirmation(mockOrder, 'yaswanthharitaluru@gmail.com', 'Yaswanth');
    console.log('SUCCESS: Email sent from the NEW account!');
  } catch (err) {
    console.error('FAILURE:', err);
  }
}

testNewAccount();
