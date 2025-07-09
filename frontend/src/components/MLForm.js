import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, MenuItem, Box, Typography, FormControlLabel, Checkbox } from '@mui/material';

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

const MLForm = () => {
  const [input, setInput] = useState(defaultInput);
  const [model, setModel] = useState('linear-regression');
  const [result, setResult] = useState(null);

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
      setResult(res.data.prediction);
    } catch (err) {
      setResult('Error: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>ML Prediction</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Model"
          value={model}
          onChange={handleModelChange}
          fullWidth
          margin="normal"
        >
          {modelOptions.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </TextField>
        <TextField label="Gender" name="Gender" value={input.Gender} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Age" name="Age" value={input.Age} onChange={handleChange} type="number" fullWidth margin="normal" />
        <TextField label="City" name="City" value={input.City} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Membership Type" name="Membership_Type" value={input.Membership_Type} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Items Purchased" name="Items_Purchased" value={input.Items_Purchased} onChange={handleChange} type="number" fullWidth margin="normal" />
        <TextField label="Average Rating" name="Average_Rating" value={input.Average_Rating} onChange={handleChange} type="number" fullWidth margin="normal" />
        <FormControlLabel
          control={<Checkbox checked={input.Discount_Applied} onChange={handleChange} name="Discount_Applied" />}
          label="Discount Applied"
        />
        <TextField label="Days Since Last Purchase" name="Days_Since_Last_Purchase" value={input.Days_Since_Last_Purchase} onChange={handleChange} type="number" fullWidth margin="normal" />
        <TextField label="Satisfaction Level" name="Satisfaction_Level" value={input.Satisfaction_Level} onChange={handleChange} fullWidth margin="normal" />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Predict</Button>
      </form>
      {result !== null && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Prediction: {result}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default MLForm; 