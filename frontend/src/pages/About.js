import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';

const About = () => (
  <Box sx={{ maxWidth: 800, mx: 'auto', mt: 6, mb: 6 }}>
    <Paper elevation={3} sx={{ p: 4, background: '#fff', color: '#111' }}>
      <Typography variant="h4" gutterBottom>Customer Analytics Dashboard</Typography>
      <Typography variant="h5" gutterBottom>About This Project</Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        This dashboard helps businesses better understand their customers and make smarter decisions using data. The platform offers three key features that work together to provide valuable customer insights:
      </Typography>
      <ul>
        <li>Predict future customer spending</li>
        <li>Group customers into meaningful segments for targeted marketing</li>
        <li>Identify customers at risk of leaving</li>
      </ul>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h5" gutterBottom>What the Dashboard Does</Typography>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}><b>1. Spend Prediction</b></Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        The system analyzes customer details like age, location, membership type, and purchase history to estimate how much a customer is likely to spend in the future. This helps businesses identify high-value customers and plan marketing or sales efforts more effectively.
      </Typography>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}><b>2. Customer Segmentation</b></Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        This feature groups customers into segments based on common characteristics like demographics, spending habits, and satisfaction levels. Each segment shows what makes that group unique, making it easier to create targeted campaigns and special offers. For example, businesses might discover a segment of loyal, high-spending customers who would respond well to exclusive rewards.
      </Typography>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}><b>3. Churn Risk Assessment</b></Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        This tool predicts which customers are most likely to stop doing business with the company. By entering customer information, the system provides a risk score and probability, allowing businesses to reach out to at-risk customers before they leave.
      </Typography>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h5" gutterBottom>How It Works</Typography>
      <Typography variant="body2" color="text.secondary">
        The dashboard uses machine learning models behind the scenes, but no data science expertise is required. Business users can simply fill in the forms and let the dashboard handle the complex analysis automatically.
      </Typography>
    </Paper>
  </Box>
);

export default About; 