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
  // 1. Add local state for model selection
  const [localModel, setLocalModel] = useState(model);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInput({
      ...input,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleModelChange = (e) => setModel(e.target.value);

  // 3. On form submit, call setModel(localModel) before making the prediction request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setModel(localModel);
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/predict/${localModel}`,
        input
      );
      let stats = null;
      try {
        const statsRes = await axios.get(`http://127.0.0.1:8000/model-stats/${localModel}`);
        stats = statsRes.data;
      } catch (statsErr) {
        stats = { error: 'Could not fetch model statistics.' };
      }
      setResult({ prediction: res.data.prediction, stats });
    } catch (err) {
      setResult({ prediction: 'Error: ' + (err.response?.data?.detail || err.message), stats: null });
    }
  };

  // Add a function to check if all required fields are filled
  const isFormComplete = () => {
    return (
      localModel &&
      input.Gender &&
      input.Age !== '' &&
      input.City &&
      input.Membership_Type &&
      input.Items_Purchased !== '' &&
      input.Average_Rating !== '' &&
      input.Days_Since_Last_Purchase !== '' &&
      input.Satisfaction_Level
    );
  };

  return (
    <Box sx={{ minWidth: 400, minHeight: 650, mx: 'auto', mt: 2, color: '#222', width: '100%' }}>
      <Typography variant="h5" gutterBottom>ML Prediction</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={1} direction="column" sx={{ width: '100%' }}>
          <Grid item xs={12}>
            <TextField
              select
              label="Model"
              value={localModel}
              onChange={e => setLocalModel(e.target.value)}
              fullWidth
              size="small"
              margin="dense"
              InputLabelProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
              InputProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#fff',
                    color: '#000',
                    boxShadow: 3,
                  },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '& input': {
                    fontSize: '0.95rem',
                  },
                  '&:hover fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#e0e0e0',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.95rem',
                },
              }}
            >
              {modelOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Gender"
              name="Gender"
              value={input.Gender}
              onChange={handleChange}
              fullWidth
              size="small"
              margin="dense"
              InputLabelProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
              InputProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#fff',
                    color: '#000',
                    boxShadow: 3,
                  },
                },
                MenuListProps: {
                  sx: {
                    '& .MuiMenuItem-root': {
                      backgroundColor: '#fff',
                      color: '#000',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#ab1313',
                        color: '#000',
                      },
                    },
                  },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '& input': {
                    fontSize: '0.95rem',
                  },
                  '&:hover fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#e0e0e0',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.95rem',
                },
              }}
            >
              {genders.map(g => (
                <MenuItem key={g} value={g}>{g}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
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
              InputLabelProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
              InputProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '& input': {
                    fontSize: '0.95rem',
                  },
                  '&:hover fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#e0e0e0',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.95rem',
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="City"
              name="City"
              value={input.City}
              onChange={handleChange}
              fullWidth
              size="small"
              margin="dense"
              InputLabelProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
              InputProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#fff',
                    color: '#000',
                    boxShadow: 3,
                  },
                },
                MenuListProps: {
                  sx: {
                    '& .MuiMenuItem-root': {
                      backgroundColor: '#fff',
                      color: '#000',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#e0e0e0',
                        color: '#000',
                      },
                    },
                  },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '& input': {
                    fontSize: '0.95rem',
                  },
                  '&:hover fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#e0e0e0',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.95rem',
                },
              }}
            >
              {allowedCities.map(city => (
                <MenuItem key={city} value={city}>{city}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Membership Type"
              name="Membership_Type"
              value={input.Membership_Type}
              onChange={handleChange}
              fullWidth
              size="small"
              margin="dense"
              InputLabelProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
              InputProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#fff',
                    color: '#000',
                    boxShadow: 3,
                  },
                },
                MenuListProps: {
                  sx: {
                    '& .MuiMenuItem-root': {
                      backgroundColor: '#fff',
                      color: '#000',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#e0e0e0',
                        color: '#000',
                      },
                    },
                  },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '& input': {
                    fontSize: '0.95rem',
                  },
                  '&:hover fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#e0e0e0',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.95rem',
                },
              }}
            >
              {membershipTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
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
              InputLabelProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
              InputProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '& input': {
                    fontSize: '0.95rem',
                  },
                  '&:hover fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#e0e0e0',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.95rem',
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
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
              InputLabelProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
              InputProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '& input': {
                    fontSize: '0.95rem',
                  },
                  '&:hover fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#e0e0e0',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.95rem',
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ border: '1px solid #bbb', borderRadius: 1, p: 1 }}>
              <FormControlLabel
                control={<Checkbox checked={input.Discount_Applied} onChange={handleChange} name="Discount_Applied" />}
                label="Discount Applied"
                sx={{ mt: 0.5, mb: 0.5, fontSize: '0.95rem' }}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
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
              InputLabelProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
              InputProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '& input': {
                    fontSize: '0.95rem',
                  },
                  '&:hover fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#e0e0e0',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.95rem',
                },
              }}
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
              InputLabelProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
              InputProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#fff',
                    color: '#000',
                    boxShadow: 3,
                  },
                },
                MenuListProps: {
                  sx: {
                    '& .MuiMenuItem-root': {
                      backgroundColor: '#fff',
                      color: '#000',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#e0e0e0',
                        color: '#000',
                      },
                    },
                  },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '& input': {
                    fontSize: '0.95rem',
                  },
                  '&:hover fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#e0e0e0',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.95rem',
                },
              }}
            >
              {satisfactionLevels.map(level => (
                <MenuItem key={level} value={level}>{level}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 1, mb: 1 }} disabled={!isFormComplete()}>
              Predict
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default MLForm; 