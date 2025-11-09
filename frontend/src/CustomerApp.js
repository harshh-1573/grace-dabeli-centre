// In frontend/src/CustomerApp.js (FINAL CLEAN VERSION)

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

import {
  Container, Grid, Box, Card, CardContent, CardMedia,
  Typography, Button, List, ListItem, ListItemText,
  IconButton, Alert,
  ListItemAvatar, Avatar, Paper, Tabs, Tab, TextField, Stack,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  Checkbox, FormControlLabel, RadioGroup, Radio, FormControl, FormLabel, Divider,
  InputLabel, Select, MenuItem,
} from '@mui/material';


import { useTheme, useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete'; 
import StarIcon from '@mui/icons-material/Star'; 
import SearchIcon from '@mui/icons-material/Search'; 
import EditNoteIcon from '@mui/icons-material/EditNote'; 
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Define API Base URL once
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';





// ===========================================
// 📦 UPDATED: Customization MODAL Component
// ===========================================
const CustomizeModal = ({ item, open, onClose, onCustomize }) => {
  const itemData = item || {};
  const [selections, setSelections] = useState({});
  const theme = useTheme(); // ✅ Add theme for dark mode support

  useEffect(() => {
    if (!itemData.modifiers) return;

    const initialSelections = {};
    itemData.modifiers.forEach((group) => {
      if (group.selectionType === 'single' && group.options.length > 0) {
        const defaultOption =
          group.options.find((opt) => opt.price === 0) || group.options[0];
        initialSelections[group.groupName] = defaultOption;
      } else {
        initialSelections[group.groupName] = [];
      }
    });
    setSelections(initialSelections);
  }, [itemData]);

  const priceAdjustment = useMemo(() => {
    if (Object.keys(selections).length === 0) return 0;
    return Object.values(selections).reduce((total, selection) => {
      if (Array.isArray(selection)) {
        return total + selection.reduce((sum, opt) => sum + opt.price, 0);
      } else if (selection && selection.price !== undefined) {
        return total + selection.price;
      }
      return total;
    }, 0);
  }, [selections]);

  const basePrice = itemData.price || 0;
  const finalPrice = basePrice + priceAdjustment;

  const handleSelectionChange = (groupName, option) => {
    setSelections((prev) => {
      const currentSelection = prev[groupName];
      const group = itemData.modifiers.find((g) => g.groupName === groupName);

      if (group.selectionType === 'single') {
        return { ...prev, [groupName]: option };
      } else {
        const isSelected = currentSelection.some(
          (o) => o.name === option.name
        );
        if (isSelected) {
          return {
            ...prev,
            [groupName]: currentSelection.filter(
              (o) => o.name !== option.name
            )
          };
        } else {
          return { ...prev, [groupName]: [...currentSelection, option] };
        }
      }
    });
  };

  const handleConfirm = () => {
    const customizationDetails = Object.keys(selections)
      .map((groupName) => {
        const selection = selections[groupName];
        if (Array.isArray(selection)) {
          return { groupName, selectedOptions: selection };
        } else if (selection) {
          return { groupName, selectedOptions: [selection] };
        }
        return { groupName, selectedOptions: [] };
      })
      .filter((d) => d.selectedOptions.length > 0);

    onCustomize({
      ...item,
      price: finalPrice,
      customization: customizationDetails
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiPaper-root': {
          borderRadius: 4,
          border: `2px solid ${
            theme.palette.mode === 'dark'
              ? 'rgba(241, 196, 15, 0.2)'
              : 'rgba(241, 196, 15, 0.3)'
          }`,
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 20px 60px rgba(0,0,0,0.5)'
              : '0 20px 60px rgba(0,0,0,0.15)',
          animation: 'modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '@keyframes modalSlideIn': {
            from: {
              opacity: 0,
              transform: 'scale(0.8) translateY(20px)'
            },
            to: {
              opacity: 1,
              transform: 'scale(1) translateY(0)'
            }
          },
          overflow: 'hidden'
        }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #F1C40F 0%, #F39C12 100%)',
          color: '#000',
          py: 3,
          textAlign: 'center',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '10%',
            right: '10%',
            height: '2px',
            background: 'rgba(255,255,255,0.3)'
          }
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 700,
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}
        >
          🎯 Customize {itemData.name || 'Item'}
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 4,
          '&::-webkit-scrollbar': { width: 8 },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.primary.main,
            borderRadius: 4
          }
        }}
      >
        <Stack spacing={4}>
          {/* Price Display */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 3,
              borderRadius: 3,
              background:
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(241, 196, 15, 0.15) 0%, rgba(243, 156, 18, 0.15) 100%)'
                  : 'linear-gradient(135deg, rgba(241, 196, 15, 0.1) 0%, rgba(243, 156, 18, 0.1) 100%)',
              border: `1px solid ${theme.palette.primary.main}33`
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                Base Price
              </Typography>
              <Typography variant="h5" fontWeight="600">
                ₹{basePrice.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="text.secondary">
                Total
              </Typography>
              <Typography
                variant="h4"
                fontWeight="700"
                color="primary.main"
              >
                ₹{finalPrice.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          {/* Customization Groups */}
          {itemData.modifiers &&
            itemData.modifiers.map((group, groupIndex) => (
              <Box
                key={group.groupName}
                sx={{
                  animation: `fadeInUp 0.5s ease-out ${groupIndex * 0.1}s both`,
                  '@keyframes fadeInUp': {
                    from: { opacity: 0, transform: 'translateY(20px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                  }
                }}
              >
                <FormControl component="fieldset" fullWidth>
                  <FormLabel
                    component="legend"
                    sx={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: 'text.primary',
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    ⚡ {group.groupName}
                    <Typography
                      variant="caption"
                      color="primary.main"
                      sx={{ ml: 1, fontSize: '0.8rem' }}
                    >
                      {group.selectionType === 'single'
                        ? '(Select one)'
                        : '(Select any number)'}
                    </Typography>
                  </FormLabel>

                  <Box
                    sx={{
                      p: 3,
                      border: `2px solid ${theme.palette.primary.main}1A`,
                      borderRadius: 3,
                      background:
                        theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, rgba(241, 196, 15, 0.08) 0%, rgba(243, 156, 18, 0.08) 100%)'
                          : 'linear-gradient(135deg, rgba(241, 196, 15, 0.05) 0%, rgba(243, 156, 18, 0.05) 100%)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: `${theme.palette.primary.main}33`,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 24px ${theme.palette.primary.main}15`
                      }
                    }}
                  >
                    {group.selectionType === 'single' ? (
                      <RadioGroup
                        value={selections[group.groupName]?.name || ''}
                        onChange={(e) => {
                          const selectedOption = group.options.find(
                            (o) => o.name === e.target.value
                          );
                          handleSelectionChange(
                            group.groupName,
                            selectedOption
                          );
                        }}
                      >
                        <Grid container spacing={2}>
                          {group.options.map((option, optIndex) => (
                            <Grid item xs={12} sm={6} key={option.name}>
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  border: `2px solid ${
                                    selections[group.groupName]?.name ===
                                    option.name
                                      ? theme.palette.primary.main
                                      : theme.palette.divider
                                  }`,
                                  background:
                                    selections[group.groupName]?.name ===
                                    option.name
                                      ? `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`
                                      : 'transparent',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    borderColor: theme.palette.primary.main,
                                    transform: 'scale(1.02)'
                                  },
                                  animation: `optionSlideIn 0.4s ease-out ${optIndex * 0.05}s both`,
                                  '@keyframes optionSlideIn': {
                                    from: {
                                      opacity: 0,
                                      transform: 'translateX(-10px)'
                                    },
                                    to: {
                                      opacity: 1,
                                      transform: 'translateX(0)'
                                    }
                                  }
                                }}
                                onClick={() =>
                                  handleSelectionChange(
                                    group.groupName,
                                    option
                                  )
                                }
                              >
                                <FormControlLabel
                                  value={option.name}
                                  control={<Radio size="small" />}
                                  label={
                                    <Box>
                                      <Typography
                                        variant="body1"
                                        fontWeight="600"
                                      >
                                        {option.name}
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        color="primary.main"
                                        fontWeight="600"
                                      >
                                        +₹{option.price.toFixed(2)}
                                      </Typography>
                                    </Box>
                                  }
                                  sx={{ width: '100%', m: 0 }}
                                />
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </RadioGroup>
                    ) : (
                      <Grid container spacing={2}>
                        {group.options.map((option, optIndex) => (
                          <Grid item xs={12} sm={6} key={option.name}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                border: `2px solid ${
                                  selections[group.groupName]?.some(
                                    (o) => o.name === option.name
                                  )
                                    ? theme.palette.primary.main
                                    : theme.palette.divider
                                }`,
                                background:
                                  selections[group.groupName]?.some(
                                    (o) => o.name === option.name
                                  )
                                    ? `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`
                                    : 'transparent',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  borderColor: theme.palette.primary.main,
                                  transform: 'scale(1.02)'
                                },
                                animation: `optionSlideIn 0.4s ease-out ${optIndex * 0.05}s both`
                              }}
                              onClick={() =>
                                handleSelectionChange(
                                  group.groupName,
                                  option
                                )
                              }
                            >
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={
                                      selections[group.groupName]?.some(
                                        (o) => o.name === option.name
                                      ) || false
                                    }
                                    onChange={() =>
                                      handleSelectionChange(
                                        group.groupName,
                                        option
                                      )
                                    }
                                    size="small"
                                  />
                                }
                                label={
                                  <Box>
                                    <Typography
                                      variant="body1"
                                      fontWeight="600"
                                    >
                                      {option.name}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="primary.main"
                                      fontWeight="600"
                                    >
                                      +₹{option.price.toFixed(2)}
                                    </Typography>
                                  </Box>
                                }
                                sx={{ width: '100%', m: 0 }}
                              />
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>
                </FormControl>
              </Box>
            ))}
        </Stack>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          p: 3,
          borderTop: `1px solid ${theme.palette.divider}`,
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(241, 196, 15, 0.08) 0%, rgba(243, 156, 18, 0.08) 100%)'
              : 'linear-gradient(135deg, rgba(241, 196, 15, 0.05) 0%, rgba(243, 156, 18, 0.05) 100%)'
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1,
            fontWeight: 600,
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 4px 12px ${theme.palette.secondary.main}33`
            }
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleConfirm}
          variant="contained"
          color="success"
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1,
            fontWeight: 700,
            fontSize: '1rem',
            background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 20px rgba(76, 175, 80, 0.4)',
              background:
                'linear-gradient(135deg, #45a049 0%, #1B5E20 100%)'
            }
          }}
        >
          🛒 Add to Order – ₹{finalPrice.toFixed(2)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};



// ===========================================
// 🏠 UPDATED: Reusable Address Form Component
// ===========================================
const AddressForm = ({ onAddressAdded, customerToken, showSnackbar }) => {
  const [addressType, setAddressType] = useState('Home');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
  const theme = useTheme(); // ✅ Add theme for dark mode support

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setError('');

    if (!street || !city || !pincode) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${customerToken}` }
      };
      const body = { addressType, street, city, pincode };

      const res = await axios.post(
        `${API_BASE_URL}/api/customers/me/addresses`,
        body,
        config
      );

      showSnackbar('New address saved!', 'success');
      setStreet('');
      setCity('');
      setPincode('');
      setAddressType('Home');
      onAddressAdded(res.data);
    } catch (err) {
      console.error('Error adding address:', err.response);
      setError(
        err.response?.data?.Error ||
          err.response?.data ||
          'Could not save address.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleAddAddress}
      sx={{
        mt: 3,
        p: 4,
        borderRadius: 3,
        border: `2px solid ${
          theme.palette.mode === 'dark'
            ? 'rgba(241, 196, 15, 0.2)'
            : 'rgba(241, 196, 15, 0.3)'
        }`,
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(145deg, rgba(241, 196, 15, 0.08) 0%, rgba(243, 156, 18, 0.08) 100%)'
            : 'linear-gradient(145deg, rgba(241, 196, 15, 0.05) 0%, rgba(243, 156, 18, 0.05) 100%)',
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 8px 24px rgba(241, 196, 15, 0.1)'
            : '0 8px 24px rgba(241, 196, 15, 0.15)',
        animation: 'formSlideIn 0.5s ease-out',
        '@keyframes formSlideIn': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        }
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: 'text.primary',
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #F1C40F 0%, #D4AC0D 100%)'
              : 'linear-gradient(135deg, #F1C40F 0%, #F39C12 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        📍 Add New Address
      </Typography>

      <Grid container spacing={3}>
        {/* Address Type */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel sx={{ fontWeight: 600 }}>Address Type</InputLabel>
            <Select
              value={addressType}
              label="Address Type"
              onChange={(e) => setAddressType(e.target.value)}
              sx={{
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: `${theme.palette.primary.main}33`
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2
                }
              }}
            >
              <MenuItem value="Home">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HomeIcon fontSize="small" /> Home
                </Box>
              </MenuItem>
              <MenuItem value="Work">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WorkIcon fontSize="small" /> Work
                </Box>
              </MenuItem>
              <MenuItem value="Other">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon fontSize="small" /> Other
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Street Address */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Street Address"
            fullWidth
            required
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: `${theme.palette.primary.main}33`
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2
                }
              }
            }}
          />
        </Grid>

        {/* City */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="City"
            fullWidth
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: `${theme.palette.primary.main}33`
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2
                }
              }
            }}
          />
        </Grid>

        {/* Pincode */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Pincode"
            fullWidth
            required
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: `${theme.palette.primary.main}33`
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2
                }
              }
            }}
          />
        </Grid>

        {/* Error Display */}
        {error && (
          <Grid item xs={12}>
            <Alert
              severity="error"
              variant="outlined"
              sx={{
                borderRadius: 2,
                border: `2px solid ${theme.palette.error.main}33`,
                background:
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(229, 57, 53, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(244, 67, 54, 0.05) 0%, rgba(229, 57, 53, 0.05) 100%)',
                '& .MuiAlert-icon': { fontSize: '1.5rem' }
              }}
            >
              <Typography variant="body2" fontWeight="600">
                {error}
              </Typography>
            </Alert>
          </Grid>
        )}

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover:not(:disabled)': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(76, 175, 80, 0.4)',
                background:
                  'linear-gradient(135deg, #45a049 0%, #1B5E20 100%)'
              },
              '&:disabled': {
                background:
                  'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)'
              }
            }}
          >
            {loading ? 'Saving Address...' : '💾 Save New Address'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};







