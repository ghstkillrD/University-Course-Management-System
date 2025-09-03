// Test script to verify error handling for invalid credentials
console.log('Testing error handling for invalid credentials...');

const testInvalidLogin = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'wronguser',
        password: 'wrongpassword'
      })
    });

    console.log('Response status:', response.status);
    console.log('Response statusText:', response.statusText);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.text();
      console.log('Error response body:', errorData);
      
      try {
        const jsonError = JSON.parse(errorData);
        console.log('Parsed error JSON:', jsonError);
      } catch (e) {
        console.log('Response is not valid JSON');
      }
    } else {
      const data = await response.json();
      console.log('Success response:', data);
    }

  } catch (error) {
    console.error('Network error:', error.message);
  }
};

// Test with valid credentials too
const testValidLogin = async () => {
  console.log('\n--- Testing valid credentials ---');
  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Valid login success:', data.message || 'Login successful');
    } else {
      const errorData = await response.text();
      console.log('Unexpected error:', errorData);
    }

  } catch (error) {
    console.error('Network error:', error.message);
  }
};

// Run tests
testInvalidLogin().then(() => testValidLogin());
