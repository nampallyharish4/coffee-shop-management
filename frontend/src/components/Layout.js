import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem,
  ListItemIcon, ListItemText, Box, Container
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard as DashboardIcon, ShoppingCart,
  Restaurant, Inventory, People, Analytics, Logout, Receipt, ArrowBack
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children, title, headerContent }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: [] },
    { text: 'POS', icon: <ShoppingCart />, path: '/pos', roles: ['ROLE_CASHIER', 'ROLE_ADMIN'] },
    { text: 'Orders', icon: <Receipt />, path: '/orders', roles: ['ROLE_CASHIER', 'ROLE_BARISTA', 'ROLE_ADMIN'] },
    { text: 'Barista View', icon: <Restaurant />, path: '/barista', roles: ['ROLE_BARISTA', 'ROLE_ADMIN'] },
    { text: 'Menu', icon: <MenuIcon />, path: '/menu', roles: ['ROLE_ADMIN'] },
    { text: 'Inventory', icon: <Inventory />, path: '/inventory', roles: ['ROLE_INVENTORY_MANAGER', 'ROLE_ADMIN'] },
    { text: 'Users', icon: <People />, path: '/users', roles: ['ROLE_ADMIN'] },
    { text: 'Analytics', icon: <Analytics />, path: '/analytics', roles: ['ROLE_ADMIN'] },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isDashboard = location.pathname === '/dashboard';

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {title || 'Coffee Shop Management'}
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.name}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {menuItems.map((item) => {
              if (item.roles.length === 0 || item.roles.some(role => hasRole(role))) {
                return (
                  <ListItem
                    button
                    key={item.text}
                    onClick={() => {
                      navigate(item.path);
                      setDrawerOpen(false);
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                );
              }
              return null;
            })}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, mt: 8 }}>
        {!isDashboard && (
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <IconButton 
              onClick={() => navigate('/dashboard')}
              sx={{ 
                mr: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                '&:hover': { backgroundColor: 'action.hover' }
              }}
            >
              <ArrowBack />
            </IconButton>
            {headerContent && (
              <Box sx={{ flexGrow: 1 }}>
                {headerContent}
              </Box>
            )}
          </Box>
        )}
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
