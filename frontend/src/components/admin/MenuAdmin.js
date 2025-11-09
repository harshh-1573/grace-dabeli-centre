// In src/components/admin/MenuAdmin.js

import React from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Grid, Card, CardContent, CardActions, Stack,
  Typography, Button, TextField, List, ListItem, ListItemText,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Box, IconButton, Switch, Avatar, Chip,
  InputLabel, Select, MenuItem, FormControl, Divider, Alert
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddIcon from '@mui/icons-material/Add';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import FilterListIcon from '@mui/icons-material/FilterList';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CategoryIcon from '@mui/icons-material/Category';

// Define your categories
const DISH_CATEGORIES = ['DABELI', 'VADAPAV'];
const FILTER_CATEGORIES = ['All', 'DABELI', 'VADAPAV'];

export function MenuAdmin(props) {
  const {
    menuItems,
    handleMenuSubmit,
    name, setName,
    price, setPrice,
    category, setCategory,
    imageFile, setImageFile,
    imageUrl, setImageUrl,
    menuSearchTerm, setMenuSearchTerm,
    menuFilterCategory, setMenuFilterCategory,
    menuFilterStock, setMenuFilterStock,
    handleToggleStock,
    handleToggleFeatured,
    handleEditClick,
    handleDeleteItem
  } = props;

  const theme = useTheme();

  // Filter logic
  const filteredMenuItems = menuItems.filter(item => {
    const nameMatch = item.name.toLowerCase().includes(menuSearchTerm.toLowerCase());
    const categoryMatch = menuFilterCategory === 'All' || item.category === menuFilterCategory;
    const stockMatch = menuFilterStock === 'All' 
      || (menuFilterStock === 'In Stock' && item.inStock)
      || (menuFilterStock === 'Out of Stock' && !item.inStock);
    return nameMatch && categoryMatch && stockMatch;
  });

  // Handler for file input change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImageUrl(''); // Clear the URL field if a file is chosen
    }
  };

  // Handler for URL text change
  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setImageFile(null); // Clear the file if a URL is typed
  };

  // Enhanced category chip
  const renderCategoryChip = (category) => {
    const categoryColors = {
      'DABELI': {
        background: 'linear-gradient(135deg, #F1C40F 0%, #E67E22 100%)',
        icon: '🍔'
      },
      'VADAPAV': {
        background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
        icon: '🍔'
      }
    };

    const config = categoryColors[category] || categoryColors['DABELI'];

    return (
      <Chip
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <span>{config.icon}</span>
            {category}
          </Box>
        }
        size="small"
        sx={{
          background: config.background,
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.7rem'
        }}
      />
    );
  };

  return (
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
          🍽️ Menu Management
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Manage Your Food Items and Categories
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            label={`Total Items: ${menuItems.length}`} 
            color="primary"
            sx={{ 
              fontWeight: 'bold',
              fontSize: '1rem',
              px: 2,
              py: 1.5
            }}
          />
          <Chip 
            label={`In Stock: ${menuItems.filter(item => item.inStock).length}`} 
            color="success"
            sx={{ 
              fontWeight: 'bold',
              fontSize: '1rem',
              px: 2,
              py: 1.5
            }}
          />
          <Chip 
            label={`Featured: ${menuItems.filter(item => item.isFeatured).length}`} 
            color="warning"
            sx={{ 
              fontWeight: 'bold',
              fontSize: '1rem',
              px: 2,
              py: 1.5
            }}
          />
        </Box>
      </Box>

      {/* Enhanced Add Item Form */}
      <Card 
        elevation={2}
        sx={{ 
          mb: 4, 
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <AddIcon color="primary" />
            <Typography variant="h5" fontWeight="bold" color="primary">
              Add New Menu Item
            </Typography>
          </Box>
          
          <Box component="form" onSubmit={handleMenuSubmit}>
            <Grid container spacing={3}>
              {/* Name & Price */}
              <Grid item xs={12} md={6}>
                <TextField 
                  label="Item Name" 
                  variant="outlined" 
                  size="medium" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  label="Price" 
                  type="number" 
                  variant="outlined" 
                  size="medium" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  required 
                  fullWidth
                  InputProps={{ 
                    startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>₹</Typography>,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Grid>

              {/* Category */}
              <Grid item xs={12} md={6}>
                <FormControl size="medium" fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    {DISH_CATEGORIES.map(cat => (
                      <MenuItem key={cat} value={cat}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {cat === 'DABELI' ? '🌶️' : '🍔'}
                          {cat}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Image Upload Section */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <UploadFileIcon color="primary" />
                  Item Image
                </Typography>
                
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={5}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<UploadFileIcon />}
                      fullWidth
                      sx={{ 
                        py: 1.5,
                        borderRadius: 2,
                        border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                        '&:hover': {
                          border: `2px dashed ${theme.palette.primary.main}`,
                          background: alpha(theme.palette.primary.main, 0.05)
                        }
                      }}
                    >
                      Upload Image
                      <input 
                        type="file" 
                        hidden 
                        accept="image/*" 
                        onChange={handleFileChange} 
                      />
                    </Button>
                  </Grid>

                  <Grid item xs={12} sm={2} sx={{ textAlign: 'center' }}>
                    <Typography color="text.secondary" sx={{ fontWeight: 'bold' }}>OR</Typography>
                  </Grid>

                  <Grid item xs={12} sm={5}>
                    <TextField
                      label="Paste Image URL"
                      variant="outlined"
                      size="medium"
                      value={imageUrl}
                      onChange={handleUrlChange}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                {/* File selection info */}
                {imageFile && (
                  <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
                    📁 File selected: <strong>{imageFile.name}</strong>
                  </Alert>
                )}
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  startIcon={<AddIcon />}
                  sx={{ 
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                    }
                  }}
                >
                  Add Menu Item
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Enhanced Filter Controls */}
      <Card 
        elevation={1}
        sx={{ 
          mb: 4, 
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <FilterListIcon color="primary" />
            <Typography variant="h5" fontWeight="bold" color="primary">
              Filter Menu Items
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Search by Name"
                variant="outlined"
                size="medium"
                fullWidth
                value={menuSearchTerm}
                onChange={(e) => setMenuSearchTerm(e.target.value)}
                InputProps={{ 
                  startAdornment: <SearchIcon color="primary" sx={{ mr: 1 }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl size="medium" fullWidth>
                <InputLabel sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CategoryIcon fontSize="small" />
                  Category
                </InputLabel>
                <Select
                  value={menuFilterCategory}
                  label="Category"
                  onChange={(e) => setMenuFilterCategory(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  {FILTER_CATEGORIES.map(cat => (
                    <MenuItem key={cat} value={cat}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {cat === 'DABELI' ? '🌶️' : cat === 'VADAPAV' ? '🍔' : '📂'}
                        {cat}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl size="medium" fullWidth>
                <InputLabel sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <InventoryIcon fontSize="small" />
                  Stock Status
                </InputLabel>
                <Select
                  value={menuFilterStock}
                  label="Stock Status"
                  onChange={(e) => setMenuFilterStock(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="All">📦 All Statuses</MenuItem>
                  <MenuItem value="In Stock">✅ In Stock Only</MenuItem>
                  <MenuItem value="Out of Stock">❌ Out of Stock Only</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Enhanced Menu Table */}
      <Card elevation={1} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <CardContent sx={{ p: 0 }}>
          {/* Table Header */}
          <Box sx={{ 
            p: 3, 
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <RestaurantMenuIcon color="primary" />
              <Typography variant="h5" fontWeight="bold" color="primary">
                Current Menu Items
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredMenuItems.length} of {menuItems.length} items
            </Typography>
          </Box>

          {/* Table */}
          <TableContainer>
            <Table sx={{ minWidth: 800 }} size="medium">
              <TableHead>
                <TableRow sx={{ 
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)` 
                }}>
                  <TableCell sx={{ width: 80, fontWeight: 'bold', fontSize: '1rem' }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Category</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Stock</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Featured</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {menuItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ p: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                          📝 No menu items found. Add your first item above!
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : filteredMenuItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ p: 4 }}>
                        <Alert severity="info" sx={{ borderRadius: 2 }}>
                          🔍 No menu items match your current filters.
                        </Alert>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMenuItems.map((item) => (
                      <motion.tr
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TableCell>
                          <Avatar 
                            variant="rounded" 
                            src={item.imageUrl || '/images/placeholder-food.jpg'} 
                            alt={item.name} 
                            sx={{ 
                              width: 60, 
                              height: 60,
                              border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
                            }} 
                            onError={(e) => { e.target.src = '/images/placeholder-food.jpg'; }} 
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" fontWeight="bold">
                            {item.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6" fontWeight="bold" color="primary">
                            ₹{item.price}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {renderCategoryChip(item.category)}
                        </TableCell>
                        <TableCell align="center">
                          <Switch 
                            checked={item.inStock} 
                            onChange={() => handleToggleStock(item)} 
                            size="medium"
                            color="success"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton 
                            color={item.isFeatured ? "warning" : "default"} 
                            onClick={() => handleToggleFeatured(item)}
                            sx={{ 
                              background: item.isFeatured ? alpha(theme.palette.warning.main, 0.1) : 'transparent',
                              '&:hover': {
                                background: item.isFeatured ? alpha(theme.palette.warning.main, 0.2) : alpha(theme.palette.action.hover, 0.05)
                              }
                            }}
                          >
                            <StarIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                          <Button
                            startIcon={<EditIcon />}
                            onClick={() => handleEditClick(item)}
                            sx={{ 
                              mr: 1,
                              borderRadius: 2,
                              fontWeight: 'bold'
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteItem(item._id)}
                            color="error"
                            sx={{ 
                              borderRadius: 2,
                              fontWeight: 'bold'
                            }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}