import React, { useState, useEffect, useCallback } from 'react';
import {
  Button, Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, Chip, OutlinedInput, Box,
  Snackbar, Alert, CircularProgress, Typography, Skeleton
} from '@mui/material';
import Layout from '../components/Layout';
import { userService } from '../services/api';

const ROLES = ['ROLE_ADMIN', 'ROLE_CASHIER', 'ROLE_BARISTA', 'ROLE_INVENTORY_MANAGER'];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null); // store ID being deleted
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', roles: [], active: true
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteConfirmation, setDeleteConfirmation] = useState({ open: false, id: null });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const loadUsers = useCallback(async () => {
    setIsPageLoading(true);
    try {
      const response = await userService.getAll();
      setUsers(response.data.data || []);
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Failed to load users. Please refresh the page.', 'error');
    } finally {
      setIsPageLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      showSnackbar('Name and Email are required fields.', 'error');
      return;
    }
    if (!editUser && !formData.password) {
      showSnackbar('Password is required when creating a new user.', 'error');
      return;
    }
    if (formData.roles.length === 0) {
      showSnackbar('Please assign at least one role.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const dataToSend = {
        ...formData,
        roles: Array.isArray(formData.roles) ? formData.roles : []
      };

      // Don't send password if it's empty during edit
      if (editUser && !dataToSend.password) {
        delete dataToSend.password;
      }

      if (editUser) {
        await userService.update(editUser.id, dataToSend);
        showSnackbar('User updated successfully!', 'success');
      } else {
        await userService.create(dataToSend);
        showSnackbar('User created successfully!', 'success');
      }
      setOpen(false);
      loadUsers();
      resetForm();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Failed to save user. Please try again.', 'error');
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
      await userService.delete(id);
      showSnackbar('User deleted successfully!', 'success');
      loadUsers();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Failed to delete user. Please try again.', 'error');
    } finally {
      setIsDeleting(null);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', roles: [], active: true });
    setEditUser(null);
  };

  const openDialog = (user = null) => {
    if (user) {
      setEditUser(user);
      const rolesArray = Array.isArray(user.roles) ? user.roles : (user.roles ? [user.roles] : []);
      setFormData({ ...user, roles: rolesArray, password: '' });
    } else {
      resetForm();
    }
    setOpen(true);
  };

  return (
    <Layout title="User Management">
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Button
        variant="contained"
        onClick={() => openDialog()}
        sx={{ mb: 2, width: { xs: '100%', sm: 'auto' } }}
      >
        Add User
      </Button>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '12px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <Box sx={{ overflowX: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 150 }}>Name</TableCell>
                <TableCell sx={{ minWidth: 200 }}>Email</TableCell>
                <TableCell sx={{ minWidth: 200 }}>Roles</TableCell>
                <TableCell sx={{ minWidth: 100 }}>Status</TableCell>
                <TableCell sx={{ minWidth: 150 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isPageLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <TableCell key={j}><Skeleton variant="text" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No users found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.roles.map(role => (
                        <Chip key={role} label={role.replace('ROLE_', '')} size="small" sx={{ mr: 0.5 }} />
                      ))}
                    </TableCell>
                    <TableCell>{user.active ? 'Active' : 'Inactive'}</TableCell>
                    <TableCell>
                      <Button onClick={() => openDialog(user)} size="small" disabled={isDeleting === user.id}>Edit</Button>
                      <Button
                        onClick={() => handleDeleteClick(user.id)}
                        color="error"
                        size="small"
                        disabled={isDeleting === user.id}
                        startIcon={isDeleting === user.id ? <CircularProgress size={14} /> : null}
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

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => { if (!isSaving) setOpen(false); }} maxWidth="sm" fullWidth>
        <DialogTitle>{editUser ? 'Edit' : 'Add'} User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
            disabled={isSaving}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
            required
            disabled={isSaving}
          />
          <TextField
            fullWidth
            label={editUser ? "Password (leave blank to keep current)" : "Password *"}
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="normal"
            disabled={isSaving}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Roles *</InputLabel>
            <Select
              multiple
              value={formData.roles}
              onChange={(e) => setFormData({ ...formData, roles: e.target.value })}
              input={<OutlinedInput label="Roles *" />}
              disabled={isSaving}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value.replace('ROLE_', '')} size="small" />
                  ))}
                </Box>
              )}
            >
              {ROLES.map((role) => (
                <MenuItem key={role} value={role}>
                  {role.replace('ROLE_', '')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={isSaving}>
            {isSaving ? <><CircularProgress size={18} sx={{ mr: 1, color: 'inherit' }} />Saving…</> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmation.open} onClose={() => setDeleteConfirmation({ open: false, id: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmation({ open: false, id: null })}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default UserManagement;
