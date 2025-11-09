// frontend/src/App.js (Mobile Responsive)

import React, { useState, useEffect, useMemo, useCallback } from 'react'; 
import { Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// --- Page Components ---
import AdminPanel from './AdminPanel';
import CustomerApp from './CustomerApp';
import LoginPage from './LoginPage';
import ProtectedRoute from './ProtectedRoute';
import CustomerTrackingPage from './CustomerTrackingPage';
import Footer from './Footer';
import AboutPage from './AboutPage';
import LocationsPage from './LocationsPage';
import FeedbackPage from './FeedbackPage'; 
import FeedbackInbox from './FeedbackInbox';
import CustomerLoginPage from './CustomerLoginPage';
import CustomerRegisterPage from './CustomerRegisterPage';
import CustomerOrderHistory from './CustomerOrderHistory';
import CustomerProfilePage from './CustomerProfilePage'; 
import ForgotPasswordPage from './ForgotPasswordPage';
import ResetPasswordPage from './ResetPasswordPage';
import CateringRequestPage from './CateringRequestPage'; 

// --- Theme Imports ---
import { ThemeProvider, createTheme } from '@mui/material/styles';
import getDesignTokens from './theme';

// --- MUI Components ---
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, CircularProgress,
  Snackbar, Alert as MuiAlert, CssBaseline, Drawer, List, ListItem,
  ListItemText, Divider, useMediaQuery
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

//import './App.css';

// Define API Base URL once
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

function App() {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('admin-token'));
  const [customerToken, setCustomerToken] = useState(localStorage.getItem('customer-token'));
  const [customerName, setCustomerName] = useState('');
  const [loadingUser, setLoadingUser] = useState(false);
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:899px)'); // md breakpoint is 900px in MUI

  const handleSnackbarClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const toggleColorMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  const isActive = (path) => location.pathname === path;

  const resetTokens = () => {
    localStorage.removeItem('admin-token');
    localStorage.removeItem('customer-token');
    setAdminToken(null);
    setCustomerToken(null);
    setCustomerName('');
  };

  const handleAdminLoginSuccess = (token) => {
    resetTokens();
    localStorage.setItem('admin-token', token);
    setAdminToken(token);
    showSnackbar('Admin login successful!', 'success');
    navigate('/admin');
    closeMobileMenu();
  };

  const handleAdminLogout = () => {
    resetTokens();
    showSnackbar('Logged out successfully!', 'info');
    navigate('/');
    closeMobileMenu();
  };

  const handleCustomerLoginSuccess = (token) => {
    resetTokens();
    localStorage.setItem('customer-token', token);
    setCustomerToken(token);
    showSnackbar('Customer login successful!', 'success');

    const state = location.state;
    if (state?.from) navigate(state.from, { replace: true });
    else navigate('/');
    closeMobileMenu();
  };

  const handleCustomerLogout = useCallback(() => {
    resetTokens();
    showSnackbar('Logged out successfully!', 'info');
    navigate('/');
    closeMobileMenu();
  }, [navigate]);

  const fetchCustomerData = useCallback(async () => {
    const token = localStorage.getItem('customer-token');
    if (!token) {
      setCustomerName('');
      return;
    }
    setLoadingUser(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const apiEndpoint = `${API_BASE_URL}/api/customers/me`;
      const res = await axios.get(apiEndpoint, config);
      setCustomerName(res.data.name);
    } catch (err) {
      console.error('Error fetching customer data:', err.response?.data?.msg || err.message);
      if (err.response && [401, 404].includes(err.response.status)) {
        handleCustomerLogout();
      }
    } finally {
      setLoadingUser(false);
    }
  }, [handleCustomerLogout]);

  useEffect(() => {
    if (customerToken) fetchCustomerData();
  }, [customerToken, fetchCustomerData]);

  // Mobile Navigation Drawer
  // Update the Drawer component in your App.js with better styling:

// Mobile Navigation Drawer
// Replace the mobileMenu const in your App.js with this:

