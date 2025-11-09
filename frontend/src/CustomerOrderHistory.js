// ✅ frontend/src/CustomerOrderHistory.js (Updated with Your Color Scheme)

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { io } from "socket.io-client";
import { ActiveOrderTracker } from './components/ActiveOrderTracker'; // Adjust path if needed
import {
  Container, Card, CardContent, Typography,
  Box, Stack, List, ListItem, ListItemText,
  CircularProgress, Alert, Divider, Grid, Chip
} from '@mui/material';
// Icons
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StorefrontIcon from '@mui/icons-material/Storefront';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CelebrationIcon from '@mui/icons-material/Celebration';
import HistoryIcon from '@mui/icons-material/History';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

const CustomerOrderHistory = ({ customerToken, customerName, showSnackbar }) => {
  const [orders, setOrders] = useState([]);
  const [cateringRequests, setCateringRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- Helper to Fetch Both Orders + Catering (Unchanged) ---
  const fetchAllHistory = useCallback(async () => {
    if (!customerToken) {
      setError('No customer token found. Please log in again.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const config = { headers: { 'Authorization': `Bearer ${customerToken}` } };

      const [ordersRes, cateringRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/api/orders/myorders`, config),
        axios.get(`${API_BASE_URL}/api/catering/my-requests`, config)
      ]);

      // Regular Orders
      if (ordersRes.status === 'fulfilled' && Array.isArray(ordersRes.value.data)) {
        setOrders(ordersRes.value.data);
      } else {
        setOrders([]);
        if (ordersRes.status === 'rejected')
          console.error("Error fetching REGULAR orders:", ordersRes.reason.message);
      }

      // Catering Requests
      if (cateringRes.status === 'fulfilled' && Array.isArray(cateringRes.value.data)) {
        setCateringRequests(cateringRes.value.data); // FIXED: was cateringRequests.value.data
      } else {
        setCateringRequests([]);
        if (cateringRes.status === 'rejected') {
          console.error("Error fetching CATERING requests:", cateringRes.reason.message);
          setError('Failed to load your catering requests.');
        }
      }
    } catch (err) {
      console.error("Error in fetchAllHistory:", err.message);
      setError('Failed to load history. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  }, [customerToken]);

  // --- Initial Fetch + Socket Setup (Unchanged) ---
  useEffect(() => {
    fetchAllHistory();
    if (!customerToken) return;

    const socket = io(API_BASE_URL);

    socket.on('connect', () => {
      socket.emit('authenticate_customer', customerToken);
    });

    socket.on('order_update', (updatedOrder) => {
      setOrders(prev =>
        prev.map(o => (o._id === updatedOrder._id ? updatedOrder : o))
      );
      showSnackbar(`Your food order status is now: ${updatedOrder.status}`, 'info');
    });

    socket.on('catering_update', (updatedRequest) => {
      setCateringRequests(prev =>
        prev.map(req => (req._id === updatedRequest._id ? updatedRequest : req))
      );
      showSnackbar(
        `Your catering request for "${updatedRequest.eventType}" is now: ${updatedRequest.status}`,
        'success'
      );
    });

    return () => socket.disconnect();
  }, [customerToken, showSnackbar, fetchAllHistory]);

  // --- FIX 1: Combine and Sort All History ---
  const combinedHistory = useMemo(() => {
    // Add a 'type' property so we know which card to render
    const foodOrders = orders.map(o => ({ ...o, type: 'food' }));
    const catering = cateringRequests.map(r => ({ ...r, type: 'catering' }));
    
    // Combine both arrays
    const allHistory = [...foodOrders, ...catering];

    // Sort the combined array by createdAt date, newest first
    allHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return allHistory;
  }, [orders, cateringRequests]);
  // --- END FIX 1 ---
// --- NEW LOGIC ---
// Find the most recent "active" food order to track
const activeOrder = useMemo(() => {
    // An active order is a food order that is NOT completed or cancelled
    return combinedHistory.find(item => 
        item.type === 'food' && 
        item.status !== 'Completed' && 
        item.status !== 'Cancelled'
    );
    // We find the *first* one, and since the list is sorted by date,
    // this will always be the most recent active order.
}, [combinedHistory]);
// --- END NEW LOGIC ---


  // --- Status Render Helpers (Updated with Your Color Scheme) ---
  const renderStatus = (status) => (
    <Chip 
      label={status}
      sx={{
        fontWeight: 600,
        background: 
          status === 'Completed' ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' :
          status === 'Cancelled' ? 'linear-gradient(135deg, #f44336 0%, #da190b 100%)' :
          status === 'Ready' ? 'linear-gradient(135deg, #2196F3 0%, #0b7dda 100%)' :
          status === 'Preparing' ? 'linear-gradient(135deg, #ff9800 0%, #e68900 100%)' :
          'linear-gradient(135deg, #F1C40F 0%, #F39C12 100%)', // Pending/Default
        color: '#fff',
        '& .MuiChip-label': {
          color: '#fff',
        }
      }}
    />
  );

  const renderCateringStatus = (status) => {
    let bgColor = 'linear-gradient(135deg, #F1C40F 0%, #F39C12 100%)'; // Pending Review
    
    if (status === 'Confirmed') bgColor = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
    if (status === 'Negotiating') bgColor = 'linear-gradient(135deg, #2196F3 0%, #0b7dda 100%)';
    if (status === 'Rejected') bgColor = 'linear-gradient(135deg, #f44336 0%, #da190b 100%)';
    if (status === 'Completed') bgColor = 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)';

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

  // --- Styled Card Backgrounds (Updated with Your Color Scheme) ---
  const getFoodOrderCardStyle = (status) => {
    const baseStyle = {
      borderRadius: 3,
      border: '2px solid',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: (theme) => theme.palette.mode === 'light'
          ? '0 12px 24px rgba(241, 196, 15, 0.25)'
          : '0 12px 24px rgba(241, 196, 15, 0.15)',
      }
    };

    switch (status) {
      case 'Completed':
        return {
          ...baseStyle,
          borderColor: 'rgba(76, 175, 80, 0.3)',
          background: (theme) => theme.palette.mode === 'light' 
            ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(76, 175, 80, 0.02) 100%)'
        };
      case 'Cancelled':
        return {
          ...baseStyle,
          borderColor: 'rgba(244, 67, 54, 0.3)',
          background: (theme) => theme.palette.mode === 'light' 
            ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(244, 67, 54, 0.05) 0%, rgba(244, 67, 54, 0.02) 100%)'
        };
      case 'Ready':
        return {
          ...baseStyle,
          borderColor: 'rgba(33, 150, 243, 0.3)',
          background: (theme) => theme.palette.mode === 'light' 
            ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(33, 150, 243, 0.02) 100%)'
        };
      case 'Preparing':
        return {
          ...baseStyle,
          borderColor: 'rgba(255, 152, 0, 0.3)',
          background: (theme) => theme.palette.mode === 'light' 
            ? 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(255, 152, 0, 0.05) 0%, rgba(255, 152, 0, 0.02) 100%)'
        };
      default: // Pending and others
        return {
          ...baseStyle,
          borderColor: 'rgba(241, 196, 15, 0.3)',
          background: (theme) => theme.palette.mode === 'light' 
            ? 'linear-gradient(135deg, rgba(241, 196, 15, 0.1) 0%, rgba(243, 156, 18, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(241, 196, 15, 0.05) 0%, rgba(243, 156, 18, 0.02) 100%)'
        };
    }
  };

  const getCateringCardStyle = (status) => {
    const baseStyle = {
      borderRadius: 3,
      border: '2px solid',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: (theme) => theme.palette.mode === 'light'
          ? '0 12px 24px rgba(241, 196, 15, 0.25)'
          : '0 12px 24px rgba(241, 196, 15, 0.15)',
      }
    };

    switch (status) {
      case 'Confirmed':
        return {
          ...baseStyle,
          borderColor: 'rgba(76, 175, 80, 0.3)',
          background: (theme) => theme.palette.mode === 'light' 
            ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(76, 175, 80, 0.02) 100%)'
        };
      case 'Completed':
        return {
          ...baseStyle,
          borderColor: 'rgba(46, 125, 50, 0.3)',
          background: (theme) => theme.palette.mode === 'light' 
            ? 'linear-gradient(135deg, rgba(46, 125, 50, 0.1) 0%, rgba(46, 125, 50, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(46, 125, 50, 0.05) 0%, rgba(46, 125, 50, 0.02) 100%)'
        };
      case 'Negotiating':
        return {
          ...baseStyle,
          borderColor: 'rgba(33, 150, 243, 0.3)',
          background: (theme) => theme.palette.mode === 'light' 
            ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(33, 150, 243, 0.02) 100%)'
        };
      case 'Rejected':
        return {
          ...baseStyle,
          borderColor: 'rgba(244, 67, 54, 0.3)',
          background: (theme) => theme.palette.mode === 'light' 
            ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(244, 67, 54, 0.05) 0%, rgba(244, 67, 54, 0.02) 100%)'
        };
      default: // Pending Review and others
        return {
          ...baseStyle,
          borderColor: 'rgba(241, 196, 15, 0.3)',
          background: (theme) => theme.palette.mode === 'light' 
            ? 'linear-gradient(135deg, rgba(241, 196, 15, 0.1) 0%, rgba(243, 156, 18, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(241, 196, 15, 0.05) 0%, rgba(243, 156, 18, 0.02) 100%)'
        };
    }
  };

  // --- RENDER ---
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
          Hello, {customerName || 'Customer'}!
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
          Your Complete Order History & Tracking ✨
        </Typography>
      </Box>

      {/* Stats Summary */}
      {!loading && combinedHistory.length > 0 && (
        <Card 
          elevation={0}
          sx={{ 
            mb: 4,
            borderRadius: 3,
            border: (theme) => `2px solid ${theme.palette.mode === 'light' ? 'rgba(241, 196, 15, 0.3)' : 'rgba(241, 196, 15, 0.2)'}`,
            overflow: 'hidden',
            background: (theme) => theme.palette.mode === 'light' 
              ? 'linear-gradient(135deg, rgba(241, 196, 15, 0.1) 0%, rgba(243, 156, 18, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(241, 196, 15, 0.05) 0%, rgba(243, 156, 18, 0.05) 100%)',
          }}
        >
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <RestaurantIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {orders.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Food Orders
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <CelebrationIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {cateringRequests.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Catering Events
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <HistoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {combinedHistory.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Requests
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Orders History */}
      <Box sx={{ mt: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ textAlign: 'center', borderRadius: 2 }}>{error}</Alert>
        ) : (combinedHistory.length === 0) ? (
          <Alert severity="info" sx={{ textAlign: 'center', borderRadius: 2 }}>
            You have not placed any orders or catering requests yet.
          </Alert>
        ) : (
          <Stack spacing={2}>
            {combinedHistory.map((item) => {
              
              // --- RENDER FOOD ORDER CARD ---
              if (item.type === 'food') {
                const order = item; // just for clarity
                return (
                  <Card
                    key={order._id}
                    elevation={0}
                    sx={getFoodOrderCardStyle(order.status)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box>
                          <Typography variant="h6" component="div">
                            Order Status: {renderStatus(order.status)}
                          </Typography>
                          <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                            Placed on: {new Date(order.createdAt).toLocaleString()}
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
                          Total: ₹{order.totalPrice.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ p: 1.5, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 1, mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                          <strong>Order ID:</strong> {order._id}
                        </Typography>
                        {order.orderType === 'Pickup' ? (
                          <Typography variant="body1" fontWeight="bold" color="primary.main">
                            Order Type: In-Store Pickup
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            <strong>Delivering To:</strong>{' '}
                            {order.deliveryAddress
                              ? `${order.deliveryAddress.street}, ${order.deliveryAddress.city}`
                              : 'N/A'}
                          </Typography>
                        )}
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>Items:</Typography>
                      <List dense sx={{ pl: 2, listStyleType: 'disc' }}>
                        {order.items.map((item, index) => (
                          <ListItem key={index} disablePadding sx={{ display: 'list-item', pl: 1 }}>
                            <ListItemText
                              primary={`${item.quantity}x ${item.name}`}
                              secondary={
                                item.note
                                  ? `(₹${item.price.toFixed(2)} each) | Note: ${item.note}`
                                  : `(₹${item.price.toFixed(2)} each)`
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                );
              }

              // --- RENDER CATERING REQUEST CARD ---
              if (item.type === 'catering') {
                const request = item; // just for clarity
                return (
                  <Card key={request._id} elevation={0} sx={getCateringCardStyle(request.status)}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box>
                          <Typography variant="h6" component="div">
                            Catering Status: {renderCateringStatus(request.status)}
                          </Typography>
                          <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                            Requested on: {new Date(request.createdAt).toLocaleString()}
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
                          Quote: ₹{request.estimatedTotal.toFixed(2)}
                        </Typography>
                      </Box>

                      {/* Detailed Info Box */}
                      <Box sx={{ p: 1.5, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 1, mb: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                              <strong>Request ID:</strong> {request._id}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                              <EventIcon fontSize="small" />
                              {new Date(request.eventDate).toLocaleDateString()} at {request.eventTime}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                              <PeopleIcon fontSize="small" />
                              {request.guestCount} Guests
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                              {request.serviceOption === 'Self Pickup' ? <StorefrontIcon fontSize="small" /> : <LocalShippingIcon fontSize="small" />}
                              <strong>{request.serviceOption}</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                              <HomeWorkIcon fontSize="small" />
                              {request.venueAddress}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              <strong>Service:</strong> {request.serviceOption}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>

                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>Menu:</Typography>
                      <List dense sx={{ pl: 2, listStyleType: 'disc' }}>
                        {request.menuItems.map((item, index) => (
                          <ListItem key={index} disablePadding sx={{ display: 'list-item', pl: 1 }}>
                            <ListItemText
                              primary={`${item.quantity}x ${item.name}`}
                              secondary={`(@ ₹${item.pricePerUnit.toFixed(2)} each)`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                );
              }
              
              return null; // Should not happen
            })}
          </Stack>
        )}
      </Box>
    </Container>
  );
};

export default CustomerOrderHistory;