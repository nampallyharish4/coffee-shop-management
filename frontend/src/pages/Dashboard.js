import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  Typography,
  CardActionArea,
  Box,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  useTheme,
  Stack,
} from '@mui/material';
import {
  ShoppingCart,
  Restaurant,
  Inventory,
  People,
  Menu as MenuIcon,
  Receipt,
  Group,
  DeleteForever,
  Refresh,
  Payments,
  ReceiptLong,
  QueryStats,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { analyticsService, orderService } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { hasRole, user } = useAuth();

  // Analytics State
  const [range, setRange] = useState('daily');
  const [salesSummary, setSalesSummary] = useState({
    totalRevenue: 0,
    orderCount: 0,
    averageOrderValue: 0,
  });
  const [topItems, setTopItems] = useState([]);
  const [staffPerformance, setStaffPerformance] = useState([]);
  const [inventoryUsage, setInventoryUsage] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('RESET_REVENUE');
  const [confirmText, setConfirmText] = useState('');
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const loadAnalytics = async () => {
    try {
      const [sales, items, staff, usage] = await Promise.all([
        analyticsService.getSales(range),
        analyticsService.getTopItems(range),
        analyticsService.getStaffPerformance(range),
        analyticsService.getInventoryUsage(range),
      ]);
      setSalesSummary(
        sales.data.data || {
          totalRevenue: 0,
          orderCount: 0,
          averageOrderValue: 0,
        },
      );
      setTopItems(items.data.data || []);
      setStaffPerformance(staff.data.data || []);
      setInventoryUsage(usage.data.data || []);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  useEffect(() => {
    if (hasRole('ROLE_ADMIN')) {
      loadAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const handleAction = async () => {
    const requiredText =
      dialogType === 'RESET_REVENUE' ? 'RESET REVENUE' : 'DELETE EVERYTHING';
    if (confirmText !== requiredText) {
      setAlert({
        open: true,
        message: `Please type "${requiredText}" to confirm`,
        severity: 'error',
      });
      return;
    }

    try {
      if (dialogType === 'RESET_REVENUE') {
        await orderService.resetRevenue();
      } else {
        await orderService.deleteAll();
      }

      setOpenDialog(false);
      setConfirmText('');
      setAlert({
        open: true,
        message: 'Action performed successfully',
        severity: 'success',
      });
      loadAnalytics();
    } catch (error) {
      setAlert({
        open: true,
        message: error.response?.data?.message || 'Failed to perform action',
        severity: 'error',
      });
    }
  };

  const openConfirmation = (type) => {
    setDialogType(type);
    setConfirmText('');
    setOpenDialog(true);
  };

  const cards = [
    {
      title: 'POS',
      icon: <ShoppingCart />,
      path: '/pos',
      roles: ['ROLE_CASHIER', 'ROLE_ADMIN'],
      color: '#6F4E37',
      desc: 'New Orders',
    },
    {
      title: 'Orders',
      icon: <Receipt />,
      path: '/orders',
      roles: ['ROLE_CASHIER', 'ROLE_BARISTA', 'ROLE_ADMIN'],
      color: '#D2691E',
      desc: 'Track History',
    },
    {
      title: 'Barista',
      icon: <Restaurant />,
      path: '/barista',
      roles: ['ROLE_BARISTA', 'ROLE_ADMIN'],
      color: '#8B4513',
      desc: 'Kitchen View',
    },
    {
      title: 'Menu',
      icon: <MenuIcon />,
      path: '/menu',
      roles: ['ROLE_ADMIN'],
      color: '#A0522D',
      desc: 'Edit Items',
    },
    {
      title: 'Users',
      icon: <People />,
      path: '/users',
      roles: ['ROLE_ADMIN'],
      color: '#DEB887',
      desc: 'Staff Access',
    },
    {
      title: 'Inventory',
      icon: <Inventory />,
      path: '/inventory',
      roles: ['ROLE_INVENTORY_MANAGER', 'ROLE_ADMIN'],
      color: '#2E7D32',
      desc: 'Stock Management',
    }, // Added Inventory Card
  ];

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Layout title="Dashboard">
      {/* Navigation Quick Links */}

      <Typography variant="h5" fontWeight="800" sx={{ mb: 3 }}>
        {getTimeGreeting()}, {user?.name || 'User'}!
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {cards.map((card) => {
          if (card.roles.some((role) => hasRole(role))) {
            return (
              <Grid item xs={12} sm={6} md={4} lg={2} key={card.title}>
                <Card
                  sx={{
                    borderRadius: '20px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 24px rgba(111, 78, 55, 0.1)',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => navigate(card.path)}
                    sx={{ p: 2 }}
                  >
                    <Box
                      sx={{
                        color: card.color,
                        mb: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 45,
                        height: 45,
                        borderRadius: '12px',
                        backgroundColor: `${card.color}15`,
                      }}
                    >
                      {card.icon}
                    </Box>
                    <Typography variant="subtitle1" fontWeight="800">
                      {card.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {card.desc}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          }
          return null;
        })}
      </Grid>

      {/* Analytics Section - Only for Admin */}
      {hasRole('ROLE_ADMIN') && (
        <Box sx={{ mt: 4, animation: 'fadeIn 0.8s ease' }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography variant="h5" fontWeight="800">
                Analytics & Reports
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Real-time performance metrics
              </Typography>
            </Box>

            <Stack
              direction={{ xs: 'column', lg: 'row' }}
              spacing={2}
              sx={{ width: { xs: '100%', lg: 'auto' } }}
            >
              <FormControl
                size="small"
                sx={{ minWidth: { xs: '100%', sm: 150 } }}
              >
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={range}
                  label="Time Range"
                  onChange={(e) => setRange(e.target.value)}
                  sx={{ borderRadius: '12px' }}
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<Refresh />}
                  onClick={() => openConfirmation('RESET_REVENUE')}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    flexGrow: 1,
                  }}
                >
                  Reset
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteForever />}
                  onClick={() => openConfirmation('CLEAR_HISTORY')}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    flexGrow: 1,
                  }}
                >
                  Clear
                </Button>
              </Stack>
            </Stack>
          </Stack>

          {alert.open && (
            <Alert
              severity={alert.severity}
              onClose={() => setAlert({ ...alert, open: false })}
              sx={{ mb: 3, borderRadius: '12px' }}
            >
              {alert.message}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Stats Summary */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'none',
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ mb: 2 }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: '10px',
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                    }}
                  >
                    <Payments />
                  </Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    fontWeight="700"
                  >
                    TOTAL REVENUE
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight="900">
                  ₹{salesSummary?.totalRevenue?.toLocaleString() || 0}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'none',
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ mb: 2 }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: '10px',
                      bgcolor: 'secondary.light',
                      color: 'secondary.main',
                    }}
                  >
                    <ReceiptLong />
                  </Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    fontWeight="700"
                  >
                    TOTAL ORDERS
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight="900">
                  {salesSummary?.orderCount || 0}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'none',
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ mb: 2 }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: '10px',
                      bgcolor: 'success.light',
                      color: 'success.main',
                    }}
                  >
                    <QueryStats />
                  </Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    fontWeight="700"
                  >
                    AVG ORDER VALUE
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight="900">
                  ₹{salesSummary?.averageOrderValue?.toLocaleString() || 0}
                </Typography>
              </Paper>
            </Grid>

            {/* Charts & Tables */}
            <Grid item xs={12} md={8} lg={8}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: '24px',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'none',
                }}
              >
                <Typography variant="h6" fontWeight="800" sx={{ mb: 3 }}>
                  Top Selling Items
                </Typography>
                <Box sx={{ height: 350, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topItems}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        opacity={0.3}
                      />
                      <XAxis
                        dataKey="itemName"
                        axisLine={false}
                        tickLine={false}
                        style={{ fontSize: '0.8rem', fontWeight: 600 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        style={{ fontSize: '0.8rem', fontWeight: 600 }}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: 'none',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        }}
                        cursor={{
                          fill:
                            theme.palette.mode === 'dark'
                              ? 'rgba(255,255,255,0.05)'
                              : 'rgba(0,0,0,0.05)',
                        }}
                      />
                      <Bar
                        dataKey="totalQuantity"
                        fill={theme.palette.primary.main}
                        radius={[8, 8, 0, 0]}
                        barSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4} lg={4}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: '24px',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'none',
                  height: '100%',
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <Typography variant="h6" fontWeight="800">
                    Staff Performance
                  </Typography>
                  <Group sx={{ color: 'text.secondary' }} />
                </Stack>
                <Box sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow
                        sx={{
                          '& th': {
                            border: 'none',
                            color: 'text.secondary',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                          },
                        }}
                      >
                        <TableCell sx={{ minWidth: 120 }}>
                          Staff Member
                        </TableCell>
                        <TableCell align="right" sx={{ minWidth: 80 }}>
                          Orders
                        </TableCell>
                        <TableCell align="right" sx={{ minWidth: 100 }}>
                          Revenue
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {staffPerformance.map((staff, idx) => (
                        <TableRow
                          key={idx}
                          sx={{
                            '& td': {
                              borderBottom: '1px solid',
                              borderColor: 'divider',
                              py: 1.5,
                            },
                          }}
                        >
                          <TableCell>
                            <Typography variant="body2" fontWeight="700">
                              {staff.userName}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="600">
                              {staff.orderCount}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              fontWeight="800"
                              color="primary"
                            >
                              ₹{staff.totalRevenue?.toLocaleString() || 0}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                      {staffPerformance.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              No data available for this range
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: '24px',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'none',
                }}
              >
                <Typography variant="h6" fontWeight="800" sx={{ mb: 3 }}>
                  Inventory Usage Report
                </Typography>
                <Box sx={{ height: 350, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={inventoryUsage}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        opacity={0.3}
                      />
                      <XAxis
                        dataKey="itemName"
                        axisLine={false}
                        tickLine={false}
                        style={{ fontSize: '0.8rem', fontWeight: 600 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        style={{ fontSize: '0.8rem', fontWeight: 600 }}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: 'none',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        }}
                        cursor={{
                          fill:
                            theme.palette.mode === 'dark'
                              ? 'rgba(255,255,255,0.05)'
                              : 'rgba(0,0,0,0.05)',
                        }}
                      />
                      <Bar
                        dataKey="totalUsed"
                        fill={theme.palette.secondary.main}
                        radius={[8, 8, 0, 0]}
                        barSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Confirmation Dialogs */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {dialogType === 'RESET_REVENUE'
            ? 'Reset Revenue Session'
            : 'Wipe System History'}
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {dialogType === 'RESET_REVENUE'
              ? 'This action will cancel all completed orders for current session and reset revenue. This cannot be undone.'
              : 'CRITICAL: This will PERMANENTLY DELETE all order history and logs. Data recovery will be impossible.'}
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={
              dialogType === 'RESET_REVENUE'
                ? 'RESET REVENUE'
                : 'DELETE EVERYTHING'
            }
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            color="inherit"
            sx={{ fontWeight: 'bold' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAction}
            variant="contained"
            color="error"
            sx={{ borderRadius: '10px', boxShadow: 'none', px: 3 }}
          >
            Confirm Action
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Dashboard;
