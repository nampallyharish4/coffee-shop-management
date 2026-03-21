import React, { useState, useEffect, useCallback } from 'react';
import {
  Button, Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, Tabs, Tab, Box,
  Snackbar, Alert, InputAdornment, Stack, CircularProgress, Typography, Skeleton
} from '@mui/material';
import { Print, Search } from '@mui/icons-material';
import Layout from '../components/Layout';
import { inventoryService } from '../services/api';

const InventoryManagement = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [addStockOpen, setAddStockOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [stockItem, setStockItem] = useState(null);
  const [stockAmount, setStockAmount] = useState('');
  const [resetUsageOpen, setResetUsageOpen] = useState(false);
  const [resetUsageText, setResetUsageText] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '', unit: '', currentStock: '', reorderLevel: ''
  });
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ open: false, id: null });
  const [usageHistory, setUsageHistory] = useState([]);

  // Loading states
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isUsageLoading, setIsUsageLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingStock, setIsAddingStock] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [isResettingUsage, setIsResettingUsage] = useState(false);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const loadData = useCallback(async () => {
    setIsPageLoading(true);
    try {
      const response = await inventoryService.getAll();
      setItems(response.data.data || []);
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Failed to load inventory. Please refresh.', 'error');
    } finally {
      setIsPageLoading(false);
    }
  }, []);

  const loadUsageHistory = useCallback(async () => {
    setIsUsageLoading(true);
    try {
      const response = await inventoryService.getUsageHistory();
      const rawHistory = response.data.data || [];

      const aggregatedHistory = Object.values(rawHistory.reduce((acc, log) => {
        const key = `${log.orderId}-${log.inventoryItemName}`;
        if (!acc[key]) {
          acc[key] = { ...log, quantityUsed: 0, totalCost: 0 };
        }
        acc[key].quantityUsed += Number(log.quantityUsed);
        acc[key].totalCost += Number(log.totalCost || 0);
        return acc;
      }, {}));

      aggregatedHistory.sort((a, b) => new Date(b.usedAt) - new Date(a.usedAt));
      setUsageHistory(aggregatedHistory);
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Failed to load usage history.', 'error');
    } finally {
      setIsUsageLoading(false);
    }
  }, []);

  const handleResetUsageHistory = async () => {
    if (resetUsageText !== 'RESET USAGE') {
      showSnackbar('Please type "RESET USAGE" to confirm.', 'error');
      return;
    }

    setIsResettingUsage(true);
    try {
      await inventoryService.resetUsageHistory();
      setResetUsageOpen(false);
      setResetUsageText('');
      loadUsageHistory();
      showSnackbar('Usage history has been reset successfully!', 'success');
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Failed to reset usage history.', 'error');
    } finally {
      setIsResettingUsage(false);
    }
  };

  const filterItems = useCallback(() => {
    let result = items;
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(item => item.name.toLowerCase().includes(lowerQuery));
    }
    setFilteredItems(result);
  }, [items, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    filterItems();
  }, [filterItems]);

  useEffect(() => {
    if (tab === 1) {
      loadUsageHistory();
    }
  }, [tab, loadUsageHistory]);

  const handlePrintRestockReport = () => {
    const lowStockItems = items.filter(item => item.lowStock || item.outOfStock);

    if (lowStockItems.length === 0) {
      showSnackbar('No items currently in low stock or out of stock.', 'info');
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
      showSnackbar('Please allow popups to view the report.', 'warning');
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.unit.trim()) {
      showSnackbar('Name and Unit are required fields.', 'error');
      return;
    }

    // Check for duplicate name (case-insensitive)
    const isDuplicate = items.some(item =>
      item.name.toLowerCase() === formData.name.trim().toLowerCase() &&
      item.id !== (editItem ? editItem.id : null)
    );

    if (isDuplicate) {
      setDuplicateDialogOpen(true);
      return;
    }

    setIsSaving(true);
    try {
      const dataToSend = {
        ...formData,
        currentStock: formData.currentStock ? Number(formData.currentStock) : 0,
        reorderLevel: formData.reorderLevel ? Number(formData.reorderLevel) : 0,
        unitPrice: formData.unitPrice ? Number(formData.unitPrice) : 0
      };

      if (editItem) {
        await inventoryService.update(editItem.id, dataToSend);
        showSnackbar('Inventory item updated successfully!', 'success');
      } else {
        await inventoryService.create(dataToSend);
        showSnackbar('Inventory item created successfully!', 'success');
      }
      setOpen(false);
      loadData();
      resetForm();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Failed to save inventory item. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddStock = async () => {
    const amount = parseFloat(stockAmount);
    if (isNaN(amount) || amount <= 0) {
      showSnackbar('Please enter a valid positive number.', 'error');
      return;
    }

    setIsAddingStock(true);
    try {
      await inventoryService.addStock(stockItem.id, amount);
      setAddStockOpen(false);
      setStockAmount('');
      showSnackbar(`Stock added to ${stockItem.name} successfully!`, 'success');
      loadData();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Failed to add stock. Please try again.', 'error');
    } finally {
      setIsAddingStock(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmation({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    const { id } = deleteConfirmation;
    if (!id) return;

    setIsDeleting(id);
    setDeleteConfirmation({ open: false, id: null });
    try {
      await inventoryService.delete(id);
      showSnackbar('Inventory item deleted successfully!', 'success');
      loadData();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Failed to delete inventory item.', 'error');
    } finally {
      setIsDeleting(null);
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
    setStockAmount('');
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ mb: 2 }}
        alignItems={{ xs: 'stretch', md: 'center' }}
      >
        <TextField
          placeholder="Search items..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 1,
            flexGrow: 1,
            maxWidth: { md: '300px' },
            '& .MuiInputBase-input': { color: 'text.primary' },
            '& .MuiSvgIcon-root': { color: 'text.secondary' }
          }}
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ ml: { md: 'auto' } }}>
          <Button variant="contained" onClick={() => openDialog()} fullWidth={tab === 0}>
            Add Item
          </Button>
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={handlePrintRestockReport}
            color="secondary"
          >
            Restock Report
          </Button>
          {tab === 1 && (
            <Button
              variant="contained"
              color="error"
              onClick={() => setResetUsageOpen(true)}
            >
              Reset History
            </Button>
          )}
        </Stack>
      </Stack>

      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="All Items" />
        <Tab label="Usage History" />
      </Tabs>

      {tab === 1 ? (
        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '12px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 150 }}>Date &amp; Time</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>Item Name</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>Source</TableCell>
                  <TableCell sx={{ minWidth: 120 }}>Quantity Deducted</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isUsageLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 4 }).map((__, j) => (
                        <TableCell key={j}><Skeleton variant="text" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : usageHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No usage history found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  usageHistory.map((log, idx) => (
                    <TableRow key={`${log.orderId}-${log.inventoryItemName}-${idx}`}>
                      <TableCell>{new Date(log.usedAt).toLocaleString()}</TableCell>
                      <TableCell>{log.inventoryItemName}</TableCell>
                      <TableCell>Order #{log.orderId}</TableCell>
                      <TableCell sx={{ color: 'error.main', fontWeight: 'bold' }}>
                        {formatUsage(log.quantityUsed, items.find(i => i.name === log.inventoryItemName)?.unit)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '12px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 150 }}>Name</TableCell>
                  <TableCell sx={{ minWidth: 120 }}>Current Stock</TableCell>
                  <TableCell sx={{ minWidth: 80 }}>Unit</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>Unit Price</TableCell>
                  <TableCell sx={{ minWidth: 120 }}>Reorder Level</TableCell>
                  <TableCell sx={{ minWidth: 120 }}>Status</TableCell>
                  <TableCell sx={{ minWidth: 250 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isPageLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((__, j) => (
                        <TableCell key={j}><Skeleton variant="text" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        {searchQuery ? 'No items match your search.' : 'No inventory items found.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.currentStock}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>₹{Number(item.unitPrice || 0).toFixed(2)}</TableCell>
                      <TableCell>{item.reorderLevel}</TableCell>
                      <TableCell>
                        {item.outOfStock && <Chip label="Out of Stock" color="error" size="small" />}
                        {item.lowStock && !item.outOfStock && <Chip label="Low Stock" color="warning" size="small" />}
                        {!item.lowStock && !item.outOfStock && <Chip label="OK" color="success" size="small" />}
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => openAddStock(item)} size="small" disabled={isDeleting === item.id}>Add Stock</Button>
                        <Button onClick={() => openDialog(item)} size="small" disabled={isDeleting === item.id}>Edit</Button>
                        <Button
                          onClick={() => handleDeleteClick(item.id)}
                          size="small"
                          color="error"
                          disabled={isDeleting === item.id}
                          startIcon={isDeleting === item.id ? <CircularProgress size={14} /> : null}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => { if (!isSaving) setOpen(false); }} maxWidth="sm" fullWidth>
        <DialogTitle>{editItem ? 'Edit' : 'Add'} Inventory Item</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth label="Name *" value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal" disabled={isSaving}
          />
          <TextField
            fullWidth label="Unit (ml, g, pcs) *" value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            margin="normal" disabled={isSaving}
          />
          <TextField
            fullWidth label="Current Stock" type="number" value={formData.currentStock}
            onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
            margin="normal" disabled={isSaving}
          />
          <TextField
            fullWidth label="Reorder Level" type="number" value={formData.reorderLevel}
            onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
            margin="normal" disabled={isSaving}
          />
          <TextField
            fullWidth label="Unit Price (Per Unit)" type="number" value={formData.unitPrice || ''}
            onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
            margin="normal" disabled={isSaving}
            InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={isSaving}>
            {isSaving ? <><CircularProgress size={18} sx={{ mr: 1, color: 'inherit' }} />Saving…</> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Stock Dialog */}
      <Dialog open={addStockOpen} onClose={() => { if (!isAddingStock) { setAddStockOpen(false); setStockAmount(''); } }}>
        <DialogTitle>Add Stock to {stockItem?.name}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth label="Quantity to Add" type="number" value={stockAmount}
            onChange={(e) => setStockAmount(e.target.value)}
            margin="normal" disabled={isAddingStock}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setAddStockOpen(false); setStockAmount(''); }} disabled={isAddingStock}>Cancel</Button>
          <Button onClick={handleAddStock} variant="contained" disabled={isAddingStock}>
            {isAddingStock ? <><CircularProgress size={18} sx={{ mr: 1, color: 'inherit' }} />Adding…</> : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Duplicate Dialog */}
      <Dialog open={duplicateDialogOpen} onClose={() => setDuplicateDialogOpen(false)}>
        <DialogTitle sx={{ color: 'warning.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <span style={{ fontSize: '1.5rem' }}>⚠️</span> Duplicate Item
        </DialogTitle>
        <DialogContent>
          <p>An item with the name <strong>"{formData.name}"</strong> already exists in the inventory.</p>
          <p>Please use a different name or edit the existing item.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDuplicateDialogOpen(false)} variant="contained" color="primary">OK</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteConfirmation.open} onClose={() => setDeleteConfirmation({ open: false, id: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this inventory item? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmation({ open: false, id: null })}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Reset Usage History Dialog */}
      <Dialog open={resetUsageOpen} onClose={() => { if (!isResettingUsage) setResetUsageOpen(false); }}>
        <DialogTitle>Reset Usage History</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography sx={{ mb: 2 }}>This will permanently delete all usage history records. This action cannot be undone.</Typography>
            <TextField
              fullWidth label="Type 'RESET USAGE' to confirm"
              value={resetUsageText}
              onChange={(e) => setResetUsageText(e.target.value)}
              margin="normal"
              color="error"
              disabled={isResettingUsage}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetUsageOpen(false)} disabled={isResettingUsage}>Cancel</Button>
          <Button
            onClick={handleResetUsageHistory}
            variant="contained"
            color="error"
            disabled={resetUsageText !== 'RESET USAGE' || isResettingUsage}
          >
            {isResettingUsage ? <><CircularProgress size={18} sx={{ mr: 1, color: 'inherit' }} />Resetting…</> : 'Reset History'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default InventoryManagement;
