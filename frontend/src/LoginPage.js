// In frontend/src/LoginPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Typography, TextField, Button, Box, Alert } from '@mui/material';
// --- THIS MUST BE THE ONLY ROUTING IMPORT ---
import { Link as RouterLink } from 'react-router-dom';

// We accept a prop 'onLoginSuccess' from App.js
function LoginPage({ onLoginSuccess }) { 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Call the login API
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
        username,
        password,
      });
      
      // If login is successful, res.data will have the token
      if (res.data.token) {
        // We call the function from App.js, passing the token up
        onLoginSuccess(res.data.token);
      }
    } catch (error) {
      setError(error.response.data); // Should be "Invalid credentials"
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Admin Login
          </Typography>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            {error && (
              <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                {error}
              </Typography>
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default LoginPage;