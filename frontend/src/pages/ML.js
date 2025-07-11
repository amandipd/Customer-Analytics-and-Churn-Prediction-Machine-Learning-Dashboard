import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import MLForm from '../components/MLForm';

const ML = () => {
  const [result, setResult] = useState(null);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Model Prediction
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter customer details and select a model to predict their total spend.
            </Typography>
            <MLForm setResult={setResult} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, minHeight: 300 }}>
            <Typography variant="h6" gutterBottom>
              Prediction Results
            </Typography>
            <Box sx={{ color: 'text.secondary' }}>
              {result !== null ? (
                <>
                  <Typography variant="h6">Prediction: {result.prediction}</Typography>
                  {result.stats && !result.stats.error ? (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1">Test Statistics:</Typography>
                      <Typography variant="body2">R²: {result.stats.r2?.toFixed(4)}</Typography>
                      <Typography variant="body2">MAE: {result.stats.mae?.toFixed(4)}</Typography>
                      <Typography variant="body2">RMSE: {result.stats.rmse?.toFixed(4)}</Typography>
                    </Box>
                  ) : result.stats && result.stats.error ? (
                    <Typography color="error">{result.stats.error}</Typography>
                  ) : null}
                </>
              ) : (
                'Results will appear here after you submit the form.'
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ML;