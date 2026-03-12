import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { NotificationsActive, NotificationsOff } from '@mui/icons-material';
import Layout from '../components/Layout';
import { orderService } from '../services/api';

const NOTIFICATION_TUNES = [
  {
    name: 'Kitchen Buzzer (Default)',
    url: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  },
  {
    name: 'Bell Chime',
    url: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  },
  {
    name: 'Soft Ding',
    url: 'https://assets.mixkit.co/active_storage/sfx/2867/2867-preview.mp3',
  },
  {
    name: 'Success Chime',
    url: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  },
  {
    name: 'Airport Announcement',
    url: 'https://assets.mixkit.co/active_storage/sfx/235/235-preview.mp3',
  },
];

const BaristaView = () => {
  const [orders, setOrders] = useState([]);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [selectedTuneUrl, setSelectedTuneUrl] = useState(
    NOTIFICATION_TUNES[0].url,
  );
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const lastDisplayedIds = React.useRef(new Set());
  const isInitialized = React.useRef(false);
  // Initialize with selected tune
  const notificationSound = React.useRef(new Audio(selectedTuneUrl));

  useEffect(() => {
    // Load preference from localStorage
    const savedTune = localStorage.getItem('baristaNotificationTune');
    if (savedTune) {
      setSelectedTuneUrl(savedTune);
    }

    const savedSoundEnabled = localStorage.getItem('baristaSoundEnabled');
    if (savedSoundEnabled !== null) {
      setIsSoundEnabled(savedSoundEnabled === 'true');
    } else {
      setIsSoundEnabled(true);
    }

    loadOrders();
    const interval = setInterval(loadOrders, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Update audio source when selectedTuneUrl changes
  useEffect(() => {
    notificationSound.current = new Audio(selectedTuneUrl);
    notificationSound.current.volume = 1.0;
    notificationSound.current.load();
    localStorage.setItem('baristaNotificationTune', selectedTuneUrl);
  }, [selectedTuneUrl]);

  const playNotification = () => {
    if (isSoundEnabled) {
      notificationSound.current.currentTime = 0;
      notificationSound.current.play().catch((err) => {
        console.warn('Audio play failed (likely browser policy):', err);
        setSnackbar({
          open: true,
          message: 'New order! (Tap anywhere to enable sound)',
          severity: 'warning',
        });
      });
    }
    if (!snackbar.open || snackbar.severity !== 'warning') {
      setSnackbar({
        open: true,
        message: 'New order arrived!',
        severity: 'info',
      });
    }
  };

  const loadOrders = async () => {
    try {
      const response = await orderService.getAll();
      const allOrders = response.data.data;
      const activeOrders = allOrders.filter((o) =>
        ['CREATED', 'IN_PREPARATION', 'READY'].includes(o.status),
      );

      // Only notify for orders that are actually shown (after 45s window)
      const displayed = activeOrders.filter(shouldShowOrder);
      const currentIds = new Set(displayed.map((o) => o.id));

      const hasNewOrder = displayed.some(
        (o) => !lastDisplayedIds.current.has(o.id),
      );

      // Play sound if:
      // 1. We have initialized (don't play on first load)
      // 2. We have a new order that wasn't there before
      if (isInitialized.current && hasNewOrder) {
        playNotification();
      }

      lastDisplayedIds.current = currentIds;
      setOrders(activeOrders);
      isInitialized.current = true;
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const getTimeRemaining = (createdAt) => {
    if (!createdAt) return 0;
    const created = new Date(createdAt);
    const now = new Date();
    const elapsed = (now - created) / 1000;
    const cancelWindow = 45;
    const remaining = Math.max(0, cancelWindow - elapsed);
    return Math.floor(remaining);
  };

  const shouldShowOrder = (order) => {
    // If status is CREATED, only show if timer has expired
    if (order.status === 'CREATED') {
      return getTimeRemaining(order.createdAt) === 0;
    }
    // Always show strict PREPARATION or READY orders
    return true;
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      loadOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          'Failed to update order status. Please try again.',
        severity: 'error',
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CREATED':
        return 'warning';
      case 'IN_PREPARATION':
        return 'info';
      case 'READY':
        return 'success';
      default:
        return 'default';
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'CREATED':
        return 'IN_PREPARATION';
      case 'IN_PREPARATION':
        return 'READY';
      case 'READY':
        return 'COMPLETED';
      default:
        return null;
    }
  };

  const displayedOrders = orders.filter(shouldShowOrder);

  return (
    <Layout title="Barista View - Kitchen Orders">
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Active Orders
        </Typography>
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            borderRadius: '12px',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: { xs: 'stretch', sm: 'center' },
          }}
        >
          <Button
            size="small"
            variant="outlined"
            onClick={playNotification}
            startIcon={<NotificationsActive />}
            fullWidth={false}
          >
            Test Speaker
          </Button>
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 180 } }}>
            <InputLabel>Notification Tone</InputLabel>
            <Select
              value={selectedTuneUrl}
              label="Notification Tone"
              onChange={(e) => setSelectedTuneUrl(e.target.value)}
            >
              {NOTIFICATION_TUNES.map((tune) => (
                <MenuItem key={tune.url} value={tune.url}>
                  {tune.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={isSoundEnabled}
                onChange={(e) => {
                  setIsSoundEnabled(e.target.checked);
                  localStorage.setItem('baristaSoundEnabled', e.target.checked);
                }}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isSoundEnabled ? (
                  <NotificationsActive color="primary" />
                ) : (
                  <NotificationsOff color="action" />
                )}
                <Typography variant="body2" fontWeight="bold">
                  {isSoundEnabled ? 'Sound ON' : 'Sound OFF'}
                </Typography>
              </Box>
            }
            sx={{ m: 0, px: 1 }}
          />
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity || 'info'}
          variant="filled"
          sx={{ width: '100%', borderRadius: '12px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Grid container spacing={3}>
        {displayedOrders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order.id}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Order #{order.id}</Typography>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                  />
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
                  onClick={() =>
                    updateStatus(order.id, getNextStatus(order.status))
                  }
                >
                  {order.status === 'CREATED' && 'Start Preparation'}
                  {order.status === 'IN_PREPARATION' && 'Mark Ready'}
                  {order.status === 'READY' && 'Complete Order'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {displayedOrders.length === 0 && (
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
