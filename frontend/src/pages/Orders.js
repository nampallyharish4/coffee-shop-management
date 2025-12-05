import React, { useState, useEffect } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip, Box,
  Typography, Tabs, Tab, IconButton, Collapse, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Snackbar, Alert
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, Receipt, Print, Cancel } from '@mui/icons-material';
import Layout from '../components/Layout';
import { orderService } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [tab, setTab] = useState(0);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [countdowns, setCountdowns] = useState({});
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterOrders();
  }, [tab, orders]);

  // Countdown timer effect - updates every second
  useEffect(() => {
    const timer = setInterval(() => {
      const newCountdowns = {};
      orders.forEach(order => {
        if (canCancelOrder(order)) {
          const timeRemaining = getTimeRemaining(order.createdAt);
          if (timeRemaining > 0) {
            newCountdowns[order.id] = timeRemaining;
          }
        }
      });
      setCountdowns(newCountdowns);
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, [orders]);

  const loadOrders = async () => {
    try {
      const response = await orderService.getAll();
      // Sort by created date, newest first
      const sortedOrders = response.data.data.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const filterOrders = () => {
    let filtered = [];
    switch (tab) {
      case 0: // All Orders
        filtered = orders;
        break;
      case 1: // Active Orders
        filtered = orders.filter(o => ['CREATED', 'IN_PREPARATION', 'READY'].includes(o.status));
        break;
      case 2: // Completed
        filtered = orders.filter(o => o.status === 'COMPLETED');
        break;
      case 3: // Cancelled
        filtered = orders.filter(o => o.status === 'CANCELLED');
        break;
      default:
        filtered = orders;
    }
    setFilteredOrders(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CREATED': return 'warning';
      case 'IN_PREPARATION': return 'info';
      case 'READY': return 'success';
      case 'COMPLETED': return 'default';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleExpandOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleViewReceipt = (order) => {
    setSelectedOrder(order);
    setReceiptOpen(true);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const canCancelOrder = (order) => {
    // Can cancel if order is CREATED or IN_PREPARATION and within 2 minutes
    const cancellableStatuses = ['CREATED', 'IN_PREPARATION'];
    if (!cancellableStatuses.includes(order.status)) {
      return false;
    }
    const timeRemaining = getTimeRemaining(order.createdAt);
    return timeRemaining > 0;
  };

  const getTimeRemaining = (createdAt) => {
    if (!createdAt) return 0;
    const created = new Date(createdAt);
    const now = new Date();
    const elapsed = (now - created) / 1000; // elapsed time in seconds
    const twoMinutes = 120; // 2 minutes in seconds
    const remaining = Math.max(0, twoMinutes - elapsed);
    return Math.floor(remaining);
  };

  const formatCountdown = (seconds) => {
    if (seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCancelClick = (order) => {
    setOrderToCancel(order);
    setCancelReason('');
    setCancelDialogOpen(true);
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      setToast({ open: true, message: 'Please provide a cancellation reason', type: 'error' });
      return;
    }

    try {
      await orderService.cancel(orderToCancel.id, cancelReason.trim());
      setCancelDialogOpen(false);
      setOrderToCancel(null);
      setCancelReason('');
      setToast({ open: true, message: 'Order cancelled successfully', type: 'success' });
      loadOrders(); // Refresh orders
    } catch (error) {
      setToast({ 
        open: true, 
        message: error.response?.data?.message || 'Failed to cancel order', 
        type: 'error' 
      });
    }
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToast({ ...toast, open: false });
  };

  return (
    <Layout title="Orders">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Placed Orders
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View and manage all orders placed from POS
        </Typography>
      </Box>

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label={`All Orders (${orders.length})`} />
        <Tab label={`Active (${orders.filter(o => ['CREATED', 'IN_PREPARATION', 'READY'].includes(o.status)).length})`} />
        <Tab label={`Completed (${orders.filter(o => o.status === 'COMPLETED').length})`} />
        <Tab label={`Cancelled (${orders.filter(o => o.status === 'CANCELLED').length})`} />
      </Tabs>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Cashier</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No orders found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map(order => (
                <React.Fragment key={order.id}>
                  <TableRow hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        #{order.id}
                      </Typography>
                    </TableCell>
                    <TableCell>{order.cashierName || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={order.status.replace('_', ' ')} 
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {order.items?.length || 0} item(s)
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold" color="primary">
                        ₹{Number(order.total || 0).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {order.payment?.method || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(order.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleExpandOrder(order.id)}
                        >
                          {expandedOrder === order.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleViewReceipt(order)}
                          color="primary"
                        >
                          <Receipt />
                        </IconButton>
                        {canCancelOrder(order) && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<Cancel />}
                            onClick={() => handleCancelClick(order)}
                            sx={{ 
                              minWidth: '140px',
                              fontSize: '0.75rem',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Cancel ({formatCountdown(countdowns[order.id] || getTimeRemaining(order.createdAt))})
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={8} sx={{ py: 0, borderBottom: 'none' }}>
                      <Collapse in={expandedOrder === order.id} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                            Order Details
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Item</TableCell>
                                <TableCell align="center">Quantity</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Subtotal</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {order.items?.map((item, idx) => (
                                <TableRow key={idx}>
                                  <TableCell>{item.menuItemName}</TableCell>
                                  <TableCell align="center">{item.quantity}</TableCell>
                                  <TableCell align="right">₹{Number(item.price || 0).toFixed(2)}</TableCell>
                                  <TableCell align="right">₹{Number(item.subtotal || 0).toFixed(2)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Box sx={{ minWidth: 200 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2">Subtotal:</Typography>
                                <Typography variant="body2">₹{Number(order.subtotal || 0).toFixed(2)}</Typography>
                              </Box>
                              {order.discount > 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                  <Typography variant="body2" color="success.main">Discount:</Typography>
                                  <Typography variant="body2" color="success.main">-₹{Number(order.discount || 0).toFixed(2)}</Typography>
                                </Box>
                              )}
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2">Tax (5%):</Typography>
                                <Typography variant="body2">₹{Number(order.tax || 0).toFixed(2)}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: 1, borderColor: 'divider' }}>
                                <Typography variant="subtitle1" fontWeight="bold">Total:</Typography>
                                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                  ₹{Number(order.total || 0).toFixed(2)}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                          {order.cancellationReason && (
                            <Box sx={{ mt: 2, p: 1, backgroundColor: 'error.light', borderRadius: 1 }}>
                              <Typography variant="body2" color="error.dark">
                                <strong>Cancellation Reason:</strong> {order.cancellationReason}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Receipt Dialog */}
      <Dialog 
        open={receiptOpen} 
        onClose={() => setReceiptOpen(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Receipt - Order #{selectedOrder?.id}</Typography>
            <Button
              startIcon={<Print />}
              onClick={handlePrintReceipt}
              variant="outlined"
              size="small"
            >
              Print
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold">Coffee Shop</Typography>
                <Typography variant="body2" color="text.secondary">
                  Order #{selectedOrder.id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(selectedOrder.createdAt)}
                </Typography>
              </Box>
              
              <Box sx={{ borderTop: 1, borderBottom: 1, borderColor: 'divider', py: 2, mb: 2 }}>
                {selectedOrder.items?.map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box>
                      <Typography variant="body1">{item.menuItemName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.quantity} x ₹{Number(item.price || 0).toFixed(2)}
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="bold">
                      ₹{Number(item.subtotal || 0).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2">₹{Number(selectedOrder.subtotal || 0).toFixed(2)}</Typography>
                </Box>
                {selectedOrder.discount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="success.main">Discount:</Typography>
                    <Typography variant="body2" color="success.main">-₹{Number(selectedOrder.discount || 0).toFixed(2)}</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Tax (5%):</Typography>
                  <Typography variant="body2">₹{Number(selectedOrder.tax || 0).toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="h6" fontWeight="bold">Total:</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    ₹{Number(selectedOrder.total || 0).toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
                <Typography variant="body2">
                  <strong>Payment Method:</strong> {selectedOrder.payment?.method || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Cashier:</strong> {selectedOrder.cashierName || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Status:</strong> {selectedOrder.status.replace('_', ' ')}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReceiptOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Order Dialog */}
      <Dialog 
        open={cancelDialogOpen} 
        onClose={() => {
          setCancelDialogOpen(false);
          setCancelReason('');
          setOrderToCancel(null);
        }} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          Cancel Order #{orderToCancel?.id}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            {orderToCancel && (() => {
              const timeRemaining = countdowns[orderToCancel.id] || getTimeRemaining(orderToCancel.createdAt);
              const canStillCancel = canCancelOrder(orderToCancel);
              return (
                <>
                  <Typography 
                    variant="body2" 
                    color={canStillCancel ? "text.secondary" : "error.main"} 
                    gutterBottom
                    sx={{ mb: 2 }}
                  >
                    {canStillCancel 
                      ? `You have ${formatCountdown(timeRemaining)} remaining to cancel this order.`
                      : 'The cancellation window has expired. This order can no longer be cancelled.'}
                  </Typography>
                  <TextField
                    fullWidth
                    label="Cancellation Reason"
                    multiline
                    rows={4}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    margin="normal"
                    required
                    disabled={!canStillCancel}
                    placeholder="Please provide a reason for cancellation..."
                    helperText="This reason will be recorded with the order"
                  />
                </>
              );
            })()}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setCancelDialogOpen(false);
            setCancelReason('');
            setOrderToCancel(null);
          }}>
            Keep Order
          </Button>
          <Button 
            onClick={handleCancelOrder} 
            variant="contained" 
            color="error"
            disabled={!cancelReason.trim() || !orderToCancel || !canCancelOrder(orderToCancel)}
          >
            Cancel Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseToast} 
          severity={toast.type || 'info'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default Orders;

