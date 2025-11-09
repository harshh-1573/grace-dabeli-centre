// In src/components/admin/OrderWall.js  
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Grid, Card, CardContent, CardActions, Stack,
  Typography, Button, TextField, List, ListItem, ListItemText,
  Box, IconButton, Chip, Alert, LinearProgress,
  InputLabel, Select, MenuItem, FormControl,
  Divider, Paper, Tooltip, Badge
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NotesIcon from '@mui/icons-material/Notes';
import FilterListIcon from '@mui/icons-material/FilterList';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PersonIcon from '@mui/icons-material/Person';
import ScheduleIcon from '@mui/icons-material/Schedule';
import RefreshIcon from '@mui/icons-material/Refresh';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import Skeleton from '@mui/material/Skeleton';

// Available Order Statuses for the filter dropdown
const STATUSES = ['All', 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

// Enhanced Status Chip renderer with brand colors and animations
const renderStatus = (status) => {
  const getStatusConfig = (status) => {
    const configs = {
      'Completed': {
        gradient: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
        icon: '✅',
        pulse: false
      },
      'Cancelled': {
        gradient: 'linear-gradient(135deg, #f44336 0%, #c62828 100%)',
        icon: '❌',
        pulse: false
      },
      'Ready': {
        gradient: 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)',
        icon: '📦',
        pulse: true
      },
      'Preparing': {
        gradient: 'linear-gradient(135deg, #ff9800 0%, #ef6c00 100%)',
        icon: '👨‍🍳',
        pulse: true
      },
      'Pending': {
        gradient: 'linear-gradient(135deg, #F1C40F 0%, #E67E22 100%)',
        icon: '⏳',
        pulse: true
      }
    };
    return configs[status] || configs['Pending'];
  };

  const config = getStatusConfig(status);
  
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
        animation: config.pulse ? 'pulse 2s infinite' : 'none',
        '@keyframes pulse': {
          '0%': { opacity: 1 },
          '50%': { opacity: 0.7 },
          '100%': { opacity: 1 }
        },
        '& .MuiChip-label': {
          color: '#fff',
          px: 1
        },
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}
    />
  );
};

// Enhanced card style with brand colors
const getCardStyle = (status, theme) => {
  const baseStyle = {
    borderRadius: 3,
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    '&:hover': {
      transform: 'translateY(-6px)',
      boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.25)}`,
    }
  };

  const statusStyles = {
    'Completed': {
      borderLeft: `6px solid #4CAF50`,
      background: `linear-gradient(135deg, ${alpha('#4CAF50', 0.08)} 0%, ${alpha('#2E7D32', 0.04)} 100%)`,
    },
    'Cancelled': {
      borderLeft: `6px solid #f44336`,
      background: `linear-gradient(135deg, ${alpha('#f44336', 0.08)} 0%, ${alpha('#c62828', 0.04)} 100%)`,
    },
    'Ready': {
      borderLeft: `6px solid #2196F3`,
      background: `linear-gradient(135deg, ${alpha('#2196F3', 0.08)} 0%, ${alpha('#1565C0', 0.04)} 100%)`,
    },
    'Preparing': {
      borderLeft: `6px solid #ff9800`,
      background: `linear-gradient(135deg, ${alpha('#ff9800', 0.08)} 0%, ${alpha('#ef6c00', 0.04)} 100%)`,
    },
    'Pending': {
      borderLeft: `6px solid #F1C40F`,
      background: `linear-gradient(135deg, ${alpha('#F1C40F', 0.08)} 0%, ${alpha('#E67E22', 0.04)} 100%)`,
    }
  };

  return {
    ...baseStyle,
    ...(statusStyles[status] || statusStyles['Pending'])
  };
};

// Order Type Badge
const renderOrderType = (orderType) => {
  const configs = {
    'Pickup': {
      color: '#FF9800',
      icon: '🏪',
      label: 'PICKUP'
    },
    'Delivery': {
      color: '#2196F3',
      icon: '🚚',
      label: 'DELIVERY'
    }
  };
  
  const config = configs[orderType] || configs['Pickup'];
  
  return (
    <Chip
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <span>{config.icon}</span>
          {config.label}
        </Box>
      }
      size="small"
      sx={{
        background: config.color,
        color: 'white',
        fontWeight: 'bold',
        fontSize: '0.7rem',
        px: 1,
        height: '24px'
      }}
    />
  );
};

