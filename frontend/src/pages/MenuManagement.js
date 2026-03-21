import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  Box,
  Autocomplete,
  IconButton,
  Typography,
  Grid,
  CircularProgress,
  Skeleton,
  Chip,
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import Layout from '../components/Layout';
import {
  menuService,
  categoryService,
  inventoryService,
} from '../services/api';
import { useAuth } from '../context/AuthContext';

const MenuManagement = () => {
  const { hasRole } = useAuth();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    description: '',
    imageUrl: '',
    active: true,
    ingredients: [],
  });
  const [newIngredient, setNewIngredient] = useState({
    inventoryItem: null,
    quantity: '',
  });
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    id: null,
  });
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);

  // Loading states
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const loadData = useCallback(async () => {
    setIsPageLoading(true);
    try {
      const [menuRes, catRes, invRes] = await Promise.all([
        menuService.getAll(),
        categoryService.getAll(),
        inventoryService.getAll(),
      ]);
      setItems(menuRes.data.data || []);
      setCategories(catRes.data.data || []);
      setInventoryItems(invRes.data.data || []);
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || 'Failed to load data. Please refresh.',
        'error'
      );
    } finally {
      setIsPageLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async () => {
    if (!formData.name || !formData.categoryId || !formData.price) {
      showSnackbar(
        'Please fill in all required fields (Name, Category, Price)',
        'error'
      );
      return;
    }

    const dataToSend = {
      ...formData,
      categoryId: Number(formData.categoryId),
      price: Number(formData.price),
    };

    const isDuplicate = items.some(
      (item) =>
        item.name.toLowerCase() === dataToSend.name.toLowerCase() &&
        item.id !== (editItem ? editItem.id : null)
    );

    if (isDuplicate) {
      setDuplicateDialogOpen(true);
      return;
    }

    setIsSaving(true);
    try {
      if (editItem) {
        await menuService.update(editItem.id, dataToSend);
        showSnackbar('Menu item updated successfully!', 'success');
      } else {
        await menuService.create(dataToSend);
        showSnackbar('Menu item created successfully!', 'success');
      }
      setOpen(false);
      loadData();
      resetForm();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.data ||
        'Failed to save menu item. Please check all fields and try again.';
      showSnackbar(errorMessage, 'error');
    } finally {
      setIsSaving(false);
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
      await menuService.delete(id);
      showSnackbar('Menu item deleted successfully!', 'success');
      loadData();
    } catch (error) {
      showSnackbar(
        error.response?.data?.message ||
          'Failed to delete menu item. Please try again.',
        'error'
      );
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      categoryId: '',
      price: '',
      description: '',
      imageUrl: '',
      active: true,
      ingredients: [],
    });
    setNewIngredient({ inventoryItem: null, quantity: '' });
    setEditItem(null);
  };

  const openDialog = (item = null) => {
    if (item) {
      setEditItem(item);
      setFormData({
        name: item.name || '',
        categoryId: item.categoryId || item.category?.id || '',
        price: item.price || '',
        description: item.description || '',
        imageUrl: item.imageUrl || '',
        active: item.active !== undefined ? item.active : true,
        ingredients: item.ingredients
          ? item.ingredients.map((ing) => ({
              inventoryItemId: ing.inventoryItemId,
              inventoryItemName: ing.inventoryItemName,
              quantityRequired: ing.quantityRequired,
              unit: ing.unit,
            }))
          : [],
      });
    } else {
      resetForm();
    }
    setOpen(true);
  };

  const handleAddIngredient = () => {
    const { inventoryItem, quantity } = newIngredient;
    if ((!inventoryItem && !newIngredient.inputValue) || !quantity) return;

    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) return;

    let ingredientToAdd = {};

    if (
      typeof inventoryItem === 'string' ||
      (inventoryItem && !inventoryItem.id)
    ) {
      const name =
        typeof inventoryItem === 'string'
          ? inventoryItem
          : newIngredient.inputValue;
      ingredientToAdd = {
        inventoryItemId: null,
        inventoryItemName: name,
        quantityRequired: qty,
        unit: 'unit',
      };
    } else if (inventoryItem && inventoryItem.id) {
      ingredientToAdd = {
        inventoryItemId: inventoryItem.id,
        inventoryItemName: inventoryItem.name,
        quantityRequired: qty,
        unit: inventoryItem.unit,
      };
    } else {
      ingredientToAdd = {
        inventoryItemId: null,
        inventoryItemName: newIngredient.inputValue,
        quantityRequired: qty,
        unit: 'unit',
      };
    }

    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, ingredientToAdd],
    });
    setNewIngredient({ inventoryItem: null, quantity: '' });
  };

  const handleRemoveIngredient = (index) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients.splice(index, 1);
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  const displayedItems = items.filter(
    (item) =>
      selectedCategory === 'ALL' ||
      item.categoryId === selectedCategory ||
      item.category?.id === selectedCategory
  );

  return (
    <Layout title="Menu Management">
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
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

      <Box
        sx={{
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
        }}
      >
        {hasRole('ROLE_ADMIN') ? (
          <Button
            variant="contained"
            onClick={() => openDialog()}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Add Menu Item
          </Button>
        ) : (
          <Box />
        )}

        <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }} size="small">
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Filter by Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="ALL">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
          borderRadius: '12px',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
        }}
      >
        <Box sx={{ overflowX: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 80 }}>Image</TableCell>
                <TableCell sx={{ minWidth: 150 }}>Name</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Category</TableCell>
                <TableCell sx={{ minWidth: 100 }}>Price</TableCell>
                <TableCell sx={{ minWidth: 80 }}>Active</TableCell>
                {hasRole('ROLE_ADMIN') && (
                  <TableCell sx={{ minWidth: 150 }}>Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {isPageLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: hasRole('ROLE_ADMIN') ? 6 : 5 }).map((__, j) => (
                      <TableCell key={j}><Skeleton variant={j === 0 ? 'rectangular' : 'text'} height={j === 0 ? 60 : undefined} width={j === 0 ? 60 : undefined} /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : displayedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={hasRole('ROLE_ADMIN') ? 6 : 5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No menu items found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                displayedItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <Box sx={{ width: 60, height: 60, bgcolor: 'grey.100', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="caption" color="text.disabled">No img</Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.categoryName}</TableCell>
                    <TableCell>₹{Number(item.price).toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.active ? 'Active' : 'Inactive'}
                        color={item.active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    {hasRole('ROLE_ADMIN') && (
                      <TableCell>
                        <Button
                          onClick={() => openDialog(item)}
                          disabled={isDeleting === item.id}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(item.id)}
                          color="error"
                          disabled={isDeleting === item.id}
                          startIcon={isDeleting === item.id ? <CircularProgress size={14} /> : null}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmation.open}
        onClose={() => setDeleteConfirmation({ open: false, id: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this menu item?</Typography>
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

      {/* Add/Edit Dialog (Admin only) */}
      {hasRole('ROLE_ADMIN') && (
        <Dialog
          open={open}
          onClose={() => { if (!isSaving) setOpen(false); }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>{editItem ? 'Edit' : 'Add'} Menu Item</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              disabled={isSaving}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category *</InputLabel>
              <Select
                value={formData.categoryId}
                label="Category *"
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                disabled={isSaving}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Price *"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              margin="normal"
              disabled={isSaving}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              margin="normal"
              disabled={isSaving}
            />
            <TextField
              fullWidth
              label="Image URL"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              margin="normal"
              disabled={isSaving}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                  disabled={isSaving}
                />
              }
              label="Active"
            />

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Ingredients
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={7}>
                  <Autocomplete
                    freeSolo
                    options={inventoryItems}
                    getOptionLabel={(option) =>
                      typeof option === 'string' ? option : option.name
                    }
                    value={newIngredient.inventoryItem}
                    onChange={(event, newValue) => {
                      setNewIngredient({
                        ...newIngredient,
                        inventoryItem: newValue,
                      });
                    }}
                    onInputChange={(event, newInputValue) => {
                      setNewIngredient({
                        ...newIngredient,
                        inputValue: newInputValue,
                      });
                    }}
                    disabled={isSaving}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select or Type Ingredient"
                        size="small"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Qty"
                    type="number"
                    size="small"
                    value={newIngredient.quantity}
                    onChange={(e) =>
                      setNewIngredient({
                        ...newIngredient,
                        quantity: e.target.value,
                      })
                    }
                    disabled={isSaving}
                    InputProps={{
                      endAdornment: newIngredient.inventoryItem?.unit ? (
                        <Typography
                          variant="caption"
                          sx={{ ml: 1, whiteSpace: 'nowrap' }}
                        >
                          {newIngredient.inventoryItem.unit}
                        </Typography>
                      ) : null,
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    onClick={handleAddIngredient}
                    fullWidth
                    sx={{ height: '100%' }}
                    disabled={isSaving}
                  >
                    <Add />
                  </Button>
                </Grid>
              </Grid>

              {formData.ingredients.length > 0 && (
                <Paper
                  variant="outlined"
                  sx={{ maxHeight: 150, overflow: 'auto' }}
                >
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
                          <TableCell align="right">
                            {ing.quantityRequired}
                          </TableCell>
                          <TableCell align="center">
                            {ing.unit || 'unit'}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveIngredient(idx)}
                              disabled={isSaving}
                            >
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
            <Button onClick={() => setOpen(false)} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" disabled={isSaving}>
              {isSaving ? (
                <><CircularProgress size={18} sx={{ mr: 1, color: 'inherit' }} />Saving…</>
              ) : (
                'Save'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Duplicate Item Dialog */}
      <Dialog
        open={duplicateDialogOpen}
        onClose={() => setDuplicateDialogOpen(false)}
      >
        <DialogTitle
          sx={{
            color: 'warning.main',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>⚠️</span> Duplicate Item
        </DialogTitle>
        <DialogContent>
          <p>
            A menu item with the name <strong>"{formData.name}"</strong> already
            exists.
          </p>
          <p>Please use a different name or edit the existing item.</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDuplicateDialogOpen(false)}
            variant="contained"
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default MenuManagement;
