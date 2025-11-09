// In frontend/src/ForgotPasswordPage.js (UPDATED WITH MATCHING DESIGN)

import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container, Card, CardContent, Typography, TextField, Button, 
  Box, Alert, CircularProgress, Grid, Link 
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import PhoneIcon from '@mui/icons-material/Phone';
import LockResetIcon from '@mui/icons-material/LockReset';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

function ForgotPasswordPage({ showSnackbar }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setLoading(true);

    if (!/^[6-9]\d{9}$/.test(phone)) {
        setAlert({ type: 'error', text: 'Please enter a valid 10-digit mobile number.' });
        setLoading(false);
        return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/customers/forgot-password`, { phone });

      setAlert({ 
        type: 'success', 
        text: 'A verification code has been generated. Redirecting to reset page...' 
      });

      if (res.data.dev_token) {
          console.log(`--- DEVELOPMENT TOKEN: ${res.data.dev_token} ---`);
      }
      
      setTimeout(() => {
          navigate('/customer/reset-password', { state: { phone: phone, tokenRequested: true } });
      }, 2000);

    } catch (err) {
      setAlert({ 
        type: 'error', 
        text: err.response?.data?.message || err.response?.data || 'Failed to process request.' 
      });
      console.error("Forgot Password Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Hero Section */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 4, 
        py: { xs: 4, md: 6 }, 
        px: { xs: 2, md: 4 },
        background: (theme) => theme.palette.mode === 'light' 
          ? 'linear-gradient(135deg, #F1C40F 0%, #F39C12 50%, #E67E22 100%)'
          : 'linear-gradient(135deg, #F1C40F 0%, #D4AC0D 50%, #F39C12 100%)',
        color: '#000',
        borderRadius: 3,
        boxShadow: (theme) => theme.palette.mode === 'light' 
          ? '0 8px 32px rgba(241, 196, 15, 0.3)'
          : '0 8px 32px rgba(241, 196, 15, 0.2)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
        animation: 'fadeInUp 0.8s ease-out',
        '@keyframes fadeInUp': {
          from: {
            opacity: 0,
            transform: 'translateY(30px)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            position: 'relative',
            zIndex: 1,
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.02)' },
            },
          }}
        >
          Reset Your Password
        </Typography>
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{
            color: '#1a1a1a',
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
            fontWeight: 400,
            position: 'relative',
            zIndex: 1,
            mt: 1.5,
          }}
        >
          Enter your mobile number to receive a verification code ✨
        </Typography>
      </Box>

      <Grid container justifyContent="center">
        <Grid item xs={12} md={6} lg={4}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              border: (theme) => `2px solid ${theme.palette.mode === 'light' ? 'rgba(241, 196, 15, 0.3)' : 'rgba(241, 196, 15, 0.2)'}`,
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: (theme) => theme.palette.mode === 'light'
                  ? '0 12px 24px rgba(241, 196, 15, 0.25)'
                  : '0 12px 24px rgba(241, 196, 15, 0.15)',
                borderColor: 'primary.main',
              },
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <LockResetIcon 
                  sx={{ 
                    fontSize: 50, 
                    color: 'primary.main',
                    mb: 1,
                    background: (theme) => theme.palette.mode === 'light' 
                      ? 'linear-gradient(135deg, #F1C40F 0%, #F39C12 100%)'
                      : 'linear-gradient(135deg, #F1C40F 0%, #D4AC0D 100%)',
                    borderRadius: '50%',
                    p: 1,
                  }} 
                />
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Forgot Password?
                </Typography>
                <Typography color="text.secondary" align="center">
                  Enter your registered mobile number to receive a verification code
                </Typography>
              </Box>

              {/* Reset Form */}
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  label="10-Digit Mobile Number"
                  variant="outlined"
                  fullWidth
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                  inputProps={{ maxLength: 10 }}
                  type="tel"
                  InputProps={{
                    startAdornment: <PhoneIcon color="action" sx={{ mr: 1 }} />,
                  }}
                  sx={{ mb: 3, borderRadius: 2 }}
                />

                {alert && (
                  <Alert 
                    severity={alert.type} 
                    sx={{ 
                      mb: 3, 
                      borderRadius: 2,
                      fontSize: '1rem'
                    }}
                  >
                    {alert.text}
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: (theme) => theme.palette.mode === 'light' 
                      ? 'linear-gradient(135deg, #F1C40F 0%, #F39C12 100%)'
                      : 'linear-gradient(135deg, #F1C40F 0%, #D4AC0D 100%)',
                    color: '#000',
                    '&:hover': {
                      background: (theme) => theme.palette.mode === 'light' 
                        ? 'linear-gradient(135deg, #F39C12 0%, #E67E22 100%)'
                        : 'linear-gradient(135deg, #D4AC0D 0%, #F39C12 100%)',
                      transform: 'scale(1.02)',
                    },
                    '&:disabled': {
                      background: '#e0e0e0',
                      color: '#9e9e9e',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Verification Code'}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Button
                    component={RouterLink}
                    to="/customer/login"
                    startIcon={<ArrowBackIcon />}
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                      },
                    }}
                  >
                    Back to Login
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Box sx={{ 
            mt: 4, 
            p: 3, 
            textAlign: 'center',
            background: (theme) => theme.palette.mode === 'light' 
              ? 'linear-gradient(135deg, rgba(241, 196, 15, 0.1) 0%, rgba(243, 156, 18, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(241, 196, 15, 0.05) 0%, rgba(243, 156, 18, 0.05) 100%)',
            borderRadius: 3,
            border: (theme) => `1px solid ${theme.palette.mode === 'light' ? 'rgba(241, 196, 15, 0.2)' : 'rgba(241, 196, 15, 0.1)'}`,
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              🔒 How it works:
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
              1. Enter your registered mobile number<br/>
              2. Receive a verification code<br/>
              3. Reset your password securely<br/>
              4. Login with your new password
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Don't have an account?{' '}
              <Link 
                component={RouterLink} 
                to="/customer/register"
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Create one here
              </Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ForgotPasswordPage;