// Time indicator for orders
const renderTimeIndicator = (createdAt, status) => {
  const now = new Date();
  const orderTime = new Date(createdAt);
  const diffMinutes = Math.floor((now - orderTime) / (1000 * 60));
  
  let color = 'success';
  let text = `${diffMinutes}m ago`;
  
  if (diffMinutes > 30) color = 'error';
  else if (diffMinutes > 15) color = 'warning';
  
  return (
    <Tooltip title={`Order placed ${diffMinutes} minutes ago`}>
      <Chip
        icon={<AccessTimeIcon />}
        label={text}
        size="small"
        color={color}
        variant="outlined"
        sx={{ fontWeight: 'bold' }}
      />
    </Tooltip>
  );
};

// Progress indicator for preparing orders
const renderProgress = (status, createdAt) => {
  if (status !== 'Preparing') return null;
  
  const now = new Date();
  const orderTime = new Date(createdAt);
  const diffMinutes = Math.floor((now - orderTime) / (1000 * 60));
  const progress = Math.min((diffMinutes / 15) * 100, 90); // Max 90% until completed
  
  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
        Preparation Progress
      </Typography>
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ 
          height: 6, 
          borderRadius: 3,
          background: alpha('#ff9800', 0.1),
          '& .MuiLinearProgress-bar': {
            background: 'linear-gradient(135deg, #ff9800 0%, #ef6c00 100%)',
            borderRadius: 3
          }
        }}
      />
    </Box>
  );
};

