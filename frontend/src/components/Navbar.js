import React from 'react';
import { AppBar, Toolbar, Button, Box, Paper, IconButton } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';

const navItems = [
  { label: 'Home', to: '/about', icon: <HomeOutlinedIcon /> },
  { label: 'Customer Spend Prediction', to: '/ml', icon: <BarChartOutlinedIcon /> },
  { label: 'Customer Segmentation', to: '/segmentation', icon: <GroupsOutlinedIcon /> },
  { label: 'Churn Risk Classification', to: '/churn', icon: <WarningAmberOutlinedIcon /> },
];

const Navbar = () => {
  const location = useLocation();
  return (
    <AppBar position="static" elevation={0} sx={{ background: 'transparent', boxShadow: 'none', pt: 0 }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', minHeight: 'unset', p: 0, position: 'relative' }}>
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            background: 'transparent',
            boxShadow: 'none',
            borderRadius: 0,
            px: 2,
            py: 0.5,
            minHeight: 56,
            gap: 3.5,
            mx: 'auto',
          }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to === '/about' && location.pathname === '/');
            return (
              <Button
                key={item.to}
                component={Link}
                to={item.to}
                startIcon={item.icon}
                sx={{
                  color: isActive ? '#2c50b8' : '#222',
                  fontWeight: 500,
                  fontSize: '1.05rem',
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2.2,
                  py: 1.2,
                  minWidth: 0,
                  position: 'relative',
                  background: 'transparent',
                  boxShadow: 'none',
                  '&:hover': {
                    background: 'rgba(44,80,184,0.07)',
                  },
                  '&:after': isActive
                    ? {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        left: 12,
                        right: 12,
                        bottom: 4,
                        height: '3px',
                        borderRadius: 2,
                        background: '#2c50b8',
                      }
                    : {},
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Paper>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
