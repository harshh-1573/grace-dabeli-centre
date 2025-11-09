// frontend/src/Footer.js (Updated with Policy Links + Enhanced Animations)
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Avatar,
  Stack,
  CircularProgress,
  Paper,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Facebook,
  Instagram,
  WhatsApp,
  ExpandMore,
  ExpandLess,
  LocationOn,
  Phone,
  Email,
  Schedule,
  Policy,
  Security,
  AssignmentReturn,
  MoneyOff,
} from "@mui/icons-material";
import Rating from "@mui/material/Rating";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

const Footer = () => {
  const [showDev, setShowDev] = useState(false);
  const [publicStats, setPublicStats] = useState({
    stats: { averageRating: 0, totalReviews: 0 },
    testimonials: [],
  });
  const [loadingRatings, setLoadingRatings] = useState(true);
  const [policyDialog, setPolicyDialog] = useState({ open: false, type: "", content: "" });

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/feedback/public`)
      .then((res) => {
        if (res.data && res.data.stats) setPublicStats(res.data);
      })
      .catch((err) => console.error("Error fetching public feedback:", err))
      .finally(() => setLoadingRatings(false));
  }, []);

  const restaurantInfo = {
    address: "Near Jayant Talkies, Behind CNI Church, Chandrapur, Maharashtra, India",
    phone: "+91 92841 80396",
    email: "harshgorantiwar@gmail.com",
    hours: {
      weekdays: "3:00 PM - 9:00 PM",
      weekends: "2:00 PM - 10:00 PM",
      everyday: "Open all days",
    },
  };

  // Policy Content
  const policies = {
    return: {
      title: "Return Policy",
      icon: <AssignmentReturn sx={{ mr: 1 }} />,
      content: `
        At Grace Dabeli Centre, we strive to ensure complete customer satisfaction. 
        
        • Food items cannot be returned once prepared for hygiene and safety reasons
        • In case of incorrect orders, please contact us immediately
        • Delivery issues will be resolved promptly
        • Quality concerns? We'll make it right!
        
        Contact us within 30 minutes of order delivery for any issues.
      `
    },
    refund: {
      title: "Refund Policy", 
      icon: <MoneyOff sx={{ mr: 1 }} />,
      content: `
        Your satisfaction is our priority!
        
        • Full refund for cancelled orders before preparation
        • Partial refund for delivery issues
        • Digital payment refunds processed within 3-5 business days
        • Cash refunds available at store
        
        For refund requests, contact: ${restaurantInfo.phone}
      `
    },
    privacy: {
      title: "Privacy Policy",
      icon: <Security sx={{ mr: 1 }} />,
      content: `
        We value your privacy and protect your personal information.
        
        • We collect only necessary information for order processing
        • Your data is never shared with third parties without consent
        • Secure payment processing
        • You can request data deletion anytime
        
        By using our services, you agree to our privacy practices.
      `
    },
    disclaimer: {
      title: "Disclaimer",
      icon: <Policy sx={{ mr: 1 }} />,
      content: `
        Important Information:
        
        • Menu items and prices are subject to change
        • Delivery times are estimates and may vary
        • Food images are for representation only
        • We reserve the right to modify policies
        
        For the most current information, please visit our store or contact us directly.
      `
    }
  };

  const handlePolicyOpen = (policyType) => {
    setPolicyDialog({
      open: true,
      type: policyType,
      content: policies[policyType]
    });
  };

  const handlePolicyClose = () => {
    setPolicyDialog({ open: false, type: "", content: "" });
  };

  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(180deg, #0D0D0D 0%, #1C1C1C 50%, #2C2C2C 100%)",
        color: "#FFD700",
        textAlign: "center",
        py: 5,
        px: 3,
        mt: "auto",
        borderTop: "2px solid #FFD70033",
        boxShadow: "0px -4px 20px rgba(255, 215, 0, 0.1)",
        animation: "fadeInUp 0.8s ease-out",
        "@keyframes fadeInUp": {
          from: { opacity: 0, transform: "translateY(20px)" },
          to: { opacity: 1, transform: "translateY(0)" }
        }
      }}
    >
      {/* --- MAIN GRID --- */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        justifyContent="space-around"
        alignItems="flex-start"
        sx={{ mb: 4 }}
      >
        {/* 1️⃣ Contact & Hours */}
        <Paper
          elevation={6}
          sx={{
            p: 3,
            maxWidth: 300,
            mx: "auto",
            textAlign: "left",
            backgroundColor: "#111",
            border: "1px solid #FFD70033",
            borderRadius: 3,
            boxShadow: "0 0 20px rgba(255, 215, 0, 0.08)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: "translateY(0)",
            "&:hover": {
              boxShadow: "0 0 40px rgba(255, 215, 0, 0.3)",
              transform: "translateY(-8px) scale(1.02)",
              borderColor: "#FFD70066",
            },
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#FFD700" }}>
            📍 Find Us
          </Typography>

          <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
            <LocationOn sx={{ color: "#FFD700", mr: 1, mt: 0.3, fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: "#F7DC6F", lineHeight: 1.4 }}>
              {restaurantInfo.address}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Phone sx={{ color: "#FFD700", mr: 1, fontSize: 18 }} />
            <Typography
              component="a"
              href={`tel:${restaurantInfo.phone}`}
              sx={{
                color: "#F7DC6F",
                textDecoration: "none",
                transition: "all 0.3s ease",
                "&:hover": { 
                  color: "#FFD700", 
                  textDecoration: "underline",
                  transform: "translateX(4px)"
                },
              }}
            >
              {restaurantInfo.phone}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Email sx={{ color: "#FFD700", mr: 1, fontSize: 18 }} />
            <Typography
              component="a"
              href={`mailto:${restaurantInfo.email}`}
              sx={{
                color: "#F7DC6F",
                textDecoration: "none",
                transition: "all 0.3s ease",
                "&:hover": { 
                  color: "#FFD700", 
                  textDecoration: "underline",
                  transform: "translateX(4px)"
                },
              }}
            >
              {restaurantInfo.email}
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ mb: 1.5, fontWeight: "bold", color: "#FFD700" }}>
            🕒 Hours
          </Typography>

          <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
            <Schedule sx={{ color: "#FFD700", mr: 1, mt: 0.2, fontSize: 18 }} />
            <Box>
              <Typography variant="body2" sx={{ color: "#F7DC6F" }}>
                <strong>Mon - Fri:</strong> {restaurantInfo.hours.weekdays}
              </Typography>
              <Typography variant="body2" sx={{ color: "#F7DC6F", mt: 0.5 }}>
                <strong>Sat - Sun:</strong> {restaurantInfo.hours.weekends}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#FFD700",
                  fontStyle: "italic",
                  mt: 1,
                  display: "block",
                }}
              >
                {restaurantInfo.hours.everyday}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* 2️⃣ Customer Ratings */}
        <Paper
          elevation={6}
          sx={{
            p: 3,
            maxWidth: 280,
            mx: "auto",
            textAlign: "left",
            backgroundColor: "#111",
            border: "1px solid #FFD70033",
            borderRadius: 3,
            boxShadow: "0 0 20px rgba(255, 215, 0, 0.08)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: "translateY(0)",
            "&:hover": {
              boxShadow: "0 0 40px rgba(255, 215, 0, 0.3)",
              transform: "translateY(-8px) scale(1.02)",
              borderColor: "#FFD70066",
            },
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#FFD700" }}>
            ⭐ Customer Rating
          </Typography>

          {loadingRatings ? (
            <CircularProgress size={24} sx={{ color: "#FFD700" }} />
          ) : (
            <>
              <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                <Typography
                  variant="h4"
                  component="span"
                  sx={{
                    fontWeight: "bold",
                    mr: 1,
                    color: "#FFD700",
                    textShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
                    animation: "pulse 2s ease-in-out infinite",
                    "@keyframes pulse": {
                      "0%, 100%": { transform: "scale(1)" },
                      "50%": { transform: "scale(1.05)" }
                    }
                  }}
                >
                  {publicStats.stats.averageRating.toFixed(1)}
                </Typography>
                <Rating
                  value={publicStats.stats.averageRating}
                  readOnly
                  precision={0.1}
                  sx={{
                    color: "#FFD700",
                    "& .MuiRating-iconFilled": { 
                      color: "#FFD700",
                      animation: "starGlow 1.5s ease-in-out infinite",
                      "@keyframes starGlow": {
                        "0%, 100%": { opacity: 1 },
                        "50%": { opacity: 0.7 }
                      }
                    },
                  }}
                />
              </Box>

              <Typography variant="body2" sx={{ color: "#F7DC6F" }}>
                Based on {publicStats.stats.totalReviews} total reviews.
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  maxHeight: 130,
                  overflowY: "auto",
                  pr: 1,
                  "&::-webkit-scrollbar": { width: "4px" },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#FFD70033",
                    borderRadius: 2,
                  },
                }}
              >
                {publicStats.testimonials.length > 0 ? (
                  publicStats.testimonials.map((review, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        mb: 1.5,
                        animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                        "@keyframes fadeIn": {
                          from: { opacity: 0, transform: "translateX(-10px)" },
                          to: { opacity: 1, transform: "translateX(0)" }
                        }
                      }}
                    >
                      <Rating
                        value={review.rating || 0}
                        readOnly
                        size="small"
                        sx={{
                          color: "#FFD700",
                          "& .MuiRating-iconFilled": { color: "#FFD700" },
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#F7DC6F",
                          display: "block",
                          fontStyle: "italic",
                          lineHeight: 1.4,
                        }}
                      >
                        "{review.message.slice(0, 55)}
                        {review.message.length > 55 ? "..." : ""}" —{" "}
                        <strong>{review.name}</strong>
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="caption" sx={{ color: "#F7DC6F" }}>
                    Be the first to review us!
                  </Typography>
                )}
              </Box>
            </>
          )}
        </Paper>

        {/* 3️⃣ Social Media + Quick Actions */}
        <Box sx={{ mx: "auto", mt: { xs: 4, md: 0 } }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#FFD700" }}>
            🔥 Connect With Us
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
            {[
              { icon: <Facebook />, link: "https://www.facebook.com/subhash.mudpalliwar", color: "#1877F2" },
              { icon: <Instagram />, link: "https://www.instagram.com/subhash_mudpalliwar", color: "#C13584" },
              { icon: <WhatsApp />, link: "https://wa.me/919284180396", color: "#25D366" },
            ].map((social, i) => (
              <IconButton
                key={i}
                component="a"
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: social.color,
                  backgroundColor: "#111",
                  border: "1px solid #FFD70033",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: "scale(1)",
                  "&:hover": {
                    backgroundColor: social.color,
                    color: "#fff",
                    boxShadow: `0 0 25px ${social.color}`,
                    transform: "scale(1.1) rotate(5deg)",
                  },
                  borderRadius: "50%",
                  p: 1.4,
                  animation: `bounceIn 0.6s ease-out ${i * 0.1}s both`,
                  "@keyframes bounceIn": {
                    "0%": { opacity: 0, transform: "scale(0.3)" },
                    "50%": { opacity: 1, transform: "scale(1.05)" },
                    "70%": { transform: "scale(0.9)" },
                    "100%": { opacity: 1, transform: "scale(1)" }
                  }
                }}
              >
                {social.icon}
              </IconButton>
            ))}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
            <Button
              variant="outlined"
              component="a"
              href={`tel:${restaurantInfo.phone}`}
              sx={{
                color: "#FFD700",
                borderColor: "#FFD700",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#E6C200",
                  backgroundColor: "#FFD70022",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(255, 215, 0, 0.3)",
                },
              }}
            >
              Call Now
            </Button>

            <Button
              variant="outlined"
              component="a"
              href={`https://maps.google.com/?q=${encodeURIComponent(
                restaurantInfo.address
              )}`}
              target="_blank"
              sx={{
                color: "#FFD700",
                borderColor: "#FFD700",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#E6C200",
                  backgroundColor: "#FFD70022",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(255, 215, 0, 0.3)",
                },
              }}
            >
              Get Directions
            </Button>
          </Box>
        </Box>
      </Stack>

      {/* Policy Links Section */}
      <Box sx={{ mb: 3, mt: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#FFD700" }}>
          📄 Policies & Information
        </Typography>
        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          spacing={2} 
          justifyContent="center"
          alignItems="center"
          sx={{ flexWrap: 'wrap' }}
        >
          {Object.entries(policies).map(([key, policy]) => (
            <Button
              key={key}
              startIcon={policy.icon}
              onClick={() => handlePolicyOpen(key)}
              sx={{
                color: "#FFD700",
                border: "1px solid #FFD70033",
                borderRadius: 2,
                px: 2,
                py: 1,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#FFD70011",
                  borderColor: "#FFD700",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(255, 215, 0, 0.2)",
                },
              }}
            >
              {policy.title}
            </Button>
          ))}
        </Stack>
      </Box>

      <Divider sx={{ bgcolor: "#FFD70055", width: "80%", mx: "auto", mb: 2 }} />

      <Typography variant="body1" sx={{ mb: 1, color: "#FFD700" }}>
        © {new Date().getFullYear()} <strong>Grace Dabeli & Vadapav Centre</strong>. All rights reserved.
      </Typography>

      <Typography variant="body2" sx={{ color: "#ccc", mb: 2, fontStyle: "italic" }}>
        Taste the Grace of Chandrapur — Serving Love with Every Bite!
      </Typography>

      {/* Developer Info Toggle */}
      <Button
        onClick={() => setShowDev(!showDev)}
        endIcon={showDev ? <ExpandLess /> : <ExpandMore />}
        variant="contained"
        sx={{
          fontWeight: "bold",
          textTransform: "none",
          borderRadius: 2,
          px: 3,
          py: 0.8,
          mb: 2,
          bgcolor: "#FFD700",
          color: "#000",
          transition: "all 0.3s ease",
          "&:hover": {
            bgcolor: "#E6C200",
            boxShadow: "0 0 20px rgba(255, 215, 0, 0.7)",
            transform: "translateY(-2px)",
          },
        }}
      >
        {showDev ? "Hide Developer Info" : "Show Developer Info"}
      </Button>

      {showDev && (
        <Box
          sx={{
            mt: 2,
            backgroundColor: "#111",
            border: "1px solid #FFD70033",
            borderRadius: 3,
            py: 3,
            px: 3,
            maxWidth: 400,
            mx: "auto",
            color: "#FFD700",
            boxShadow: "0 0 20px rgba(255, 215, 0, 0.08)",
            animation: "slideDown 0.5s ease-out",
            "@keyframes slideDown": {
              from: { opacity: 0, transform: "translateY(-20px)" },
              to: { opacity: 1, transform: "translateY(0)" }
            }
          }}
        >
          <Avatar
            src="/images/harsh.jpg"
            alt="Harsh Gorantiwar"
            sx={{
              width: 70,
              height: 70,
              mx: "auto",
              mb: 1.5,
              border: "2px solid #FFD700",
              animation: "rotateIn 0.8s ease-out",
              "@keyframes rotateIn": {
                from: { transform: "rotate(-180deg) scale(0)" },
                to: { transform: "rotate(0) scale(1)" }
              }
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Harsh Gorantiwar
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, color: "#ccc" }}>
            MERN Stack Developer | Passionate about Food & Tech
          </Typography>
        </Box>
      )}

      {/* Policy Dialog */}
      <Dialog 
        open={policyDialog.open} 
        onClose={handlePolicyClose}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: '#111',
            border: '2px solid #FFD70033',
            borderRadius: 3,
            color: '#FFD700',
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #FFD70033',
          display: 'flex',
          alignItems: 'center',
          fontWeight: 'bold'
        }}>
          {policyDialog.content?.icon}
          {policyDialog.content?.title}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body1" sx={{ color: '#F7DC6F', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
            {policyDialog.content?.content}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handlePolicyClose}
            sx={{
              color: '#FFD700',
              border: '1px solid #FFD70033',
              '&:hover': {
                backgroundColor: '#FFD70011'
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Footer;