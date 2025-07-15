import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import SegmentationForm from '../components/SegmentationForm';
import SegmentationResults from '../components/SegmentationResults';

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
    <Container maxWidth={false} sx={{ mt: 4, width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Customer Segmentation
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Use clustering algorithms to segment customers based on their behavior and characteristics. 
        Choose between K-Means (for predefined clusters) or DBSCAN (for density-based clustering).
      </Typography>

      <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
        {/* Form on the left: 3/12, Results on the right: 4/12 */}
        <Grid item xs={12} sm={3} sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Paper elevation={3} sx={{ p: 4, minHeight: 500, width: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Segmentation Parameters
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select features and algorithm parameters to perform customer segmentation.
            </Typography>
            <SegmentationForm setResult={handleSetResult} setStatus={setStatus} segmentationStatus={status} />
          </Paper>
        </Grid>
        {/* Results on the right, aligned to top, with maxWidth and centered */}
        <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', maxWidth: 600, mx: 'auto', width: '100%' }}>
            <SegmentationResults result={result} status={status} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Segmentation;
