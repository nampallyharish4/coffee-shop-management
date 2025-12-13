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
  const [isBackendReady, setIsBackendReady] = React.useState(false);

  React.useEffect(() => {
    const startTime = Date.now();
    const MIN_LOAD_TIME = 7000; // 7 seconds

    const checkBackend = async () => {
      try {
        // Try to fetch the Swagger UI page or a simple health endpoint
        // Using fetch to avoid axios interceptors that might redirect to login
        await fetch('http://localhost:8081/api-docs', {
          method: 'HEAD', 
          mode: 'no-cors' // We just want to know if it's reachable
        });
        
        // Backend is ready. Check if we need to wait longer to meet the minimum load time.
        const elapsedTime = Date.now() - startTime;
        const remainingTime = MIN_LOAD_TIME - elapsedTime;

        if (remainingTime > 0) {
            setTimeout(() => setIsBackendReady(true), remainingTime);
        } else {
            setIsBackendReady(true);
        }

      } catch (error) {
        // Retry after 2 seconds
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
