// In frontend/src/LocationsPage.js

import React from 'react';
import {
  Container, Typography, Box, Grid,
  Card, CardContent, CardMedia,
  Link, Avatar, Chip
} from '@mui/material';

// Import icons
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InstagramIcon from '@mui/icons-material/Instagram';
import StarIcon from '@mui/icons-material/Star';

const branches = [
  {
    title: "Main Branch (Jayant Talkies)",
    location: "Near Jayant Talkies, CNI Church, Chandrapur",
    owner: "Subhash Mudpalliwar",
    videoUrl: "/images/branch-main-video.mp4",
    ownerInstaHandle: "subhash_mudpalliwar",
    ownerImageUrl: "/images/owner-subhash.jpg",
    description: "The original home of authentic Dabeli since 2015. Our flagship branch where the magic began, serving generations of Dabeli lovers with the same traditional recipe and passion Owned by Mr.Subhash Mudpalliwar.",
    isNew: false
  },
  {
    title: "Warora Naka Branch",
    location: "Near Warora Naka, Opposite Dhande Hospital, Chandrapur",
    owner: "Prem Mudaplliwar",
    videoUrl: "/images/branch-warora-video.mp4",
    ownerInstaHandle: "prem.mudpalliwar.3",
    ownerImageUrl: "/images/owner-prem.jpg",
    description: "Expanding our legacy to serve the Warora Naka community by Mr.Prem Mudpalliwar Experience the same authentic taste with warm hospitality in the heart of the city.",
    isNew: false
  },
  {
    title: "Mahakali Mandir Branch",
    location: "Near Mahakali Mandir, Chandrapur",
    owner: "Vishal Nagrale",
    videoUrl: "/images/branch-mahakali-video.mp4",
    ownerInstaHandle: "vishhhuu__x7",
    ownerImageUrl: "/images/owner-vishal.jpg",
    description: "Serving devotees and visitors with divine taste near the sacred Mahakali Mandir. Perfect blend of spirituality and delicious street food experience.",
    isNew: false
  },
  {
    title: "Bengali Camp Branch",
    location: "Near Bengali Camp, Chandrapur",
    owner: "Subhash Mudpalliwar",
    videoUrl: "/images/branch-bengali-video.mp4",
    ownerInstaHandle: "subhash_mudpalliwar",
    ownerImageUrl: "/images/owner-subhash.jpg",
    description: "Our newest addition! Bringing the legendary Grace Dabeli experience to Bengali Camp. Fresh, hot, and authentic - now closer to your neighborhood.",
    isNew: true
  }
];

function LocationsPage() {
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
          Our Branches
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
          GRACE DABELI AND MUMBAICHA VADAPAV CENTRE
        </Typography>
        <Typography 
          variant="h6" 
          sx={{
            color: '#1a1a1a',
            fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.2rem' },
            fontWeight: 300,
            position: 'relative',
            zIndex: 1,
            mt: 1,
          }}
        >
          Serving Authentic Taste Across Chandrapur Since 2015
        </Typography>
      </Box>

      {/* Branches Grid */}
      <Grid container spacing={3}>
        {branches.map((branch, index) => (
          <Grid item xs={12} sm={6} md={3} key={branch.title}>
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
              {/* Video Section - Same layout for all */}
              <Box sx={{ position: 'relative', p: 2, pb: 1 }}>
                <Box
                  sx={{
                    width: '100%',
                    height: 180,
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: (theme) => `3px solid ${theme.palette.mode === 'light' ? 'rgba(241, 196, 15, 0.4)' : 'rgba(241, 196, 15, 0.3)'}`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  <CardMedia
                    component="video"
                    height="180"
                    image={branch.videoUrl}
                    title={branch.title}
                    controls
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
                {branch.isNew && (
                  <Chip 
                    icon={<StarIcon />}
                    label="New Branch" 
                    color="primary" 
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: 25, 
                      right: 25,
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #F1C40F 0%, #F39C12 100%)',
                      color: '#000'
                    }}
                  />
                )}
              </Box>

              <CardContent sx={{ p: 2, flexGrow: 1, textAlign: 'center' }}>
                <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 600, fontSize: '1rem', mb: 1 }}>
                  {branch.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.8rem', lineHeight: 1.4, minHeight: '55px' }}>
                  {branch.description}
                </Typography>

                {/* Branch Details - Same layout for all */}
                <Box sx={{ textAlign: 'left', mb: 2 }}>
                  {/* Location */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                    <LocationOnIcon color="primary" sx={{ mr: 1, mt: 0.2, fontSize: '1rem' }} />
                    <Typography variant="caption" sx={{ fontSize: '0.75rem', lineHeight: 1.3 }}>
                      {branch.location}
                    </Typography>
                  </Box>

                  {/* Owner */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Avatar
                      alt={branch.owner}
                      src={branch.ownerImageUrl}
                      sx={{ width: 20, height: 20, mr: 1 }}
                    />
                    <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                      {branch.owner}
                    </Typography>
                  </Box>

                  {/* Timing */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <AccessTimeIcon color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
                    <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                      3:00 PM - 10:00 PM
                    </Typography>
                  </Box>

                  {/* Instagram */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <InstagramIcon color="secondary" sx={{ mr: 1, fontSize: '1rem' }} />
                    <Link 
                      href={`https://www.instagram.com/${branch.ownerInstaHandle}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      variant="caption"
                      sx={{ 
                        fontSize: '0.75rem',
                        color: 'primary.main',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      @{branch.ownerInstaHandle}
                    </Link>
                  </Box>
                </Box>

                {/* Special Features - Same for all */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center', mt: 1 }}>
                  <Chip 
                    label="Free Delivery" 
                    size="small" 
                    variant="outlined" 
                    color="success"
                    sx={{ fontSize: '0.6rem', height: 20 }}
                  />
                  <Chip 
                    label="Fresh Food" 
                    size="small" 
                    variant="outlined" 
                    color="primary"
                    sx={{ fontSize: '0.6rem', height: 20 }}
                  />
                  <Chip 
                    label="Family Owned" 
                    size="small" 
                    variant="outlined" 
                    color="secondary"
                    sx={{ fontSize: '0.6rem', height: 20 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
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
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 3 }}>
          🚚 Free Delivery Available at All Locations
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 1 }}>
              🕒 Operating Hours
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              3:00 PM - 10:00 PM
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All branches follow same timings
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 1 }}>
              🎯 Service Area
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Free Delivery within 3km
            </Typography>
            <Typography variant="body2" color="text.secondary">
              From each branch location
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 1 }}>
              ⭐ Quality Promise
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Same Great Taste Everywhere
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Consistent quality across all branches
            </Typography>
          </Grid>
        </Grid>

        <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
          "From our family to yours - serving authentic Dabeli and Vadapav with love since 2015. 
          Experience the taste that made us Chandrapur's favorite street food destination!"
        </Typography>
      </Box>
    </Container>
  );
}

export default LocationsPage;