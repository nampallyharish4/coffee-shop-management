import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, TextField, Button, Typography, Box, Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: { xs: 4, sm: 8 }, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom
            sx={{ 
              fontFamily: '"Cinzel", serif', 
              fontWeight: 800, 
              color: 'primary.main',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              mb: 1
            }}
          >
            Cloud Cafe
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary" sx={{ mb: 4, fontWeight: 500 }}>
            Management Portal
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
            >
              Login
            </Button>
          </form>


        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
