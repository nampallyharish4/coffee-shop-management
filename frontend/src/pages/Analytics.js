import React, { useState, useEffect } from 'react';
import {
  Grid, Paper, Typography, Select, MenuItem, FormControl, InputLabel, Box,
  Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';
import { analyticsService } from '../services/api';

const Analytics = () => {
  const [range, setRange] = useState('daily');
  const [salesSummary, setSalesSummary] = useState(null);
  const [topItems, setTopItems] = useState([]);
  const [staffPerformance, setStaffPerformance] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, [range]);

  const loadAnalytics = async () => {
    try {
      const [sales, items, staff] = await Promise.all([
        analyticsService.getSales(range),
        analyticsService.getTopItems(range),
        analyticsService.getStaffPerformance(range)
      ]);
      setSalesSummary(sales.data.data || { totalRevenue: 0, orderCount: 0, averageOrderValue: 0 });
      setTopItems(items.data.data || []);
      setStaffPerformance(staff.data.data || []);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      // Set default values on error
      setSalesSummary({ totalRevenue: 0, orderCount: 0, averageOrderValue: 0 });
      setTopItems([]);
      setStaffPerformance([]);
    }
  };

  return (
    <Layout title="Analytics & Reports">
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Time Range</InputLabel>
          <Select value={range} onChange={(e) => setRange(e.target.value)}>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Total Revenue</Typography>
            <Typography variant="h4">₹{salesSummary?.totalRevenue || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Total Orders</Typography>
            <Typography variant="h4">{salesSummary?.orderCount || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Avg Order Value</Typography>
            <Typography variant="h4">₹{salesSummary?.averageOrderValue || 0}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Top Selling Items</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topItems}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="itemName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalQuantity" fill="#6F4E37" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Staff Performance</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Staff Name</TableCell>
                  <TableCell align="right">Orders</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staffPerformance.map((staff, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{staff.userName}</TableCell>
                    <TableCell align="right">{staff.orderCount}</TableCell>
                    <TableCell align="right">₹{staff.totalRevenue || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Analytics;
