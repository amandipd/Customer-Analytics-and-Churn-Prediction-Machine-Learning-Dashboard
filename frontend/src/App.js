import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, IconButton } from '@mui/material';
import theme from './theme';
import Navbar from './components/Navbar';
import GitHubIcon from '@mui/icons-material/GitHub';
import MLPage from './pages/ML';
import SegmentationPage from './pages/Segmentation';
import ChurnPage from './pages/Churn';
import About from './pages/About';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* GitHub icon in top right corner, independent of navbar */}
        <IconButton
          href="https://github.com/amandipd/Customer-Analytics-and-Churn-Prediction-Machine-Learning-Dashboard"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            position: 'absolute',
            top: 8,
            right: 12,
            zIndex: 1200,
            color: '#222',
            background: 'transparent',
            '&:hover': { color: '#2c50b8', background: 'rgba(44,80,184,0.07)' }
          }}
          aria-label="GitHub Repository"
        >
          <GitHubIcon fontSize="medium" />
        </IconButton>
        <Navbar />
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/segmentation" element={<SegmentationPage />} />
          <Route path="/churn" element={<ChurnPage />} />
          <Route path="/ml" element={<MLPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
