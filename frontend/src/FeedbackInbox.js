// frontend/src/FeedbackInbox.js (FIXED VERSION)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, Paper, Box, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  CircularProgress, Button, IconButton, Switch, Card, CardContent,
  Chip, Grid, Alert
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import Rating from '@mui/material/Rating';
import RefreshIcon from '@mui/icons-material/Refresh';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MessageIcon from '@mui/icons-material/Message';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

function FeedbackInbox({ showSnackbar }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAdminAuthHeader = () => {
    const token = localStorage.getItem('admin-token');
    if (!token) { console.error("Admin token not found."); return null; }
    return { headers: { 'Authorization': `Bearer ${token}` } };
  };

  const fetchFeedbacks = () => {
    setLoading(true);
    setError(null);
    const config = getAdminAuthHeader();
    if (!config) {
      setLoading(false);
      return;
    }

    axios.get(`${API_BASE_URL}/api/feedback/`, config)
      .then(res => {
        setFeedbacks(res.data);
      })
      .catch(err => {
        console.error("Error fetching feedback:", err.response || err.message);
        setError("Failed to load feedback. Check your backend connection.");
        showSnackbar("Error loading feedback inbox.", "error");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Handler for marking read/unread status
  const handleMarkAsRead = (id, isCurrentlyRead) => {
    const config = getAdminAuthHeader();
    if (!config) return;
    
    const newStatus = !isCurrentlyRead;

    axios.patch(`${API_BASE_URL}/api/feedback/read/${id}`, { isRead: newStatus }, config)
      .then(() => {
        setFeedbacks(prev => prev.map(f => f._id === id ? { ...f, isRead: newStatus } : f));
        showSnackbar(newStatus ? "Feedback marked as read." : "Feedback marked as unread.", "info");
      })
      .catch(err => {
        console.error("Error marking status:", err);
        showSnackbar("Could not update read status.", "error");
      });
  };

  // Handler for toggling public visibility
  const handleTogglePublic = (id, isCurrentlyPublic) => {
    const config = getAdminAuthHeader();
    if (!config) return;
    
    const newStatus = !isCurrentlyPublic;
    
    axios.patch(`${API_BASE_URL}/api/feedback/public/${id}`, { isPublic: newStatus }, config)
      .then(() => {
        setFeedbacks(prev => prev.map(f => f._id === id ? { ...f, isPublic: newStatus } : f));
        showSnackbar(newStatus ? "Review is now PUBLIC on the homepage." : "Review set to PRIVATE.", "success");
      })
      .catch(err => {
        console.error("Error updating public status:", err);
        showSnackbar("Could not update public status.", "error");
      });
  };

  // FIXED: Helper to render stars with null/undefined check
  const renderRating = (rating) => {
    // Handle undefined or null ratings
    const safeRating = rating || 0;
    
    return (
      <Box display="flex" alignItems="center">
        <Rating
          value={safeRating}
          readOnly
          precision={0.5}
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          sx={{ 
            color: 'warning.main', 
            mr: 1,
            '& .MuiRating-icon': {
              fontSize: '1.2rem'
            }
          }}
        />
        <Chip 
          label={safeRating.toFixed(1)} 
          size="small" 
          color="primary"
          sx={{ 
            fontWeight: 'bold',
            background: (theme) => theme.palette.mode === 'light' 
              ? 'linear-gradient(135deg, #F1C40F 0%, #F39C12 100%)'
              : 'linear-gradient(135deg, #F1C40F 0%, #D4AC0D 100%)',
            color: '#000',
          }}
        />
      </Box>
    );
  };

  // FIXED: Calculate stats with null/undefined checks
  const stats = {
    total: feedbacks.length,
    unread: feedbacks.filter(f => !f.isRead).length,
    public: feedbacks.filter(f => f.isPublic).length,
    averageRating: feedbacks.length > 0 
      ? (feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length).toFixed(1)
      : 0
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
          Customer Feedback Inbox
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
          Manage and Review Customer Feedback & Ratings ✨
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              border: (theme) => `2px solid ${theme.palette.mode === 'light' ? 'rgba(241, 196, 15, 0.3)' : 'rgba(241, 196, 15, 0.2)'}`,
              background: (theme) => theme.palette.mode === 'light' 
                ? 'linear-gradient(135deg, rgba(241, 196, 15, 0.1) 0%, rgba(243, 156, 18, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(241, 196, 15, 0.05) 0%, rgba(243, 156, 18, 0.05) 100%)',
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <MessageIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Feedback
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              border: (theme) => `2px solid ${theme.palette.mode === 'light' ? 'rgba(241, 196, 15, 0.3)' : 'rgba(241, 196, 15, 0.2)'}`,
              background: (theme) => theme.palette.mode === 'light' 
                ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(33, 150, 243, 0.02) 100%)',
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <MarkEmailUnreadIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'info.main' }}>
                {stats.unread}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unread Messages
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              border: (theme) => `2px solid ${theme.palette.mode === 'light' ? 'rgba(241, 196, 15, 0.3)' : 'rgba(241, 196, 15, 0.2)'}`,
              background: (theme) => theme.palette.mode === 'light' 
                ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(76, 175, 80, 0.02) 100%)',
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <VisibilityIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'success.main' }}>
                {stats.public}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Public Reviews
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              border: (theme) => `2px solid ${theme.palette.mode === 'light' ? 'rgba(241, 196, 15, 0.3)' : 'rgba(241, 196, 15, 0.2)'}`,
              background: (theme) => theme.palette.mode === 'light' 
                ? 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(255, 152, 0, 0.05) 0%, rgba(255, 152, 0, 0.02) 100%)',
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <StarIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {stats.averageRating}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Rating
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Controls */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Button 
          variant="contained"
          onClick={fetchFeedbacks} 
          disabled={loading} 
          startIcon={<RefreshIcon />}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            background: (theme) => theme.palette.mode === 'light' 
              ? 'linear-gradient(135deg, #F1C40F 0%, #F39C12 100%)'
              : 'linear-gradient(135deg, #F1C40F 0%, #D4AC0D 100%)',
            color: '#000',
            '&:hover': {
              background: (theme) => theme.palette.mode === 'light' 
                ? 'linear-gradient(135deg, #F39C12 0%, #E67E22 100%)'
                : 'linear-gradient(135deg, #D4AC0D 0%, #F39C12 100%)',
            },
          }}
        >
          Refresh Feedback
        </Button>
        {error && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}
      </Stack>

      {/* Feedback Table */}
      <Card 
        elevation={0}
        sx={{ 
          borderRadius: 3,
          border: (theme) => `2px solid ${theme.palette.mode === 'light' ? 'rgba(241, 196, 15, 0.3)' : 'rgba(241, 196, 15, 0.2)'}`,
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 700 }} size="small">
            <TableHead>
              <TableRow sx={{ 
                background: (theme) => theme.palette.mode === 'light' 
                  ? 'linear-gradient(135deg, #F1C40F 0%, #F39C12 100%)'
                  : 'linear-gradient(135deg, #F1C40F 0%, #D4AC0D 100%)',
              }}>
                <TableCell sx={{ color: '#000', fontWeight: 700, textAlign: 'center', width: '8%' }}>Status</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 700, width: '12%' }}>Customer</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 700, width: '15%' }}>Contact</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 700, width: '12%' }}>Rating</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 700, width: '35%' }}>Message</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 700, textAlign: 'center', width: '8%' }}>Public</TableCell>
                <TableCell sx={{ color: '#000', fontWeight: 700, width: '10%' }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbacks.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No feedback submissions found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                feedbacks.map((feedback, index) => (
                  <TableRow 
                    key={feedback._id} 
                    hover 
                    sx={{ 
                      backgroundColor: feedback.isRead ? 'background.paper' : 'warning.light', 
                      opacity: feedback.isRead ? 0.9 : 1,
                      transition: 'all 0.3s ease',
                      animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
                      '@keyframes fadeInUp': {
                        from: {
                          opacity: 0,
                          transform: 'translateY(10px)',
                        },
                        to: {
                          opacity: feedback.isRead ? 0.9 : 1,
                          transform: 'translateY(0)',
                        },
                      },
                    }}
                  >
                    <TableCell align="center">
                      <IconButton 
                        onClick={() => handleMarkAsRead(feedback._id, feedback.isRead)}
                        color={feedback.isRead ? 'success' : 'error'}
                        title={feedback.isRead ? 'Mark as Unread' : 'Mark as Read'}
                        sx={{
                          '&:hover': {
                            transform: 'scale(1.1)',
                          },
                          transition: 'transform 0.2s ease',
                        }}
                      >
                        {feedback.isRead ? <MarkEmailReadIcon fontSize="small" /> : <MarkEmailUnreadIcon fontSize="small" />}
                      </IconButton>
                    </TableCell>
                    <TableCell sx={{ fontWeight: feedback.isRead ? 'normal' : 'bold' }}>
                      {feedback.name}
                    </TableCell>
                    <TableCell>
                      {feedback.contact || (
                        <Chip label="Not Provided" size="small" variant="outlined" color="default" />
                      )}
                    </TableCell>
                    <TableCell>
                      {/* FIXED: Safe rating rendering */}
                      {renderRating(feedback.rating)}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                        {feedback.message}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={feedback.isPublic}
                        onChange={() => handleTogglePublic(feedback._id, feedback.isPublic)}
                        size="small"
                        color="primary"
                        icon={<VisibilityOffIcon />}
                        checkedIcon={<VisibilityIcon />}
                        title={feedback.isPublic ? 'Click to make private' : 'Click to approve for public display'}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(feedback.createdAt).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={40} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Loading feedback...
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Container>
  );
}

export default FeedbackInbox;