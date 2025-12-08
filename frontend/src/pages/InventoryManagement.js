import React, { useState, useEffect } from 'react';
import {
  Button, Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, Tabs, Tab, Box
} from '@mui/material';
import { Print } from '@mui/icons-material';
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

  const [usageHistory, setUsageHistory] = useState([]);



  const loadData = async () => {
    try {
      const response = await inventoryService.getAll();
      setItems(response.data.data);
    } catch (error) {
      console.error("Failed to load inventory:", error);
    }
  };

  const loadUsageHistory = async () => {
     try {
       const response = await inventoryService.getUsageHistory();
       const rawHistory = response.data.data;

       // Aggregate history by Order ID and Inventory Item Name
       const aggregatedHistory = Object.values(rawHistory.reduce((acc, log) => {
         const key = `${log.orderId}-${log.inventoryItemName}`;
         if (!acc[key]) {
           acc[key] = { ...log, quantityUsed: 0, totalCost: 0 };
         }
         acc[key].quantityUsed += Number(log.quantityUsed);
         acc[key].totalCost += Number(log.totalCost || 0);
         // Keep the latest date if they differ, though they should be same for one order
         return acc;
       }, {}));

       // Sort by date descending
       aggregatedHistory.sort((a, b) => new Date(b.usedAt) - new Date(a.usedAt));

       setUsageHistory(aggregatedHistory);
     } catch (error) {
       console.error("Failed to load usage history:", error);
     }
  };

  const filterItems = React.useCallback(() => {
    setFilteredItems(items);
  }, [items]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterItems();
  }, [tab, items, filterItems]);

  useEffect(() => {
    if (tab === 1) {
      loadUsageHistory();
    }
  }, [tab]);

  const handlePrintRestockReport = () => {
    const lowStockItems = items.filter(item => item.lowStock || item.outOfStock);
    
    if (lowStockItems.length === 0) {
      alert('No items currently in low stock or out of stock.');
      return;
    }

    const reportContent = `
      <html>
        <head>
          <title>Restock Report - Coffee Shop</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            h1 { margin: 0; color: #2c3e50; }
            .meta { text-align: right; color: #666; font-size: 0.9rem; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: 600; color: #2c3e50; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .status-out { color: #d32f2f; font-weight: bold; background-color: #ffebee; padding: 4px 8px; border-radius: 4px; display: inline-block; }
            .status-low { color: #ed6c02; font-weight: bold; background-color: #fff3e0; padding: 4px 8px; border-radius: 4px; display: inline-block; }
            .footer { margin-top: 40px; text-align: center; color: #888; font-size: 0.8rem; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>Restock Requirement Report</h1>
              <p style="margin: 5px 0 0 0; color: #666;">Items requiring immediate attention</p>
            </div>
            <div class="meta">
              <p>Generated: ${new Date().toLocaleString()}</p>
              <p>Total Items: ${lowStockItems.length}</p>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Status</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
                <th>Recommended Add (to 2x Level)</th>
              </tr>
            </thead>
            <tbody>
              ${lowStockItems.map(item => {
                const status = item.outOfStock ? 'Out of Stock' : 'Low Stock';
                const statusClass = item.outOfStock ? 'status-out' : 'status-low';
                // Suggest topping up to 2x Reorder Level for safety buffer
                const recommendedAdd = Math.ceil((item.reorderLevel * 2) - item.currentStock);
                return `
                  <tr>
                    <td><strong>${item.name}</strong></td>
                    <td><span class="${statusClass}">${status}</span></td>
                    <td>${item.currentStock} ${item.unit}</td>
                    <td>${item.reorderLevel} ${item.unit}</td>
                    <td><strong>${recommendedAdd > 0 ? recommendedAdd : 0} ${item.unit}</strong></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div class="footer">
            Coffee Shop Management System | Internal Use Only
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(reportContent);
      printWindow.document.close();
    } else {
      alert('Please allow popups to view the report');
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

  const openAddStock = (item = null) => {
    setStockItem(item);
    setAddStockOpen(true);
  };

  const formatUsage = (qty, unit) => {
    const val = Number(qty);
    if (!unit) return `-${val.toFixed(2)}`;
    
    const u = unit.toLowerCase();
    if (u === 'liters') return `-${(val * 1000).toFixed(0)} ml`;
    if (u === 'kg') return `-${(val * 1000).toFixed(0)} grams`;
    if (u === 'pieces') return `-${val.toFixed(0)} ps`;
    
    return `-${val.toFixed(2)} ${unit}`;
  };

  return (
    <Layout title="Inventory Management">
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={() => openDialog()}>
          Add Inventory Item
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<Print />}
          onClick={handlePrintRestockReport}
          color="secondary"
        >
          Print Restock Report
        </Button>
      </Box>

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="All Items" />
        <Tab label="Usage History" />
      </Tabs>

      {tab === 1 ? (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date & Time</TableCell>
                <TableCell>Item Name</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Quantity Deducted</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {usageHistory.map(log => (
                <TableRow key={log.id}>
                  <TableCell>{new Date(log.usedAt).toLocaleString()}</TableCell>
                  <TableCell>{log.inventoryItemName}</TableCell>
                  <TableCell>Order #{log.orderId}</TableCell>
                  <TableCell sx={{ color: 'error.main', fontWeight: 'bold' }}>
                    {formatUsage(log.quantityUsed, items.find(i => i.name === log.inventoryItemName)?.unit)}
                  </TableCell>

                </TableRow>
              ))}
              {usageHistory.length === 0 && (
                 <TableRow>
                   <TableCell colSpan={4} align="center">No usage history found</TableCell>
                 </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      ) : (
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
      )}

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
