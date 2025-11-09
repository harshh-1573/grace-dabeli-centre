// In frontend/src/AnalyticsDashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Container, Grid, Card, CardContent, Typography, CircularProgress, Box, 
    Divider, Stack, Button, TextField // <-- ADDED Stack, Button, TextField, Divider
} from '@mui/material'; 
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// Define API Base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

// A simple component for our stat cards
function StatCard({ title, value, color }) {
  return (
    <Card sx={{ backgroundColor: color || '#f9f9f9' }}>
      <CardContent>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h3" component="div">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

function AnalyticsDashboard({ showSnackbar }) {
  const [stats, setStats] = useState({ totalOrders: 0, totalSales: 0, topItems: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- NEW: Date Filter States ---
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterActive, setFilterActive] = useState(false); // Tracks if filter is applied

  // Function to fetch data based on filters
  const fetchAnalytics = async (start, end) => {
    const token = localStorage.getItem('admin-token');
    if (!token) { setError("Login required."); setLoading(false); return; }

    setLoading(true);
    setError(null);

    const config = {
      headers: { 'Authorization': `Bearer ${token}` },
      params: { 
          startDate: start, 
          endDate: end 
      }
    };
    
    try {
      const res = await axios.get(`${API_BASE_URL}/api/analytics/`, config);
      
      // The response structure is now { totalOrders, totalSales, topItems: [...] }
      setStats(res.data);
      setFilterActive(!!(start || end)); // Check if either date is set
      setLoading(false);
    }
    catch (err) {
      console.error("Error fetching analytics:", err.response?.data || err.message);
      setError('Failed to fetch data. Session may have expired.');
      setLoading(false);
    }
  };

  // Run on initial load and when date filters change
  useEffect(() => {
    fetchAnalytics(startDate, endDate);
  }, [startDate, endDate]); // Dependency array includes the date states

  // --- JSX for Top Items Chart ---
  const TopItemsChart = ({ topItems }) => (
      <Card elevation={1} sx={{ p: 2, mt: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
             <TrendingUpIcon color="primary" sx={{ mr: 1 }}/> Top 3 Popular Items ({topItems.reduce((acc, item) => acc + item.count, 0)} Sold)
          </Typography>
          <Divider sx={{ mb: 2 }}/>
          <Stack spacing={1}>
              {topItems.map((item, index) => (
                  <Box key={item.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {index + 1}. {item.name}
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                          {item.count} Sold
                      </Typography>
                  </Box>
              ))}
          </Stack>
      </Card>
  );

  // --- RENDER ---
  if (loading) {
    return <Container maxWidth="md" sx={{ mt: 5 }}><Box textAlign="center"><CircularProgress /></Box></Container>;
  }
  
  if (error) {
    return <Container maxWidth="md" sx={{ mt: 5 }}><Typography color="error.main" textAlign="center">{error}</Typography></Container>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h3" gutterBottom textAlign="center">
        {filterActive ? `Analytics Summary (Filtered)` : `All-Time Business Summary`}
      </Typography>

      {/* --- Date Filters UI --- */}
      <Card elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom color="primary">Filter Orders by Date</Typography>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              <TextField 
                  label="Start Date" 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
              />
              <TextField 
                  label="End Date" 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
              />
              <Button onClick={() => {setStartDate(''); setEndDate('');}} disabled={!filterActive}>Clear Filter</Button>
          </Box>
      </Card>
      
      <Grid container spacing={3}>
        
        {/* Total Orders Card */}
        <Grid xs={12} sm={6} component={Grid}>
          <StatCard 
            title="Total Orders Received"
            value={stats.totalOrders} 
            color="#e3f2fd" 
          />
        </Grid>
        
        {/* Total Sales Card */}
        <Grid xs={12} sm={6} component={Grid}>
          <StatCard 
            title="Total Completed Sales"
            value={`₹${stats.totalSales.toFixed(2)}`}
            color="#e8f5e9" 
          />
        </Grid>
        
        {/* Top Items Chart */}
        <Grid xs={12} component={Grid}>
           {stats.topItems && stats.topItems.length > 0 && <TopItemsChart topItems={stats.topItems} />}
        </Grid>
        
      </Grid>
    </Container>
  );
}

export default AnalyticsDashboard;