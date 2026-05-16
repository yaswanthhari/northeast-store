async function testOrder() {
  console.log('Simulating order...');
  try {
    const res = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // Note: This might fail if the session cookie is missing, 
        // but it will hit the API and show the logs.
      },
      body: JSON.stringify({
        items: [
          { id: 'cmp79c0lk001kuqmwp3jj48q3', name: 'Naga Sticky Rice', price: 165, quantity: 1 }
        ],
        total: 100,
        shippingDetails: {
          firstName: 'Test',
          lastName: 'User',
          email: 'yaswanthharitaluru@gmail.com',
          address: 'Test Address',
          city: 'Test City',
          postalCode: '123456'
        }
      })
    });
    const data = await res.json();
    console.log('Response:', data);
  } catch (err) {
    console.error('Error:', err);
  }
}

testOrder();
