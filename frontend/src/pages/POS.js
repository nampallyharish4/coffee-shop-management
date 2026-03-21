import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, Paper, Box, IconButton, Chip, Divider, Snackbar, Alert,
  InputAdornment, Stack, useTheme, useMediaQuery, Skeleton, CircularProgress
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCart, Search, ClearAll } from '@mui/icons-material';
import Layout from '../components/Layout';
import { menuService, orderService, categoryService } from '../services/api';

const POS = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [discountPercent, setDiscountPercent] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const loadData = async () => {
    setIsPageLoading(true);
    try {
      const [menuRes, catRes] = await Promise.all([
        menuService.getActive(),
        categoryService.getAll()
      ]);
      setMenuItems(menuRes.data.data || []);
      setCategories(catRes.data.data || []);
      setFilteredMenuItems(menuRes.data.data || []);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to load menu data. Please refresh.' });
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let result = menuItems;

    if (selectedCategory !== 'ALL') {
      result = result.filter(item => item.categoryId == selectedCategory);
    }

    if (searchQuery.trim() !== '') {
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMenuItems(result);
  }, [searchQuery, selectedCategory, menuItems]);

  const addToCart = (item) => {
    const existing = cart.find(c => c.menuItemId === item.id);
    if (existing) {
      setCart(cart.map(c =>
        c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c
      ));
    } else {
      setCart([...cart, {
        menuItemId: item.id,
        menuItemName: item.name,
        price: item.price,
        quantity: 1
      }]);
    }
  };

  const updateQuantity = (menuItemId, delta) => {
    setCart(cart.map(item => {
      if (item.menuItemId === menuItemId) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (menuItemId) => {
    setCart(cart.filter(item => item.menuItemId !== menuItemId));
  };

  const clearCart = () => {
    if (cart.length === 0) return;
    setCart([]);
    setDiscountPercent('');
    setMessage({ type: 'info', text: 'Cart cleared' });
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountVal = parseFloat(discountPercent) || 0;
    const discountAmount = (subtotal * discountVal) / 100;
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const tax = taxableAmount * 0.05;
    const rawTotal = taxableAmount + tax;
    const roundedTotal = Math.round(rawTotal);
    const roundOff = roundedTotal - rawTotal;

    return {
      subtotal: subtotal.toFixed(2),
      discount: discountAmount.toFixed(2),
      tax: tax.toFixed(2),
      roundOff: roundOff.toFixed(2),
      total: roundedTotal.toFixed(2)
    };
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setMessage({ type: 'error', text: 'Cart is empty' });
      return;
    }

    if (isCheckingOut) return; // Prevent duplicate submissions

    setIsCheckingOut(true);
    const totals = calculateTotal();
    const order = {
      items: cart,
      discount: parseFloat(totals.discount),
      roundOff: parseFloat(totals.roundOff),
      payment: {
        method: paymentMethod,
        amount: parseFloat(totals.total)
      }
    };

    try {
      await orderService.create(order);
      setMessage({ type: 'success', text: 'Order created successfully!' });
      setCart([]);
      setDiscountPercent('');
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create order. Please try again.' });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMessage({ type: '', text: '' });
  };

  const totals = calculateTotal();

  return (
    <Layout
      title="Point of Sale"
      headerContent={
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight="bold" color="primary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Menu Items
          </Typography>
          <Chip
            icon={<ShoppingCart />}
            label={isMobile ? `${cart.length}` : `${cart.length} items`}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>
      }
    >
      <Snackbar
        open={!!message.text}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={message.type || 'info'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message.text}
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        {/* Menu Items Section */}
        <Grid item xs={12} md={8}>

          {/* Category Filter */}
          {isPageLoading ? (
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              {[1, 2, 3, 4].map(i => <Skeleton key={i} variant="rounded" width={80} height={32} />)}
            </Stack>
          ) : (
            <Stack direction="row" spacing={1} sx={{
              mb: 2,
              overflowX: 'auto',
              pb: 1,
              '&::-webkit-scrollbar': { height: '4px' },
              '&::-webkit-scrollbar-thumb': { backgroundColor: 'divider', borderRadius: '4px' }
            }}>
              <Chip
                label="All"
                onClick={() => setSelectedCategory('ALL')}
                color={selectedCategory === 'ALL' ? "primary" : "default"}
                variant={selectedCategory === 'ALL' ? "filled" : "outlined"}
                clickable
                size="small"
              />
              {categories.map(cat => (
                <Chip
                  key={cat.id}
                  label={cat.name}
                  onClick={() => setSelectedCategory(cat.id)}
                  color={selectedCategory === cat.id ? "primary" : "default"}
                  variant={selectedCategory === cat.id ? "filled" : "outlined"}
                  clickable
                  size="small"
                />
              ))}
            </Stack>
          )}

          <TextField
            fullWidth
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 4 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
            disabled={isPageLoading}
          />

          <Box
            sx={{
              maxHeight: 'calc(100vh - 250px)',
              overflowY: 'auto',
              pr: 1,
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-track': { backgroundColor: 'background.default', borderRadius: '3px' },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'text.secondary',
                borderRadius: '3px',
                '&:hover': { backgroundColor: 'text.primary' },
              },
            }}
          >
            <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ p: { xs: 0, sm: 1 } }}>
              {isPageLoading ? (
                // Skeleton loaders while menu loads
                Array.from({ length: 8 }).map((_, i) => (
                  <Grid item xs={6} sm={4} md={6} lg={4} xl={3} key={i}>
                    <Skeleton variant="rounded" height={280} />
                  </Grid>
                ))
              ) : filteredMenuItems.length === 0 ? (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="body1" color="text.secondary">
                      {searchQuery || selectedCategory !== 'ALL' ? 'No items match your filter.' : 'No menu items available.'}
                    </Typography>
                  </Box>
                </Grid>
              ) : (
                filteredMenuItems.map(item => (
                  <Grid item xs={6} sm={4} md={6} lg={4} xl={3} key={item.id}>
                    <Card
                      onClick={() => addToCart(item)}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: { xs: 2, sm: 3 },
                        overflow: 'hidden',
                        transition: 'all 0.2s ease-in-out',
                        cursor: 'pointer',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                          borderColor: 'primary.main',
                          '& .item-image': { transform: 'scale(1.05)' }
                        },
                        '&:active': { transform: 'scale(0.98)' }
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          height: { xs: 100, sm: 140, md: 160, lg: 180 },
                          overflow: 'hidden',
                          backgroundColor: 'grey.100',
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {item.imageUrl ? (
                          <img
                            className="item-image"
                            src={item.imageUrl}
                            alt={item.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'center',
                              display: 'block',
                              transition: 'transform 0.5s ease'
                            }}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400';
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#e0e0e0',
                              color: '#9e9e9e',
                            }}
                          >
                            <Typography variant="body2">No Image</Typography>
                          </Box>
                        )}
                      </Box>

                      <CardContent
                        sx={{
                          flexGrow: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          p: 1.5,
                          pt: 1.5,
                          '&:last-child': { pb: 1.5 }
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          sx={{
                            fontSize: { xs: '0.8rem', sm: '0.9rem' },
                            lineHeight: 1.2,
                            mb: 0.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            minHeight: '2.6rem'
                          }}
                        >
                          {item.name}
                        </Typography>

                        <Typography
                          variant="h6"
                          color="primary"
                          fontWeight="800"
                          sx={{
                            fontSize: { xs: '0.9rem', sm: '1.1rem' },
                            mt: 'auto',
                            mb: 0.5
                          }}
                        >
                          ₹{Number(item.price).toFixed(2)}
                        </Typography>

                        {cart.find(c => c.menuItemId === item.id) ? (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 1,
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 1,
                              p: 0.5,
                              px: 2,
                              width: 'fit-content',
                              ml: 'auto'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(item.id, -1);
                              }}
                              sx={{ p: 0.5 }}
                            >
                              <Remove fontSize="small" />
                            </IconButton>
                            <Typography fontWeight="bold">
                              {cart.find(c => c.menuItemId === item.id).quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(item.id, 1);
                              }}
                              sx={{ p: 0.5 }}
                            >
                              <Add fontSize="small" />
                            </IconButton>
                          </Box>
                        ) : (
                          <Button
                            fullWidth
                            variant="contained"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(item);
                            }}
                            sx={{
                              py: 0.75,
                              fontSize: '0.75rem',
                              textTransform: 'none',
                              fontWeight: 'bold',
                              borderRadius: 1
                            }}
                          >
                            Add to Cart
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </Box>
        </Grid>

        {/* Cart Section */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
              boxShadow: 3,
              display: 'flex',
              flexDirection: 'column',
              position: { xs: 'relative', md: 'sticky' },
              top: { md: 100 },
              height: { xs: 'auto', md: 'calc(100vh - 120px)' },
              maxHeight: { xs: 'none', md: 'calc(100vh - 120px)' },
              mt: { xs: 4, md: 0 }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5" fontWeight="bold" color="primary">
                Current Order
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {cart.length > 0 && (
                  <>
                    <Chip
                      label={`${cart.reduce((sum, item) => sum + item.quantity, 0)} items`}
                      color="primary"
                      size="small"
                    />
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<ClearAll />}
                      onClick={clearCart}
                      disabled={isCheckingOut}
                      sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.5, px: 1.5 }}
                    >
                      Clear All
                    </Button>
                  </>
                )}
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Cart Items */}
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                mb: 2,
                minHeight: 0,
                pr: 1,
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-track': { backgroundColor: 'background.default', borderRadius: '3px' },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'text.secondary',
                  borderRadius: '3px',
                  '&:hover': { backgroundColor: 'text.primary' },
                },
              }}
            >
              {cart.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ShoppingCart sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    Your cart is empty
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Add items from the menu
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {cart.map(item => (
                    <Paper
                      key={item.menuItemId}
                      sx={{
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        backgroundColor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        transition: 'all 0.2s',
                        '&:hover': { boxShadow: 2, borderColor: 'primary.main' }
                      }}
                    >
                      <Box sx={{ flexGrow: 1, minWidth: 0, mr: 1 }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                          {item.menuItemName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ₹{Number(item.price).toFixed(2)} each
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="body1" fontWeight="bold" sx={{ minWidth: '32px', textAlign: 'center', fontSize: '0.95rem' }}>
                          x{item.quantity}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', ml: 1, minWidth: '90px' }}>
                        <Typography variant="subtitle2" fontWeight="bold" color="primary" sx={{ mb: 0.5 }}>
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => removeFromCart(item.menuItemId)}
                          disabled={isCheckingOut}
                          sx={{
                            color: 'error.main',
                            width: 28,
                            height: 28,
                            '&:hover': { backgroundColor: 'error.light', color: 'error.dark' }
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Payment Section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
              <TextField
                fullWidth
                label="Discount (%)"
                type="number"
                value={discountPercent}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') {
                    setDiscountPercent('');
                    return;
                  }
                  const numVal = parseFloat(val);
                  if (numVal >= 0 && numVal <= 100) {
                    setDiscountPercent(val);
                  }
                }}
                size="small"
                disabled={isCheckingOut}
                InputProps={{ inputProps: { min: 0, max: 100, step: 1 } }}
              />

              <FormControl fullWidth size="small">
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label="Payment Method"
                  disabled={isCheckingOut}
                >
                  <MenuItem value="CASH">Cash</MenuItem>
                  <MenuItem value="CARD">Card</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                </Select>
              </FormControl>

              {/* Totals */}
              <Box
                sx={{
                  p: 2,
                  backgroundColor: 'background.default',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
                  <Typography variant="body2" fontWeight="medium">₹{totals.subtotal}</Typography>
                </Box>
                {parseFloat(totals.discount) > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Discount:</Typography>
                    <Typography variant="body2" color="success.main" fontWeight="medium">
                      -₹{totals.discount}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Tax (5%):</Typography>
                  <Typography variant="body2" fontWeight="medium">₹{totals.tax}</Typography>
                </Box>
                {Math.abs(parseFloat(totals.roundOff)) > 0.001 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Round Off:</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {parseFloat(totals.roundOff) > 0 ? '+' : ''}₹{totals.roundOff}
                    </Typography>
                  </Box>
                )}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight="bold">Total:</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    ₹{totals.total}
                  </Typography>
                </Box>
              </Box>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                onClick={handleCheckout}
                disabled={cart.length === 0 || isCheckingOut}
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  borderRadius: 1,
                  textTransform: 'none',
                  boxShadow: 2,
                  '&:hover': { boxShadow: 4 },
                  '&:disabled': { opacity: 0.6 }
                }}
              >
                {isCheckingOut ? (
                  <>
                    <CircularProgress size={20} sx={{ color: 'inherit', mr: 1 }} />
                    Processing…
                  </>
                ) : (
                  'Complete Order'
                )}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default POS;
