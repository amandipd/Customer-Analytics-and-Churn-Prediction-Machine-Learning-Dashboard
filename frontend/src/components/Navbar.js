import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <AppBar position="static" color="primary" elevation={2}>
    <Toolbar sx={{ justifyContent: 'center' }}>
      <Box sx={{ mx: 'auto', display: 'flex', gap: 4 }}>
        <Button color="inherit" component={Link} to="/about" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
          About This Project
        </Button>
        <Button color="inherit" component={Link} to="/" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
          Customer Spend Prediction
        </Button>
        <Button color="inherit" component={Link} to="/segmentation" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
          Customer Segmentation
        </Button>
        <Button color="inherit" component={Link} to="/churn" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
          Churn Risk Classification
        </Button>
      </Box>
    </Toolbar>
  </AppBar>
);

export default Navbar;
