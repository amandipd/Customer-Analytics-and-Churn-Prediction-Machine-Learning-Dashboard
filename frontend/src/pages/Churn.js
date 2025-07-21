import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import { TextField, Button, MenuItem, Alert, FormControlLabel, Checkbox, CircularProgress } from '@mui/material';
import axios from 'axios';
import RenderDelayNote from '../components/RenderDelayNote';

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


const ChurnForm = ({ setResult, setLoading }) => {
  const [input, setInput] = useState(defaultInput);
  const [error, setError] = useState('');

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
      const res = await axios.post('https://customer-analytics-and-churn-prediction-t7i4.onrender.com/predict/churn', payload);
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
          <TextField label="Age" name="Age" value={input.Age} onChange={handleChange} type="number" fullWidth margin="dense" required inputProps={{ min: 0, max: 150 }} size="small"
  InputLabelProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
  InputProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#e0e0e0' },
      '& input': { fontSize: '0.95rem' },
      '&:hover fieldset': { borderColor: '#e0e0e0' },
      '&.Mui-focused fieldset': { borderColor: '#e0e0e0' }
    },
    '& .MuiInputLabel-root': { fontSize: '0.95rem' }
  }}
/>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ minWidth: 220 }}>
          <TextField label="Total Spend" name="Total_Spend" value={input.Total_Spend} onChange={handleChange} type="number" fullWidth margin="dense" required inputProps={{ min: 0 }} size="small"
  InputLabelProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
  InputProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#e0e0e0' },
      '& input': { fontSize: '0.95rem' },
      '&:hover fieldset': { borderColor: '#e0e0e0' },
      '&.Mui-focused fieldset': { borderColor: '#e0e0e0' }
    },
    '& .MuiInputLabel-root': { fontSize: '0.95rem' }
  }}
/>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ minWidth: 220 }}>
          <TextField label="Items Purchased" name="Items_Purchased" value={input.Items_Purchased} onChange={handleChange} type="number" fullWidth margin="dense" required inputProps={{ min: 0 }} size="small"
  InputLabelProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
  InputProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#e0e0e0' },
      '& input': { fontSize: '0.95rem' },
      '&:hover fieldset': { borderColor: '#e0e0e0' },
      '&.Mui-focused fieldset': { borderColor: '#e0e0e0' }
    },
    '& .MuiInputLabel-root': { fontSize: '0.95rem' }
  }}
/>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ minWidth: 220 }}>
          <TextField label="Average Rating" name="Average_Rating" value={input.Average_Rating} onChange={handleChange} type="number" fullWidth margin="dense" required inputProps={{ min: 0, max: 5, step: 0.1 }} size="small"
  InputLabelProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
  InputProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#e0e0e0' },
      '& input': { fontSize: '0.95rem' },
      '&:hover fieldset': { borderColor: '#e0e0e0' },
      '&.Mui-focused fieldset': { borderColor: '#e0e0e0' }
    },
    '& .MuiInputLabel-root': { fontSize: '0.95rem' }
  }}
/>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ minWidth: 220 }}>
          <FormControlLabel
            control={<Checkbox checked={!!input.Discount_Applied} onChange={handleChange} name="Discount_Applied" />}
            label="Discount Applied"
            sx={{ display: 'block', mt: 1, mb: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ minWidth: 220 }}>
          <TextField label="Days Since Last Purchase" name="Days_Since_Last_Purchase" value={input.Days_Since_Last_Purchase} onChange={handleChange} type="number" fullWidth margin="dense" required inputProps={{ min: 0 }} size="small"
  InputLabelProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
  InputProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#e0e0e0' },
      '& input': { fontSize: '0.95rem' },
      '&:hover fieldset': { borderColor: '#e0e0e0' },
      '&.Mui-focused fieldset': { borderColor: '#e0e0e0' }
    },
    '& .MuiInputLabel-root': { fontSize: '0.95rem' }
  }}