// ===========================================
// --- 🚚 UPDATED: Address Selection Modal ---
// ===========================================
// ===========================================
// 🚚 UPDATED: Address Selection Modal
// ===========================================
const AddressModal = ({
  open,
  onClose,
  onSubmitOrder,
  customerToken,
  showSnackbar
}) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [orderType, setOrderType] = useState('Delivery');

  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
  const theme = useTheme(); // ✅ Access MUI theme

  const getAuthConfig = useCallback(() => {
    return { headers: { Authorization: `Bearer ${customerToken}` } };
  }, [customerToken]);

  // Fetch addresses when modal opens
  useEffect(() => {
    if (open) {
      setLoading(true);
      setShowAddForm(false);
      setOrderType('Delivery');

      axios
        .get(`${API_BASE_URL}/api/customers/me/addresses`, getAuthConfig())
        .then((res) => {
          setAddresses(res.data || []);
          if (res.data && res.data.length > 0) {
            setSelectedAddressId(res.data[0]._id);
          } else {
            setShowAddForm(true);
          }
        })
        .catch((err) => {
          console.error('Error fetching addresses:', err);
          showSnackbar('Could not load addresses.', 'error');
        })
        .finally(() => setLoading(false));
    }
  }, [open, getAuthConfig, showSnackbar, API_BASE_URL]);

  const handleAddressAdded = (newAddress) => {
    setAddresses((prev) => [newAddress, ...prev]);
    setSelectedAddressId(newAddress._id);
    setShowAddForm(false);
  };

  const handleSubmit = () => {
    if (orderType === 'Pickup') {
      onSubmitOrder({
        orderType: 'Pickup',
        deliveryAddress: null
      });
      return;
    }

    if (orderType === 'Delivery') {
      const selected = addresses.find((a) => a._id === selectedAddressId);
      if (selected) {
        onSubmitOrder({
          orderType: 'Delivery',
          deliveryAddress: selected
        });
      } else {
        showSnackbar('Please select a delivery address.', 'error');
      }
    }
  };

  const getIcon = (type) => {
    if (type === 'Work') return <WorkIcon fontSize="small" />;
    if (type === 'Home') return <HomeIcon fontSize="small" />;
    return <LocationOnIcon fontSize="small" />;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiPaper-root': {
          borderRadius: 4,
          border: `2px solid ${
            theme.palette.mode === 'dark'
              ? 'rgba(241, 196, 15, 0.2)'
              : 'rgba(241, 196, 15, 0.3)'
          }`,
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 20px 60px rgba(0,0,0,0.5)'
              : '0 20px 60px rgba(0,0,0,0.15)',
          overflow: 'hidden'
        }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #F1C40F 0%, #F39C12 100%)',
          color: '#000',
          py: 3,
          textAlign: 'center',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '10%',
            right: '10%',
            height: '2px',
            background: 'rgba(255,255,255,0.3)'
          }
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{ fontWeight: 700, textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}
        >
          🚀 Order Delivery Options
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        {/* Order Type Selection */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            📦 Select Order Type
          </Typography>

          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background:
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(241, 196, 15, 0.08) 0%, rgba(243, 156, 18, 0.08) 100%)'
                  : 'linear-gradient(135deg, rgba(241, 196, 15, 0.05) 0%, rgba(243, 156, 18, 0.05) 100%)',
              border: `2px solid ${
                theme.palette.mode === 'dark'
                  ? 'rgba(241, 196, 15, 0.15)'
                  : 'rgba(241, 196, 15, 0.1)'
              }`
            }}
          >
            <RadioGroup
              row
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              sx={{ justifyContent: 'space-around' }}
            >
              {/* Delivery Option */}
              <FormControlLabel
                value="Delivery"
                control={<Radio />}
                label={
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <LocationOnIcon
                      sx={{ fontSize: 32, color: 'primary.main', mb: 1 }}
                    />
                    <Typography variant="body1" fontWeight="600">
                      Delivery
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Get it delivered
                    </Typography>
                  </Box>
                }
                sx={{
                  borderRadius: 2,
                  border:
                    orderType === 'Delivery'
                      ? `2px solid ${theme.palette.primary.main}`
                      : `2px solid ${theme.palette.divider}`,
                  background:
                    orderType === 'Delivery'
                      ? theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(241, 196, 15, 0.15) 0%, rgba(243, 156, 18, 0.15) 100%)'
                        : 'linear-gradient(135deg, rgba(241, 196, 15, 0.1) 0%, rgba(243, 156, 18, 0.1) 100%)'
                      : 'transparent',
                  transition: 'all 0.3s ease',
                  mx: 1
                }}
              />

              {/* Pickup Option */}
              <FormControlLabel
                value="Pickup"
                control={<Radio />}
                label={
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <HomeIcon
                      sx={{ fontSize: 32, color: 'primary.main', mb: 1 }}
                    />
                    <Typography variant="body1" fontWeight="600">
                      Pickup
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      In-Store
                    </Typography>
                  </Box>
                }
                sx={{
                  borderRadius: 2,
                  border:
                    orderType === 'Pickup'
                      ? `2px solid ${theme.palette.primary.main}`
                      : `2px solid ${theme.palette.divider}`,
                  background:
                    orderType === 'Pickup'
                      ? theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(241, 196, 15, 0.15) 0%, rgba(243, 156, 18, 0.15) 100%)'
                        : 'linear-gradient(135deg, rgba(241, 196, 15, 0.1) 0%, rgba(243, 156, 18, 0.1) 100%)'
                      : 'transparent',
                  transition: 'all 0.3s ease',
                  mx: 1
                }}
              />
            </RadioGroup>
          </Paper>
        </Box>

        {/* Delivery Section */}
        {orderType === 'Delivery' && (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              🏠 Select Delivery Address
            </Typography>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress size={40} />
              </Box>
            ) : (
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={selectedAddressId}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                >
                  <Stack spacing={2}>
                    {addresses.map((addr) => (
                      <Paper
                        key={addr._id}
                        elevation={0}
                        sx={{
                          p: 3,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          border:
                            selectedAddressId === addr._id
                              ? `2px solid ${theme.palette.primary.main}`
                              : `2px solid ${theme.palette.divider}`,
                          background:
                            selectedAddressId === addr._id
                              ? 'linear-gradient(135deg, rgba(241, 196, 15, 0.1) 0%, rgba(243, 156, 18, 0.1) 100%)'
                              : 'linear-gradient(135deg, rgba(241, 196, 15, 0.03) 0%, rgba(243, 156, 18, 0.03) 100%)',
                          cursor: 'pointer',
                          borderRadius: 3,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow:
                              '0 8px 24px rgba(241, 196, 15, 0.15)',
                            borderColor: theme.palette.primary.main
                          }
                        }}
                        onClick={() => setSelectedAddressId(addr._id)}
                      >
                        <Radio value={addr._id} />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 'bold',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              mb: 0.5
                            }}
                          >
                            {getIcon(addr.addressType)}
                            {addr.addressType}
                            <Typography
                              variant="caption"
                              color="primary.main"
                              sx={{ ml: 1, fontWeight: 600 }}
                            >
                              {selectedAddressId === addr._id && '✓ Selected'}
                            </Typography>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {addr.street}, {addr.city}, {addr.pincode}
                          </Typography>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                </RadioGroup>
              </FormControl>
            )}

            {/* Add New Address Section */}
            {!loading &&
              (showAddForm ? (
                <Box sx={{ mt: 3 }}>
                  <AddressForm
                    customerToken={customerToken}
                    showSnackbar={showSnackbar}
                    onAddressAdded={handleAddressAdded}
                  />
                </Box>
              ) : (
                <Button
                  onClick={() => setShowAddForm(true)}
                  startIcon={<AddIcon />}
                  fullWidth
                  variant="outlined"
                  sx={{
                    mt: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    border: `2px dashed ${
                      theme.palette.mode === 'dark'
                        ? 'rgba(241, 196, 15, 0.3)'
                        : 'rgba(241, 196, 15, 0.4)'
                    }`,
                    color: 'primary.main',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      border: `2px dashed ${theme.palette.primary.main}`,
                      background:
                        'linear-gradient(135deg, rgba(241, 196, 15, 0.05) 0%, rgba(243, 156, 18, 0.05) 100%)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  + Add New Address
                </Button>
              ))}
          </Box>
        )}

        {/* Pickup Message */}
        {orderType === 'Pickup' && (
          <Alert
            severity="info"
            sx={{
              mt: 2,
              borderRadius: 3,
              background:
                'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(21, 101, 192, 0.1) 100%)',
              border: '1px solid rgba(33, 150, 243, 0.3)'
            }}
          >
            <Typography variant="body1" fontWeight="600">
              🏪 In-Store Pickup Selected
            </Typography>
            <Typography variant="body2">
              Your order will be prepared for pickup at our store. You will not
              be charged any delivery fees.
            </Typography>
          </Alert>
        )}
      </DialogContent>

      {/* Action Buttons */}
      <DialogActions
        sx={{
          p: 3,
          borderTop: `1px solid ${theme.palette.divider}`,
          background:
            'linear-gradient(135deg, rgba(241, 196, 15, 0.05) 0%, rgba(243, 156, 18, 0.05) 100%)'
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1,
            fontWeight: 600,
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'translateY(-2px)' }
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          color="success"
          disabled={loading || (orderType === 'Delivery' && !selectedAddressId)}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover:not(:disabled)': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 20px rgba(76, 175, 80, 0.4)'
            }
          }}
        >
          ✅ Confirm & Place Order
        </Button>
      </DialogActions>
    </Dialog>
  );
};


