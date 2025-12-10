import React, { useState, useEffect } from 'react';
import {
  Button, Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select,
  MenuItem, FormControl, InputLabel, Switch, FormControlLabel, Snackbar, Alert, Box,
  Autocomplete, IconButton, Typography, Grid
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import Layout from '../components/Layout';
import { menuService, categoryService, inventoryService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MenuManagement = () => {
  const { hasRole } = useAuth();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '', categoryId: '', price: '', description: '', imageUrl: '', active: true, ingredients: []
  });
  // State for new ingredient input in dialog
  const [newIngredient, setNewIngredient] = useState({ inventoryItem: null, quantity: '' });
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [deleteConfirmation, setDeleteConfirmation] = useState({ open: false, id: null });



  const loadData = async () => {
    const [menuRes, catRes, invRes] = await Promise.all([
      menuService.getAll(),
      categoryService.getAll(),
      inventoryService.getAll()
    ]);
    setItems(menuRes.data.data);
    setCategories(catRes.data.data);
    setInventoryItems(invRes.data.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.name || !formData.categoryId || !formData.price) {
        setSnackbar({
          open: true,
          message: 'Please fill in all required fields (Name, Category, Price)',
          severity: 'error'
        });
        return;
      }

      // Ensure categoryId and price are numbers
      const dataToSend = {
        ...formData,
        categoryId: Number(formData.categoryId),
        price: Number(formData.price)
      };
      
      if (editItem) {
        await menuService.update(editItem.id, dataToSend);
        setSnackbar({
          open: true,
          message: 'Menu item updated successfully!',
          severity: 'success'
        });
      } else {
        await menuService.create(dataToSend);
        setSnackbar({
          open: true,
          message: 'Menu item created successfully!',
          severity: 'success'
        });
      }
      setOpen(false);
      loadData();
      resetForm();
    } catch (error) {
      console.error('Failed to save menu item:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.data || 
                          'Failed to save menu item. Please check all fields and try again.';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmation({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    const { id } = deleteConfirmation;
    if (!id) return;

    try {
      await menuService.delete(id);
      setSnackbar({
        open: true,
        message: 'Menu item deleted successfully!',
        severity: 'success'
      });
      loadData();
    } catch (error) {
      console.error('Failed to delete menu item:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to delete menu item. Please try again.',
        severity: 'error'
      });
    } finally {
      setDeleteConfirmation({ open: false, id: null });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const resetForm = () => {
    setFormData({ name: '', categoryId: '', price: '', description: '', imageUrl: '', active: true, ingredients: [] });
    setNewIngredient({ inventoryItem: null, quantity: '' });
    setEditItem(null);
  };

  const openDialog = (item = null) => {
    if (item) {
      setEditItem(item);
      // Properly map the item data to form format
      setFormData({
        name: item.name || '',
        categoryId: item.categoryId || item.category?.id || '',
        price: item.price || '',
        description: item.description || '',
        imageUrl: item.imageUrl || '',
        active: item.active !== undefined ? item.active : true,
        ingredients: item.ingredients ? item.ingredients.map(ing => ({
          inventoryItemId: ing.inventoryItemId,
          inventoryItemName: ing.inventoryItemName,
          quantityRequired: ing.quantityRequired,
          unit: ing.unit
        })) : []
      });
    } else {
      resetForm();
    }
    setOpen(true);
  };

  const handleAddIngredient = () => {
    const { inventoryItem, quantity } = newIngredient;
    // Allow adding if we have a selected item OR a typed name (string)
    if ((!inventoryItem && !newIngredient.inputValue) || !quantity) return;

    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) return;

    let ingredientToAdd = {};
    
    // Check if it's an existing item object or a new string
    if (typeof inventoryItem === 'string' || (inventoryItem && !inventoryItem.id)) {
        // It's a new item name typed in
        const name = typeof inventoryItem === 'string' ? inventoryItem : newIngredient.inputValue;
        ingredientToAdd = {
            inventoryItemId: null,
            inventoryItemName: name,
            quantityRequired: qty,
            unit: 'unit' // Default for new items created here
        };
    } else if (inventoryItem && inventoryItem.id) {
        // Existing item selected
        ingredientToAdd = {
            inventoryItemId: inventoryItem.id,
            inventoryItemName: inventoryItem.name,
            quantityRequired: qty,
            unit: inventoryItem.unit // Use existing unit from inventory
        };
    } else {
        // Fallback for typed value if inventoryItem is null but inputValue exists (Autocomplete behavior)
         ingredientToAdd = {
            inventoryItemId: null,
            inventoryItemName: newIngredient.inputValue,
            quantityRequired: qty,
            unit: 'unit'
        };
    }

    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, ingredientToAdd]
    });
    setNewIngredient({ inventoryItem: null, quantity: '' });
  };

  const handleRemoveIngredient = (index) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients.splice(index, 1);
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  return (
    <Layout title="Menu Management">
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Only show Add Menu Item button to admins */}
      {hasRole('ROLE_ADMIN') && (
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button variant="contained" onClick={() => openDialog()}>
            Add Menu Item
          </Button>
          
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Filter by Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Filter by Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="ALL">All Categories</MenuItem>
              {categories.map(cat => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Show filter for non-admins */}
      {!hasRole('ROLE_ADMIN') && (
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Filter by Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Filter by Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="ALL">All Categories</MenuItem>
              {categories.map(cat => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
      
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Active</TableCell>
              {/* Only show Actions column to admins */}
              {hasRole('ROLE_ADMIN') && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {items
              .filter(item => selectedCategory === 'ALL' || item.categoryId === selectedCategory || item.category?.id === selectedCategory)
              .map(item => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.categoryName}</TableCell>
                <TableCell>₹{item.price}</TableCell>
                <TableCell>{item.active ? 'Yes' : 'No'}</TableCell>
                {/* Only show Edit/Delete buttons to admins */}
                {hasRole('ROLE_ADMIN') && (
                  <TableCell>
                    <Button onClick={() => openDialog(item)}>Edit</Button>
                    <Button onClick={() => handleDeleteClick(item.id)} color="error">Delete</Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog
        open={deleteConfirmation.open}
        onClose={() => setDeleteConfirmation({ open: false, id: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this menu item?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmation({ open: false, id: null })}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Only show dialog to admins */}
      {hasRole('ROLE_ADMIN') && (
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editItem ? 'Edit' : 'Add'} Menu Item</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                {categories.map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Image URL"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              margin="normal"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
              }
              label="Active"
            />
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Ingredients</Typography>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={7}>
                  <Autocomplete
                    freeSolo
                    options={inventoryItems}
                    getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                    value={newIngredient.inventoryItem}
                    onChange={(event, newValue) => {
                      setNewIngredient({ 
                          ...newIngredient, 
                          inventoryItem: newValue
                      });
                    }}
                    onInputChange={(event, newInputValue) => {
                      setNewIngredient({ ...newIngredient, inputValue: newInputValue });
                    }}
                    renderInput={(params) => <TextField {...params} label="Select or Type Ingredient" size="small" />}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Qty"
                    type="number"
                    size="small"
                    value={newIngredient.quantity}
                    onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
                    // Show unit as suffix if item selected
                     InputProps={{
                      endAdornment: newIngredient.inventoryItem?.unit ? (
                        <Typography variant="caption" sx={{ ml: 1, whiteSpace: 'nowrap' }}>
                          {newIngredient.inventoryItem.unit}
                        </Typography>
                      ) : null
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                   <Button 
                    variant="contained" 
                    onClick={handleAddIngredient}
                    fullWidth 
                    sx={{ height: '100%' }}
                   >
                     <Add />
                   </Button>
                </Grid>
              </Grid>

              {formData.ingredients.length > 0 && (
                <Paper variant="outlined" sx={{ maxHeight: 150, overflow: 'auto' }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Ingredient</TableCell>
                        <TableCell align="right">Qty</TableCell>
                        <TableCell align="center">Unit</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                        {formData.ingredients.map((ing, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{ing.inventoryItemName}</TableCell>
                                <TableCell align="right">{ing.quantityRequired}</TableCell>
                                <TableCell align="center">{ing.unit || 'unit'}</TableCell>
                                <TableCell align="center">
                                    <IconButton size="small" color="error" onClick={() => handleRemoveIngredient(idx)}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Paper>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      )}
    </Layout>
  );
};

export default MenuManagement;