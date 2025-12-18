import React, { useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem,
  ListItemIcon, ListItemText, Box, Container, Divider, useTheme, useMediaQuery,
  Avatar, Tooltip, ListItemButton
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard as DashboardIcon, ShoppingCart,
  Restaurant, Inventory, People, Analytics, Logout, Receipt, ArrowBack
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const Layout = ({ children, title, headerContent }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isDashboard = location.pathname === '/dashboard';

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #2c1e14 0%, #1e1e1e 100%)'
          : 'linear-gradient(135deg, #f5f0ed 0%, #ffffff 100%)',
      }}>
        <Avatar 
          sx={{ 
            bgcolor: 'primary.main',
            width: 45,
            height: 45,
            boxShadow: '0 4px 12px rgba(111, 78, 55, 0.3)',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}
        >
          {user?.name?.charAt(0) || 'C'}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" fontWeight="800" noWrap sx={{ color: 'primary.main' }}>
            {user?.name || 'Coffee Admin'}
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
            {user?.roles?.[0]?.replace('ROLE_', '') || 'User'}
          </Typography>
        </Box>
      </Box>
      
      <Divider sx={{ opacity: 0.6 }} />
      
      <List sx={{ px: 2, py: 3, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          if (item.roles.length === 0 || item.roles.some(role => hasRole(role))) {
            return (
              <ListItemButton
                key={item.text}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: '12px',
                  mb: 1,
                  py: 1.5,
                  backgroundColor: active ? 'primary.main' : 'transparent',
                  color: active ? 'primary.contrastText' : 'text.secondary',
                  '&:hover': {
                    backgroundColor: active ? 'primary.dark' : 'action.hover',
                    color: active ? 'primary.contrastText' : 'primary.main',
                    '& .MuiListItemIcon-root': {
                      color: active ? 'inherit' : 'primary.main',
                      transform: 'translateX(4px)'
                    }
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <ListItemIcon sx={{ 
                  color: active ? 'inherit' : 'text.secondary', 
                  minWidth: 40,
                  transition: 'all 0.3s'
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: active ? 'bold' : '600',
                    fontSize: '0.95rem'
                  }} 
                />
              </ListItemButton>
            );
          }
          return null;
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: hasRole('ROLE_ADMIN') ? '100%' : `calc(100% - ${drawerWidth}px)` },
          ml: { md: hasRole('ROLE_ADMIN') ? 0 : `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(12px)',
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(18, 18, 18, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: 70 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!hasRole('ROLE_ADMIN') && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" fontWeight="800" sx={{ color: 'primary.main', letterSpacing: 0.5 }}>
              {title || 'Coffee Shop'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ThemeSwitcher />
            <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" fontWeight="bold">
                  {user?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.roles?.[0]?.replace('ROLE_', '')}
                </Typography>
              </Box>
              <Tooltip title="Profile Settings">
                <Avatar 
                  sx={{ 
                    width: 35, 
                    height: 35, 
                    bgcolor: 'primary.light',
                    cursor: 'pointer',
                    '&:hover': { transform: 'scale(1.1)' },
                    transition: 'transform 0.2s'
                  }}
                >
                  {user?.name?.charAt(0)}
                </Avatar>
              </Tooltip>
              <Tooltip title="Logout">
                <IconButton 
                  onClick={handleLogout}
                  sx={{ 
                    ml: 1, 
                    color: 'error.main',
                    border: '1px solid',
                    borderColor: 'error.light',
                    borderRadius: '10px',
                    '&:hover': { 
                      bgcolor: 'error.main', 
                      color: 'white',
                      borderColor: 'error.main'
                    },
                    transition: 'all 0.2s'
                  }}
                  size="small"
                >
                  <Logout fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: (hasRole('ROLE_ADMIN') ? 0 : drawerWidth) }, flexShrink: { md: (hasRole('ROLE_ADMIN') ? 0 : 1) } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: hasRole('ROLE_ADMIN') ? 'block' : 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
              boxShadow: '10px 0 30px rgba(0,0,0,0.1)'
            },
          }}
        >
          {drawer}
        </Drawer>
        {!hasRole('ROLE_ADMIN') && (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
                borderRight: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper'
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>


      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { md: hasRole('ROLE_ADMIN') ? '100%' : `calc(100% - ${drawerWidth}px)` },
          mt: '70px',
          minHeight: 'calc(100vh - 70px)',
          transition: 'all 0.3s'
        }}
      >
        {!isDashboard && (
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
            <IconButton 
              onClick={() => navigate('/dashboard')}
              sx={{ 
                mr: 2,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                '&:hover': { 
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  transform: 'translateX(-4px)'
                },
                transition: 'all 0.2s'
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
        <Container maxWidth="xl" sx={{ p: 0, animation: 'fadeIn 0.5s ease' }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};


export default Layout;
