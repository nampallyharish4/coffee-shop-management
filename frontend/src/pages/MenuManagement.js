import React, { useState, useEffect } from 'react';
import {
  Button, Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select,
  MenuItem, FormControl, InputLabel, Switch, FormControlLabel
} from '@mui/material';
import Layout from '../components/Layout';
import { menuService, categoryService } from '../services/api';

const MenuManagement = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '', categoryId: '', price: '', description: '', imageUrl: '', active: true
  });

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
      // Ensure categoryId is a number
      const dataToSend = {
        ...formData,
        categoryId: formData.categoryId ? Number(formData.categoryId) : null,
        price: formData.price ? Number(formData.price) : null
      };
      
      if (editItem) {
        await menuService.update(editItem.id, dataToSend);
      } else {
        await menuService.create(dataToSend);
      }
      setOpen(false);
      loadData();
      resetForm();
    } catch (error) {
      console.error('Failed to save menu item:', error);
      alert(error.response?.data?.message || 'Failed to save menu item. Please check all fields and try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await menuService.delete(id);
        loadData();
      } catch (error) {
        console.error('Failed to delete menu item:', error);
        alert(error.response?.data?.message || 'Failed to delete menu item. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', categoryId: '', price: '', description: '', imageUrl: '', active: true });
    setEditItem(null);
  };

  const openDialog = (item = null) => {
    if (item) {
      setEditItem(item);
      setFormData(item);
    } else {
      resetForm();
    }
    setOpen(true);
  };

  return (
    <Layout title="Menu Management">
      <Button variant="contained" onClick={() => openDialog()} sx={{ mb: 2 }}>
        Add Menu Item
      </Button>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(item => (
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
                <TableCell>
                  <Button onClick={() => openDialog(item)}>Edit</Button>
                  <Button onClick={() => handleDelete(item.id)} color="error">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

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
    </Layout>
  );
};

export default MenuManagement;
