// frontend/src/EditItemModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, Button, Box, Typography, CircularProgress, Stack,
    Tabs, Tab, Divider, IconButton, FormControl, InputLabel, Select, MenuItem, Paper, Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

// --- MODAL COMPONENT ---
function EditItemModal({ open, item, onClose, onUpdateSuccess, showSnackbar }) {
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- Item Fields ---
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    // --- Modifiers ---
    const [modifierGroups, setModifierGroups] = useState([]);

    useEffect(() => {
        if (item) {
            setName(item.name || '');
            setPrice(item.price || '');
            setCategory(item.category || '');
            setImageUrl(item.imageUrl || '');
            setModifierGroups(item.modifiers || []);
            setError(null);
            setActiveTab(0);
        }
    }, [item]);

    // --- IMAGE UPLOAD HANDLER ---
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            setUploading(true);
            const token = localStorage.getItem('admin-token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };

            const res = await axios.post(`${API_BASE_URL}/api/menu/upload`, formData, config);
            setImageUrl(res.data.imageUrl); // from backend response
            showSnackbar('Image uploaded successfully!', 'success');
        } catch (err) {
            console.error('Image upload failed:', err);
            showSnackbar('Image upload failed. Try again.', 'error');
        } finally {
            setUploading(false);
        }
    };

    // --- SAVE HANDLER ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const updatedItem = {
            name,
            price: parseFloat(price),
            category,
            imageUrl,
            modifiers: modifierGroups
        };

        const token = localStorage.getItem('admin-token');
        const config = { headers: { 'Authorization': `Bearer ${token}` } };

        try {
            await axios.patch(`${API_BASE_URL}/api/menu/update/${item._id}`, updatedItem, config);
            showSnackbar(`Item "${name}" updated successfully!`, 'success');
            onUpdateSuccess();
            onClose();
        } catch (err) {
            console.error("Error updating item:", err);
            setError('Failed to update item.');
            showSnackbar('Error updating item.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // --- MODIFIER HANDLERS ---
    const handleAddGroup = () => {
        setModifierGroups([
            ...modifierGroups,
            {
                groupName: 'New Option Group',
                selectionType: 'single',
                options: [{ name: 'Option 1', price: 0 }]
            }
        ]);
    };

    const handleUpdateGroup = (groupIndex, field, value) => {
        const newGroups = [...modifierGroups];
        newGroups[groupIndex][field] = value;
        setModifierGroups(newGroups);
    };

    const handleRemoveGroup = (groupIndex) => {
        setModifierGroups(modifierGroups.filter((_, i) => i !== groupIndex));
    };

    const handleAddOption = (groupIndex) => {
        const newGroups = [...modifierGroups];
        newGroups[groupIndex].options.push({ name: 'New Option', price: 0 });
        setModifierGroups(newGroups);
    };

    const handleUpdateOption = (groupIndex, optionIndex, field, value) => {
        const newGroups = [...modifierGroups];
        const updatedValue = field === 'price' ? (parseFloat(value) || 0) : value;
        newGroups[groupIndex].options[optionIndex][field] = updatedValue;
        setModifierGroups(newGroups);
    };

    const handleRemoveOption = (groupIndex, optionIndex) => {
        const newGroups = [...modifierGroups];
        newGroups[groupIndex].options = newGroups[groupIndex].options.filter((_, i) => i !== optionIndex);
        setModifierGroups(newGroups);
    };

    // --- TABS ---
    const renderGeneralTab = () => (
        <Stack spacing={2}>
            {error && <Typography color="error.main" textAlign="center">{error}</Typography>}
            <TextField label="Name" fullWidth required value={name} onChange={(e) => setName(e.target.value)} disabled={loading}/>
            <TextField label="Price" type="number" fullWidth required value={price} onChange={(e) => setPrice(e.target.value)} disabled={loading}/>
            <TextField label="Category" fullWidth required value={category} onChange={(e) => setCategory(e.target.value)} disabled={loading}/>
            
            {/* Upload Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    disabled={uploading || loading}
                >
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </Button>

                <Typography variant="body2" color="text.secondary">
                    or use an existing URL:
                </Typography>

                <TextField
                    placeholder="Image URL (Optional)"
                    size="small"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    sx={{ flexGrow: 1 }}
                    disabled={loading}
                />
            </Box>

            {imageUrl && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <img
                        src={imageUrl}
                        alt={name}
                        style={{ width: '120px', height: '120px', borderRadius: '6px', objectFit: 'cover' }}
                    />
                </Box>
            )}
        </Stack>
    );

    const renderModifiersTab = () => (
        <Stack spacing={4}>
            <Button onClick={handleAddGroup} startIcon={<AddIcon />} variant="contained" color="primary">
                Add New Modifier Group
            </Button>
            {modifierGroups.length === 0 && (
                <Typography variant="body1" color="text.secondary" textAlign="center">
                    No modifiers defined for this item.
                </Typography>
            )}
            {modifierGroups.map((group, groupIndex) => (
                <Paper key={groupIndex} sx={{ p: 3, borderLeft: '5px solid', borderColor: 'primary.main' }}>
                    <Stack spacing={2}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">Group: {group.groupName}</Typography>
                            <IconButton color="error" onClick={() => handleRemoveGroup(groupIndex)} disabled={loading}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    label="Group Name"
                                    fullWidth
                                    required
                                    value={group.groupName}
                                    onChange={(e) => handleUpdateGroup(groupIndex, 'groupName', e.target.value)}
                                    disabled={loading}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth required disabled={loading}>
                                    <InputLabel>Select Type</InputLabel>
                                    <Select
                                        value={group.selectionType}
                                        label="Select Type"
                                        onChange={(e) => handleUpdateGroup(groupIndex, 'selectionType', e.target.value)}
                                    >
                                        <MenuItem value="single">Single (Radio)</MenuItem>
                                        <MenuItem value="multiple">Multiple (Checkbox)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle1" fontWeight="bold">Options:</Typography>
                        {group.options.map((option, optionIndex) => (
                            <Box key={optionIndex} display="flex" alignItems="center">
                                <TextField
                                    label="Option Name"
                                    size="small"
                                    value={option.name}
                                    onChange={(e) => handleUpdateOption(groupIndex, optionIndex, 'name', e.target.value)}
                                    sx={{ flexGrow: 1, mr: 1 }}
                                    disabled={loading}
                                />
                                <TextField
                                    label="Price (₹)"
                                    type="number"
                                    size="small"
                                    value={option.price}
                                    onChange={(e) => handleUpdateOption(groupIndex, optionIndex, 'price', e.target.value)}
                                    sx={{ width: 100, mr: 1 }}
                                    disabled={loading}
                                />
                                <IconButton color="error" onClick={() => handleRemoveOption(groupIndex, optionIndex)} disabled={loading}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}

                        <Button
                            onClick={() => handleAddOption(groupIndex)}
                            startIcon={<AddIcon />}
                            size="small"
                            variant="outlined"
                            sx={{ mt: 1, width: 'fit-content' }}
                            disabled={loading}
                        >
                            Add Option
                        </Button>
                    </Stack>
                </Paper>
            ))}
        </Stack>
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{`Edit: ${item?.name || 'Menu Item'}`}</DialogTitle>
            <Box component="form" onSubmit={handleSubmit}>
                <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab label="General Details" />
                    <Tab label="Customization Modifiers" />
                </Tabs>

                <DialogContent dividers sx={{ minHeight: 400 }}>
                    {activeTab === 0 && renderGeneralTab()}
                    {activeTab === 1 && renderModifiersTab()}
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

export default EditItemModal;
