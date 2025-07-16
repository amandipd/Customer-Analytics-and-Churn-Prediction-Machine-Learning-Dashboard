import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import Navbar from './components/Navbar';
import MLPage from './pages/ML';
import SegmentationPage from './pages/Segmentation';
import ChurnPage from './pages/Churn';
import About from './pages/About';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<MLPage />} />
          <Route path="/segmentation" element={<SegmentationPage />} />
          <Route path="/churn" element={<ChurnPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
