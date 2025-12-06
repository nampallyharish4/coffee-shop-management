import React, { useState, useEffect } from 'react';
import {
  Button, Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select,
  MenuItem, FormControl, InputLabel, Switch, FormControlLabel, Snackbar, Alert, Box
} from '@mui/material';
import Layout from '../components/Layout';
import { menuService, categoryService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MenuManagement = () => {
  const { hasRole } = useAuth();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '', categoryId: '', price: '', description: '', imageUrl: '', active: true
  });
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [menuRes, catRes] = await Promise.all([
      menuService.getAll(),
      categoryService.getAll()
    ]);
    setItems(menuRes.data.data);
    setCategories(catRes.data.data);
  };

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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
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
      }
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const resetForm = () => {
    setFormData({ name: '', categoryId: '', price: '', description: '', imageUrl: '', active: true });
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
        active: item.active !== undefined ? item.active : true
      });
    } else {
      resetForm();
    }
    setOpen(true);
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
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                    <Button onClick={() => handleDelete(item.id)} color="error">Delete</Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

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