// ===========================================
// 🍔 CustomerApp MAIN Component
// ===========================================
function CustomerApp({ customerToken, customerName, showSnackbar }) {

  const theme = useTheme();


  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Detects mobile & tablet
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detects small phones
  const [drawerOpen, setDrawerOpen] = useState(false);
  // State
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(''); // ✅ THIS FIXES THE ESLINT ERRORS
  
  

  // Customization Modal State
  const [customizationModalOpen, setCustomizationModalOpen] = useState(false);
  const [itemToCustomize, setItemToCustomize] = useState(null);
  
  // Note Modal State
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [currentItemForNote, setCurrentItemForNote] = useState(null);
  const [currentNoteText, setCurrentNoteText] = useState("");

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

  // Auth Config helper
  const getAuthConfig = useCallback(() => {
    return { headers: { 'Authorization': `Bearer ${customerToken}` } };
  }, [customerToken]);

  // Filter State
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // --- Fetching Logic ---
  const fetchMenu = useCallback(() => {
    setLoading(true);
    const params = {};
    if (selectedCategory !== 'All') params.category = selectedCategory;
    if (searchTerm.trim() !== '') params.search = searchTerm;
    
    axios.get(`${API_BASE_URL}/api/menu/`, { params }) 
      .then((res) => {
        setMenu(res.data);
        setLoading(false); // Set loading to false once menu is fetched
      })
      .catch((err) => {
        console.log("Error fetching menu:", err);
        setLoading(false);
      });
  }, [selectedCategory, searchTerm, API_BASE_URL]);

  const fetchCategories = useCallback(() => {
    axios.get(`${API_BASE_URL}/api/menu/categories`)
      .then((res) => {
        // Remove 'All' if it exists in the response, then add it at the beginning
        const categoriesFromAPI = Array.isArray(res.data) ? res.data.filter(cat => cat !== 'All') : [];
        setCategories(['All', ...categoriesFromAPI]);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, [API_BASE_URL]);
  
  const fetchFeaturedItems = useCallback(() => {
    axios.get(`${API_BASE_URL}/api/menu/featured`)
      .then((res) => setFeaturedItems(res.data))
      .catch((err) => console.error("Error fetching featured items:", err));
  }, [API_BASE_URL]);

  // --- Effects ---
  useEffect(() => {
    fetchCategories(); 
    fetchFeaturedItems();
  }, [fetchCategories, fetchFeaturedItems]); 

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchMenu();
    }, 300); 
    return () => {
      clearTimeout(handler); 
    };
  }, [selectedCategory, searchTerm, fetchMenu]);
  

  // --- Cart Logic ---
  const addSimpleItemToCart = (itemToAdd) => {
    if (itemToAdd.modifiers && itemToAdd.modifiers.length > 0) {
        setItemToCustomize(itemToAdd);
        setCustomizationModalOpen(true);
        return; 
    }
    setCart((prevCart) => {
        const existingItemIndex = prevCart.findIndex((item) => item._id === itemToAdd._id && !item.customization);
        if (existingItemIndex > -1) {
            return prevCart.map((item, index) =>
                index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            return [...prevCart, { ...itemToAdd, quantity: 1, note: '' }];
        }
    });
    showSnackbar(`${itemToAdd.name} added to cart!`, 'success');
  };
  
  const handleItemCustomized = (customizedItem) => {
    setCart((prevCart) => {
      return [...prevCart, { 
        ...customizedItem, 
        cartId: Date.now() + Math.random(), 
        quantity: 1, 
        note: '', 
      }];
    });
    setCustomizationModalOpen(false);
    showSnackbar(`${customizedItem.name} added to cart!`, 'success');
  };
  
  const handleQuantityChange = (itemId, change) => {
     setCart((prevCart) => {
       return prevCart.map((item) => {
        const idToCheck = item.cartId || item._id;
        if (idToCheck === itemId) {
           const newQuantity = item.quantity + change;
           return newQuantity > 0 ? { ...item, quantity: newQuantity } : null; 
         }
         return item;
       }).filter(item => item !== null); 
     });
  };
  
  const handleRemoveItem = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => (item.cartId || item._id) !== itemId));
  };
  // --- END CART LOGIC ---

  // --- Note Modal Handlers ---
  const openNoteModal = (item) => {
    setCurrentItemForNote(item);
    setCurrentNoteText(item.note || ''); 
    setNoteModalOpen(true);
  };
  
  const closeNoteModal = () => {
    setNoteModalOpen(false);
    setCurrentItemForNote(null);
    setCurrentNoteText("");
  };
  
  const handleSaveNote = () => {
    setCart(prevCart => 
      prevCart.map(item => 
        (item.cartId || item._id) === (currentItemForNote.cartId || currentItemForNote._id)
          ? { ...item, note: currentNoteText } 
          : item
      )
    );
    showSnackbar(`Note saved for ${currentItemForNote.name}`, 'success');
    closeNoteModal();
  };
  // --- END NOTE HANDLERS ---

  // Calculate Total Price
  const getTotalPrice = () => { return cart.reduce((total, item) => total + (item.price * item.quantity), 0); };

  // Group Menu By Categories
  const menuByCategories = menu.reduce((acc, item) => {
    const { category } = item;
    if (!acc[category]) { acc[category] = []; }
    acc[category].push(item);
    return acc;
   }, {});

  // --- Order Submission Logic ---
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!customerToken) {
      navigate('/customer/login', { state: { from: 'checkout' } });
      return;
    }
    if (cart.length === 0) {
      showSnackbar("Your cart is empty!", "warning");
      return;
    }
    setIsAddressModalOpen(true);
  };

  // Finalize Order Submission
  const handleFinalizeOrder = (orderData) => {
    
    // 1. Create the secure payload
    const newOrder = {
      orderType: orderData.orderType,

      deliveryAddress: orderData.orderType === 'Delivery' ? {
        street: orderData.deliveryAddress.street,
        city: orderData.deliveryAddress.city,
        pincode: orderData.deliveryAddress.pincode,
      } : undefined,
      
      items: cart.map(item => {
        const selectedModifiers = (item.customization || []).flatMap(group => 
          group.selectedOptions.map(option => ({
            name: option.name,
            price: option.price
          }))
        );
        return {
          menuItemId: item._id, 
          quantity: item.quantity,
          note: item.note || '',
          selectedModifiers: selectedModifiers 
        };
      })
    };
    
    const config = getAuthConfig();

    axios.post(`${API_BASE_URL}/api/orders/add`, newOrder, config)
      .then((res) => {
        showSnackbar(`Order placed! Your Order ID is ${res.data.orderId}`, "success");
        setCart([]); 
        setIsAddressModalOpen(false); 
      })
      .catch((err) => {
        console.error("Order submission error:", err);
        const errorData = err.response?.data;
        let errorMsg = errorData?.Error || errorData || "Error placing order";
        
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
           showSnackbar("Authentication error. Please log in again.", "error");
        } else if (typeof errorData === 'string' && errorData.includes('Validation Error')) {
           showSnackbar('Validation Error: Please check your order details.', 'error');
        } else {
           showSnackbar(errorMsg, "error");
        }
      });
  };

  // --- RENDER HELPERS ---
  const handleOpenCustomization = (item) => {
    if (item.modifiers && item.modifiers.length > 0) {
      setItemToCustomize(item);
      setCustomizationModalOpen(true);
    } else {
      addSimpleItemToCart(item);
    }
  }
  
  const getCustomizationSummary = (item) => {
    if (!item.customization || item.customization.length === 0) return null;
    const summaries = item.customization.flatMap(group => {
        return group.selectedOptions.map(option => option.name);
    });
    return summaries.join(', ');
  }







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
          Welcome to Grace Dabeli Centre
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
          Fresh, Hot, and Authentic. Place your order below! ✨
        </Typography>
      </Box>

      {/* --- FEATURED ITEMS SECTION --- */}
      {featuredItems.length > 0 && selectedCategory === 'All' && searchTerm === '' && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              borderBottom: '2px solid', 
              borderColor: 'primary.main', 
              pb: 1, 
              color: 'text.primary',
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              mb: 2
            }}>
                <StarIcon color="primary" sx={{ 
                  mr: 1, 
                  animation: 'twinkle 2s ease-in-out infinite',
                  '@keyframes twinkle': {
                    '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                    '50%': { opacity: 0.7, transform: 'scale(1.1)' },
                  },
                }} /> 
                Today's Must-Try Specials
            </Typography>
            <Grid container spacing={2}>
                {featuredItems.map((item, index) => (
                    <Grid item xs={6} sm={4} md={3} key={item._id}>
                        <Card 
                          elevation={0}
                          sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            borderRadius: 4,
                            border: (theme) => `2px solid ${theme.palette.mode === 'light' ? 'rgba(241, 196, 15, 0.3)' : 'rgba(241, 196, 15, 0.2)'}`,
                            overflow: 'hidden',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                              transform: 'translateY(-8px) scale(1.02)',
                              boxShadow: (theme) => theme.palette.mode === 'light'
                                ? '0 12px 24px rgba(241, 196, 15, 0.25)'
                                : '0 12px 24px rgba(241, 196, 15, 0.15)',
                              borderColor: 'primary.main',
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
                            <CardContent sx={{ p: 2, pb: '16px !important', textAlign: 'center' }}>
                                <Avatar 
                                    variant="rounded" 
                                    src={item.imageUrl || '/images/placeholder-food.jpg'} 
                                    sx={{ 
                                      width: 80, 
                                      height: 80, 
                                      mx: 'auto', 
                                      mb: 1.5,
                                      borderRadius: 3,
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                      transition: 'transform 0.3s ease',
                                      '&:hover': {
                                        transform: 'scale(1.1) rotate(5deg)',
                                      },
                                    }}
                                    alt={item.name}
                                    onError={(e) => { e.target.src = '/images/placeholder-food.jpg'; }}
                                />
                                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>{item.name}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Only ₹{item.price}</Typography>
                            </CardContent>
                            <Box sx={{ p: 1.5, textAlign: 'center', borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
                                <Button 
                                    size="small" 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={() => handleOpenCustomization(item)} 
                                    startIcon={<AddIcon />}
                                    sx={{
                                      borderRadius: 2,
                                      textTransform: 'none',
                                      fontWeight: 600,
                                    }}
                                >
                                    {item.modifiers && item.modifiers.length > 0 ? 'Customize' : 'Add to Order'}
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
          </Box>
      )}


      <Grid container spacing={3}>
        {/* --- LEFT COLUMN: MENU --- */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 1.5, mb: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                label="Search Menu..."
                variant="outlined"
                size="small"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 0.5, fontSize: '1.1rem' }} />
                }}
                sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
              />
            </Stack>
            <Tabs
              value={selectedCategory}
              onChange={(e, newValue) => setSelectedCategory(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{ mt: 1.5, minHeight: 'auto' }}
            >
              {categories.map((category) => (
                <Tab key={category} label={category} value={category} sx={{ py: 1, fontSize: '0.875rem', minHeight: 'auto' }} />
              ))}
            </Tabs>
          </Paper>

          {loading ? (
            <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}><CircularProgress /></Box>
          ) : Object.keys(menuByCategories).length === 0 ? (
            <Typography sx={{ p: 3, textAlign: 'center', fontStyle: 'italic' }}>
              No items match your search. Try another category!
            </Typography>
          ) : (
            <Stack spacing={2.5}>
             {Object.keys(menuByCategories).map(category => (
                <Box key={category}>
                  <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', borderBottom: 2, borderColor: 'primary.main', pb: 0.75, color: 'text.primary', fontSize: '1.35rem', mb: 1.5 }}>
                    {category}
                  </Typography>
                  <Grid container spacing={2}>
                    {menuByCategories[category].map((item, index) => (
                      <Grid item key={item._id} xs={12} sm={6}>
                        <Card sx={{ 
                          display: 'flex', 
                          height: '100%', 
                          p: 1.5,
                          borderRadius: 4,
                          border: (theme) => `1px solid ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}`,
                          boxShadow: (theme) => theme.palette.mode === 'light'
                            ? '0 2px 8px rgba(0,0,0,0.08)'
                            : '0 2px 8px rgba(0,0,0,0.3)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          overflow: 'hidden',
                          position: 'relative',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                            transform: 'scaleX(0)',
                            transformOrigin: 'left',
                            transition: 'transform 0.3s ease',
                          },
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: (theme) => theme.palette.mode === 'light'
                              ? '0 8px 24px rgba(241, 196, 15, 0.2)'
                              : '0 8px 24px rgba(241, 196, 15, 0.15)',
                            borderColor: 'primary.main',
                            '&::before': {
                              transform: 'scaleX(1)',
                            },
                          },
                          animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`,
                          '@keyframes fadeIn': {
                            from: { opacity: 0 },
                            to: { opacity: 1 },
                          },
                        }}>
                          <CardMedia
                            component="img"
                            sx={{ 
                              width: 90, 
                              height: 90, 
                              m: 1, 
                              borderRadius: 3, 
                              flexShrink: 0,
                              objectFit: 'cover',
                              transition: 'transform 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.05)',
                              },
                            }}
                            image={item.imageUrl || '/images/placeholder-food.jpg'}
                            alt={item.name}
                            onError={(e) => { e.target.src = '/images/placeholder-food.jpg'; }}
                          />
                          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 1, pl: 0 }}>
                            <CardContent sx={{ p: 0, flex: '1 0 auto', pb: 0.5 }}>
                              <Typography variant="subtitle1" sx={{ lineHeight: 1.3, fontSize: '0.95rem', fontWeight: 600, mb: 0.5 }}>{item.name}</Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'primary.main' }}>₹{item.price}</Typography>
                            </CardContent>
                            <Box sx={{ mt: 0.5, alignSelf: 'flex-end' }}>
                              <Button 
                                variant="contained" 
                                size="small"
                                startIcon={<AddIcon sx={{ fontSize: '1rem' }} />} 
                                onClick={() => handleOpenCustomization(item)}
                                sx={{ 
                                  fontSize: '0.75rem', 
                                  px: 1.5, 
                                  py: 0.5,
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  fontWeight: 600,
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    transform: 'scale(1.05)',
                                  },
                                }}
                              >
                                {item.modifiers && item.modifiers.length > 0 ? 'Customize' : 'Add'}
                              </Button> 
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
             ))}
            </Stack>
          )}
        </Grid>

        {/* --- RIGHT COLUMN: CART --- */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ 
            position: 'sticky', 
            top: 20,
            borderRadius: 4,
            border: (theme) => `2px solid ${theme.palette.mode === 'light' ? 'rgba(241, 196, 15, 0.2)' : 'rgba(241, 196, 15, 0.15)'}`,
            boxShadow: (theme) => theme.palette.mode === 'light'
              ? '0 4px 16px rgba(0,0,0,0.1)'
              : '0 4px 16px rgba(0,0,0,0.3)',
            background: (theme) => theme.palette.mode === 'light'
              ? 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)'
              : 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: (theme) => theme.palette.mode === 'light'
                ? '0 8px 24px rgba(241, 196, 15, 0.2)'
                : '0 8px 24px rgba(241, 196, 15, 0.15)',
              borderColor: 'primary.main',
            },
          }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 600, 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  background: (theme) => theme.palette.mode === 'light'
                    ? 'linear-gradient(135deg, #F1C40F 0%, #F39C12 100%)'
                    : 'linear-gradient(135deg, #F1C40F 0%, #D4AC0D 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                🛒 Your Order
              </Typography>
              {cart.length === 0 ? ( <Typography variant="body2" sx={{ mb: 2 }}>Your cart is empty.</Typography> ) : (
                <Box>
                  <List sx={{ py: 0 }}>
                    {cart.map((item, index) => (
                      <ListItem 
                        key={item.cartId || item._id} 
                        divider 
                        sx={{ 
                          py: 1.5, 
                          px: 1, 
                          flexWrap: 'wrap',
                          borderRadius: 2,
                          mb: 1,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: (theme) => theme.palette.mode === 'light' 
                              ? 'rgba(241, 196, 15, 0.05)' 
                              : 'rgba(241, 196, 15, 0.08)',
                            transform: 'translateX(4px)',
                          },
                          animation: `slideInRight 0.3s ease-out ${index * 0.05}s both`,
                          '@keyframes slideInRight': {
                            from: {
                              opacity: 0,
                              transform: 'translateX(-20px)',
                            },
                            to: {
                              opacity: 1,
                              transform: 'translateX(0)',
                            },
                          },
                        }} 
                      >
                        {/* --- TOP ROW: NAME, QTY, DELETE --- */}
                        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                          <ListItemText 
                            primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>{item.name}</Typography>}
                            secondary={<Typography variant="caption">{item.customization ? `₹${item.price.toFixed(2)} (Customized)` : `₹${item.price} each`}</Typography>} 
                            sx={{ m: 0 }} 
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: 0.5 }}>
                            <Button size="small" variant="outlined" onClick={() => handleQuantityChange(item.cartId || item._id, -1)} sx={{ minWidth: '28px', height: '28px', padding: 0, fontSize: '1rem' }} aria-label="decrease quantity">-</Button>
                            <Typography variant="body2" sx={{ px: 1, minWidth: '24px', textAlign: 'center', fontWeight: 500 }} aria-label="quantity">{item.quantity}</Typography>
                            <Button size="small" variant="outlined" onClick={() => handleQuantityChange(item.cartId || item._id, 1)} sx={{ minWidth: '28px', height: '28px', padding: 0, fontSize: '1rem' }} aria-label="increase quantity">+</Button>
                            <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveItem(item.cartId || item._id)} size="small" sx={{ ml: 0.5, p: 0.5}}> 
                              <DeleteIcon sx={{ fontSize: '1rem' }} /> 
                            </IconButton>
                          </Box>
                        </Box>
                        
                        {/* --- MIDDLE ROW: CUSTOMIZATION SUMMARY --- */}
                        {item.customization && item.customization.length > 0 && (
                            <Typography variant="caption" sx={{ width: '100%', pt: 0.25, color: 'text.secondary', fontStyle: 'italic', fontSize: '0.7rem' }}>
                              {getCustomizationSummary(item)}
                            </Typography>
                        )}
                        
                        {/* --- BOTTOM ROW: NOTE --- */}
                        <Box display="flex" width="100%" sx={{ pt: 0.25 }}>
                          <Button 
                            variant="text" 
                            size="small" 
                            startIcon={<EditNoteIcon sx={{ fontSize: '0.875rem' }} />}
                            onClick={() => openNoteModal(item)}
                            sx={{ textTransform: 'none', p: 0, minHeight: 'auto', fontSize: '0.75rem' }}
                          >
                            {item.note ? 'Edit Note' : 'Add Note'}
                          </Button>
                          {item.note && (
                            <Typography variant="caption" sx={{ pl: 0.5, fontStyle: 'italic', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.7rem' }}>
                              "{item.note}"
                            </Typography>
                          )}
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                  <Typography variant="h6" sx={{ mt: 1.5, fontWeight: 600 }}> Total: ₹{getTotalPrice()} </Typography>
                </Box>
              )}
              {/* --- Conditional Checkout UI --- */}
              <Box sx={{ mt: 2 }}>
                {customerToken ? (
                  <Button onClick={handleSubmitOrder} variant="contained" color="success" size="medium" fullWidth disabled={cart.length === 0} sx={{ py: 1.5 }}>
                    Proceed to Checkout
                  </Button>
                ) : (
                  <Box textAlign="center">
                    <Alert severity="info" sx={{ mb: 1.5, fontSize: '0.875rem', py: 0.75 }}>Please log in or register to place an order.</Alert>
                    <Button component={RouterLink} to="/customer/login" state={{ from: 'checkout' }} variant="contained" color="primary" size="medium" sx={{ mr: 1, mb: 1, py: 1 }}>Login to Order</Button>
                    <Button component={RouterLink} to="/customer/register" variant="outlined" color="primary" size="medium" sx={{ mb: 1, py: 1 }}>Register</Button>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* --- NOTE EDITING MODAL --- */}
      <Dialog open={noteModalOpen} onClose={closeNoteModal} fullWidth maxWidth="xs">
        <DialogTitle>Add Note for {currentItemForNote?.name}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus margin="dense"
            label="Special Instructions (e.g., extra spicy)"
            type="text" fullWidth variant="outlined"
            multiline rows={3}
            value={currentNoteText}
            onChange={(e) => setCurrentNoteText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeNoteModal}>Cancel</Button>
          <Button onClick={handleSaveNote} variant="contained">Save Note</Button>
        </DialogActions>
      </Dialog>
      
      {/* --- CUSTOMIZATION MODAL RENDER --- */}
      <CustomizeModal 
        item={itemToCustomize}
        open={customizationModalOpen}
        onClose={() => setCustomizationModalOpen(false)}
        onCustomize={handleItemCustomized}
      />
      
      {/* --- ADDRESS MODAL RENDER --- */}
      <AddressModal
        open={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSubmitOrder={handleFinalizeOrder}
        customerToken={customerToken}
        showSnackbar={showSnackbar}
      />

    </Container>

  );
}

export default CustomerApp;