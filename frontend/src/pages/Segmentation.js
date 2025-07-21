import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import SegmentationForm from '../components/SegmentationForm';
import SegmentationResults from '../components/SegmentationResults';
import RenderDelayNote from '../components/RenderDelayNote';

const Segmentation = () => {
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

  // Wrap setResult to also set status
  const handleSetResult = (res) => {
    if (res && res.error) {
      setStatus('error');
    } else if (res && res.stats && Object.keys(res.stats).length > 0) {
      setStatus('success');
    } else {
      setStatus('success'); // treat empty as success for empty result message
    }
    setResult(res);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
        <Grid item xs={12} md={6} lg={5} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600, background: 'rgba(255,255,255,0.24)', color: '#111', borderRadius: 4 }}>
            <Typography variant="h5" gutterBottom>
              Customer Segmentation
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: '#555' }}>
              Use clustering algorithms to segment customers based on their behavior and characteristics. Choose between K-Means (for predefined clusters) or DBSCAN (for density-based clustering).
            </Typography>
            <SegmentationForm setResult={handleSetResult} setStatus={setStatus} segmentationStatus={status} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={5} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
          <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500, background: 'rgba(255,255,255,0.24)', color: '#111', borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Segmentation Results
            </Typography>
            <Box sx={{ color: '#555' }}>
              <SegmentationResults result={result} status={status} />
            </Box>
          </Paper>
          <RenderDelayNote />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Segmentation;
