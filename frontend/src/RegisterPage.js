// In frontend/src/RegisterPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); 

  const handleRegister = async (e) => {
    e.preventDefault();
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        username,
        password,
      });
      setMessage(res.data);
    } catch (error) {
      setMessage(error.response?.data || 'An error occurred during registration.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Register Admin
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Use this page *only once* to create your main admin account.
          </Typography>
          <Box component="form" onSubmit={handleRegister} sx={{ mt: 3 }}>
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
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Create Admin
            </Button>
            {message && (
              <Typography color="secondary" sx={{ mt: 2, textAlign: 'center' }}>
                {message}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default RegisterPage;
