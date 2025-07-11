import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import SegmentationForm from '../components/SegmentationForm';
import SegmentationResults from '../components/SegmentationResults';

const Segmentation = () => {
  const [result, setResult] = useState(null);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Customer Segmentation
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Use clustering algorithms to segment customers based on their behavior and characteristics. 
        Choose between K-Means (for predefined clusters) or DBSCAN (for density-based clustering).
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Segmentation Parameters
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select features and algorithm parameters to perform customer segmentation.
            </Typography>
            <SegmentationForm setResult={setResult} />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <SegmentationResults result={result} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Segmentation;
