import React, { useState, useEffect } from 'react';
import {
  Button, Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, Tabs, Tab, Box
} from '@mui/material';
import Layout from '../components/Layout';
import { inventoryService } from '../services/api';

const InventoryManagement = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [addStockOpen, setAddStockOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [stockItem, setStockItem] = useState(null);
  const [stockAmount, setStockAmount] = useState('');
  const [formData, setFormData] = useState({
    name: '', unit: '', currentStock: '', reorderLevel: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterItems();
  }, [tab, items]);

  const loadData = async () => {
    const response = await inventoryService.getAll();
    setItems(response.data.data);
  };

  const filterItems = () => {
    if (tab === 1) {
      setFilteredItems(items.filter(i => i.lowStock));
    } else if (tab === 2) {
      setFilteredItems(items.filter(i => i.outOfStock));
    } else {
      setFilteredItems(items);
    }
  };

  const handleSave = async () => {
    try {
      // Ensure numeric values are properly converted
      const dataToSend = {
        ...formData,
        currentStock: formData.currentStock ? Number(formData.currentStock) : 0,
        reorderLevel: formData.reorderLevel ? Number(formData.reorderLevel) : 0
      };
      
      if (editItem) {
        await inventoryService.update(editItem.id, dataToSend);
      } else {
        await inventoryService.create(dataToSend);
      }
      setOpen(false);
      loadData();
      resetForm();
    } catch (error) {
      console.error('Failed to save inventory item:', error);
      alert(error.response?.data?.message || 'Failed to save inventory item. Please check all fields and try again.');
    }
  };

  const handleAddStock = async () => {
    try {
      const amount = parseFloat(stockAmount);
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid positive number');
        return;
      }
      await inventoryService.addStock(stockItem.id, amount);
      setAddStockOpen(false);
      setStockAmount('');
      loadData();
    } catch (error) {
      console.error('Failed to add stock:', error);
      alert(error.response?.data?.message || 'Failed to add stock. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', unit: '', currentStock: '', reorderLevel: '' });
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

  const openAddStock = (item) => {
    setStockItem(item);
    setAddStockOpen(true);
  };

  return (
    <Layout title="Inventory Management">
      <Button variant="contained" onClick={() => openDialog()} sx={{ mb: 2 }}>
        Add Inventory Item
      </Button>

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="All Items" />
        <Tab label="Low Stock" />
        <Tab label="Out of Stock" />
      </Tabs>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Current Stock</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Reorder Level</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.currentStock}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.reorderLevel}</TableCell>
                <TableCell>
                  {item.outOfStock && <Chip label="Out of Stock" color="error" size="small" />}
                  {item.lowStock && !item.outOfStock && <Chip label="Low Stock" color="warning" size="small" />}
                  {!item.lowStock && <Chip label="OK" color="success" size="small" />}
                </TableCell>
                <TableCell>
                  <Button onClick={() => openAddStock(item)} size="small">Add Stock</Button>
                  <Button onClick={() => openDialog(item)} size="small">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editItem ? 'Edit' : 'Add'} Inventory Item</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Unit (ml, g, pcs)"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Current Stock"
            type="number"
            value={formData.currentStock}
            onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Reorder Level"
            type="number"
            value={formData.reorderLevel}
            onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addStockOpen} onClose={() => setAddStockOpen(false)}>
        <DialogTitle>Add Stock to {stockItem?.name}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Quantity to Add"
            type="number"
            value={stockAmount}
            onChange={(e) => setStockAmount(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddStockOpen(false)}>Cancel</Button>
          <Button onClick={handleAddStock} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default InventoryManagement;
