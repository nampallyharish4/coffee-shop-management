import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Button, Chip, Box
} from '@mui/material';
import Layout from '../components/Layout';
import { orderService } from '../services/api';

const BaristaView = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderService.getAll();
      const activeOrders = response.data.data.filter(
        o => ['CREATED', 'IN_PREPARATION', 'READY'].includes(o.status)
      );
      setOrders(activeOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
      // Don't show alert for background refresh errors
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      loadOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert(error.response?.data?.message || 'Failed to update order status. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CREATED': return 'warning';
      case 'IN_PREPARATION': return 'info';
      case 'READY': return 'success';
      default: return 'default';
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'CREATED': return 'IN_PREPARATION';
      case 'IN_PREPARATION': return 'READY';
      case 'READY': return 'COMPLETED';
      default: return null;
    }
  };

  return (
    <Layout title="Barista View - Kitchen Orders">
      <Typography variant="h5" gutterBottom>
        Active Orders
      </Typography>
      <Grid container spacing={3}>
        {orders.map(order => (
          <Grid item xs={12} sm={6} md={4} key={order.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Order #{order.id}</Typography>
                  <Chip label={order.status} color={getStatusColor(order.status)} />
                </Box>
                
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Cashier: {order.cashierName}
                </Typography>
                
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Items:
                </Typography>
                {order.items.map((item, idx) => (
                  <Typography key={idx} variant="body2">
                    {item.quantity}x {item.menuItemName}
                  </Typography>
                ))}
                
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => updateStatus(order.id, getNextStatus(order.status))}
                >
                  {order.status === 'CREATED' && 'Start Preparation'}
                  {order.status === 'IN_PREPARATION' && 'Mark Ready'}
                  {order.status === 'READY' && 'Complete Order'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {orders.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" align="center" color="textSecondary">
              No active orders
            </Typography>
          </Grid>
        )}
      </Grid>
    </Layout>
  );
};

export default BaristaView;
