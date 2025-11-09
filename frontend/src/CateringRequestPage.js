// frontend/src/CateringRequestPage.js (UPDATED WITH MATCHING DESIGN)

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, Box, Grid,
  TextField, Button, Stack, CircularProgress, Alert,
  Divider, FormControl, InputLabel, Select, MenuItem, List, ListItem,
  RadioGroup, FormControlLabel, Radio, FormLabel, Card, CardContent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
const formatPrice = (price) => `₹${price.toFixed(2)}`;

function CateringRequestPage({ customerToken, customerName, showSnackbar }) {
  const navigate = useNavigate();

  // --- States ---
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [guestCount, setGuestCount] = useState(10);
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [serviceOption, setServiceOption] = useState('Home Delivery');
  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState([]);

  // --- Add Menu Item ---
  const handleAddItemToOrder = (item) => {
    setSelectedMenu(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        return prev.map(i =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, {
        _id: item._id,
        name: item.name,
        pricePerUnit: item.price,
        quantity: 1,
        note: ''
      }];
    });
  };

  // --- Change Quantity ---
  const handleQuantityChange = (itemId, change) => {
    setSelectedMenu(prev =>
      prev
        .map(item => {
          if (item._id === itemId) {
            const newQuantity = item.quantity + change;
            if (newQuantity < 1) return null;
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(item => item !== null)
    );
  };

  // --- Calculate Total ---
  const estimatedTotal = useMemo(
    () => selectedMenu.reduce((t, item) => t + item.pricePerUnit * item.quantity, 0),
    [selectedMenu]
  );

  // --- Fetch Menu Items ---
  const fetchInitialData = useCallback(async () => {
    if (!customerToken) return;
    setLoading(true);
    try {
      const config = { headers: { 'Authorization': `Bearer ${customerToken}` } };
      await axios.get(`${API_BASE_URL}/api/customers/me`, config);
      const menuRes = await axios.get(`${API_BASE_URL}/api/menu/`);
      setMenuItems(menuRes.data.filter(item => item.inStock) || []);
    } catch (err) {
      console.error("Error loading catering data:", err);
      showSnackbar('Failed to load menu or customer details.', 'error');
    } finally {
      setLoading(false);
    }
  }, [customerToken, showSnackbar]);

  useEffect(() => {
    if (!customerToken) {
      showSnackbar("Please log in to submit a catering request.", "warning");
      navigate('/customer/login', { state: { from: '/catering' } });
      return;
    }
    fetchInitialData();
  }, [customerToken, navigate, showSnackbar, fetchInitialData]);

  // --- Submit Request ---
  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!eventType || !eventDate || !eventTime || !venueName || !serviceOption) {
      showSnackbar('Please fill out all event and service fields.', 'error');
      setSubmitting(false);
      return;
    }

    if ((serviceOption === 'Home Delivery' || serviceOption === 'Full Services') && !venueAddress) {
      showSnackbar('Please provide a venue address for this service type.', 'error');
      setSubmitting(false);
      return;
    }

    if (selectedMenu.length === 0) {
      showSnackbar('Please add items to your catering order.', 'error');
      setSubmitting(false);
      return;
    }

    if (guestCount < 10) {
      showSnackbar('Guest count must be at least 10.', 'error');
      setSubmitting(false);
      return;
    }

    const payload = {
      eventType,
      eventDate: new Date(eventDate).toISOString(),
      eventTime,
      guestCount,
      serviceOption,
      venueName,
      venueAddress: (serviceOption === 'Home Delivery' || serviceOption === 'Full Services')
        ? venueAddress
        : 'N/A (Pickup)',
      menuItems: selectedMenu.map(item => ({
        name: item.name,
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit,
        note: item.note
      })),
      estimatedTotal
    };

    try {
      const config = { headers: { 'Authorization': `Bearer ${customerToken}` } };
      await axios.post(`${API_BASE_URL}/api/catering/submit`, payload, config);
      showSnackbar('Catering request submitted successfully!', 'success');

      // Reset form
      setSelectedMenu([]);
      setGuestCount(10);
      setEventType('');
      setEventDate('');
      setEventTime('');
      setVenueName('');
      setVenueAddress('');
      setServiceOption('Home Delivery');
    } catch (err) {
      console.error("Catering Submission Error:", err.response || err.message);
      const errorData = err.response?.data;
      let errorMessage = 'Submission failed. Try again.';
      if (errorData) {
        if (typeof errorData === 'string' && errorData.includes('Validation Error')) {
          const validationError = errorData.split(':').slice(1).join(':').trim();
          errorMessage = `Validation Error: ${validationError || 'Check required fields.'}`;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.Error) {
          errorMessage = errorData.Error;
        }
      }
      showSnackbar(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // --- Menu Lists ---
  const renderAvailableMenu = () => (
    <Card 
      elevation={0}
      sx={{ 
        borderRadius: 4,
        border: (theme) => `2px solid ${theme.palette.mode === 'light' ? 'rgba(241, 196, 15, 0.3)' : 'rgba(241, 196, 15, 0.2)'}`,
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
          Add Menu Items ({menuItems.length} available)
        </Typography>
        <Box sx={{ height: 400, overflowY: 'auto', p: 1 }}>
          <List dense>
            {menuItems.map((item, index) => (
              <ListItem 
                key={item._id} 
                disablePadding 
                sx={{ 
                  py: 1,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
                  '@keyframes fadeInUp': {
                    from: { opacity: 0, transform: 'translateY(10px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
              >
                <Grid container alignItems="center" spacing={1}>
                  <Grid item xs={7} sm={8}>
                    <Typography variant="body1" fontWeight="bold">{item.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Category: {item.category}
                    </Typography>
                  </Grid>
                  <Grid item xs={5} sm={4} sx={{ textAlign: 'right' }}>
                    <Button
                      onClick={() => handleAddItemToOrder(item)}
                      size="small"
                      variant="contained"
                      startIcon={<AddIcon />}
                      sx={{ 
                        width: '100%', 
                        fontSize: '0.75rem', 
                        p: 0.5,
                        background: (theme) => theme.palette.mode === 'light' 
                          ? 'linear-gradient(135deg, #F1C40F 0%, #F39C12 100%)'
                          : 'linear-gradient(135deg, #F1C40F 0%, #D4AC0D 100%)',
                        color: '#000',
                        fontWeight: 600,
                        '&:hover': {
                          background: (theme) => theme.palette.mode === 'light' 
                            ? 'linear-gradient(135deg, #F39C12 0%, #E67E22 100%)'
                            : 'linear-gradient(135deg, #D4AC0D 0%, #F39C12 100%)',
                        },
                      }}
                    >
                      Add ({formatPrice(item.price)})
                    </Button>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
        </Box>
      </CardContent>
    </Card>
  );

  const renderSelectedMenu = () => (
    <Card 
      elevation={0}
      sx={{ 
        borderRadius: 4,
        border: (theme) => `2px solid ${theme.palette.mode === 'light' ? 'rgba(241, 196, 15, 0.3)' : 'rgba(241, 196, 15, 0.2)'}`,
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
          Your Custom Menu
        </Typography>
        {selectedMenu.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            Add items from the menu list to build your event order.
          </Alert>
        ) : (
          <Box sx={{ height: 400, overflowY: 'auto', p: 1 }}>
            <List dense>
              {selectedMenu.map((item, index) => (
                <ListItem 
                  key={item._id} 
                  disablePadding 
                  sx={{ 
                    py: 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
                  }}
                >
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={7} sm={6}>
                      <Typography variant="body1" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatPrice(item.pricePerUnit)} per unit
                      </Typography>
                    </Grid>
                    <Grid item xs={5} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1 }}>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          onClick={() => handleQuantityChange(item._id, -1)} 
                          sx={{ 
                            minWidth: '30px', 
                            p: '2px',
                            borderColor: 'primary.main',
                            color: 'primary.main',
                          }}
                        >
                          -
                        </Button>
                        <Typography variant="body1" sx={{ minWidth: 20, textAlign: 'center', fontWeight: 600 }}>
                          {item.quantity}
                        </Typography>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          onClick={() => handleQuantityChange(item._id, 1)} 
                          sx={{ 
                            minWidth: '30px', 
                            p: '2px',
                            borderColor: 'primary.main',
                            color: 'primary.main',
                          }}
                        >
                          +
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Estimated Total: {formatPrice(estimatedTotal)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Final quote may vary based on event requirements
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading menu and customer data...</Typography>
      </Container>
    );
  }

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
          Book Your Event Catering
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
          Select your menu and event details. We'll contact you soon! ✨
        </Typography>
      </Box>

      {/* Main Content */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          {renderAvailableMenu()}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderSelectedMenu()}
        </Grid>

        {/* Event Details Section */}
        <Grid item xs={12}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 4,
              border: (theme) => `2px solid ${theme.palette.mode === 'light' ? 'rgba(241, 196, 15, 0.3)' : 'rgba(241, 196, 15, 0.2)'}`,
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 3 }}>
                <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Event & Venue Details
              </Typography>

              <Box component="form" onSubmit={handleSubmitRequest}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Type of Event</InputLabel>
                      <Select
                        value={eventType}
                        label="Type of Event"
                        onChange={(e) => setEventType(e.target.value)}
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="Birthday">Birthday Party</MenuItem>
                        <MenuItem value="Anniversary">Anniversary</MenuItem>
                        <MenuItem value="Corporate">Corporate Event</MenuItem>
                        <MenuItem value="Social">Social Gathering</MenuItem>
                        <MenuItem value="Other">Other / Custom</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Estimated Guest Count (Min 10)"
                      type="number"
                      fullWidth
                      required
                      value={guestCount}
                      onChange={(e) => setGuestCount(parseInt(e.target.value) || 10)}
                      inputProps={{ min: 10 }}
                      sx={{ borderRadius: 2 }}
                      InputProps={{
                        startAdornment: <PeopleIcon color="action" sx={{ mr: 1 }} />,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Event Date"
                      type="date"
                      fullWidth
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Event Time"
                      type="time"
                      fullWidth
                      required
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>

                  {/* Service Options */}
                  <Grid item xs={12}>
                    <FormControl component="fieldset" required fullWidth>
                      <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
                        Service Option
                      </FormLabel>
                      <RadioGroup
                        row
                        value={serviceOption}
                        onChange={(e) => setServiceOption(e.target.value)}
                        sx={{ gap: 3 }}
                      >
                        <FormControlLabel 
                          value="Home Delivery" 
                          control={<Radio color="primary" />} 
                          label="Home Delivery (Drop-off)" 
                        />
                        <FormControlLabel 
                          value="Self Pickup" 
                          control={<Radio color="primary" />} 
                          label="Self Pickup" 
                        />
                        <FormControlLabel 
                          value="Full Services" 
                          control={<Radio color="primary" />} 
                          label="Full Service (On-Site)" 
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Venue Name"
                      fullWidth
                      required
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      sx={{ borderRadius: 2 }}
                      InputProps={{
                        startAdornment: <LocationOnIcon color="action" sx={{ mr: 1 }} />,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Venue Full Address"
                      fullWidth
                      required={serviceOption === 'Home Delivery' || serviceOption === 'Full Services'}
                      disabled={serviceOption === 'Self Pickup'}
                      helperText={serviceOption === 'Self Pickup' ? "Address not required for pickup" : ""}
                      multiline
                      rows={2}
                      value={venueAddress}
                      onChange={(e) => setVenueAddress(e.target.value)}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={submitting || selectedMenu.length === 0 || guestCount < 10}
                      sx={{
                        py: 2,
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
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {submitting
                        ? <CircularProgress size={24} color="inherit" />
                        : `Submit Request (Quote: ${formatPrice(estimatedTotal)})`}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CateringRequestPage;