import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <AppBar
    position="static"
    elevation={0}
    sx={{
      background: '#232323',
      borderBottom: '1px solid #333',
      boxShadow: 'none',
      py: 1
    }}
  >
    <Toolbar sx={{ justifyContent: 'center', minHeight: 64 }}>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Button
          color="inherit"
          component={Link}
          to="/"
          sx={{
            fontWeight: 700,
            fontSize: '1.15rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
            color: '#fff',
            '&:hover': { color: '#8ab4f8', background: 'transparent' }
          }}
        >
          Model Prediction
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/segmentation"
          sx={{
            fontWeight: 700,
            fontSize: '1.15rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
            color: '#fff',
            '&:hover': { color: '#8ab4f8', background: 'transparent' }
          }}
        >
          Segmentation Graphs
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/churn"
          sx={{
            fontWeight: 700,
            fontSize: '1.15rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
            color: '#fff',
            '&:hover': { color: '#8ab4f8', background: 'transparent' }
          }}
        >
          Churn Risk Classification
        </Button>
      </Box>
    </Toolbar>
  </AppBar>
);

export default Navbar; 