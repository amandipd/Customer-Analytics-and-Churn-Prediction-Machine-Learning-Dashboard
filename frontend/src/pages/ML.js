import React from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import MLForm from '../components/MLForm';

const ML = () => (
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
          <MLForm />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 4, minHeight: 300 }}>
          <Typography variant="h6" gutterBottom>
            Prediction Results
          </Typography>
          {/* Display prediction results, stats, or charts here */}
          <Box sx={{ color: 'text.secondary' }}>
            Results will appear here after you submit the form.
          </Box>
        </Paper>
      </Grid>
    </Grid>
  </Container>
);

export default ML;