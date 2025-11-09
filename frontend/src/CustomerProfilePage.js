// In frontend/src/CustomerProfilePage.js (UPDATED WITH MATCHING DESIGN)

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Container, Paper, Typography, TextField, Button,
  Box, Stack, CircularProgress, Alert, Divider,
  Grid, FormControl, InputLabel, Select, MenuItem,
  IconButton, Card, CardContent, Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LockIcon from '@mui/icons-material/Lock';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';

// Define API Base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

function CustomerProfilePage({ customerToken, showSnackbar, onProfileUpdate }) {
  
  // State for profile form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');

  // State for password form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // State for addresses
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addressError, setAddressError] = useState('');

  // State for 'Add Address' form
  const [addressType, setAddressType] = useState('Home');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [loadingAddAddress, setLoadingAddAddress] = useState(false);

  // Helper to get auth config
  const getAuthConfig = useCallback(() => {
    return {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    };
  }, [customerToken]);

  // On page load, fetch the customer's current data to fill the form
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!customerToken) return;
      
      const config = getAuthConfig();
      
      // 1. Fetch Profile
      setLoadingProfile(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/customers/me`, config);
        setName(res.data.name || '');
        setPhone(res.data.phone || '');
        setEmail(res.data.email || '');
      } catch (err) {
        console.error("Error fetching customer data:", err);
        setProfileError("Could not load your profile.");
      } finally {
        setLoadingProfile(false);
      }
      
      // 2. Fetch Addresses
      setLoadingAddresses(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/customers/me/addresses`, config);
        setAddresses(res.data || []);
      } catch (err) {
        console.error("Error fetching addresses:", err);
        showSnackbar("Could not load saved addresses.", "error");
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchCustomerData();
  }, [customerToken, getAuthConfig, showSnackbar]);

  // Handler for the "Update Profile" form
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    setProfileError('');
    
    try {
      const config = getAuthConfig();
      const body = { name, phone, email };
      await axios.put(`${API_BASE_URL}/api/customers/me/update`, body, config);
      
      showSnackbar('Profile updated successfully!', 'success');
      onProfileUpdate();
      
    } catch (err) {
      console.error("Error updating profile:", err.response);
      setProfileError(err.response?.data?.Error || err.response?.data || "An error occurred.");
    } finally {
      setLoadingProfile(false);
    }
  };

  // Handler for the "Change Password" form
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    setLoadingPassword(true);
    
    try {
      const config = getAuthConfig();
      const body = { oldPassword, newPassword };
      const res = await axios.post(`${API_BASE_URL}/api/customers/me/change-password`, body, config);
      
      showSnackbar(res.data, 'success');
      
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (err) {
      console.error("Error changing password:", err.response);
      setPasswordError(err.response?.data?.Error || err.response?.data || "An error occurred.");
    } finally {
      setLoadingPassword(false);
    }
  };

  // Handler for "Add Address" form
  const handleAddAddress = async (e) => {
    e.preventDefault();
    setAddressError('');
    
    if (!street || !city || !pincode) {
      setAddressError("Please fill in all required fields.");
      return;
    }
    
    setLoadingAddAddress(true);
    try {
      const config = getAuthConfig();
      const body = { addressType, street, city, pincode };
      const res = await axios.post(`${API_BASE_URL}/api/customers/me/addresses`, body, config);
      
      setAddresses(prev => [res.data, ...prev]);
      showSnackbar("New address saved!", "success");
      setStreet('');
      setCity('');
      setPincode('');
      setAddressType('Home');
      
    } catch (err) {
      console.error("Error adding address:", err.response);
      setAddressError(err.response?.data?.Error || err.response?.data || "Could not save address.");
    } finally {
      setLoadingAddAddress(false);
    }
  };

  // Handler for "Delete Address" button
  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }
    
    try {
      const config = getAuthConfig();
      await axios.delete(`${API_BASE_URL}/api/customers/me/addresses/${addressId}`, config);
      
      setAddresses(prev => prev.filter(addr => addr._id !== addressId));
      showSnackbar("Address deleted.", "info");
      
    } catch (err) {
      console.error("Error deleting address:", err.response);
      showSnackbar(err.response?.data?.Error || "Could not delete address.", "error");
    }
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case 'Home': return <HomeIcon fontSize="small" />;
      case 'Work': return <WorkIcon fontSize="small" />;
      default: return <OtherHousesIcon fontSize="small" />;
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
          My Profile
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
          Manage Your Account Settings & Preferences ✨
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Details Section */}
        <Grid item xs={12} md={6}>
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
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PersonIcon sx={{ fontSize: 30, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Personal Information
                </Typography>
              </Box>
              
              <Box component="form" onSubmit={handleProfileUpdate}>
                <Stack spacing={2.5}>
                  <TextField
                    label="Full Name"
                    fullWidth
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loadingProfile}
                    sx={{ borderRadius: 2 }}
                  />
                  <TextField
                    label="Phone Number"
                    fullWidth
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loadingProfile}
                    sx={{ borderRadius: 2 }}
                  />
                  <TextField
                    label="Email Address (Optional)"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loadingProfile}
                    sx={{ borderRadius: 2 }}
                  />
                  {profileError && (
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                      {profileError}
                    </Alert>
                  )}
                  <Button 
                    type="submit" 
                    variant="contained"
                    fullWidth 
                    disabled={loadingProfile}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1rem',
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
                    {loadingProfile ? <CircularProgress size={24} color="inherit" /> : 'Update Profile'}
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Password Change Section */}
        <Grid item xs={12} md={6}>
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
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LockIcon sx={{ fontSize: 30, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Change Password
                </Typography>
              </Box>
              
              <Box component="form" onSubmit={handlePasswordChange}>
                <Stack spacing={2.5}>
                  <TextField
                    label="Current Password"
                    type="password"
                    fullWidth
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    disabled={loadingPassword}
                    sx={{ borderRadius: 2 }}
                  />
                  <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loadingPassword}
                    sx={{ borderRadius: 2 }}
                  />
                  <TextField
                    label="Confirm New Password"
                    type="password"
                    fullWidth
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loadingPassword}
                    sx={{ borderRadius: 2 }}
                  />
                  {passwordError && (
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                      {passwordError}
                    </Alert>
                  )}
                  <Button 
                    type="submit" 
                    variant="contained"
                    fullWidth 
                    disabled={loadingPassword}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1rem',
                      fontWeight: 600,
                      background: (theme) => theme.palette.mode === 'light' 
                        ? 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)'
                        : 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)',
                      color: '#fff',
                      '&:hover': {
                        background: (theme) => theme.palette.mode === 'light' 
                          ? 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)'
                          : 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
                        transform: 'scale(1.02)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {loadingPassword ? <CircularProgress size={24} color="inherit" /> : 'Change Password'}
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Address Management Section */}
        <Grid item xs={12}>
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
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LocationOnIcon sx={{ fontSize: 30, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Manage Addresses
                </Typography>
              </Box>

              {/* Add Address Form */}
              <Box component="form" onSubmit={handleAddAddress} sx={{ mb: 4, p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                  Add New Address
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Address Type</InputLabel>
                      <Select
                        value={addressType}
                        label="Address Type"
                        onChange={(e) => setAddressType(e.target.value)}
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="Home">Home</MenuItem>
                        <MenuItem value="Work">Work</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Street Address"
                      fullWidth
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="City"
                      fullWidth
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Pincode"
                      fullWidth
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>
                  {addressError && (
                    <Grid item xs={12}>
                      <Alert severity="error" sx={{ borderRadius: 2 }}>
                        {addressError}
                      </Alert>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Button 
                      type="submit" 
                      variant="contained"
                      disabled={loadingAddAddress}
                      startIcon={<AddIcon />}
                      sx={{
                        borderRadius: 2,
                        fontWeight: 600,
                        background: (theme) => theme.palette.mode === 'light' 
                          ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                          : 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
                        color: '#fff',
                        '&:hover': {
                          background: (theme) => theme.palette.mode === 'light' 
                            ? 'linear-gradient(135deg, #45a049 0%, #388E3C 100%)'
                            : 'linear-gradient(135deg, #388E3C 0%, #2E7D32 100%)',
                          transform: 'scale(1.02)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {loadingAddAddress ? <CircularProgress size={24} color="inherit" /> : 'Save Address'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />
              
              {/* Saved Address List */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                  Your Saved Addresses ({addresses.length})
                </Typography>
                {loadingAddresses ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : addresses.length === 0 ? (
                  <Alert severity="info" sx={{ borderRadius: 2, textAlign: 'center' }}>
                    You have no saved addresses. Add your first address above!
                  </Alert>
                ) : (
                  <Grid container spacing={2}>
                    {addresses.map((addr) => (
                      <Grid item xs={12} md={6} key={addr._id}>
                        <Card 
                          variant="outlined" 
                          sx={{ 
                            p: 2, 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'flex-start',
                            borderRadius: 2,
                            borderColor: 'primary.light',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: 'primary.main',
                              boxShadow: 1,
                            }
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              {getAddressIcon(addr.addressType)}
                              <Chip 
                                label={addr.addressType} 
                                size="small" 
                                color="primary" 
                                variant="filled"
                                sx={{ 
                                  ml: 1,
                                  background: (theme) => theme.palette.mode === 'light' 
                                    ? 'linear-gradient(135deg, #F1C40F 0%, #F39C12 100%)'
                                    : 'linear-gradient(135deg, #F1C40F 0%, #D4AC0D 100%)',
                                  color: '#000',
                                  fontWeight: 600,
                                }}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              {addr.street}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {addr.city}, {addr.pincode}
                            </Typography>
                          </Box>
                          <IconButton 
                            edge="end" 
                            aria-label="delete" 
                            color="error"
                            onClick={() => handleDeleteAddress(addr._id)}
                            sx={{ 
                              '&:hover': {
                                backgroundColor: 'error.light',
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CustomerProfilePage;