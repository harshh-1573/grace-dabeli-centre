// In frontend/src/FeedbackPage.js (UPDATED WITH MATCHING DESIGN)

import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container, Typography, Paper, Box, 
  TextField, Button, CircularProgress, Stack,
  Card, CardContent, Grid
} from '@mui/material';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import SendIcon from '@mui/icons-material/Send';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

function FeedbackPage({ showSnackbar }) { 
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newFeedback = { 
      name, 
      contact, 
      rating,
      message 
    };

    try {
      await axios.post(`${API_BASE_URL}/api/feedback/add`, newFeedback);
      
      showSnackbar("Feedback submitted successfully! We appreciate your input.", "success");
      
      // Clear the form
      setName('');
      setContact('');
      setRating(5);
      setMessage('');
      
    } catch (err) {
      showSnackbar("Failed to send feedback. Please try again later.", "error");
      console.error(err.response?.data || err);
    } finally {
        setLoading(false);
    }
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
          Share Your Experience
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
          Your Feedback Helps Us Serve You Better! ✨
        </Typography>
      </Box>

      {/* Feedback Form Card */}
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 4,
              border: (theme) => `2px solid ${theme.palette.mode === 'light' ? 'rgba(241, 196, 15, 0.3)' : 'rgba(241, 196, 15, 0.2)'}`,
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: (theme) => theme.palette.mode === 'light'
                  ? '0 12px 24px rgba(241, 196, 15, 0.25)'
                  : '0 12px 24px rgba(241, 196, 15, 0.15)',
                borderColor: 'primary.main',
              },
              animation: 'fadeInUp 0.6s ease-out 0.2s both',
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
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              {/* Rating Section */}
              <Stack spacing={2} alignItems="center" sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h5" component="div" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  How was your experience?
                </Typography>
                <Rating
                  name="feedback-rating"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                  icon={<StarIcon fontSize="large" />}
                  emptyIcon={<StarIcon fontSize="large" style={{ opacity: 0.3 }} />}
                  sx={{ 
                    fontSize: { xs: 35, md: 40 },
                    color: (theme) => theme.palette.warning.main
                  }}
                  disabled={loading}
                />
                <Typography variant="body2" color="text.secondary">
                  {rating === 5 ? 'Excellent! 🎉' : 
                   rating === 4 ? 'Very Good! 😊' : 
                   rating === 3 ? 'Good! 👍' : 
                   rating === 2 ? 'Fair 👌' : 
                   rating === 1 ? 'Poor 😔' : 'Select your rating'}
                </Typography>
              </Stack>

              {/* Feedback Form */}
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    label="Your Name"
                    variant="outlined"
                    fullWidth
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  
                  <TextField
                    label="Phone or Email (Optional)"
                    variant="outlined"
                    fullWidth
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  
                  <TextField
                    label="Your Message"
                    variant="outlined"
                    fullWidth
                    required
                    multiline
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loading}
                    placeholder="Tell us about your experience with our food, service, or anything else you'd like to share..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />

                  <Button 
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
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
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {loading ? 'Submitting...' : 'Submit Feedback'}
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Info Section */}
      <Box sx={{ 
        mt: 6, 
        p: 4, 
        textAlign: 'center',
        background: (theme) => theme.palette.mode === 'light' 
          ? 'linear-gradient(135deg, rgba(241, 196, 15, 0.1) 0%, rgba(243, 156, 18, 0.1) 100%)'
          : 'linear-gradient(135deg, rgba(241, 196, 15, 0.05) 0%, rgba(243, 156, 18, 0.05) 100%)',
        borderRadius: 4,
        border: (theme) => `1px solid ${theme.palette.mode === 'light' ? 'rgba(241, 196, 15, 0.2)' : 'rgba(241, 196, 15, 0.1)'}`,
      }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
          💌 We Value Your Opinion
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Your feedback helps us improve our food quality, service, and overall customer experience. 
          We read every single review and take your suggestions seriously.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Thank you for being a valued customer of Grace Dabeli Centre! 🙏
        </Typography>
      </Box>
    </Container>
  );
}

export default FeedbackPage;