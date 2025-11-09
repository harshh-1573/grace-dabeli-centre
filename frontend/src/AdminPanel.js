// In frontend/src/AdminPanel.js (PREMIUM ENHANCED VERSION)

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { io } from "socket.io-client";
import { motion, AnimatePresence } from 'framer-motion';

// --- CRITICAL IMPORTS ---
import EditItemModal from './EditItemModal'; 
import { useTheme, alpha } from '@mui/material/styles';
import Badge from '@mui/material/Badge'; 

// --- MUI Imports ---
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  Tabs, 
  Tab, 
  CircularProgress,
  Chip,
  Tooltip,
  IconButton,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material';

// --- Component Imports ---
import { OrderWall } from './components/admin/OrderWall';
import { MenuAdmin } from './components/admin/MenuAdmin';
import { CustomerList } from './components/admin/CustomerList';
import { AnalyticsDashboard } from './components/admin/AnalyticsDashboard';
import { CateringRequests } from './components/admin/CateringRequests';
import { CustomerOrdersModal } from './components/admin/CustomerOrdersModal';

// --- Icons ---
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import EventIcon from '@mui/icons-material/Event';
import RefreshIcon from '@mui/icons-material/Refresh';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ScheduleIcon from '@mui/icons-material/Schedule';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

// Notification sound
const audio = new Audio('/ping.mp3');

// Define API Base URL once
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

