import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import BaristaView from './pages/BaristaView';
import Orders from './pages/Orders';
import MenuManagement from './pages/MenuManagement';
import InventoryManagement from './pages/InventoryManagement';
import UserManagement from './pages/UserManagement';
import Analytics from './pages/Analytics';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6F4E37',
    },
    secondary: {
      main: '#D2691E',
    },
  },
});

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.some(role => user.roles.includes(role))) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/pos" element={<PrivateRoute roles={['ROLE_CASHIER', 'ROLE_ADMIN']}><POS /></PrivateRoute>} />
      <Route path="/orders" element={<PrivateRoute roles={['ROLE_CASHIER', 'ROLE_BARISTA', 'ROLE_ADMIN']}><Orders /></PrivateRoute>} />
      <Route path="/barista" element={<PrivateRoute roles={['ROLE_BARISTA', 'ROLE_ADMIN']}><BaristaView /></PrivateRoute>} />
      <Route path="/menu" element={<PrivateRoute roles={['ROLE_ADMIN']}><MenuManagement /></PrivateRoute>} />
      <Route path="/inventory" element={<PrivateRoute roles={['ROLE_INVENTORY_MANAGER', 'ROLE_ADMIN']}><InventoryManagement /></PrivateRoute>} />
      <Route path="/users" element={<PrivateRoute roles={['ROLE_ADMIN']}><UserManagement /></PrivateRoute>} />
      <Route path="/analytics" element={<PrivateRoute roles={['ROLE_ADMIN']}><Analytics /></PrivateRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
