// frontend/src/AboutPage.js (UPDATED WITH MATCHING DESIGN)

import React from 'react';
import {
  Container,
  Typography,
  Box,
  Avatar,
  Link,
  Divider,
  Button,
  Stack,
  Card,
  CardContent,
  Grid,
  Chip
} from '@mui/material';
import { Instagram, WhatsApp, Star, LocationOn, Group } from '@mui/icons-material';

function AboutPage() {
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
          Our Story
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
          The Heart Behind the Authentic Taste ✨
        </Typography>
      </Box>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Owner Profile Card */}
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0}
            sx={{ 
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
            }}
          >
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Avatar
                alt="Subhash Mudpalliwar"
                src="/images/owner-subhash.jpg"
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mx: 'auto', 
                  mb: 2,
                  border: (theme) => `3px solid ${theme.palette.primary.main}`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Subhash Mudpalliwar
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Founder & Visionary
              </Typography>
              
              <Button
                variant="contained"
                startIcon={<WhatsApp />}
                href="https://wa.me/919284180396"
                target="_blank"
                fullWidth
                sx={{
                  mb: 2,
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
                WhatsApp
              </Button>

              <Button
                startIcon={<Instagram />}
                href="https://www.instagram.com/subhash_mudpalliwar"
                target="_blank"
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    backgroundColor: 'primary.light',
                  },
                }}
              >
                Instagram
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Story Content */}
        <Grid item xs={12} md={8}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 4,
              border: (theme) => `2px solid ${theme.palette.mode === 'light' ? 'rgba(241, 196, 15, 0.3)' : 'rgba(241, 196, 15, 0.2)'}`,
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>
                Welcome to Grace Dabeli Centre
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                  Grace Dabeli Centre is a family-owned business founded by <strong>Subhash Mudpalliwar</strong> and his brother <strong>Prem Mudpalliwar</strong>. 
                  Later, their nephew <strong>Vishal Nagrale</strong> joined them in this venture. Together, they worked tirelessly at the main branch 
                  before expanding with new outlets, continuing the family's passion for authentic taste and warm hospitality.
                </Typography>

                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                  Our journey began with a simple dream: to bring the original taste of Kutchi Dabeli and Mumbai Vadapav to every food lover in Chandrapur. 
                  Every dish at Grace Dabeli Centre is made with care, using our signature homemade spices and fresh ingredients. 
                  From the classic Dabeli to the perfectly spiced Vadapav, every item reflects our commitment to quality and flavor.
                </Typography>

                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                  Proudly serving authentic street food flavors since 2015, we have established ourselves as a beloved food destination near Jayant Talkies, Chandrapur. 
                  Our dedication to maintaining traditional recipes while ensuring consistent quality has earned us excellent customer feedback and loyalty.
                </Typography>

                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                  Today, with multiple branches across Chandrapur, we continue to serve our community with the same passion and dedication that started it all. 
                  We believe in using only the freshest ingredients and maintaining the authentic flavors that our customers have come to love.
                </Typography>
              </Box>

              {/* Features */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Star color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" fontWeight="medium">
                      Excellent Customer Feedback
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" fontWeight="medium">
                      4 Branches Across Chandrapur
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Group color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" fontWeight="medium">
                      Family-Owned Business
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Star color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" fontWeight="medium">
                      Fresh Ingredients Daily
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary', textAlign: 'center' }}>
                "Thank you for being part of our story. Your love and support inspire us to keep serving 
                the best street food experience in Chandrapur — fresh, delicious, and made with heart."
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Team Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 700, color: 'primary.main', mb: 4 }}>
          Meet Our Family
        </Typography>
        
        <Grid container spacing={3}>
          {/* Prem Mudpalliwar */}
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 4,
                border: (theme) => `2px solid ${theme.palette.mode === 'light' ? 'rgba(241, 196, 15, 0.3)' : 'rgba(241, 196, 15, 0.2)'}`,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  borderColor: 'primary.main',
                },
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Avatar
                  alt="Prem Mudpalliwar"
                  src="/images/owner-prem.jpg"
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mx: 'auto', 
                    mb: 2,
                    border: (theme) => `2px solid ${theme.palette.primary.main}`,
                  }}
                />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Prem Mudpalliwar
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Co-Founder & Manager
                </Typography>
                <Button
                  startIcon={<Instagram />}
                  href="https://www.instagram.com/prem.mudpalliwar.3"
                  target="_blank"
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  Follow
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Vishal Nagrale */}
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 4,
                border: (theme) => `2px solid ${theme.palette.mode === 'light' ? 'rgba(241, 196, 15, 0.3)' : 'rgba(241, 196, 15, 0.2)'}`,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  borderColor: 'primary.main',
                },
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Avatar
                  alt="Vishal Nagrale"
                  src="/images/owner-vishal.jpg"
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mx: 'auto', 
                    mb: 2,
                    border: (theme) => `2px solid ${theme.palette.primary.main}`,
                  }}
                />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Vishal Nagrale
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Branch Manager
                </Typography>
                <Button
                  startIcon={<Instagram />}
                  href="https://www.instagram.com/vishhhuu__x7"
                  target="_blank"
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  Follow
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Values Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 4,
                border: (theme) => `2px solid ${theme.palette.mode === 'light' ? 'rgba(241, 196, 15, 0.3)' : 'rgba(241, 196, 15, 0.2)'}`,
                overflow: 'hidden',
                background: (theme) => theme.palette.mode === 'light' 
                  ? 'linear-gradient(135deg, rgba(241, 196, 15, 0.1) 0%, rgba(243, 156, 18, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(241, 196, 15, 0.05) 0%, rgba(243, 156, 18, 0.05) 100%)',
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Our Values
                </Typography>
                <Stack spacing={1} sx={{ mt: 2 }}>
                  <Chip label="Authentic Taste" color="primary" variant="outlined" size="small" />
                  <Chip label="Fresh Ingredients" color="primary" variant="outlined" size="small" />
                  <Chip label="Family Legacy" color="primary" variant="outlined" size="small" />
                  <Chip label="Customer First" color="primary" variant="outlined" size="small" />
                  <Chip label="Quality Service" color="primary" variant="outlined" size="small" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default AboutPage;