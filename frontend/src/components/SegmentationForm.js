import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Button, 
  TextField, 
  MenuItem, 
  Box, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  CircularProgress
} from '@mui/material';

const algorithmOptions = [
  { value: 'kmeans', label: 'K-Means Clustering' },
  { value: 'dbscan', label: 'DBSCAN Clustering' }
];

const SegmentationForm = ({ setResult, setStatus, segmentationStatus }) => {
  const [algorithm, setAlgorithm] = useState('kmeans');
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [nClusters, setNClusters] = useState(3);
  const [eps, setEps] = useState(0.5);
  const [minSamples, setMinSamples] = useState(5);
  const [availableFeatures, setAvailableFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load available features from API
  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/segmentation/features');
        setAvailableFeatures(response.data.features);
      } catch (error) {
        console.error('Error loading features:', error);
        // Fallback to basic features if API fails
        setAvailableFeatures([
          { value: 'Age', label: 'Age', type: 'numeric' },
          { value: 'Items Purchased', label: 'Items Purchased', type: 'numeric' },
          { value: 'Average Rating', label: 'Average Rating', type: 'numeric' },
          { value: 'Discount Applied', label: 'Discount Applied', type: 'numeric' },
          { value: 'Days Since Last Purchase', label: 'Days Since Last Purchase', type: 'numeric' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadFeatures();
  }, []);

  const handleFeatureChange = (event) => {
    const value = event.target.value;
    setSelectedFeatures(typeof value === 'string' ? value.split(',') : value);
  };

  const handleAlgorithmChange = (event) => {
    setAlgorithm(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedFeatures.length < 2) {
      setResult({ error: 'Please select at least 2 features for clustering.' });
      return;
    }

    if (setStatus) setStatus('loading');
    try {
      const endpoint = algorithm === 'kmeans' ? '/segmentation/kmeans' : '/segmentation/dbscan';
      const payload = algorithm === 'kmeans' 
        ? { features: selectedFeatures, n_clusters: nClusters }
        : { features: selectedFeatures, eps: eps, min_samples: minSamples };

      const res = await axios.post(`http://127.0.0.1:8000${endpoint}`, payload);
      setResult({ 
        assignments: res.data.assignments, 
        stats: res.data.stats,
        algorithm: algorithm,
        features: selectedFeatures
      });
    } catch (err) {
      setResult({ error: 'Error: ' + (err.response?.data?.detail || err.message) });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Customer Segmentation</Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Clustering Algorithm</InputLabel>
          <Select
            value={algorithm}
            onChange={handleAlgorithmChange}
            label="Clustering Algorithm"
          >
            {algorithmOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Features for Clustering</InputLabel>
          <Select
            multiple
            value={selectedFeatures}
            onChange={handleFeatureChange}
            input={<OutlinedInput label="Features for Clustering" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => {
                  const feature = availableFeatures.find(f => f.value === value);
                  return <Chip key={value} label={feature?.label || value} size="small" />;
                })}
              </Box>
            )}
          >
            {availableFeatures.map((feature) => (
              <MenuItem key={feature.value} value={feature.value}>
                <Checkbox checked={selectedFeatures.indexOf(feature.value) > -1} />
                <ListItemText primary={feature.label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {algorithm === 'kmeans' && (
          <TextField
            label="Number of Clusters"
            type="number"
            value={nClusters}
            onChange={(e) => setNClusters(parseInt(e.target.value))}
            inputProps={{ min: 2, max: 10 }}
            fullWidth
            margin="normal"
          />
        )}

        {algorithm === 'dbscan' && (
          <>
            <TextField
              label="Epsilon (eps)"
              type="number"
              value={eps}
              onChange={(e) => setEps(parseFloat(e.target.value))}
              inputProps={{ min: 0.1, max: 2.0, step: 0.1 }}
              fullWidth
              margin="normal"
              helperText="Maximum distance between points to be considered neighbors"
            />
            <TextField
              label="Min Samples"
              type="number"
              value={minSamples}
              onChange={(e) => setMinSamples(parseInt(e.target.value))}
              inputProps={{ min: 2, max: 20 }}
              fullWidth
              margin="normal"
              helperText="Minimum number of samples to form a core point"
            />
          </>
        )}

        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth 
          sx={{ mt: 2 }}
          disabled={selectedFeatures.length < 2}
        >
          Run Segmentation
        </Button>
        {segmentationStatus === 'success' && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              You may need to scroll down to see results.
            </Typography>
          </Box>
        )}
      </form>
    </Box>
  );
};

export default SegmentationForm; 