export function OrderWall(props) {
  const {
    orders,
    quickFilter,
    setQuickFilter,
    filterStatus,
    setFilterStatus,
    searchTerm,
    setSearchTerm,
    handleUpdateOrderStatus,
    loading = false
  } = props;
  
  const theme = useTheme();
  const [isLive, setIsLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getFilterVariant = (filter) => quickFilter === filter ? 'contained' : 'outlined';

  // Enhanced filter button style with counts
  const getFilterButtonStyle = (filter, count = 0) => ({
    borderRadius: 3,
    px: 2,
    fontWeight: 'bold',
    background: quickFilter === filter 
      ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
      : 'transparent',
    color: quickFilter === filter ? 'white' : theme.palette.primary.main,
    border: `2px solid ${quickFilter === filter ? 'transparent' : alpha(theme.palette.primary.main, 0.3)}`,
    '&:hover': {
      background: quickFilter === filter 
        ? `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`
        : alpha(theme.palette.primary.main, 0.1),
    }
  });

  // Quick actions
  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Export functionality would go here
    console.log('Exporting orders...');
  };

  // Get counts for filter badges
  const getOrderCount = (filter) => {
    switch (filter) {
      case 'All': return orders.length;
      case 'Last10': return Math.min(orders.length, 10);
      case 'Last24': return orders.filter(order => {
        const orderTime = new Date(order.createdAt);
        const now = new Date();
        return (now - orderTime) < (24 * 60 * 60 * 1000);
      }).length;
      default: return 0;
    }
  };

  // Skeleton loading component
  const renderSkeleton = () => (
    <Stack spacing={2}>
      {[1, 2, 3].map((item) => (
        <Card key={item} sx={{ borderRadius: 3, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Skeleton variant="rectangular" width={120} height={32} sx={{ borderRadius: 2 }} />
            <Skeleton variant="text" width={80} height={40} />
          </Box>
          <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={20} width="60%" />
          <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2, mt: 2 }} />
        </Card>
      ))}
    </Stack>
  );

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, maxWidth: '1200px', mx: 'auto' }}>
      {/* Enhanced Header with Live Status */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
          <Typography 
            variant="h3" 
            fontWeight="bold" 
            sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            🎯 Order Wall
          </Typography>
          <Tooltip title="Real-time updates active">
            <Badge
              color="error"
              variant="dot"
              invisible={!isLive}
              sx={{ 
                '& .MuiBadge-dot': {
                  animation: 'pulse 2s infinite',
                }
              }}
            >
              <Chip 
                icon={<FiberManualRecordIcon sx={{ fontSize: 12 }} />}
                label="LIVE"
                color="error"
                size="small"
                variant="outlined"
                sx={{ fontWeight: 'bold' }}
              />
            </Badge>
          </Tooltip>
        </Box>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Real-time Order Management
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </Typography>
      </Box>

      {/* Enhanced Controls Section */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          position: 'relative'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListIcon color="primary" />
            <Typography variant="h6" fontWeight="bold" color="primary">
              Filters & Search
            </Typography>
          </Box>
          <Button
            startIcon={<RefreshIcon />}
            onClick={() => setLastUpdated(new Date())}
            size="small"
            sx={{ borderRadius: 2 }}
          >
            Refresh
          </Button>
        </Box>

        {/* Quick Filters with Counts */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {['All', 'Last10', 'Last24'].map((filter) => (
            <Tooltip key={filter} title={`Show ${filter.toLowerCase()} orders`}>
              <Badge badgeContent={getOrderCount(filter)} color="primary" showZero={false}>
                <Button 
                  size="small" 
                  onClick={() => setQuickFilter(filter)}
                  sx={getFilterButtonStyle(filter)}
                >
                  {filter === 'All' && '📋 All Orders'}
                  {filter === 'Last10' && '🔟 Last 10'}
                  {filter === 'Last24' && '⏰ Last 24h'}
                </Button>
              </Badge>
            </Tooltip>
          ))}
        </Box>

        {/* Search & Filter Row */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ fontWeight: 'bold' }}>Status Filter</InputLabel>
              <Select
                value={filterStatus}
                label="Status Filter"
                onChange={(e) => setFilterStatus(e.target.value)}
                disabled={quickFilter !== 'All'}
                sx={{ borderRadius: 2 }}
              >
                {STATUSES.map((status) => (
                  <MenuItem key={status} value={status} sx={{ fontWeight: 'medium' }}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={9}>
            <TextField
              label="Search by Customer Name or Phone"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'primary.main' }} />,
              }}
              sx={{ 
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Orders Count and Stats */}
      {orders.length > 0 && (
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptIcon color="primary" />
            <Typography variant="h6" fontWeight="bold" color="primary">
              {orders.length} Order{orders.length !== 1 ? 's' : ''} Found
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              label={`${orders.filter(o => o.status === 'Pending').length} Pending`}
              size="small"
              variant="outlined"
              color="warning"
            />
            <Chip 
              label={`${orders.filter(o => o.status === 'Preparing').length} Preparing`}
              size="small"
              variant="outlined"
              color="info"
            />
            <Chip 
              label={`${orders.filter(o => o.status === 'Ready').length} Ready`}
              size="small"
              variant="outlined"
              color="success"
            />
          </Box>
        </Box>
      )}

      {/* Enhanced Order Cards */}
      <Box sx={{ maxWidth: '1000px', mx: 'auto' }}>
        {loading ? (
          renderSkeleton()
        ) : (
          <Stack spacing={3}>
            <AnimatePresence>
              {orders.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h4" color="text.secondary" sx={{ mb: 2 }}>
                    📭 No Orders Found
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {searchTerm || filterStatus !== 'All' 
                      ? 'Try adjusting your search or filters'
                      : 'New orders will appear here automatically'
                    }
                  </Typography>
                  {(searchTerm || filterStatus !== 'All') && (
                    <Button 
                      variant="outlined" 
                      onClick={() => {
                        setSearchTerm('');
                        setFilterStatus('All');
                        setQuickFilter('All');
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </Box>
              ) : (
                orders.map((order) => (
                  <motion.div
                    key={order._id}
                    layout="position" 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    <Card elevation={1} sx={getCardStyle(order.status, theme)}>
                      <CardContent sx={{ p: { xs: 2, sm: 3 }, pb: '16px !important' }}>
                        {/* Order Type & Status Row */}
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start',
                          mb: 3,
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: 2
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            {renderOrderType(order.orderType)}
                            {renderStatus(order.status)}
                            {renderTimeIndicator(order.createdAt, order.status)}
                          </Box>
                          
                          <Typography 
                            variant="h4" 
                            fontWeight="bold" 
                            sx={{ 
                              color: 'primary.main',
                              fontSize: { xs: '1.5rem', sm: '2rem' }
                            }}
                          >
                            ₹{order.totalPrice.toFixed(2)}
                          </Typography>
                        </Box>
                        
                        {/* Progress Bar for Preparing Orders */}
                        {renderProgress(order.status, order.createdAt)}
                        
                        {/* Customer & Order Info */}
                        <Grid container spacing={3} sx={{ mb: 2 }}>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <PersonIcon color="primary" fontSize="small" />
                              <Typography variant="h6" fontWeight="bold">Customer</Typography>
                            </Box>
                            <Typography variant="body1" fontWeight="bold" fontSize="1.1rem">
                              {order.customerName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                              📞 {order.customerPhone}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <ScheduleIcon color="primary" fontSize="small" />
                              <Typography variant="h6" fontWeight="bold">Order Details</Typography>
                            </Box>
                            {order.orderType === 'Pickup' ? (
                              <Typography color="secondary.main" variant="body1" fontWeight="bold">
                                🏪 In-Store Pickup
                              </Typography>
                            ) : (
                              <Box>
                                <Typography variant="body2" fontWeight="bold" color="primary">
                                  🚚 Delivery
                                </Typography>
                                {order.deliveryAddress && (
                                  <Typography variant="body2" color="text.secondary">
                                    {order.deliveryAddress.street}, {order.deliveryAddress.city}
                                  </Typography>
                                )}
                              </Box>
                            )}
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              ⏰ {new Date(order.createdAt).toLocaleString()}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Divider sx={{ my: 2, borderColor: alpha(theme.palette.primary.main, 0.2) }} />

                        {/* Order Items */}
                        <Box>
                          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                            🍽️ Items ({order.items.length})
                          </Typography>
                          <List dense sx={{ maxHeight: 200, overflowY: 'auto' }}>
                            {order.items.map((item, index) => (
                              <ListItem
                                key={index}
                                sx={{
                                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                  borderRadius: 2,
                                  mb: 1,
                                  background: alpha(theme.palette.primary.main, 0.02)
                                }}
                              >
                                <ListItemText
                                  primary={
                                    <Typography variant="body1" fontWeight="bold">
                                      {item.quantity}x {item.name}
                                    </Typography>
                                  }
                                  secondary={
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                                      <Typography variant="body2" color="text.secondary">
                                        ₹{item.price.toFixed(2)} each
                                      </Typography>
                                      <Typography variant="body2" fontWeight="bold" color="primary">
                                        ₹{(item.quantity * item.price).toFixed(2)}
                                      </Typography>
                                    </Box>
                                  }
                                />
                                {item.note && (
                                  <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                                    <NotesIcon fontSize="small" sx={{ mr: 0.5, color: 'warning.main' }} />
                                    <Typography variant="caption" color="warning.main" fontStyle="italic">
                                      {item.note}
                                    </Typography>
                                  </Box>
                                )}
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </CardContent>

                      {/* Enhanced Action Buttons */}
                      <CardActions sx={{ 
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                        p: { xs: 2, sm: 3 },
                        borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
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
                            color="warning"
                            onClick={() => handleUpdateOrderStatus(order._id, 'Preparing')}
                            disabled={order.status !== 'Pending'}
                            sx={{ 
                              borderRadius: 2,
                              flex: 1,
                              fontWeight: 'bold',
                              py: 1
                            }}
                          >
                            👨‍🍳 Preparing
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="info"
                            onClick={() => handleUpdateOrderStatus(order._id, 'Ready')}
                            disabled={order.status !== 'Preparing'}
                            sx={{ 
                              borderRadius: 2,
                              flex: 1,
                              fontWeight: 'bold',
                              py: 1
                            }}
                          >
                            📦 Ready
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => handleUpdateOrderStatus(order._id, 'Completed')}
                            disabled={order.status !== 'Ready'}
                            sx={{ 
                              borderRadius: 2,
                              flex: 1,
                              fontWeight: 'bold',
                              py: 1
                            }}
                          >
                            ✅ Complete
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleUpdateOrderStatus(order._id, 'Cancelled')}
                            disabled={order.status === 'Completed' || order.status === 'Cancelled'}
                            sx={{ 
                              borderRadius: 2,
                              flex: 1,
                              fontWeight: 'bold',
                              py: 1
                            }}
                          >
                            ❌ Cancel
                          </Button>
                        </Box>
                      </CardActions>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </Stack>
        )}
      </Box>

      {/* Quick Actions Speed Dial */}
      <SpeedDial
        ariaLabel="Order actions"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        icon={<RefreshIcon />}
      >
        <SpeedDialAction
          icon={<PrintIcon />}
          tooltipTitle="Print Orders"
          onClick={handlePrint}
        />
        <SpeedDialAction
          icon={<DownloadIcon />}
          tooltipTitle="Export Data"
          onClick={handleExport}
        />
      </SpeedDial>
    </Box>
  );
}