// In src/components/admin/AnalyticsDashboard.js

import React from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Typography, Button,
  Box, CircularProgress, Paper, Grid, Stack, Card,
  Chip, Alert
} from '@mui/material';

// --- Chart Imports ---
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';

// --- DATE PICKER IMPORTS ---
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SellIcon from '@mui/icons-material/Sell';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RestaurantIcon from '@mui/icons-material/Restaurant';

// Enhanced color palette matching your brand
const CHART_COLORS = {
  primary: '#F1C40F',
  secondary: '#E67E22',
  success: '#4CAF50',
  error: '#f44336',
  info: '#2196F3',
  warning: '#ff9800',
  catering: '#9C27B0'
};

const STATUS_COLORS = {
  'Pending': CHART_COLORS.primary,
  'Preparing': CHART_COLORS.warning,
  'Ready': CHART_COLORS.info,
  'Completed': CHART_COLORS.success,
  'Cancelled': CHART_COLORS.error,
  'Pending Review': CHART_COLORS.primary,
  'Negotiating': CHART_COLORS.info,
  'Confirmed': CHART_COLORS.success,
  'Rejected': CHART_COLORS.error
};

export function AnalyticsDashboard(props) {
  const { stats, statsLoading, startDate, setStartDate, endDate, setEndDate } = props;
  const theme = useTheme();

  // Safe data formatting for charts
  const formatChartData = (data) => {
    if (!data || !Array.isArray(data)) return [];
    return data.filter(item => item && item.name && item.value !== undefined);
  };

  const formatTopItemsData = (data) => {
    if (!data || !Array.isArray(data)) return [];
    return data
      .filter(item => item && item.name && item.quantity !== undefined)
      .slice(0, 5) // Take top 5 only
      .map(item => ({
        ...item,
        // Shorten long names for better display
        name: item.name.length > 20 ? `${item.name.substring(0, 20)}...` : item.name
      }));
  };

  if (statsLoading) {
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
          Loading Analytics...
        </Typography>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        <Typography variant="h6">Could not load statistics</Typography>
        <Typography>Please check your connection and try refreshing the page.</Typography>
      </Alert>
    );
  }

  const statusData = formatChartData(stats.statusBreakdown);
  const topItemsData = formatTopItemsData(stats.topItems);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: { xs: 1, sm: 2 }, maxWidth: '1400px', mx: 'auto' }}>
        
        {/* Enhanced Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h3" 
            fontWeight="bold" 
            sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            📊 Analytics Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Real-time Business Insights & Performance Metrics
          </Typography>
        </Box>

        {/* Enhanced Date Filters */}
        <Paper 
          elevation={2}
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CalendarTodayIcon color="primary" />
            <Typography variant="h6" fontWeight="bold" color="primary">
              Date Range Filter
            </Typography>
          </Box>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              sx={{ 
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              sx={{ 
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            <Button 
              variant="outlined" 
              onClick={() => { setStartDate(null); setEndDate(null); }}
              disabled={!startDate && !endDate}
              sx={{ 
                borderRadius: 2,
                fontWeight: 'bold',
                px: 3
              }}
            >
              Clear Dates
            </Button>
          </Stack>
        </Paper>

        {/* Enhanced KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Total Sales */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              p: 3,
              textAlign: 'center',
              background: `linear-gradient(135deg, ${alpha(CHART_COLORS.success, 0.1)} 0%, ${alpha(CHART_COLORS.success, 0.05)} 100%)`,
              borderLeft: `6px solid ${CHART_COLORS.success}`,
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8]
              }
            }}>
              <SellIcon sx={{ fontSize: 40, color: CHART_COLORS.success, mb: 1 }} />
              <Typography variant="h3" fontWeight="bold" color={CHART_COLORS.success}>
                ₹{stats.totalSales?.toFixed(2) || '0.00'}
              </Typography>
              <Typography variant="h6" color="text.secondary" fontWeight="medium">
                Total Sales
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Completed Orders
              </Typography>
            </Card>
          </Grid>

          {/* Average Order Value */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              p: 3,
              textAlign: 'center',
              background: `linear-gradient(135deg, ${alpha(CHART_COLORS.primary, 0.1)} 0%, ${alpha(CHART_COLORS.primary, 0.05)} 100%)`,
              borderLeft: `6px solid ${CHART_COLORS.primary}`,
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8]
              }
            }}>
              <TrendingUpIcon sx={{ fontSize: 40, color: CHART_COLORS.primary, mb: 1 }} />
              <Typography variant="h3" fontWeight="bold" color={CHART_COLORS.primary}>
                ₹{stats.averageOrderValue?.toFixed(2) || '0.00'}
              </Typography>
              <Typography variant="h6" color="text.secondary" fontWeight="medium">
                Avg Order Value
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Per Completed Order
              </Typography>
            </Card>
          </Grid>

          {/* Completed Orders */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              p: 3,
              textAlign: 'center',
              background: `linear-gradient(135deg, ${alpha(CHART_COLORS.info, 0.1)} 0%, ${alpha(CHART_COLORS.info, 0.05)} 100%)`,
              borderLeft: `6px solid ${CHART_COLORS.info}`,
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8]
              }
            }}>
              <CheckCircleIcon sx={{ fontSize: 40, color: CHART_COLORS.info, mb: 1 }} />
              <Typography variant="h3" fontWeight="bold" color={CHART_COLORS.info}>
                {stats.totalCompletedOrders || 0}
              </Typography>
              <Typography variant="h6" color="text.secondary" fontWeight="medium">
                Completed Orders
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Successfully Delivered
              </Typography>
            </Card>
          </Grid>

          {/* Cancelled Orders */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              p: 3,
              textAlign: 'center',
              background: `linear-gradient(135deg, ${alpha(CHART_COLORS.error, 0.1)} 0%, ${alpha(CHART_COLORS.error, 0.05)} 100%)`,
              borderLeft: `6px solid ${CHART_COLORS.error}`,
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8]
              }
            }}>
              <CancelIcon sx={{ fontSize: 40, color: CHART_COLORS.error, mb: 1 }} />
              <Typography variant="h3" fontWeight="bold" color={CHART_COLORS.error}>
                {stats.totalCancelledOrders || 0}
              </Typography>
              <Typography variant="h6" color="text.secondary" fontWeight="medium">
                Cancelled Orders
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Refunded/Rejected
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Enhanced Charts Section */}
        <Grid container spacing={3}>
          
          {/* Order Status Breakdown - Pie Chart */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={2}
              sx={{ 
                p: 3, 
                borderRadius: 3,
                height: '100%',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <AnalyticsIcon color="primary" />
                <Typography variant="h5" fontWeight="bold" color="primary">
                  Order Status Breakdown
                </Typography>
              </Box>
              
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={STATUS_COLORS[entry.name] || CHART_COLORS.primary} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} orders`, 'Count']}
                      contentStyle={{ 
                        backgroundColor: theme.palette.background.paper, 
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        borderRadius: 2
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h6" color="text.secondary">
                    No status data available
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Top Selling Items - Bar Chart */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={2}
              sx={{ 
                p: 3, 
                borderRadius: 3,
                height: '100%',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <RestaurantIcon color="primary" />
                <Typography variant="h5" fontWeight="bold" color="primary">
                  Top 5 Selling Items
                </Typography>
              </Box>
              
              {topItemsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topItemsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.primary, 0.1)} />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80}
                      tick={{ fontSize: 12 }}
                      stroke={theme.palette.text.secondary}
                    />
                    <YAxis 
                      allowDecimals={false} 
                      stroke={theme.palette.text.secondary}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} sold`, 'Quantity']}
                      contentStyle={{ 
                        backgroundColor: theme.palette.background.paper, 
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        borderRadius: 2
                      }} 
                    />
                    <Bar 
                      dataKey="quantity" 
                      fill={CHART_COLORS.primary}
                      radius={[4, 4, 0, 0]}
                      name="Quantity Sold"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h6" color="text.secondary">
                    No item data available
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Additional Stats */}
        {stats.totalOrders > 0 && (
          <Paper 
            elevation={1}
            sx={{ 
              p: 3, 
              mt: 3, 
              borderRadius: 3,
              background: alpha(theme.palette.primary.main, 0.02)
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold">
              📈 Performance Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">Total Orders Processed</Typography>
                <Typography variant="h6" fontWeight="bold">{stats.totalOrders || 0}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">Completion Rate</Typography>
                <Typography variant="h6" fontWeight="bold" color={CHART_COLORS.success}>
                  {stats.totalOrders ? `${((stats.totalCompletedOrders / stats.totalOrders) * 100).toFixed(1)}%` : '0%'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">Cancellation Rate</Typography>
                <Typography variant="h6" fontWeight="bold" color={CHART_COLORS.error}>
                  {stats.totalOrders ? `${((stats.totalCancelledOrders / stats.totalOrders) * 100).toFixed(1)}%` : '0%'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">Avg Items per Order</Typography>
                <Typography variant="h6" fontWeight="bold">
                  {stats.averageItemsPerOrder?.toFixed(1) || '0.0'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>
    </LocalizationProvider>
  );
}