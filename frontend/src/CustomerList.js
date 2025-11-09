// In frontend/src/CustomerList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Container, Typography, Box, Paper, CircularProgress, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Card, Chip, useTheme, alpha
} from '@mui/material'; 
import { People, Person, Phone, Email, CalendarToday } from '@mui/icons-material';

// Define API Base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

function CustomerList({ showSnackbar }) {
    const [customers, setCustomers] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();

    // Function to fetch data from the secured API route
    useEffect(() => {
        const fetchCustomers = async () => {
            const token = localStorage.getItem('admin-token');
            if (!token) {
                setError("Admin authentication required.");
                setLoading(false);
                return;
            }

            const config = { headers: { 'Authorization': `Bearer ${token}` } };

            try {
                // Call the new protected API route
                const res = await axios.get(`${API_BASE_URL}/api/customers/all`, config);

                setCustomers(res.data.customers);
                setTotalCount(res.data.count);
                setError(null);
            } catch (err) {
                console.error("Error fetching customer list:", err.response?.data || err.message);
                setError('Failed to fetch customer list. Session may have expired.');
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []); // Runs once on load

    // --- RENDER ---
    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 5 }}>
                <Box textAlign="center" sx={{ py: 8 }}>
                    <CircularProgress 
                        size={60} 
                        sx={{ 
                            color: theme.palette.primary.main,
                            animation: 'pulse 1.5s ease-in-out infinite',
                            '@keyframes pulse': {
                                '0%, 100%': { transform: 'scale(1)' },
                                '50%': { transform: 'scale(1.1)' }
                            }
                        }} 
                    />
                </Box>
            </Container>
        );
    }
    
    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 5 }}>
                <Typography 
                    color="error.main" 
                    textAlign="center" 
                    variant="h6"
                    sx={{ 
                        p: 3, 
                        borderRadius: 3,
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                        border: `1px solid ${theme.palette.error.main}33`
                    }}
                >
                    {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 5 }}>
            {/* Header Section */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography 
                    variant="h3" 
                    gutterBottom 
                    sx={{
                        fontWeight: 700,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        animation: 'fadeInUp 0.8s ease-out',
                        '@keyframes fadeInUp': {
                            from: { opacity: 0, transform: 'translateY(20px)' },
                            to: { opacity: 1, transform: 'translateY(0)' }
                        }
                    }}
                >
                    👥 Registered Customers
                </Typography>
                
                <Card 
                    elevation={0}
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                        border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        animation: 'slideIn 0.6s ease-out 0.2s both',
                        '@keyframes slideIn': {
                            from: { opacity: 0, transform: 'translateX(-20px)' },
                            to: { opacity: 1, transform: 'translateX(0)' }
                        }
                    }}
                >
                    <People sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
                    <Box>
                        <Typography variant="h4" fontWeight="bold" color={theme.palette.primary.main}>
                            {totalCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight="500">
                            Total Customer Accounts
                        </Typography>
                    </Box>
                </Card>
            </Box>

            {/* Customers Table */}
            <TableContainer 
                component={Paper} 
                elevation={0}
                sx={{
                    borderRadius: 4,
                    border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    overflow: 'hidden',
                    background: theme.palette.mode === 'light' 
                        ? 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)'
                        : 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)',
                    animation: 'fadeIn 0.8s ease-out 0.4s both',
                    '@keyframes fadeIn': {
                        from: { opacity: 0 },
                        to: { opacity: 1 }
                    }
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ 
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            '& th': { 
                                color: '#000',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                py: 2,
                                borderBottom: 'none'
                            }
                        }}>
                            <TableCell>#</TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Person sx={{ fontSize: 20 }} />
                                    Name
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Phone sx={{ fontSize: 20 }} />
                                    Phone (Login)
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Email sx={{ fontSize: 20 }} />
                                    Email
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CalendarToday sx={{ fontSize: 20 }} />
                                    Registered
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                    <Typography 
                                        variant="h6" 
                                        color="text.secondary"
                                        sx={{ 
                                            fontStyle: 'italic',
                                            animation: 'pulse 2s ease-in-out infinite',
                                            '@keyframes pulse': {
                                                '0%, 100%': { opacity: 0.7 },
                                                '50%': { opacity: 1 }
                                            }
                                        }}
                                    >
                                        No customer accounts found.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            customers.map((customer, index) => (
                                <TableRow 
                                    key={customer._id}
                                    sx={{ 
                                        transition: 'all 0.3s ease',
                                        animation: `rowSlideIn 0.5s ease-out ${index * 0.05}s both`,
                                        '@keyframes rowSlideIn': {
                                            from: { opacity: 0, transform: 'translateX(-10px)' },
                                            to: { opacity: 1, transform: 'translateX(0)' }
                                        },
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                            transform: 'translateY(-2px)',
                                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`
                                        },
                                        '&:nth-of-type(odd)': {
                                            backgroundColor: theme.palette.mode === 'light' 
                                                ? alpha(theme.palette.primary.main, 0.02)
                                                : alpha(theme.palette.primary.main, 0.05)
                                        }
                                    }}
                                >
                                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body1" fontWeight="500">
                                            {customer.name}
                                        </Typography>
                                        {index === 0 && (
                                            <Chip 
                                                label="Latest" 
                                                size="small" 
                                                color="primary" 
                                                sx={{ 
                                                    mt: 0.5,
                                                    fontSize: '0.7rem',
                                                    height: 20
                                                }} 
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                fontFamily: 'monospace',
                                                fontWeight: '500',
                                                color: theme.palette.text.primary
                                            }}
                                        >
                                            {customer.phone}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {customer.email ? (
                                            <Typography 
                                                variant="body1"
                                                sx={{
                                                    color: theme.palette.primary.main,
                                                    fontWeight: '500'
                                                }}
                                            >
                                                {customer.email}
                                            </Typography>
                                        ) : (
                                            <Chip 
                                                label="Not Provided" 
                                                size="small" 
                                                variant="outlined"
                                                sx={{ 
                                                    color: 'text.secondary',
                                                    borderColor: 'text.secondary'
                                                }} 
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" fontWeight="500">
                                                {new Date(customer.createdAt).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(customer.createdAt).toLocaleTimeString()}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Footer Stats */}
            {customers.length > 0 && (
                <Box 
                    sx={{ 
                        mt: 3, 
                        display: 'flex', 
                        justifyContent: 'center',
                        gap: 2,
                        flexWrap: 'wrap'
                    }}
                >
                    <Chip 
                        icon={<People />}
                        label={`${customers.length} Customers Displayed`}
                        color="primary"
                        variant="outlined"
                    />
                    <Chip 
                        icon={<CalendarToday />}
                        label={`Latest: ${new Date(customers[0]?.createdAt).toLocaleDateString()}`}
                        color="secondary"
                        variant="outlined"
                    />
                </Box>
            )}
        </Container>
    );
}

export default CustomerList;