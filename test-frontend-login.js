// Test the frontend login behavior directly
console.log('Testing frontend login behavior...');

const testFrontendLogin = async () => {
  try {
    console.log('Making login request with invalid credentials...');
    
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'invaliduser',
        password: 'invalidpass'
      })
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      
      // This should throw an error that the frontend can catch
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Unexpected success:', data);

  } catch (error) {
    console.log('Caught error (this is expected):', error.message);
    console.log('Error type:', typeof error);
    console.log('Error object:', error);
  }
};

testFrontendLogin();
