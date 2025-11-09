// In src/components/admin/CateringRequests.js

import React from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Grid, Card, CardContent, CardActions, Stack,
  Typography, Button, List, ListItem, ListItemText,
  Box, CircularProgress,
  Divider, Alert, Chip
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

// Enhanced color palette for catering
const CATERING_COLORS = {
  primary: '#9C27B0',
  secondary: '#7B1FA2',
  accent: '#BA68C8'
};

export function CateringRequests(props) {
  const { cateringRequests, loadingCatering, handleUpdateCateringStatus } = props;
  const theme = useTheme();

  // Enhanced card style with brand colors
  const getCardStyle = (status, theme) => {
    const baseStyle = {
      borderRadius: 3,
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      height: '100%',
      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: `0 12px 28px ${alpha(CATERING_COLORS.primary, 0.2)}`,
      }
    };

    const statusStyles = {
      'Confirmed': {
        borderLeft: `6px solid #4CAF50`,
        background: `linear-gradient(135deg, ${alpha('#4CAF50', 0.08)} 0%, ${alpha('#2E7D32', 0.04)} 100%)`,
      },
      'Completed': {
        borderLeft: `6px solid #2E7D32`,
        background: `linear-gradient(135deg, ${alpha('#2E7D32', 0.08)} 0%, ${alpha('#1B5E20', 0.04)} 100%)`,
      },
      'Negotiating': {
        borderLeft: `6px solid #2196F3`,
        background: `linear-gradient(135deg, ${alpha('#2196F3', 0.08)} 0%, ${alpha('#1565C0', 0.04)} 100%)`,
      },
      'Rejected': {
        borderLeft: `6px solid #f44336`,
        background: `linear-gradient(135deg, ${alpha('#f44336', 0.08)} 0%, ${alpha('#c62828', 0.04)} 100%)`,
      },
      'Pending Review': {
        borderLeft: `6px solid #F1C40F`,
        background: `linear-gradient(135deg, ${alpha('#F1C40F', 0.08)} 0%, ${alpha('#E67E22', 0.04)} 100%)`,
      }
    };

    return {
      ...baseStyle,
      ...(statusStyles[status] || statusStyles['Pending Review'])
    };
  };

  // Enhanced status chip with icons
  const renderStatus = (status) => {
    const statusConfig = {
      'Pending Review': {
        gradient: 'linear-gradient(135deg, #F1C40F 0%, #E67E22 100%)',
        icon: '📋'
      },
      'Negotiating': {
        gradient: 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)',
        icon: '💬'
      },
      'Confirmed': {
        gradient: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
        icon: '✅'
      },
      'Completed': {
        gradient: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
        icon: '🎉'
      },
      'Rejected': {
        gradient: 'linear-gradient(135deg, #f44336 0%, #c62828 100%)',
        icon: '❌'
      }
    };

    const config = statusConfig[status] || statusConfig['Pending Review'];

    return (
      <Chip 
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <span>{config.icon}</span>
            {status}
          </Box>
        }
        sx={{
          fontWeight: 700,
          fontSize: '0.8rem',
          background: config.gradient,
          color: '#fff',
          px: 1.5,
          py: 2,
          '& .MuiChip-label': {
            color: '#fff',
            px: 1
          },
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}
      />
    );
  };

  // Enhanced order type badge for catering
  const renderCateringBadge = () => (
    <Chip
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <span>🎉</span>
          CATERING ORDER
        </Box>
      }
      sx={{
        background: `linear-gradient(135deg, ${CATERING_COLORS.primary} 0%, ${CATERING_COLORS.secondary} 100%)`,
        color: 'white',
        fontWeight: 'bold',
        fontSize: '0.8rem',
        px: 1.5,
        py: 2
      }}
    />
  );

  if (loadingCatering) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="primary">
          Loading Catering Requests...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, maxWidth: '1400px', mx: 'auto' }}>
      
      {/* Enhanced Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h3" 
          fontWeight="bold" 
          sx={{ 
            background: `linear-gradient(135deg, ${CATERING_COLORS.primary} 0%, ${CATERING_COLORS.secondary} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          🎉 Catering & Event Requests
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Manage Special Events and Bulk Orders
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            label={`Total Requests: ${cateringRequests.length}`} 
            color="primary"
            sx={{ 
              fontWeight: 'bold',
              fontSize: '1rem',
              px: 2,
              py: 1.5
            }}
          />
          <Chip 
            label={`Active: ${cateringRequests.filter(req => !['Completed', 'Rejected'].includes(req.status)).length}`} 
            color="success"
            sx={{ 
              fontWeight: 'bold',
              fontSize: '1rem',
              px: 2,
              py: 1.5
            }}
          />
        </Box>
      </Box>

      {/* Catering Requests Grid */}
      <Grid container spacing={3}>
        <AnimatePresence>
          {cateringRequests.length === 0 ? (
            <Grid item xs={12}>
              <Alert 
                severity="info" 
                sx={{ 
                  borderRadius: 3,
                  textAlign: 'center',
                  fontSize: '1.1rem',
                  py: 3
                }}
              >
                📭 No catering requests found. New requests will appear here.
              </Alert>
            </Grid>
          ) : (
            cateringRequests.map((request) => {
              const isClosed = request.status === 'Completed' || request.status === 'Rejected';

              return (
                <Grid item xs={12} lg={6} key={request._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    <Card elevation={1} sx={getCardStyle(request.status, theme)}>
                      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        
                        {/* Header Section */}
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start',
                          mb: 3,
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: 2
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            {renderCateringBadge()}
                            {renderStatus(request.status)}
                          </Box>
                          
                          <Typography 
                            variant="h4" 
                            fontWeight="bold" 
                            sx={{ 
                              color: CATERING_COLORS.primary,
                              fontSize: { xs: '1.5rem', sm: '2rem' }
                            }}
                          >
                            ₹{request.estimatedTotal?.toFixed(2) || '0.00'}
                          </Typography>
                        </Box>

                        {/* Customer & Event Details */}
                        <Grid container spacing={3} sx={{ mb: 2 }}>
                          {/* Customer Info */}
                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <PeopleIcon color="primary" fontSize="small" />
                              <Typography variant="h6" fontWeight="bold">Customer</Typography>
                            </Box>
                            <Typography variant="body1" fontWeight="bold" fontSize="1.1rem">
                              {request.customerName}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                              <PhoneIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {request.customerPhone}
                              </Typography>
                            </Box>
                            {request.customerEmail && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                <EmailIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {request.customerEmail}
                                </Typography>
                              </Box>
                            )}
                          </Grid>

                          {/* Event Details */}
                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <EventIcon color="primary" fontSize="small" />
                              <Typography variant="h6" fontWeight="bold">Event Details</Typography>
                            </Box>
                            <Typography variant="body2" fontWeight="bold">
                              {request.eventType}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              👥 {request.guestCount} Guests
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              📅 {new Date(request.eventDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ⏰ {request.eventTime}
                            </Typography>
                          </Grid>
                        </Grid>

                        {/* Venue Information */}
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <LocationOnIcon color="primary" fontSize="small" />
                            <Typography variant="h6" fontWeight="bold">Venue</Typography>
                          </Box>
                          <Typography variant="body1" fontWeight="bold">
                            {request.venueName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {request.venueAddress}
                          </Typography>
                        </Box>

                        <Divider sx={{ my: 2, borderColor: alpha(theme.palette.primary.main, 0.2) }} />

                        {/* Menu Items */}
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <RestaurantIcon color="primary" fontSize="small" />
                            <Typography variant="h6" fontWeight="bold">
                              Menu Items ({request.menuItems?.length || 0})
                            </Typography>
                          </Box>
                          
                          <Grid container spacing={1}>
                            {request.menuItems?.slice(0, 4).map((item, index) => (
                              <Grid item xs={12} sm={6} key={index}>
                                <Box sx={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  alignItems: 'center',
                                  bgcolor: alpha(CATERING_COLORS.primary, 0.05),
                                  p: 1.5,
                                  borderRadius: 2,
                                  border: `1px solid ${alpha(CATERING_COLORS.primary, 0.1)}`
                                }}>
                                  <Box>
                                    <Typography variant="body2" fontWeight="bold">
                                      {item.quantity}x {item.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      @ ₹{item.pricePerUnit?.toFixed(2) || '0.00'} each
                                    </Typography>
                                  </Box>
                                  <Typography variant="body2" fontWeight="bold" color={CATERING_COLORS.primary}>
                                    ₹{(item.quantity * (item.pricePerUnit || 0)).toFixed(2)}
                                  </Typography>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                          
                          {request.menuItems?.length > 4 && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                              +{request.menuItems.length - 4} more items...
                            </Typography>
                          )}
                        </Box>

                        {/* Request Meta */}
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          mt: 2,
                          pt: 2,
                          borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ConfirmationNumberIcon fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary" fontFamily="monospace">
                              ID: {request._id?.slice(-8) || 'N/A'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ScheduleIcon fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              Requested: {new Date(request.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>

                      {/* Enhanced Action Buttons */}
                      <CardActions sx={{ 
                        background: `linear-gradient(135deg, ${alpha(CATERING_COLORS.primary, 0.05)} 0%, ${alpha(CATERING_COLORS.secondary, 0.05)} 100%)`,
                        p: { xs: 2, sm: 3 },
                        borderTop: `1px solid ${alpha(CATERING_COLORS.primary, 0.1)}`
                      }}>
                        <Box sx={{ 
                          display: 'flex', 
                          gap: 1, 
                          width: '100%',
                          flexWrap: { xs: 'wrap', sm: 'nowrap' }
                        }}>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => handleUpdateCateringStatus(request._id, 'Confirmed')}
                            disabled={isClosed || request.status === 'Confirmed'}
                            sx={{ 
                              borderRadius: 2,
                              flex: 1,
                              fontWeight: 'bold',
                              py: 1
                            }}
                          >
                            ✅ Confirm
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="info"
                            onClick={() => handleUpdateCateringStatus(request._id, 'Negotiating')}
                            disabled={isClosed}
                            sx={{ 
                              borderRadius: 2,
                              flex: 1,
                              fontWeight: 'bold',
                              py: 1
                            }}
                          >
                            💬 Negotiate
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleUpdateCateringStatus(request._id, 'Rejected')}
                            disabled={isClosed || request.status === 'Rejected'}
                            sx={{ 
                              borderRadius: 2,
                              flex: 1,
                              fontWeight: 'bold',
                              py: 1
                            }}
                          >
                            ❌ Reject
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="secondary"
                            onClick={() => handleUpdateCateringStatus(request._id, 'Completed')}
                            disabled={request.status !== 'Confirmed'}
                            sx={{ 
                              borderRadius: 2,
                              flex: 1,
                              fontWeight: 'bold',
                              py: 1
                            }}
                          >
                            🎉 Complete
                          </Button>
                        </Box>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })
          )}
        </AnimatePresence>
      </Grid>
    </Box>
  );
}