import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Box, TextField, Button, MenuItem, Alert, FormControlLabel, Checkbox } from '@mui/material';
import axios from 'axios';

const genders = ['Male', 'Female'];
const membershipTypes = ['Bronze', 'Silver', 'Gold'];
const satisfactionLevels = ['Satisfied', 'Neutral', 'Unsatisfied'];
const cities = [
  'Atlanta', 'Austin', 'Boston', 'Chicago', 'Dallas', 'Denver', 'Houston',
  'Las Vegas', 'Los Angeles', 'Miami', 'New York', 'Orlando', 'Philadelphia',
  'Phoenix', 'Portland', 'San Diego', 'San Francisco', 'Seattle'
];

const defaultInput = {
  Age: '',
  Total_Spend: '',
  Items_Purchased: '',
  Average_Rating: '',
  Discount_Applied: '',
  Days_Since_Last_Purchase: '',
  Gender: '',
  City: '',
  Membership_Type: '',
  Satisfaction_Level: ''
};

const ChurnForm = ({ setResult }) => {
  const [input, setInput] = useState(defaultInput);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      // Prepare payload with categorical fields (backend will handle one-hot encoding)
      const payload = {
        Age: Number(input.Age),
        Total_Spend: Number(input.Total_Spend),
        Items_Purchased: Number(input.Items_Purchased),
        Average_Rating: Number(input.Average_Rating),
        Discount_Applied: input.Discount_Applied ? 1 : 0,
        Days_Since_Last_Purchase: Number(input.Days_Since_Last_Purchase),
        Gender: input.Gender,
        City: input.City,
        Membership_Type: input.Membership_Type,
        Satisfaction_Level: input.Satisfaction_Level
      };
      const res = await axios.post('http://127.0.0.1:8000/predict/churn', payload);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} sx={{ minWidth: 220 }}>
          <TextField label="Age" name="Age" value={input.Age} onChange={handleChange} type="number" fullWidth margin="dense" required inputProps={{ min: 0, max: 150 }} size="small" InputLabelProps={{ style: { color: '#222' } }} InputProps={{ style: { color: '#222' } }} />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ minWidth: 220 }}>
          <TextField label="Total Spend" name="Total_Spend" value={input.Total_Spend} onChange={handleChange} type="number" fullWidth margin="dense" required inputProps={{ min: 0 }} size="small" InputLabelProps={{ style: { color: '#222' } }} InputProps={{ style: { color: '#222' } }} />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ minWidth: 220 }}>
          <TextField label="Items Purchased" name="Items_Purchased" value={input.Items_Purchased} onChange={handleChange} type="number" fullWidth margin="dense" required inputProps={{ min: 0 }} size="small" InputLabelProps={{ style: { color: '#222' } }} InputProps={{ style: { color: '#222' } }} />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ minWidth: 220 }}>
          <TextField label="Average Rating" name="Average_Rating" value={input.Average_Rating} onChange={handleChange} type="number" fullWidth margin="dense" required inputProps={{ min: 0, max: 5, step: 0.1 }} size="small" InputLabelProps={{ style: { color: '#222' } }} InputProps={{ style: { color: '#222' } }} />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ minWidth: 220 }}>
          <FormControlLabel
            control={<Checkbox checked={!!input.Discount_Applied} onChange={handleChange} name="Discount_Applied" />}
            label="Discount Applied"
            sx={{ display: 'block', mt: 1, mb: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ minWidth: 220 }}>
          <TextField label="Days Since Last Purchase" name="Days_Since_Last_Purchase" value={input.Days_Since_Last_Purchase} onChange={handleChange} type="number" fullWidth margin="dense" required inputProps={{ min: 0 }} size="small" InputLabelProps={{ style: { color: '#222' } }} InputProps={{ style: { color: '#222' } }} />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ minWidth: 220 }}>
          <TextField select label="Gender" name="Gender" value={input.Gender} onChange={handleChange} fullWidth margin="dense" required size="small" InputLabelProps={{ style: { color: '#222' } }} InputProps={{ style: { color: '#222' } }}>
            {genders.map((gender) => (
              <MenuItem key={gender} value={gender}>{gender}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ minWidth: 220 }}>
          <TextField select label="City" name="City" value={input.City} onChange={handleChange} fullWidth margin="dense" required size="small" InputLabelProps={{ style: { color: '#222' } }} InputProps={{ style: { color: '#222' } }}>
            {cities.map((city) => (
              <MenuItem key={city} value={city}>{city}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ minWidth: 220 }}>
          <TextField select label="Membership Type" name="Membership_Type" value={input.Membership_Type} onChange={handleChange} fullWidth margin="dense" required size="small" InputLabelProps={{ style: { color: '#222' } }} InputProps={{ style: { color: '#222' } }}>
            {membershipTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ minWidth: 220 }}>
          <TextField select label="Satisfaction Level" name="Satisfaction_Level" value={input.Satisfaction_Level} onChange={handleChange} fullWidth margin="dense" required size="small" InputLabelProps={{ style: { color: '#222' } }} InputProps={{ style: { color: '#222' } }}>
            {satisfactionLevels.map((level) => (
              <MenuItem key={level} value={level}>{level}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 1, mb: 1 }} disabled={loading}>
            {loading ? 'Predicting...' : 'Predict Churn Risk'}
          </Button>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Grid>
      </Grid>
    </form>
  );
};

const ChurnResults = ({ result }) => {
  if (!result) return null;
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Churn Risk Results
      </Typography>
      <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Churn Risk:</strong> {result.churn_risk === 1 ? 'At Risk' : 'Not at Risk'}
        </Typography>
        <Typography variant="body2">
          <strong>Risk of Losing Customer:</strong> {(result.probability * 100).toFixed(2)}%
        </Typography>
        <Typography variant="body2">
          <strong>Model Accuracy:</strong> {(result.model_accuracy * 100).toFixed(2)}%
        </Typography>
      </Paper>
    </Box>
  );
};

const Churn = () => {
  const [result, setResult] = useState(null);

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Churn Risk Classification
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Enter customer information to assess churn risk and view probability statistics.
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, maxWidth: 540, minHeight: 600, mx: 'auto', background: 'rgba(255,255,255,0.24)', color: '#111', borderRadius: 4 }}>
            <ChurnForm setResult={setResult} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChurnResults result={result} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Churn;