/>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ minWidth: 220 }}>
          <TextField select label="Gender" name="Gender" value={input.Gender} onChange={handleChange} fullWidth margin="dense" required size="small"
  InputLabelProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
  InputProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#e0e0e0' },
      '& input': { fontSize: '0.95rem' },
      '&:hover fieldset': { borderColor: '#e0e0e0' },
      '&.Mui-focused fieldset': { borderColor: '#e0e0e0' }
    },
    '& .MuiInputLabel-root': { fontSize: '0.95rem' }
  }}
>
  {genders.map((gender) => (
    <MenuItem key={gender} value={gender}>{gender}</MenuItem>
  ))}
</TextField>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ minWidth: 220 }}>
          <TextField select label="City" name="City" value={input.City} onChange={handleChange} fullWidth margin="dense" required size="small"
  InputLabelProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
  InputProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#e0e0e0' },
      '& input': { fontSize: '0.95rem' },
      '&:hover fieldset': { borderColor: '#e0e0e0' },
      '&.Mui-focused fieldset': { borderColor: '#e0e0e0' }
    },
    '& .MuiInputLabel-root': { fontSize: '0.95rem' }
  }}
>
  {cities.map((city) => (
    <MenuItem key={city} value={city}>{city}</MenuItem>
  ))}
</TextField>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ minWidth: 220 }}>
          <TextField select label="Membership Type" name="Membership_Type" value={input.Membership_Type} onChange={handleChange} fullWidth margin="dense" required size="small"
  InputLabelProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
  InputProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#e0e0e0' },
      '& input': { fontSize: '0.95rem' },
      '&:hover fieldset': { borderColor: '#e0e0e0' },
      '&.Mui-focused fieldset': { borderColor: '#e0e0e0' }
    },
    '& .MuiInputLabel-root': { fontSize: '0.95rem' }
  }}
>
  {membershipTypes.map((type) => (
    <MenuItem key={type} value={type}>{type}</MenuItem>
  ))}
</TextField>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ minWidth: 220 }}>
          <TextField select label="Satisfaction Level" name="Satisfaction_Level" value={input.Satisfaction_Level} onChange={handleChange} fullWidth margin="dense" required size="small"
  InputLabelProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
  InputProps={{ style: { color: '#222', fontSize: '0.95rem' } }}
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#e0e0e0' },
      '& input': { fontSize: '0.95rem' },
      '&:hover fieldset': { borderColor: '#e0e0e0' },
      '&.Mui-focused fieldset': { borderColor: '#e0e0e0' }
    },
    '& .MuiInputLabel-root': { fontSize: '0.95rem' }
  }}
>
  {satisfactionLevels.map((level) => (
    <MenuItem key={level} value={level}>{level}</MenuItem>
  ))}
</TextField>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 1, mb: 1 }}>
            Predict Churn Risk
          </Button>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Grid>
      </Grid>
    </form>
  );
};

const ChurnResults = ({ result, loading }) => {
  if (loading) {
    return <Box sx={{ mt: 3, textAlign: 'center' }}><CircularProgress /></Box>;
  }
  return (
    <>
      {!result ? (
        <Typography sx={{ color: '#555', mt: 2 }}>
          Results will appear here after you submit the form.
        </Typography>
      ) : (
        <>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#222' }}>
            Churn Risk: <span style={{ fontWeight: 400 }}>{result.churn_risk === 1 ? 'At Risk' : 'Not at Risk'}</span>
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#222' }}>
            <b>Risk of Losing Customer:</b> {(result.probability * 100).toFixed(2)}%
          </Typography>
        </>
      )}
    </>
  );
};

const Churn = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
        <Grid item xs={12} md={6} lg={5} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600, background: 'rgba(255,255,255,0.24)', color: '#111', borderRadius: 4 }}>
            <Typography variant="h5" gutterBottom>
              Churn Risk Classification
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: '#555' }}>
              Enter customer information to assess churn risk and view probability statistics.
            </Typography>
            <ChurnForm setResult={setResult} setLoading={setLoading} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={5} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
          <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500, background: 'rgba(255,255,255,0.24)', color: '#111', borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Prediction Results
            </Typography>
            <Box sx={{ color: '#555' }}>
              <ChurnResults result={result} loading={loading} />
            </Box>
          </Paper>
          <RenderDelayNote />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Churn;
