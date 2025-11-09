// In frontend/src/CustomerLoginPage.js (UPDATED WITH MATCHING DESIGN)

import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container, Card, CardContent, Typography, TextField, Button, 
  Box, Alert, Link, CircularProgress, Grid 
} from '@mui/material'; 
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';

function CustomerLoginPage({ onLoginSuccess }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fromCheckout = location.state?.from === 'checkout';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/customers/login`, {
        phone,
        password,
      });

      if (res.data.token) {
        onLoginSuccess(res.data.token);
        navigate(fromCheckout ? '/' : '/', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data || 'Login failed. Please check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Hero Section - Same as Home Page */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 4, 
        py: { xs: 4, md: 6 }, 
        px: { xs: 2, md: 4 },
        background: (theme) => theme.palette.mode === 'light' 
          ? 'linear-gradient(135deg, #F1C40F 0%, #F39C12 50%, #E67E22 100%)'
          : 'linear-gradient(135deg, #F1C40F 0%, #D4AC0D 50%, #F39C12 100%)',
        color: '#000',
        borderRadius: { xs: 3, md: 5 },
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
          Welcome Back!
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
          Sign in to your account and continue your delicious journey! ✨
        </Typography>
      </Box>

      <Grid container justifyContent="center">
        <Grid item xs={12} md={6} lg={4}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 4,
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
                <LockIcon 
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
                  Customer Login
                </Typography>
                {fromCheckout && (
                  <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
                    Please login to place your order and access exclusive features!
                  </Alert>
                )}
              </Box>

              {/* Login Form */}
              <Box component="form" onSubmit={handleLogin}>
                <TextField
                  label="10-Digit Mobile Number"
                  variant="outlined"
                  fullWidth
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  sx={{ mb: 3 }}
                  inputProps={{ maxLength: 10 }}
                  InputProps={{
                    startAdornment: <PhoneIcon color="action" sx={{ mr: 1 }} />,
                  }}
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
                  InputProps={{
                    startAdornment: <LockIcon color="action" sx={{ mr: 1 }} />,
                  }}
                />

                <Typography align="right" sx={{ mb: 3 }}>
                  <Link 
                    component={RouterLink} 
                    to="/forgot-password" 
                    underline="hover"
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 500,
                      '&:hover': { color: 'primary.dark' }
                    }}
                  >
                    Forgot password?
                  </Link>
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
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
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Login to Your Account'}
                </Button>

                <Typography align="center" sx={{ mt: 3, color: 'text.secondary' }}>
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
            borderRadius: 4,
            border: (theme) => `1px solid ${theme.palette.mode === 'light' ? 'rgba(241, 196, 15, 0.2)' : 'rgba(241, 196, 15, 0.1)'}`,
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              🎉 New to Grace Dabeli Centre?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Create an account to enjoy faster ordering, track your orders, and get exclusive offers!
            </Typography>
            <Button
              component={RouterLink}
              to="/customer/register"
              variant="outlined"
              startIcon={<PersonIcon />}
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                fontWeight: 600,
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'primary.light',
                },
              }}
            >
              Register Now
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CustomerLoginPage;