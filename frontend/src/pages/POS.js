import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, Paper, Box, IconButton, Chip, Divider, Snackbar, Alert, InputAdornment
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCart, Search, ClearAll } from '@mui/icons-material';
import Layout from '../components/Layout';
import { menuService, orderService } from '../services/api';

const POS = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const response = await menuService.getActive();
      setMenuItems(response.data.data);
      setFilteredMenuItems(response.data.data);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to load menu items' });
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMenuItems(menuItems);
    } else {
      const filtered = menuItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMenuItems(filtered);
    }
  }, [searchQuery, menuItems]);

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
        return newQty > 0 ? { ...item, quantity: newQty } : item;
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
    setDiscount(0);
    setMessage({ type: 'info', text: 'Cart cleared' });
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = discount || 0;
    const taxableAmount = subtotal - discountAmount;
    const tax = taxableAmount * 0.05;
    return {
      subtotal: subtotal.toFixed(2),
      discount: discountAmount.toFixed(2),
      tax: tax.toFixed(2),
      total: (taxableAmount + tax).toFixed(2)
    };
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setMessage({ type: 'error', text: 'Cart is empty' });
      return;
    }

    const totals = calculateTotal();
    const order = {
      items: cart,
      discount: parseFloat(totals.discount),
      payment: {
        method: paymentMethod,
        amount: parseFloat(totals.total)
      }
    };

    try {
      await orderService.create(order);
      setMessage({ type: 'success', text: 'Order created successfully!' });
      setCart([]);
      setDiscount(0);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create order' });
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
    <Layout title="Point of Sale">
      <Snackbar
        open={!!message.text}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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
        <Grid item xs={12} md={7}>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" fontWeight="bold" color="primary">
              Menu Items
            </Typography>
            <Chip 
              icon={<ShoppingCart />} 
              label={`${cart.length} items`} 
              color="primary" 
              variant="outlined"
            />
          </Box>

          <TextField
            fullWidth
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
          />
          
          <Box
            sx={{
              maxHeight: 'calc(100vh - 200px)',
              overflowY: 'auto',
              pr: 1,
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'background.default',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'text.secondary',
                borderRadius: '3px',
                '&:hover': {
                  backgroundColor: 'text.primary',
                },
              },
            }}
          >
            <Grid container spacing={2}>
            {filteredMenuItems.map(item => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card 
                  sx={{ 
                    aspectRatio: '1 / 1',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                      borderColor: 'primary.main'
                    }
                  }}
                  onClick={() => addToCart(item)}
                >
                  {/* Square Image Container */}
                  <Box
                    sx={{
                      width: '100%',
                      aspectRatio: '1 / 1',
                      overflow: 'hidden',
                      backgroundColor: '#f5f5f5',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          display: 'block',
                          minWidth: '100%',
                          minHeight: '100%'
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
                          aspectRatio: '1 / 1'
                        }}
                      >
                        <Typography variant="body2">No Image</Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Card Content */}
                  <CardContent 
                    sx={{ 
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      p: 1.5,
                      pt: 1.5,
                      '&:last-child': {
                        pb: 1.5
                      }
                    }}
                  >
                    <Typography 
                      variant="subtitle2" 
                      fontWeight="bold"
                      sx={{ 
                        fontSize: '0.875rem',
                        lineHeight: 1.3,
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
                      fontWeight="bold"
                      sx={{ 
                        fontSize: '1rem',
                        mt: 'auto',
                        mb: 0.5
                      }}
                    >
                      ₹{Number(item.price).toFixed(2)}
                    </Typography>
                    
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
                  </CardContent>
                </Card>
              </Grid>
            ))}
            </Grid>
          </Box>
        </Grid>

        {/* Cart Section */}
        <Grid item xs={12} md={5}>
          <Paper 
            sx={{ 
              p: 3,
              borderRadius: 2,
              boxShadow: 3,
              display: 'flex',
              flexDirection: 'column',
              position: 'sticky',
              top: 100,
              height: 'calc(100vh - 120px)',
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
                      sx={{
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        py: 0.5,
                        px: 1.5
                      }}
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
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'background.default',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'text.secondary',
                  borderRadius: '3px',
                  '&:hover': {
                    backgroundColor: 'text.primary',
                  },
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
                        '&:hover': {
                          boxShadow: 2,
                          borderColor: 'primary.main'
                        }
                      }}
                    >
                      <Box sx={{ flexGrow: 1, minWidth: 0, mr: 1 }}>
                        <Typography 
                          variant="subtitle2" 
                          fontWeight="bold"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {item.menuItemName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ₹{Number(item.price).toFixed(2)} each
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => updateQuantity(item.menuItemId, -1)}
                          sx={{ 
                            border: '1px solid',
                            borderColor: 'divider',
                            width: 32,
                            height: 32,
                            '&:hover': { 
                              backgroundColor: 'action.hover',
                              borderColor: 'primary.main'
                            }
                          }}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        
                        <Typography 
                          variant="body1" 
                          fontWeight="bold" 
                          sx={{ 
                            minWidth: '32px', 
                            textAlign: 'center',
                            fontSize: '0.95rem'
                          }}
                        >
                          {item.quantity}
                        </Typography>
                        
                        <IconButton 
                          size="small" 
                          onClick={() => updateQuantity(item.menuItemId, 1)}
                          sx={{ 
                            border: '1px solid',
                            borderColor: 'divider',
                            width: 32,
                            height: 32,
                            '&:hover': { 
                              backgroundColor: 'action.hover',
                              borderColor: 'primary.main'
                            }
                          }}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', ml: 1, minWidth: '90px' }}>
                        <Typography variant="subtitle2" fontWeight="bold" color="primary" sx={{ mb: 0.5 }}>
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => removeFromCart(item.menuItemId)}
                          sx={{ 
                            color: 'error.main',
                            width: 28,
                            height: 28,
                            '&:hover': { 
                              backgroundColor: 'error.light', 
                              color: 'error.dark' 
                            }
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
                label="Discount (₹)"
                type="number"
                value={discount}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  const maxDiscount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                  setDiscount(Math.max(0, Math.min(value, maxDiscount)));
                }}
                size="small"
                InputProps={{
                  inputProps: { min: 0, step: 0.01 }
                }}
                helperText={discount > 0 ? `Max discount: ₹${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}` : ''}
              />

              <FormControl fullWidth size="small">
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label="Payment Method"
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
                disabled={cart.length === 0}
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  borderRadius: 1,
                  textTransform: 'none',
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4
                  },
                  '&:disabled': {
                    opacity: 0.6
                  }
                }}
              >
                Complete Order
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default POS;
