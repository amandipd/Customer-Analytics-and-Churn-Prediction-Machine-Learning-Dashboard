import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import MLForm from '../components/MLForm';
import axios from 'axios';

const ML = () => {
  const [result, setResult] = useState(null);
  const [model, setModel] = useState('linear-regression');
  const [residualPlot, setResidualPlot] = useState(null);
  const [loadingPlot, setLoadingPlot] = useState(false);
  const [plotError, setPlotError] = useState(null);

  // Automatically fetch residual plot after prediction
  useEffect(() => {
    if (result !== null) {
      const fetchPlot = async () => {
        setLoadingPlot(true);
        setPlotError(null);
        setResidualPlot(null);
        try {
          let apiModel = model.replace('-', '_');
          const res = await axios.post('http://127.0.0.1:8000/residual-plot', { model: apiModel });
          setResidualPlot(res.data.image_base64);
        } catch (err) {
          setPlotError('Could not fetch residual plot.');
        } finally {
          setLoadingPlot(false);
        }
      };
      fetchPlot();
    } else {
      setResidualPlot(null);
    }
  }, [result, model]);

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
        <Grid item xs={12} md={6} lg={5} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500, background: 'rgba(255,255,255,0.24)', color: '#111', borderRadius: 4 }}>
            <Typography variant="h5" gutterBottom>
              Model Prediction
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter customer details and select a model to predict their total spend.
            </Typography>
            <MLForm setResult={setResult} model={model} setModel={setModel} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={5} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500, background: 'rgba(255,255,255,0.24)', color: '#111', borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Prediction Results
            </Typography>
            <Box sx={{ color: 'text.secondary' }}>
              {result !== null ? (
                <>
                  <Typography variant="h6">Spend Prediction: ${typeof result.prediction === "number" ? result.prediction.toFixed(2) : result.prediction}</Typography>
                  {result.stats && !result.stats.error ? (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1">Test Statistics:</Typography>
                      <Typography variant="body2">R 8: {result.stats.r2?.toFixed(4)}</Typography>
                      <Typography variant="body2">MAE: {result.stats.mae?.toFixed(4)}</Typography>
                      <Typography variant="body2">RMSE: {result.stats.rmse?.toFixed(4)}</Typography>
                    </Box>
                  ) : result.stats && result.stats.error ? (
                    <Typography color="error">{result.stats.error}</Typography>
                  ) : null}
                  {loadingPlot && <Box sx={{ mt: 3, textAlign: 'center' }}><CircularProgress /></Box>}
                  {plotError && <Typography color="error" sx={{ mt: 2 }}>{plotError}</Typography>}
                  {residualPlot && !loadingPlot && (
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      <img
                        src={`data:image/png;base64,${residualPlot}`}
                        alt="Residual Plot"
                        style={{ maxWidth: '100%', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                      />
                    </Box>
                  )}
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