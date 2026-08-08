
async function test() {
  try {
    // 1. Register a new user to guarantee a fresh token
    const uniqueEmail = `test_${Date.now()}@example.com`;
    let registerRes = await fetch('http://localhost:5000/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: uniqueEmail, 
        password: 'password123'
      })
    });
    
    if (!registerRes.ok) {
        console.error('Register failed', registerRes.status, await registerRes.text());
        return;
    }

    const registerData = await registerRes.json();
    const token = registerData.data.token;
    console.log('Registered, got token:', token.substring(0, 20) + '...');

    // 2. Fetch Analytics
    const analyticsRes = await fetch('http://localhost:5000/api/v1/analytics/dashboard', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!analyticsRes.ok) {
        console.error('Analytics failed', analyticsRes.status, await analyticsRes.text());
        return;
    }

    const analyticsData = await analyticsRes.json();
    console.log('Analytics response:', analyticsData);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
