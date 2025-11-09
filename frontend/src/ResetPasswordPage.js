// In frontend/src/ResetPasswordPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Typography, TextField, Button, Box, Alert, Link as MuiLink, CircularProgress } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

function ResetPasswordPage({ showSnackbar }) {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get phone number from the navigation state (passed from ForgotPasswordPage)
  const phone = location.state?.phone; 
  const tokenRequested = location.state?.tokenRequested; // Flag to confirm user came from the request page

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);

    if (newPassword !== confirmPassword) {
        setAlert({ type: 'error', text: 'Passwords do not match.' });
        setLoading(false);
        return;
    }
    if (newPassword.length < 6) {
        setAlert({ type: 'error', text: 'Password must be at least 6 characters.' });
        setLoading(false);
        return;
    }

    try {
      // Call the secure reset password API
      await axios.post(`${API_BASE_URL}/api/customers/reset-password`, {
        phone,
        token, // The 6-digit code the user received
        newPassword,
      });

      // Success: Redirect to login page
      setAlert({ type: 'success', text: 'Success! Your password has been updated. Redirecting...' });
      setTimeout(() => {
          navigate('/customer/login', { replace: true });
      }, 3000);

    } catch (err) {
      setAlert({ 
        type: 'error', 
        text: err.response?.data?.message || err.response?.data || 'Invalid Code or Request Expired.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // If the user lands here without requesting a token, send them back to start
  if (!phone || !tokenRequested) {
      return (
          <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
              <Alert severity="warning">
                  You must request a reset code first.
              </Alert>
              <MuiLink onClick={() => navigate('/forgot-password')} sx={{ display: 'block', mt: 2, cursor: 'pointer' }}>
                  Go to Forgot Password Page
              </MuiLink>
          </Container>
      );
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Reset Password
          </Typography>
          <Typography color="textSecondary" align="center" sx={{ mb: 3 }}>
            Mobile: **{phone}** (Enter the 6-digit code below)
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>

            <TextField
              label="6-Digit Reset Code"
              variant="outlined" fullWidth required
              value={token} onChange={(e) => setToken(e.target.value)}
              sx={{ mb: 2 }} inputProps={{ maxLength: 6 }}
              type="tel"
              disabled={loading}
            />

            <TextField
              label="New Password (min 6 characters)"
              type="password"
              variant="outlined" fullWidth required
              value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }} disabled={loading}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              variant="outlined" fullWidth required
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 2 }} disabled={loading}
            />

            {alert && <Alert severity={alert.type} sx={{ mb: 2 }}>{alert.text}</Alert>}

            <Button 
              type="submit" variant="contained" color="primary" fullWidth size="large"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ResetPasswordPage;