// Mobile Navigation Drawer with Brand Colors
const mobileMenu = (
  <Drawer
    anchor="right"
    open={mobileMenuOpen}
    onClose={closeMobileMenu}
    sx={{
      '& .MuiDrawer-paper': {
        boxSizing: 'border-box',
        width: 280,
        // Using golden/yellow gradient background
        background: mode === 'dark' 
          ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' // Dark theme: black to dark gray
          : 'linear-gradient(135deg, #fef3c7 0%, #fef7cd 100%)', // Light theme: golden yellow gradient
        borderLeft: mode === 'dark' ? '1px solid #444' : '1px solid #e5e5e5',
      },
    }}
  >
    {/* Header with Black Background and Golden Text */}
    <Box sx={{ 
      p: 2, 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      background: mode === 'dark' ? '#000000' : '#1a1a1a', // Black background
      color: '#FFD700', // Golden text
      borderBottom: '2px solid #FFD700' // Golden border
    }}>
      <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
        Grace Dabeli Centre
      </Typography>
      <IconButton onClick={closeMobileMenu} sx={{ color: '#FFD700' }}>
        <CloseIcon />
      </IconButton>
    </Box>
    
    <Divider sx={{ borderColor: mode === 'dark' ? '#444' : '#e5e5e5' }} />

    <List sx={{ px: 1, py: 1 }}>
      {/* Main Navigation Links */}
      {[
        { path: '/', label: 'Home' },
        { path: '/track', label: 'Track Order' },
        { path: '/about', label: 'About Us' },
        { path: '/locations', label: 'Locations' },
        { path: '/feedback', label: 'Feedback' },
        { path: '/catering', label: 'Catering' },
      ].map((item) => (
        <ListItem 
          key={item.path}
          component={Link} 
          to={item.path} 
          onClick={closeMobileMenu}
          sx={{ 
            borderRadius: 2,
            mb: 0.5,
            bgcolor: isActive(item.path) 
              ? (mode === 'dark' ? '#FFD720' : '#FFD700') // Golden background for active item
              : 'transparent',
            color: isActive(item.path) 
              ? '#000000' // Black text when active (for contrast with gold)
              : (mode === 'dark' ? '#FFFFFF' : '#1a1a1a'), // White text in dark mode, black in light mode
            '&:hover': {
              bgcolor: mode === 'dark' ? '#333333' : '#f8f0d5', // Dark gray in dark mode, light golden in light mode
              color: mode === 'dark' ? '#FFD700' : '#1a1a1a', // Golden text in dark mode, black in light mode
            },
            transition: 'all 0.2s ease',
            border: isActive(item.path) ? '1px solid #FFD700' : 'none',
          }}
        >
          <ListItemText 
            primary={item.label} 
            primaryTypographyProps={{ 
              fontWeight: isActive(item.path) ? 'bold' : 'normal',
              fontSize: '0.95rem'
            }}
          />
        </ListItem>
      ))}
    </List>

    <Divider sx={{ 
      my: 1, 
      borderColor: mode === 'dark' ? '#444' : '#e5e5e5',
      borderWidth: '1px'
    }} />

    <List sx={{ px: 1, py: 1 }}>
      {/* Authentication Links */}
      {adminToken ? (
        <>
          <ListItem 
            component={Link} 
            to="/admin" 
            onClick={closeMobileMenu}
            sx={{ 
              borderRadius: 2, 
              mb: 0.5,
              color: mode === 'dark' ? '#FFFFFF' : '#1a1a1a',
              '&:hover': {
                bgcolor: mode === 'dark' ? '#333333' : '#f8f0d5',
                color: mode === 'dark' ? '#FFD700' : '#1a1a1a',
              },
            }}
          >
            <ListItemText 
              primary="Admin Panel" 
              primaryTypographyProps={{ fontSize: '0.95rem' }}
            />
          </ListItem>
          <ListItem 
            component={Link} 
            to="/admin/feedback" 
            onClick={closeMobileMenu}
            sx={{ 
              borderRadius: 2, 
              mb: 0.5,
              color: mode === 'dark' ? '#FFFFFF' : '#1a1a1a',
              '&:hover': {
                bgcolor: mode === 'dark' ? '#333333' : '#f8f0d5',
                color: mode === 'dark' ? '#FFD700' : '#1a1a1a',
              },
            }}
          >
            <ListItemText 
              primary="Feedback Inbox" 
              primaryTypographyProps={{ fontSize: '0.95rem' }}
            />
          </ListItem>
          <ListItem 
            onClick={handleAdminLogout}
            sx={{ 
              borderRadius: 2, 
              mb: 0.5, 
              cursor: 'pointer',
              color: mode === 'dark' ? '#FFFFFF' : '#1a1a1a',
              '&:hover': {
                bgcolor: mode === 'dark' ? '#333333' : '#f8f0d5',
                color: mode === 'dark' ? '#FFD700' : '#1a1a1a',
              },
            }}
          >
            <ListItemText 
              primary="Logout (Admin)" 
              primaryTypographyProps={{ fontSize: '0.95rem' }}
            />
          </ListItem>
        </>
      ) : customerToken ? (
        <>
          <ListItem sx={{ 
            borderRadius: 2, 
            mb: 0.5,
            color: '#FFD700', // Golden color for the greeting
            bgcolor: mode === 'dark' ? '#333333' : '#fff9e6',
          }}>
            <ListItemText 
              primary={`Hello, ${customerName || 'Customer'}!`} 
              primaryTypographyProps={{ 
                fontSize: '0.9rem', 
                fontStyle: 'italic',
                fontWeight: 'bold'
              }}
            />
          </ListItem>
          <ListItem 
            component={Link} 
            to="/customer/orders" 
            onClick={closeMobileMenu}
            sx={{ 
              borderRadius: 2, 
              mb: 0.5,
              color: mode === 'dark' ? '#FFFFFF' : '#1a1a1a',
              '&:hover': {
                bgcolor: mode === 'dark' ? '#333333' : '#f8f0d5',
                color: mode === 'dark' ? '#FFD700' : '#1a1a1a',
              },
            }}
          >
            <ListItemText 
              primary="My Orders" 
              primaryTypographyProps={{ fontSize: '0.95rem' }}
            />
          </ListItem>
          <ListItem 
            component={Link} 
            to="/customer/profile" 
            onClick={closeMobileMenu}
            sx={{ 
              borderRadius: 2, 
              mb: 0.5,
              color: mode === 'dark' ? '#FFFFFF' : '#1a1a1a',
              '&:hover': {
                bgcolor: mode === 'dark' ? '#333333' : '#f8f0d5',
                color: mode === 'dark' ? '#FFD700' : '#1a1a1a',
              },
            }}
          >
            <ListItemText 
              primary="My Profile" 
              primaryTypographyProps={{ fontSize: '0.95rem' }}
            />
          </ListItem>
          <ListItem 
            onClick={handleCustomerLogout}
            sx={{ 
              borderRadius: 2, 
              mb: 0.5, 
              cursor: 'pointer',
              color: mode === 'dark' ? '#FFFFFF' : '#1a1a1a',
              '&:hover': {
                bgcolor: mode === 'dark' ? '#333333' : '#f8f0d5',
                color: mode === 'dark' ? '#FFD700' : '#1a1a1a',
              },
            }}
          >
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{ fontSize: '0.95rem' }}
            />
          </ListItem>
        </>
      ) : (
        <>
          <ListItem 
            component={Link} 
            to="/customer/login" 
            onClick={closeMobileMenu}
            sx={{ 
              borderRadius: 2, 
              mb: 0.5,
              color: mode === 'dark' ? '#FFFFFF' : '#1a1a1a',
              '&:hover': {
                bgcolor: mode === 'dark' ? '#333333' : '#f8f0d5',
                color: mode === 'dark' ? '#FFD700' : '#1a1a1a',
              },
            }}
          >
            <ListItemText 
              primary="Customer Login" 
              primaryTypographyProps={{ fontSize: '0.95rem' }}
            />
          </ListItem>
          <ListItem 
            component={Link} 
            to="/customer/register" 
            onClick={closeMobileMenu}
            sx={{ 
              borderRadius: 2, 
              mb: 0.5,
              color: mode === 'dark' ? '#FFFFFF' : '#1a1a1a',
              '&:hover': {
                bgcolor: mode === 'dark' ? '#333333' : '#f8f0d5',
                color: mode === 'dark' ? '#FFD700' : '#1a1a1a',
              },
            }}
          >
            <ListItemText 
              primary="Register" 
              primaryTypographyProps={{ fontSize: '0.95rem' }}
            />
          </ListItem>
          <ListItem 
            component={Link} 
            to="/admin/login" 
            onClick={closeMobileMenu}
            sx={{ 
              borderRadius: 2, 
              mb: 0.5,
              color: mode === 'dark' ? '#FFFFFF' : '#1a1a1a',
              '&:hover': {
                bgcolor: mode === 'dark' ? '#333333' : '#f8f0d5',
                color: mode === 'dark' ? '#FFD700' : '#1a1a1a',
              },
            }}
          >
            <ListItemText 
              primary="Admin Login" 
              primaryTypographyProps={{ fontSize: '0.95rem' }}
            />
          </ListItem>
        </>
      )}
    </List>
  </Drawer>
);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="sticky" color="primary" elevation={1} sx={{ top: 0, zIndex: 1100 }}>
            <Toolbar sx={{ gap: 0.5, minHeight: { xs: 56, sm: 64 }, py: { xs: 0.5, sm: 1 } }}>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  flexGrow: 0,
                  textDecoration: 'none',
                  color: 'inherit',
                  fontWeight: 'bold',
                  mr: 1.5,
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                Grace Dabeli Centre
              </Typography>

              {/* Desktop Navigation - Hidden on mobile */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.25, alignItems: 'center' }}>
                <Button component={Link} to="/" color="inherit" size="small" sx={{ fontWeight: isActive('/') ? 'bold' : 'normal', px: 1, py: 0.5, fontSize: '0.875rem' }}>Home</Button>
                <Button component={Link} to="/track" color="inherit" size="small" sx={{ fontWeight: isActive('/track') ? 'bold' : 'normal', px: 1, py: 0.5, fontSize: '0.875rem' }}>Track Order</Button>
                <Button component={Link} to="/about" color="inherit" size="small" sx={{ fontWeight: isActive('/about') ? 'bold' : 'normal', px: 1, py: 0.5, fontSize: '0.875rem' }}>About Us</Button>
                <Button component={Link} to="/locations" color="inherit" size="small" sx={{ fontWeight: isActive('/locations') ? 'bold' : 'normal', px: 1, py: 0.5, fontSize: '0.875rem' }}>Locations</Button>
                <Button component={Link} to="/feedback" color="inherit" size="small" sx={{ fontWeight: isActive('/feedback') ? 'bold' : 'normal', px: 1, py: 0.5, fontSize: '0.875rem' }}>Feedback</Button>
                <Button component={Link} to="/catering" color="inherit" size="small" sx={{ fontWeight: isActive('/catering') ? 'bold' : 'normal', px: 1, py: 0.5, fontSize: '0.875rem' }}>Catering</Button>
              </Box>

              <Box sx={{ flexGrow: 1 }} />

              {/* Theme Toggle - Always visible */}
              <IconButton onClick={toggleColorMode} color="inherit" size="small" sx={{ mr: 0.5 }}>
                {mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
              </IconButton>

              {/* Desktop Authentication - Hidden on mobile */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
                {adminToken ? (
                  <>
                    <Button component={Link} to="/admin" color="inherit" size="small" sx={{ px: 1, py: 0.5, fontSize: '0.875rem' }}>Admin Panel</Button>
                    <Button component={Link} to="/admin/feedback" color="inherit" size="small" sx={{ px: 1, py: 0.5, fontSize: '0.875rem' }}>Inbox</Button>
                    <Button color="inherit" variant="outlined" onClick={handleAdminLogout} size="small" sx={{ borderColor: 'inherit', color: 'inherit', px: 1, py: 0.5, fontSize: '0.875rem' }}>Logout</Button>
                  </>
                ) : customerToken ? (
                  <>
                    {loadingUser ? (
                      <CircularProgress size={16} sx={{ color: 'inherit' }} />
                    ) : (
                      <Button component={Link} to="/customer/profile" color="inherit" size="small" sx={{ textTransform: 'none', px: 0.5, py: 0.5, fontSize: '0.875rem' }}>
                        <Typography variant="body2">Hello, {customerName || 'Customer'}!</Typography>
                      </Button>
                    )}
                    <Button component={Link} to="/customer/orders" color="inherit" size="small" startIcon={<AccountCircleIcon sx={{ fontSize: '1rem' }} />} sx={{ px: 1, py: 0.5, fontSize: '0.875rem' }}>My Orders</Button>
                    <Button color="inherit" variant="outlined" onClick={handleCustomerLogout} size="small" sx={{ borderColor: 'inherit', color: 'inherit', px: 1, py: 0.5, fontSize: '0.875rem' }}>Logout</Button>
                  </>
                ) : (
                  <>
                    <Button component={Link} to="/customer/login" color="inherit" variant="outlined" size="small" sx={{ borderColor: 'inherit', color: 'inherit', px: 1, py: 0.5, fontSize: '0.875rem' }}>Customer Login</Button>
                    <Button component={Link} to="/customer/register" color="inherit" size="small" sx={{ px: 1, py: 0.5, fontSize: '0.875rem' }}>Register</Button>
                    <Button component={Link} to="/admin/login" color="inherit" size="small" sx={{ px: 1, py: 0.5, fontSize: '0.875rem' }}>Admin Login</Button>
                  </>
                )}
              </Box>

              {/* Mobile Menu Button - Only visible on mobile */}
              <IconButton
                color="inherit"
                onClick={toggleMobileMenu}
                sx={{ display: { xs: 'flex', md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          {/* Mobile Navigation Drawer */}
          {mobileMenu}

          {/* Routes */}
          <Box sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<CustomerApp customerToken={customerToken} customerName={customerName} showSnackbar={showSnackbar} />} />
              <Route path="/track" element={<CustomerTrackingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/locations" element={<LocationsPage />} />
              <Route path="/feedback" element={<FeedbackPage showSnackbar={showSnackbar} />} />
              <Route
                path="/catering"
                element={
                  <ProtectedRoute token={customerToken} loginPath="/customer/login">
                    <CateringRequestPage customerToken={customerToken} customerName={customerName} showSnackbar={showSnackbar} />
                  </ProtectedRoute>
                }
              />

              <Route path="/customer/login" element={<CustomerLoginPage onLoginSuccess={handleCustomerLoginSuccess} />} />
              <Route path="/customer/register" element={<CustomerRegisterPage onLoginSuccess={handleCustomerLoginSuccess} />} />
              <Route
                path="/customer/orders"
                element={
                  <ProtectedRoute token={customerToken} loginPath="/customer/login">
                    <CustomerOrderHistory customerToken={customerToken} customerName={customerName} showSnackbar={showSnackbar} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/customer/profile"
                element={
                  <ProtectedRoute token={customerToken} loginPath="/customer/login">
                    <CustomerProfilePage
                      customerToken={customerToken}
                      showSnackbar={showSnackbar}
                      onProfileUpdate={fetchCustomerData}
                    />
                  </ProtectedRoute>
                }
              />

              <Route path="/forgot-password" element={<ForgotPasswordPage showSnackbar={showSnackbar} />} />
              <Route path="/customer/reset-password" element={<ResetPasswordPage showSnackbar={showSnackbar} />} />

              <Route path="/admin/login" element={<LoginPage onLoginSuccess={handleAdminLoginSuccess} />} />

              <Route
                path="/admin"
                element={<ProtectedRoute token={adminToken} loginPath="/admin/login"><AdminPanel showSnackbar={showSnackbar} /></ProtectedRoute>}
              />
              <Route
                path="/admin/feedback"
                element={<ProtectedRoute token={adminToken} loginPath="/admin/login"><FeedbackInbox showSnackbar={showSnackbar} /></ProtectedRoute>}
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Box>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <MuiAlert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
            {snackbar.message}
          </MuiAlert>
        </Snackbar>

        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;