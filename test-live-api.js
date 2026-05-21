// Use native global fetch in Node 22

async function main() {
  const loginRes = await fetch('https://northeast-store.vercel.app/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'parimigayatri5@gmail.com',
      password: 'password123'
    })
  });

  console.log('Login Response Status:', loginRes.status);
  const loginData = await loginRes.json();
  console.log('Login Response Data:', loginData);

  const cookie = loginRes.headers.get('set-cookie');
  console.log('Set-Cookie:', cookie);

  if (!cookie) {
    console.log('No cookie returned from login!');
    return;
  }

  // extract the session token
  const sessionToken = cookie.split(';')[0];
  console.log('Session Cookie:', sessionToken);

  const sessionRes = await fetch('https://northeast-store.vercel.app/api/auth/session', {
    headers: { Cookie: sessionToken }
  });
  console.log('Session Check Status:', sessionRes.status);
  const sessionData = await sessionRes.json();
  console.log('Session Data:', sessionData);

  const ordersRes = await fetch('https://northeast-store.vercel.app/api/orders', {
    headers: { Cookie: sessionToken }
  });
  console.log('Orders API Status:', ordersRes.status);
  const ordersData = await ordersRes.json();
  console.log('Orders Data:', JSON.stringify(ordersData, null, 2));
}

main().catch(console.error);
