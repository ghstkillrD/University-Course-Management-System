import React from 'react';
import { Button, Box } from '@mui/material';
import api from '../services/api';

const TestPage: React.FC = () => {
  const testLogin = async () => {
    try {
      console.log('Testing login...');
      const response = await api.post('/test/login', { username: 'admin', password: 'admin123' });
      console.log('Test response:', response.data);
      alert('Test successful: ' + JSON.stringify(response.data));
    } catch (error: any) {
      console.error('Test error:', error);
      alert('Test failed: ' + error.message);
    }
  };

  const testHealth = async () => {
    try {
      console.log('Testing health...');
      const response = await api.get('/test/health');
      console.log('Health response:', response.data);
      alert('Health check successful: ' + JSON.stringify(response.data));
    } catch (error: any) {
      console.error('Health error:', error);
      alert('Health check failed: ' + error.message);
    }
  };

  const testRealLogin = async () => {
    try {
      console.log('Testing real login...');
      const loginData = { username: 'admin', password: 'admin123' };
      console.log('Sending login data:', loginData);
      const response = await api.post('/auth/login', loginData);
      console.log('Real login response:', response.data);
      alert('Real login successful: ' + JSON.stringify(response.data));
    } catch (error: any) {
      console.error('Real login error:', error);
      console.error('Error response:', error.response?.data);
      alert('Real login failed: ' + error.message + '\nDetails: ' + JSON.stringify(error.response?.data));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <h2>Test Page</h2>
      <Button onClick={testHealth} variant="contained" sx={{ mr: 2 }}>
        Test Health
      </Button>
      <Button onClick={testLogin} variant="contained" sx={{ mr: 2 }}>
        Test Login
      </Button>
      <Button onClick={testRealLogin} variant="contained" color="secondary">
        Test Real Login
      </Button>
    </Box>
  );
};

export default TestPage;
