import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, MenuItem, Box, Typography, FormControlLabel, Checkbox, Grid } from '@mui/material';

const modelOptions = [
  { value: 'linear-regression', label: 'Linear Regression' },
  { value: 'random-forest', label: 'Random Forest' },
  { value: 'xgboost', label: 'XGBoost' }
];

const defaultInput = {
  Gender: '',
  Age: '',
  City: '',
  Membership_Type: '',
  Items_Purchased: '',
  Average_Rating: '',
  Discount_Applied: false,
  Days_Since_Last_Purchase: '',
  Satisfaction_Level: ''
};

const allowedCities = [
  "Atlanta", "Austin", "Boston", "Chicago", "Dallas", "Denver", "Houston",
  "Las Vegas", "Los Angeles", "Miami", "New York", "Orlando", "Philadelphia",
  "Phoenix", "Portland", "San Diego", "San Francisco", "Seattle"
];
const membershipTypes = ["Bronze", "Silver", "Gold"];
const satisfactionLevels = ["Satisfied", "Neutral", "Unsatisfied"];
const genders = ["Male", "Female"];

const MLForm = ({ setResult, model, setModel }) => {
  const [input, setInput] = useState(defaultInput);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInput({
      ...input,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleModelChange = (e) => setModel(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/predict/${model}`,
        input
      );
      let stats = null;
      try {
        const statsRes = await axios.get(`http://127.0.0.1:8000/model-stats/${model}`);
        stats = statsRes.data;
      } catch (statsErr) {
        stats = { error: 'Could not fetch model statistics.' };
      }
      setResult({ prediction: res.data.prediction, stats });
    } catch (err) {
      setResult({ prediction: 'Error: ' + (err.response?.data?.detail || err.message), stats: null });
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 2 }}>
      <Typography variant="h5" gutterBottom>ML Prediction</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              select
              label="Model"
              value={model}
              onChange={handleModelChange}
              fullWidth
              size="small"
              margin="dense"
            >
              {modelOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Gender"
              name="Gender"
              value={input.Gender}
              onChange={handleChange}
              fullWidth
              size="small"
              margin="dense"
            >
              {genders.map(g => (
                <MenuItem key={g} value={g}>{g}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Age"
              name="Age"
              value={input.Age}
              onChange={handleChange}
              type="number"
              inputProps={{ min: 0, max: 150 }}
              fullWidth
              size="small"
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="City"
              name="City"
              value={input.City}
              onChange={handleChange}
              fullWidth
              size="small"
              margin="dense"
            >
              {allowedCities.map(city => (
                <MenuItem key={city} value={city}>{city}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Membership Type"
              name="Membership_Type"
              value={input.Membership_Type}
              onChange={handleChange}
              fullWidth
              size="small"
              margin="dense"
            >
              {membershipTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Items Purchased"
              name="Items_Purchased"
              value={input.Items_Purchased}
              onChange={handleChange}
              type="number"
              inputProps={{ min: 0 }}
              fullWidth
              size="small"
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Average Rating"
              name="Average_Rating"
              value={input.Average_Rating}
              onChange={handleChange}
              type="number"
              inputProps={{ min: 0, max: 5, step: 0.1 }}
              fullWidth
              size="small"
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={<Checkbox checked={input.Discount_Applied} onChange={handleChange} name="Discount_Applied" />}
              label="Discount Applied"
              sx={{ mt: 1, mb: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Days Since Last Purchase"
              name="Days_Since_Last_Purchase"
              value={input.Days_Since_Last_Purchase}
              onChange={handleChange}
              type="number"
              inputProps={{ min: 0 }}
              fullWidth
              size="small"
              margin="dense"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Satisfaction Level"
              name="Satisfaction_Level"
              value={input.Satisfaction_Level}
              onChange={handleChange}
              fullWidth
              size="small"
              margin="dense"
            >
              {satisfactionLevels.map(level => (
                <MenuItem key={level} value={level}>{level}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 1, mb: 1 }}>Predict</Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default MLForm; 