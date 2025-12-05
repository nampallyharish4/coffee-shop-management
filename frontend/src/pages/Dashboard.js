import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, CardActionArea } from '@mui/material';
import {
  ShoppingCart, Restaurant, Inventory, People, Analytics, Menu as MenuIcon, Receipt
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  const cards = [
    { title: 'POS', icon: <ShoppingCart sx={{ fontSize: 60 }} />, path: '/pos', roles: ['ROLE_CASHIER', 'ROLE_ADMIN'] },
    { title: 'Orders', icon: <Receipt sx={{ fontSize: 60 }} />, path: '/orders', roles: ['ROLE_CASHIER', 'ROLE_BARISTA', 'ROLE_ADMIN'] },
    { title: 'Barista View', icon: <Restaurant sx={{ fontSize: 60 }} />, path: '/barista', roles: ['ROLE_BARISTA', 'ROLE_ADMIN'] },
    { title: 'Menu Management', icon: <MenuIcon sx={{ fontSize: 60 }} />, path: '/menu', roles: ['ROLE_ADMIN'] },
    { title: 'Inventory', icon: <Inventory sx={{ fontSize: 60 }} />, path: '/inventory', roles: ['ROLE_INVENTORY_MANAGER', 'ROLE_ADMIN'] },
    { title: 'User Management', icon: <People sx={{ fontSize: 60 }} />, path: '/users', roles: ['ROLE_ADMIN'] },
    { title: 'Analytics', icon: <Analytics sx={{ fontSize: 60 }} />, path: '/analytics', roles: ['ROLE_ADMIN'] },
  ];

  return (
    <Layout title="Dashboard">
      <Typography variant="h4" gutterBottom>
        Welcome to Coffee Shop Management
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {cards.map((card) => {
          if (card.roles.some(role => hasRole(role))) {
            return (
              <Grid item xs={12} sm={6} md={4} key={card.title}>
                <Card>
                  <CardActionArea onClick={() => navigate(card.path)}>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      {card.icon}
                      <Typography variant="h6" sx={{ mt: 2 }}>
                        {card.title}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          }
          return null;
        })}
      </Grid>
    </Layout>
  );
};

export default Dashboard;
