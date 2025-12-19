import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Loader from './components/Loader';
import { ThemeProviderWrapper } from './context/ThemeContext';
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



const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.some(role => user.roles.includes(role))) {
    if (user.roles.some(r => ['ROLE_ADMIN', 'ROLE_BARISTA'].includes(r))) return <Navigate to="/dashboard" />;
    if (user.roles.includes('ROLE_CASHIER')) return <Navigate to="/pos" />;
    return <Navigate to="/inventory" />;
  }

  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  const getHomePath = (user) => {
    if (!user) return '/login';
    if (user.roles.some(r => ['ROLE_ADMIN', 'ROLE_BARISTA'].includes(r))) return '/dashboard';
    if (user.roles.includes('ROLE_CASHIER')) return '/pos';
    return '/inventory';
  };
  const homePath = getHomePath(user);

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={homePath} /> : <Login />} />
      <Route path="/dashboard" element={<PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BARISTA']}><Dashboard /></PrivateRoute>} />
      <Route path="/pos" element={<PrivateRoute roles={['ROLE_CASHIER', 'ROLE_ADMIN']}><POS /></PrivateRoute>} />
      <Route path="/orders" element={<PrivateRoute roles={['ROLE_CASHIER', 'ROLE_BARISTA', 'ROLE_ADMIN']}><Orders /></PrivateRoute>} />
      <Route path="/barista" element={<PrivateRoute roles={['ROLE_BARISTA', 'ROLE_ADMIN']}><BaristaView /></PrivateRoute>} />
      <Route path="/menu" element={<PrivateRoute roles={['ROLE_ADMIN']}><MenuManagement /></PrivateRoute>} />
      <Route path="/inventory" element={<PrivateRoute roles={['ROLE_INVENTORY_MANAGER', 'ROLE_ADMIN']}><InventoryManagement /></PrivateRoute>} />
      <Route path="/users" element={<PrivateRoute roles={['ROLE_ADMIN']}><UserManagement /></PrivateRoute>} />
      <Route path="/analytics" element={<PrivateRoute roles={['ROLE_ADMIN']}><Analytics /></PrivateRoute>} />
      <Route path="/" element={<Navigate to={homePath} />} />
    </Routes>
  );
}

function App() {
  const [isBackendReady, setIsBackendReady] = React.useState(false);

  React.useEffect(() => {
    const startTime = Date.now();
    const minTime = 3000;

    const checkBackend = async () => {
      try {
        await fetch('http://localhost:8081/api-docs', {
          method: 'HEAD', 
          mode: 'no-cors' 
        });
        
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minTime - elapsed);
        
        setTimeout(() => setIsBackendReady(true), remaining);
      } catch (error) {
        setTimeout(checkBackend, 2000);
      }
    };

    checkBackend();
  }, []);

  return (
    <ThemeProviderWrapper>
      <CssBaseline />
      {!isBackendReady && <Loader />}
      {isBackendReady && (
        <AuthProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AppRoutes />
          </Router>
        </AuthProvider>
      )}
    </ThemeProviderWrapper>
  );
}

export default App;
