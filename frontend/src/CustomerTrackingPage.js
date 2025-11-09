// In frontend/src/CustomerTrackingPage.js (UPDATED WITH MATCHING DESIGN)

import React, { useState } from 'react';
import axios from 'axios';
import {
  Container, Card, CardContent, Typography,
  TextField, Button, Box, Stack, List,
  ListItem, ListItemText, CircularProgress,
  Grid, Chip, Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';
import EventIcon from '@mui/icons-material/Event';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StorefrontIcon from '@mui/icons-material/Storefront';

// Define API Base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

const CustomerTrackingPage = () => {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setMessage('Please enter a valid 10-digit phone number.');
      setOrders([]);
      setLoading(false);
      return;
    }

    setMessage('');
    setOrders([]);
    setLoading(true);

    try {
      const apiEndpoint = `${API_BASE_URL}/api/orders/track/${phone}`;
      const res = await axios.get(apiEndpoint);
      
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setOrders(res.data);
        setMessage('');
      } else {
        setMessage('No orders found for this phone number.');
      }
    } catch (error) {
      console.error("Error tracking order:", error.response || error.request || error.message);
      setOrders([]);
      if (error.response) {
        if (error.response.status === 404) {
            setMessage('No orders found for this phone number.');
        } else {
            setMessage(error.response.data?.message || error.response.data || `Error: ${error.response.statusText || error.response.status}`);
        }
      } else if (error.request) {
        setMessage('Network Error: Could not connect. Please try again.');
      } else {
        setMessage('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to render status with correct color
  const renderStatus = (status) => {
    let bgColor = 'linear-gradient(135deg, #F1C40F 0%, #F39C12 100%)'; // Pending/Default
    
    if (status === 'Completed') bgColor = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
    if (status === 'Cancelled') bgColor = 'linear-gradient(135deg, #f44336 0%, #da190b 100%)';
    if (status === 'Ready') bgColor = 'linear-gradient(135deg, #2196F3 0%, #0b7dda 100%)';
    if (status === 'Preparing') bgColor = 'linear-gradient(135deg, #ff9800 0%, #e68900 100%)';

    return (
      <Chip 
        label={status}
        sx={{
          fontWeight: 600,
          background: bgColor,
          color: '#fff',
          '& .MuiChip-label': {
            color: '#fff',
          }
        }}
      />
    );
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
          Track Your Order
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
          Enter your phone number to check order status in real-time! ✨
        </Typography>
      </Box>

      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          {/* Tracking Form Card */}
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              border: (theme) => `2px solid ${theme.palette.mode === 'light' ? 'rgba(241, 196, 15, 0.3)' : 'rgba(241, 196, 15, 0.2)'}`,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: (theme) => theme.palette.mode === 'light'
                  ? '0 8px 24px rgba(241, 196, 15, 0.2)'
                  : '0 8px 24px rgba(241, 196, 15, 0.15)',
              },
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <SearchIcon 
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
                  Order Tracking
                </Typography>
                <Typography color="text.secondary" align="center">
                  Enter the 10-digit phone number used to place your order
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleTrackOrder}>
                <TextField
                  label="Your Phone Number"
                  variant="outlined"
                  fullWidth
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                  inputProps={{ maxLength: 10 }}
                  InputProps={{
                    startAdornment: <PhoneIcon color="action" sx={{ mr: 1 }} />,
                  }}
                  sx={{ mb: 3, borderRadius: 2 }}
                />
                <Button 
                  type="submit" 
                  variant="contained"
                  fullWidth
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
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Track My Orders'}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Results Area */}
          <Box sx={{ mt: 4 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ ml: 2, alignSelf: 'center' }}>
                  Searching for your orders...
                </Typography>
              </Box>
            ) : message ? (
              <Alert 
                severity={
                  message.startsWith('Error') || 
                  message.startsWith('Network Error') || 
                  message.startsWith('No orders found') ? 'error' : 'info'
                } 
                sx={{ 
                  borderRadius: 2,
                  textAlign: 'center',
                  fontSize: '1.1rem',
                  py: 2
                }}
              >
                {message}
              </Alert>
            ) : orders.length > 0 ? (
              <Box>
                <Typography variant="h4" textAlign="center" sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>
                  Found {orders.length} Order{orders.length > 1 ? 's' : ''}
                </Typography>
                <Stack spacing={3}>
                  {orders.map((order, index) => (
                    <Card 
                      key={order._id}
                      elevation={0}
                      sx={{ 
                        borderRadius: 3,
                        border: (theme) => `2px solid ${theme.palette.mode === 'light' ? 'rgba(241, 196, 15, 0.3)' : 'rgba(241, 196, 15, 0.2)'}`,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: (theme) => theme.palette.mode === 'light'
                            ? '0 8px 24px rgba(241, 196, 15, 0.2)'
                            : '0 8px 24px rgba(241, 196, 15, 0.15)',
                        },
                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                        '@keyframes fadeInUp': {
                          from: {
                            opacity: 0,
                            transform: 'translateY(20px)',
                          },
                          to: {
                            opacity: 1,
                            transform: 'translateY(0)',
                          },
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                          <Box>
                            <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                              Order Status: {renderStatus(order.status)}
                            </Typography>
                            <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <EventIcon fontSize="small" />
                              {new Date(order.createdAt).toLocaleString()}
                            </Typography>
                          </Box>
                          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            ₹{order.totalPrice}
                          </Typography>
                        </Box>

                        <Box sx={{ p: 2, backgroundColor: 'background.default', borderRadius: 2, mb: 2 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Order ID:</strong> {order._id}
                              </Typography>
                              {order.orderType === 'Pickup' ? (
                                <Typography variant="body2" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                  <StorefrontIcon fontSize="small" />
                                  <strong>In-Store Pickup</strong>
                                </Typography>
                              ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <LocalShippingIcon fontSize="small" />
                                  <strong>Delivery:</strong> {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                                </Typography>
                              )}
                            </Grid>
                          </Grid>
                        </Box>

                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>Items Ordered:</Typography>
                        <List dense sx={{ pl: 2 }}>
                          {order.items.map((item, idx) => (
                            <ListItem key={idx} disablePadding sx={{ mb: 1 }}>
                              <ListItemText
                                primary={
                                  <Typography variant="body2" fontWeight="medium">
                                    {item.quantity}x {item.name}
                                  </Typography>
                                }
                                secondary={
                                  <Typography variant="caption" color="text.secondary">
                                    ₹{item.price} each{item.note ? ` • Note: ${item.note}` : ''}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>
            ) : null}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomerTrackingPage;