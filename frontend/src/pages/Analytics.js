import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid, Paper, Typography, Select, MenuItem, FormControl, InputLabel, Box,
  Table, TableBody, TableCell, TableHead, TableRow, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Alert, Stack, Skeleton, CircularProgress
} from '@mui/material';
import { Payments, ReceiptLong, QueryStats } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';
import { analyticsService, orderService } from '../services/api';

const Analytics = () => {
  const [range, setRange] = useState('daily');
  const [salesSummary, setSalesSummary] = useState(null);
  const [topItems, setTopItems] = useState([]);
  const [staffPerformance, setStaffPerformance] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('RESET_REVENUE');
  const [confirmText, setConfirmText] = useState('');
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [isLoading, setIsLoading] = useState(false);
  const [isActing, setIsActing] = useState(false);

  const loadAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      const [sales, items, staff] = await Promise.all([
        analyticsService.getSales(range),
        analyticsService.getTopItems(range),
        analyticsService.getStaffPerformance(range)
      ]);
      setSalesSummary(sales.data.data || { totalRevenue: 0, orderCount: 0, averageOrderValue: 0 });
      setTopItems(items.data.data || []);
      setStaffPerformance(staff.data.data || []);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      setSalesSummary({ totalRevenue: 0, orderCount: 0, averageOrderValue: 0 });
      setTopItems([]);
      setStaffPerformance([]);
      setAlert({ open: true, message: 'Failed to load analytics data. Please try again.', severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [range]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const handleAction = async () => {
    const requiredText = dialogType === 'RESET_REVENUE' ? 'RESET REVENUE' : 'DELETE EVERYTHING';
    if (confirmText !== requiredText) {
      setAlert({
        open: true,
        message: `Please type "${requiredText}" to confirm`,
        severity: 'error'
      });
      return;
    }

    setIsActing(true);
    try {
      if (dialogType === 'RESET_REVENUE') {
        await orderService.resetRevenue();
      } else {
        await orderService.deleteAll();
      }

      setOpenDialog(false);
      setConfirmText('');
      setAlert({ open: true, message: 'Action performed successfully.', severity: 'success' });
      loadAnalytics();
    } catch (error) {
      setAlert({
        open: true,
        message: error.response?.data?.message || 'Failed to perform action',
        severity: 'error'
      });
    } finally {
      setIsActing(false);
    }
  };

  const openConfirmation = (type) => {
    setDialogType(type);
    setConfirmText('');
    setOpenDialog(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') return;
    setAlert({ ...alert, open: false });
  };

  return (
    <Layout title="Analytics & Reports">
      {alert.open && (
        <Alert
          severity={alert.severity}
          onClose={handleCloseAlert}
          sx={{ mb: 2 }}
        >
          {alert.message}
        </Alert>
      )}

      <Box sx={{
        mb: 3,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: 2
      }}>
        <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }} size="small">
          <InputLabel>Time Range</InputLabel>
          <Select value={range} label="Time Range" onChange={(e) => setRange(e.target.value)} disabled={isLoading}>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>
        <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button
            variant="contained"
            color="warning"
            onClick={() => openConfirmation('RESET_REVENUE')}
            fullWidth
            disabled={isLoading}
          >
            Reset Revenue
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => openConfirmation('CLEAR_HISTORY')}
            fullWidth
            disabled={isLoading}
          >
            Clear History
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'primary.light', color: 'primary.main', display: 'flex' }}>
                <Payments />
              </Box>
              <Typography variant="subtitle2" color="text.secondary" fontWeight="700">TOTAL REVENUE</Typography>
            </Stack>
            {isLoading
              ? <Skeleton variant="text" width={130} height={56} />
              : <Typography variant="h4" fontWeight="900">₹{salesSummary?.totalRevenue?.toLocaleString() || 0}</Typography>
            }
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'secondary.light', color: 'secondary.main', display: 'flex' }}>
                <ReceiptLong />
              </Box>
              <Typography variant="subtitle2" color="text.secondary" fontWeight="700">TOTAL ORDERS</Typography>
            </Stack>
            {isLoading
              ? <Skeleton variant="text" width={80} height={56} />
              : <Typography variant="h4" fontWeight="900">{salesSummary?.orderCount || 0}</Typography>
            }
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'success.light', color: 'success.main', display: 'flex' }}>
                <QueryStats />
              </Box>
              <Typography variant="subtitle2" color="text.secondary" fontWeight="700">AVG ORDER VALUE</Typography>
            </Stack>
            {isLoading
              ? <Skeleton variant="text" width={110} height={56} />
              : <Typography variant="h4" fontWeight="900">₹{salesSummary?.averageOrderValue?.toLocaleString() || 0}</Typography>
            }
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Top Selling Items</Typography>
            {isLoading ? (
              <Skeleton variant="rectangular" height={300} />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topItems}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="itemName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalQuantity" fill="#6F4E37" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Staff Performance</Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 150 }}>Staff Name</TableCell>
                    <TableCell align="right" sx={{ minWidth: 100 }}>Orders</TableCell>
                    <TableCell align="right" sx={{ minWidth: 120 }}>Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton variant="text" /></TableCell>
                        <TableCell><Skeleton variant="text" /></TableCell>
                        <TableCell><Skeleton variant="text" /></TableCell>
                      </TableRow>
                    ))
                  ) : staffPerformance.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Typography color="text.secondary" variant="body2">No data available.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    staffPerformance.map((staff, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{staff.userName}</TableCell>
                        <TableCell align="right">{staff.orderCount}</TableCell>
                        <TableCell align="right">₹{staff.totalRevenue || 0}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => { if (!isActing) setOpenDialog(false); }}>
        <DialogTitle>
          {dialogType === 'RESET_REVENUE' ? 'Reset Revenue' : 'Clear All History'}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            {dialogType === 'RESET_REVENUE'
              ? 'This action will cancel all completed orders and reset the revenue to zero. This cannot be undone.'
              : 'DANGER: This action will PERMANENTLY DELETE all order history and inventory usage logs. This data cannot be recovered.'
            }
          </Typography>
          <TextField
            fullWidth
            label={`Type '${dialogType === 'RESET_REVENUE' ? 'RESET REVENUE' : 'DELETE EVERYTHING'}' to confirm`}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            disabled={isActing}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={isActing}>Cancel</Button>
          <Button onClick={handleAction} variant="contained" color="error" disabled={isActing}>
            {isActing
              ? <><CircularProgress size={18} sx={{ mr: 1, color: 'inherit' }} />Processing…</>
              : (dialogType === 'RESET_REVENUE' ? 'Reset Revenue' : 'Delete Everything')
            }
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Analytics;