const { sendOrderConfirmation } = require('./src/lib/mail');
require('dotenv').config();

async function finalTest() {
  console.log('Sending FINAL JS VERIFICATION...');
  const mockOrder = {
    id: 'VERIFIED-JS',
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
    await sendOrderConfirmation(mockOrder, 'yaswanthharitaluru@gmail.com', 'Yaswanth');
    console.log('--- SUCCESS: Final test sent from new account! ---');
  } catch (err) {
    console.error('--- FAILURE ---');
    console.error(err);
  }
}

finalTest();