function AdminPanel({ showSnackbar }) {
  // --- All of your state declarations remain exactly the same ---
  const [menuItems, setMenuItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]); 
  const [stats, setStats] = useState(null); 
  const [statsLoading, setStatsLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [quickFilter, setQuickFilter] = useState('All');
  const [menuSearchTerm, setMenuSearchTerm] = useState('');
  const [menuFilterCategory, setMenuFilterCategory] = useState('All');
  const [menuFilterStock, setMenuFilterStock] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null); 
  const [activeTab, setActiveTab] = useState(0); 
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingCustomerOrders, setLoadingCustomerOrders] = useState(false);
  const [cateringRequests, setCateringRequests] = useState([]);
  const [loadingCatering, setLoadingCatering] = useState(false);
  const theme = useTheme(); 
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [newCateringCount, setNewCateringCount] = useState(0);
  const [isLive, setIsLive] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Animation variants
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      x: -50,
      transition: { duration: 0.3 }
    }
  };

  const heroVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const tabsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, delay: 0.2 }
    }
  };

  // Enhanced data fetching
  const fetchAllData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchMenuItems(),
        fetchOrders(),
        fetchCustomers(),
        fetchAnalytics(),
        fetchCateringRequests()
      ]);
      setLastRefresh(new Date());
      showSnackbar('🔄 All data refreshed successfully!', 'success');
    } catch (error) {
      showSnackbar('❌ Error refreshing data', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  const uniqueCategories = useMemo(() => {
    const categories = menuItems.map(item => item.category);
    return ['All', ...new Set(categories.filter(cat => cat))]; 
  }, [menuItems]);

  const getAdminAuthHeader = () => {
    const token = localStorage.getItem('admin-token');
    if (!token) { console.error("Admin token not found. Cannot perform action."); return null; }
    return { headers: { 'Authorization': `Bearer ${token}` } };
  };

  // --- All of your data fetching logic ---
  const fetchMenuItems = () => {
    const config = getAdminAuthHeader();
    if (!config) return; 
    axios.get(`${API_BASE_URL}/api/menu/all`, config) 
      .then((res) => setMenuItems(res.data))
      .catch((err) => {
        console.error("Error fetching menu for admin:", err);
        showSnackbar(err.response?.data?.Error || err.response?.data || "Failed to fetch menu items", "error");
      });
  };

  const fetchOrders = () => {
    const config = getAdminAuthHeader();
    if (!config) return; 
    const params = {};
    if (quickFilter === 'All' && filterStatus !== 'All') { params.status = filterStatus; }
    if (searchTerm && searchTerm.length >= 2) { params.search = searchTerm; }
    if (quickFilter === 'Last10') { params.limit = 10; } 
    else if (quickFilter === 'Last24') { params.quickFilter = '24hrs'; }
    
    axios.get(`${API_BASE_URL}/api/orders/`, { params, ...config }) 
      .then((res) => setOrders(res.data))
      .catch((err) => { 
        console.log("Error fetching orders:", err.response?.data || err.message); 
        showSnackbar(err.response?.data?.Error || err.response?.data || "Failed to fetch orders", "error");
      });
  };

  const fetchCustomers = () => {
    const config = getAdminAuthHeader();
    if (!config) return showSnackbar("Auth error fetching customers", "error");
    axios.get(`${API_BASE_URL}/api/customers/all`, config)
      .then((res) => {
        setCustomers(res.data.customers);
      })
      .catch((err) => {
        console.error("Error fetching customers:", err);
        showSnackbar(err.response?.data?.msg || "Failed to fetch customers", "error");
      });
  };

  const fetchAnalytics = async () => {
    setStatsLoading(true);
    const config = getAdminAuthHeader();
    if (!config) return showSnackbar("Auth error fetching stats", "error");
    const params = {};
    if (startDate) params.startDate = startDate.toISOString().split('T')[0];
    if (endDate) params.endDate = endDate.toISOString().split('T')[0];
    try {
      const res = await axios.get(`${API_BASE_URL}/api/analytics/`, { ...config, params });
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
      showSnackbar(err.response?.data || "Failed to fetch stats", "error");
    } finally {
      setStatsLoading(false);
    }
  };
  
  const fetchCustomerOrders = (customerId) => {
    setLoadingCustomerOrders(true);
    const config = getAdminAuthHeader();
    if (!config) {
      setLoadingCustomerOrders(false);
      return;
    }
    
    axios.get(`${API_BASE_URL}/api/orders/bycustomer/${customerId}`, config)
      .then(res => {
        setCustomerOrders(res.data);
      })
      .catch(err => {
        console.error("Error fetching customer orders:", err);
        showSnackbar("Failed to load customer's orders.", "error");
      })
      .finally(() => {
        setLoadingCustomerOrders(false);
      });
  };

  const fetchCateringRequests = async () => {
    setLoadingCatering(true);
    const config = getAdminAuthHeader();
    if (!config) return showSnackbar("Auth error fetching catering requests", "error");

    try {
        const res = await axios.get(`${API_BASE_URL}/api/catering/all`, config);
        setCateringRequests(res.data);
    } catch (err) {
        console.error("Error fetching catering requests:", err);
        showSnackbar(err.response?.data || "Failed to fetch catering requests.", "error");
    } finally {
        setLoadingCatering(false);
    }
  };

  // Enhanced Socket.IO
  useEffect(() => {
    const socket = io(API_BASE_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    
    socket.on('new_order', (newOrder) => {
      audio.play().catch(e => console.log("Audio play failed:", e));
      
      if (quickFilter === 'All' && (filterStatus === 'All' || newOrder.status === filterStatus)) {
        setOrders((prevOrders) => [newOrder, ...prevOrders]);
      }
      
      setNewOrderCount(prev => prev + 1);
      showSnackbar(`🆕 New order from ${newOrder.customerName}`, 'info');
    });

    socket.on('new_catering_request', (newRequest) => {
      audio.play().catch(e => console.log("Audio play failed (Catering):", e));
      setCateringRequests((prevRequests) => [newRequest, ...prevRequests]);
      setNewCateringCount(prev => prev + 1);
      showSnackbar('🎉 NEW CATERING REQUEST RECEIVED!', 'warning');
    });

    socket.on("connect", () => {
      setIsLive(true);
      console.log("Socket.IO connected");
    });

    socket.on("disconnect", () => {
      setIsLive(false);
      console.log("Socket.IO disconnected");
    });

    socket.on("connect_error", (err) => { 
      setIsLive(false);
      console.error(`Socket.IO connection error: ${err.message}`); 
    });

    return () => { 
      socket.disconnect(); 
      setIsLive(false);
    };
  }, [filterStatus, quickFilter, showSnackbar]); 

  // Data fetching effects
  useEffect(() => { fetchMenuItems(); }, []); 
  useEffect(() => { fetchOrders(); }, [filterStatus, searchTerm, quickFilter]); 
  useEffect(() => {
    if (activeTab === 2) { fetchCustomers(); }
    if (activeTab === 3) { fetchAnalytics(); }
    if (activeTab === 4) { fetchCateringRequests(); }
  }, [activeTab]); 
  useEffect(() => {
    if (activeTab === 3) { fetchAnalytics(); }
  }, [startDate, endDate]);

  // Enhanced event handlers
  const handleTabChange = (e, newValue) => {
    if (newValue === 0) setNewOrderCount(0);
    if (newValue === 4) setNewCateringCount(0);
    setActiveTab(newValue);
  };
  
  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setIsCustomerModalOpen(true);
    fetchCustomerOrders(customer._id);
  };

  const handleEditClick = (item) => { setItemToEdit(item); setIsModalOpen(true); };
  
  const handleMenuSubmit = async (e) => { 
    e.preventDefault();
    
    const config = getAdminAuthHeader();
    if (!config) return showSnackbar("Authentication error. Please log in again.", 'error');

    let finalImageUrl = imageUrl;

    try {
      if (imageFile) {
        showSnackbar('Uploading image, please wait...', 'info');
        
        const fileData = new FormData();
        fileData.append('image', imageFile);

        const uploadRes = await axios.post(
          `${API_BASE_URL}/api/menu/upload-image`, 
          fileData, 
          {
            headers: {
              ...config.headers,
              'Content-Type': 'multipart/form-data',
            }
          }
        );

        finalImageUrl = uploadRes.data.imageUrl;
      }

      const newItemData = {
        name: name,
        price: Number(price),
        category: category,
        imageUrl: finalImageUrl,
      };

      await axios.post(
        `${API_BASE_URL}/api/menu/add`, 
        newItemData, 
        config
      );

      showSnackbar(`✅ Item "${name}" added successfully!`, 'success');
      setName(''); 
      setPrice(''); 
      setCategory('');
      setImageFile(null);
      setImageUrl('');
      fetchMenuItems(); 

    } catch (err) {
      console.error("Error adding menu item:", err);
      showSnackbar(`❌ Error: ${err.response?.data?.Error || err.response?.data || 'Failed to add item'}`, 'error');
    }
  };
  
  const handleUpdateOrderStatus = (orderId, newStatus) => { 
    const apiEndpoint = `${API_BASE_URL}/api/orders/update/${orderId}`; 
    const config = getAdminAuthHeader();
    if (!config) return showSnackbar("Authentication error. Please log in again.", 'error');
    axios.patch(apiEndpoint, { status: newStatus }, config)
      .then((res) => {
        setOrders(prevOrders => prevOrders.map(order => order._id === orderId ? { ...order, status: newStatus } : order ));
        showSnackbar('🔄 Status updated!', 'success');
      })
      .catch((err) => {
         showSnackbar(`❌ Error updating status: ${err.response?.data || 'Failed to update'}`, 'error');
      });
  };

  const handleUpdateCateringStatus = (id, newStatus) => {
    const config = getAdminAuthHeader();
    if (!config) return;

    axios
      .patch(`${API_BASE_URL}/api/catering/update-status/${id}`, { status: newStatus }, config)
      .then((res) => {
        setCateringRequests((prev) =>
          prev.map((req) => (req._id === id ? res.data : req))
        );
        showSnackbar(`🔄 Request ${id.slice(-4)} status updated to ${newStatus}`, 'success');
      })
      .catch((err) => {
        showSnackbar(
          `❌ Error updating status: ${err.response?.data || 'Failed to update'}`,
          'error'
        );
      });
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const config = getAdminAuthHeader();
      if (!config) return showSnackbar("Authentication error. Please log in again.", 'error');
      axios.delete(`${API_BASE_URL}/api/menu/${itemId}`, config)
        .then((res) => { 
           fetchMenuItems(); 
           showSnackbar('🗑️ Item deleted successfully!', 'info');
        })
        .catch((err) => {
           showSnackbar(`❌ Error deleting item: ${err.response?.data?.Error || err.response?.data || 'Failed to delete'}`, 'error');
        });
    }
  };
  
  const handleToggleFeatured = (item) => { 
    const newFeaturedStatus = !item.isFeatured;
    const apiEndpoint = `${API_BASE_URL}/api/menu/update/${item._id}`;
    const config = getAdminAuthHeader();
    if (!config) return showSnackbar("Authentication error. Please log in again.", 'error');
    
    axios.patch(apiEndpoint, { isFeatured: newFeaturedStatus }, config)
      .then((res) => { 
         fetchMenuItems(); 
         showSnackbar(`⭐ "${item.name}" ${newFeaturedStatus ? 'is now featured!' : 'is no longer featured.'}`, 'info');
      })
      .catch((err) => {
         showSnackbar(`❌ Error updating featured status: ${err.response?.data?.Error || 'Failed to update'}`, 'error');
      });
  };
  
  const handleToggleStock = (item) => { 
    const newInStockStatus = !item.inStock;
    const apiEndpoint = `${API_BASE_URL}/api/menu/update/${item._id}`;
    const config = getAdminAuthHeader();
    if (!config) return showSnackbar("Authentication error. Please log in again.", 'error');
    axios.patch(apiEndpoint, { inStock: newInStockStatus }, config)
      .then((res) => { 
         fetchMenuItems(); 
         showSnackbar(`📦 Stock updated to ${newInStockStatus ? 'In Stock' : 'Sold Out'}`, 'info');
      })
      .catch((err) => {
         showSnackbar(`❌ Error updating stock: ${err.response?.data?.Error || err.response?.data || 'Failed to update'}`, 'error');
      });
  };

  // Quick actions
  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    showSnackbar('📊 Exporting data...', 'info');
  };

  const handleRefresh = () => {
    fetchAllData();
  };

  // Enhanced tab styling
  const getTabStyle = (tabIndex) => ({
    minWidth: { xs: 100, sm: 120, md: 140 },
    px: { xs: 2, sm: 3 },
    py: 1.5,
    fontWeight: 'bold',
    borderRadius: 2,
    transition: 'all 0.3s ease',
    background: activeTab === tabIndex 
      ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`
      : 'transparent',
    '&:hover': {
      background: alpha(theme.palette.primary.main, 0.05),
      transform: 'translateY(-2px)',
    }
  });

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4, position: 'relative' }}>
      
      {/* --- ENHANCED HERO SECTION --- */}
      <motion.div
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <Box sx={{ 
          textAlign: 'center', 
          mb: 4, 
          py: { xs: 4, md: 6 }, 
          px: { xs: 2, md: 4 },
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${alpha(theme.palette.secondary.main, 0.8)} 100%)`,
          color: '#000',
          borderRadius: 4, 
          boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.3)}`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }
        }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
              textShadow: '3px 3px 6px rgba(0,0,0,0.1)',
              position: 'relative',
              zIndex: 1,
            }}
          >
            🚀 Admin Dashboard
          </Typography>
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{
              color: '#1a1a1a',
              fontSize: { xs: '1.1rem', sm: '1.4rem', md: '1.6rem' },
              fontWeight: 400,
              mt: 1.5,
              position: 'relative',
              zIndex: 1,
              opacity: 0.9,
            }}
          >
            Real-time management for Grace Dabeli Centre
          </Typography>
          
          {/* Live Status Indicator */}
          <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}>
            <Tooltip title={isLive ? "Real-time updates active" : "Connection lost"}>
              <Chip
                icon={<FiberManualRecordIcon sx={{ 
                  fontSize: 12,
                  animation: isLive ? 'pulse 2s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.3 },
                    '100%': { opacity: 1 }
                  }
                }} />}
                label={isLive ? "LIVE" : "OFFLINE"}
                color={isLive ? "success" : "error"}
                variant="filled"
                sx={{ 
                  fontWeight: 'bold',
                  background: isLive 
                    ? `linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)`
                    : `linear-gradient(135deg, #f44336 0%, #c62828 100%)`,
                  color: 'white',
                }}
              />
            </Tooltip>
          </Box>
        </Box>
      </motion.div>

      {/* --- ENHANCED TAB CONTROL --- */}
      <motion.div
        variants={tabsVariants}
        initial="hidden"
        animate="visible"
      >
        <Paper 
          elevation={4} 
          sx={{ 
            mb: 4, 
            p: { xs: 1, sm: 2 }, 
            position: 'sticky', 
            top: 80, 
            zIndex: 1000, 
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              indicatorColor="primary"
              textColor="primary"
              sx={{
                flex: 1,
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                }
              }}
            >
              <Tab 
                icon={<ShoppingCartIcon />}
                iconPosition="start"
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Order Wall
                    <Badge 
                      badgeContent={newOrderCount} 
                      color="error" 
                      sx={{ 
                        '& .MuiBadge-badge': {
                          animation: newOrderCount > 0 ? 'bounce 1s infinite' : 'none',
                          '@keyframes bounce': {
                            '0%, 100%': { transform: 'scale(1)' },
                            '50%': { transform: 'scale(1.2)' }
                          }
                        }
                      }}
                    />
                  </Box>
                } 
                sx={getTabStyle(0)}
              />
              <Tab 
                icon={<RestaurantMenuIcon />} 
                iconPosition="start"
                label="Menu Management" 
                sx={getTabStyle(1)}
              />
              <Tab 
                icon={<PeopleIcon />} 
                iconPosition="start"
                label="Customers" 
                sx={getTabStyle(2)}
              />
              <Tab 
                icon={<BarChartIcon />} 
                iconPosition="start"
                label="Analytics" 
                sx={getTabStyle(3)}
              />
              <Tab 
                icon={<EventIcon />} 
                iconPosition="start"
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Catering
                    <Badge 
                      badgeContent={newCateringCount} 
                      color="warning"
                      sx={{ 
                        '& .MuiBadge-badge': {
                          animation: newCateringCount > 0 ? 'pulse 2s infinite' : 'none',
                        }
                      }}
                    />
                  </Box>
                } 
                sx={getTabStyle(4)}
              />
            </Tabs>

            {/* Quick Actions */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Tooltip title="Refresh All Data">
                <IconButton 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  sx={{
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.1)} 100%)`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.info.main, 0.2)} 100%)`,
                      transform: 'rotate(180deg)',
                      transition: 'all 0.6s ease',
                    }
                  }}
                >
                  <RefreshIcon 
                    sx={{ 
                      animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                      '@keyframes spin': { '100%': { transform: 'rotate(360deg)' } }
                    }} 
                  />
                </IconButton>
              </Tooltip>
              <Chip
                icon={<ScheduleIcon />}
                label={`Updated: ${lastRefresh.toLocaleTimeString()}`}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
          </Box>
        </Paper>
      </motion.div>
      
      {/* --- ANIMATED TAB CONTENT --- */}
      <Box sx={{ minHeight: '600px', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ width: '100%' }}
          >
            {activeTab === 0 && (
              <OrderWall
                orders={orders}
                quickFilter={quickFilter}
                setQuickFilter={setQuickFilter}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleUpdateOrderStatus={handleUpdateOrderStatus}
                loading={isRefreshing}
              />
            )}
            {activeTab === 1 && (
              <MenuAdmin
                menuItems={menuItems}
                handleMenuSubmit={handleMenuSubmit}
                name={name} setName={setName}
                price={price} setPrice={setPrice}
                category={category} setCategory={setCategory}
                imageUrl={imageUrl} setImageUrl={setImageUrl}
                menuSearchTerm={menuSearchTerm} setMenuSearchTerm={setMenuSearchTerm}
                menuFilterCategory={menuFilterCategory} setMenuFilterCategory={setMenuFilterCategory}
                uniqueCategories={uniqueCategories}
                menuFilterStock={menuFilterStock} setMenuFilterStock={setMenuFilterStock}
                handleToggleStock={handleToggleStock}
                handleToggleFeatured={handleToggleFeatured}
                handleEditClick={handleEditClick}
                handleDeleteItem={handleDeleteItem}
              />
            )}
            {activeTab === 2 && (
              <CustomerList
                customers={customers}
                handleCustomerClick={handleCustomerClick}
              />
            )}
            {activeTab === 3 && (
              <AnalyticsDashboard
                stats={stats}
                statsLoading={statsLoading}
                startDate={startDate} setStartDate={setStartDate}
                endDate={endDate} setEndDate={setEndDate}
              />
            )}
            {activeTab === 4 && (
              <CateringRequests
                cateringRequests={cateringRequests}
                loadingCatering={loadingCatering}
                handleUpdateCateringStatus={handleUpdateCateringStatus}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </Box>
      
      {/* --- ENHANCED FLOATING ACTIONS --- */}
      <SpeedDial
        ariaLabel="Admin actions"
        sx={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24,
          '& .MuiSpeedDial-fab': {
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
              transform: 'scale(1.1)',
            }
          }
        }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<RefreshIcon />}
          tooltipTitle="Refresh All"
          onClick={handleRefresh}
          tooltipOpen
        />
        <SpeedDialAction
          icon={<PrintIcon />}
          tooltipTitle="Print Reports"
          onClick={handlePrint}
          tooltipOpen
        />
        <SpeedDialAction
          icon={<DownloadIcon />}
          tooltipTitle="Export Data"
          onClick={handleExport}
          tooltipOpen
        />
      </SpeedDial>

      {/* --- MODALS --- */}
      {isModalOpen && itemToEdit && (
        <EditItemModal 
          open={isModalOpen}
          item={itemToEdit}
          onClose={() => setIsModalOpen(false)}
          onUpdateSuccess={fetchMenuItems}
          showSnackbar={showSnackbar}
        />
      )}
      <CustomerOrdersModal
        open={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        customer={selectedCustomer}
        orders={customerOrders}
        loading={loadingCustomerOrders}
      />
    </Container>
  );
}

export default AdminPanel;