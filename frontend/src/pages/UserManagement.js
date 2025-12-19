import React, { useState, useEffect } from 'react';
import {
  Button, Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, Chip, OutlinedInput, Box
} from '@mui/material';
import Layout from '../components/Layout';
import { userService } from '../services/api';

const ROLES = ['ROLE_ADMIN', 'ROLE_CASHIER', 'ROLE_BARISTA', 'ROLE_INVENTORY_MANAGER'];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', roles: [], active: true
  });



  const loadUsers = async () => {
    const response = await userService.getAll();
    setUsers(response.data.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSave = async () => {
    try {
      // Ensure roles is an array
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
      } else {
        await userService.create(dataToSend);
      }
      setOpen(false);
      loadUsers();
      resetForm();
    } catch (error) {
      console.error('Failed to save user:', error);
      alert(error.response?.data?.message || 'Failed to save user. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.delete(id);
        loadUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert(error.response?.data?.message || 'Failed to delete user. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', roles: [], active: true });
    setEditUser(null);
  };

  const openDialog = (user = null) => {
    if (user) {
      setEditUser(user);
      // Ensure roles is an array (backend returns Set which becomes array in JSON)
      const rolesArray = Array.isArray(user.roles) ? user.roles : (user.roles ? [user.roles] : []);
      setFormData({ ...user, roles: rolesArray, password: '' });
    } else {
      resetForm();
    }
    setOpen(true);
  };

  return (
    <Layout title="User Management">
      <Button variant="contained" onClick={() => openDialog()} sx={{ mb: 2, width: { xs: '100%', sm: 'auto' } }}>
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
            {users.map(user => (
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
                  <Button onClick={() => openDialog(user)} size="small">Edit</Button>
                  <Button onClick={() => handleDelete(user.id)} color="error" size="small">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editUser ? 'Edit' : 'Add'} User</DialogTitle>
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
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label={editUser ? "Password (leave blank to keep current)" : "Password"}
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Roles</InputLabel>
            <Select
              multiple
              value={formData.roles}
              onChange={(e) => setFormData({ ...formData, roles: e.target.value })}
              input={<OutlinedInput label="Roles" />}
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
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default UserManagement;
