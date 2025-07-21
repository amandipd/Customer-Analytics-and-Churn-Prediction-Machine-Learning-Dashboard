import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

const SegmentationResults = ({ result, status }) => {
  // Message to always show after loading
  const scrollMsg = (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary">
        You may need to scroll down to see results.
      </Typography>
    </Box>
  );

  if (status === 'idle') {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography sx={{ color: '#555' }}>
          Results will appear here after you submit the form.
        </Typography>
      </Box>
    );
  }

  if (status === 'loading') {
    return (
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" color="primary">
            Loading...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (status === 'error' || result?.error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" color="error">
            {result?.error || 'An error occurred.'}
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (
    status === 'success' &&
    (!result || !result.stats || Object.keys(result.stats).length === 0)
  ) {
    return (
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" color="error">
            No results to display.
          </Typography>
        </Paper>
      </Box>
    );
  }

  const { stats, algorithm, features } = result;
  const clusterIds = Object.keys(stats).sort((a, b) => parseInt(a) - parseInt(b));

  // Helper to get display cluster number (start at 1)
  const getClusterNumber = (clusterId, index) => {
    if (clusterId === '-1') return 'Noise';
    return (index + 1).toString();
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Algorithm: {algorithm === 'kmeans' ? 'K-Means Clustering' : 'DBSCAN Clustering'} | 
        Features: {features.join(', ')}
      </Typography>

      {/* Cluster Overview */}
      <Grid container direction="column" spacing={3} sx={{ mb: 4 }}>
        {clusterIds.map((clusterId, idx) => {
          const cluster = stats[clusterId];
          const displayNumber = getClusterNumber(clusterId, idx);
          return (
            <Grid item key={clusterId} xs={12}>
              <Card elevation={2} sx={{ background: 'rgba(255,255,255,0.24)', color: '#111', borderRadius: 4 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ mr: 2 }}>
                      Cluster {displayNumber}
                    </Typography>
                    <Chip 
                      label={`${cluster.size} customers`} 
                      size="small" 
                      color="primary" 
                    />
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {/* Numeric Statistics */}
                  <Typography variant="subtitle2" gutterBottom>
                    Average Values:
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      Total Spend: ${cluster.avg_total_spend?.toFixed(2) || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      Age: {cluster.avg_age?.toFixed(1) || 'N/A'} years
                    </Typography>
                    <Typography variant="body2">
                      Items: {cluster.avg_items_purchased?.toFixed(1) || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      Rating: {cluster.avg_rating?.toFixed(2) || 'N/A'}/5
                    </Typography>
                    <Typography variant="body2">
                      Days Since Purchase: {cluster.avg_days_since_last_purchase?.toFixed(1) || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      Discount Applied: {cluster.pct_discount_applied?.toFixed(1) || 'N/A'}%
                    </Typography>
                  </Box>
                  {/* Categorical Distributions */}
                  <Typography variant="subtitle2" gutterBottom>
                    Demographics:
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Gender: {cluster.gender_distribution?.Male ? 
                        `${(cluster.gender_distribution.Male * 100).toFixed(1)}% Male` : 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Membership: {cluster.membership_type_distribution?.Gold ? 
                        `${(cluster.membership_type_distribution.Gold * 100).toFixed(1)}% Gold` : 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Satisfaction: {cluster.satisfaction_level_distribution?.Satisfied ? 
                        `${(cluster.satisfaction_level_distribution.Satisfied * 100).toFixed(1)}% Satisfied` : 'N/A'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Cluster Size Comparison */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Cluster Size Distribution
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {clusterIds.map((clusterId, idx) => {
          const cluster = stats[clusterId];
          const totalCustomers = Object.values(stats).reduce((sum, c) => sum + c.size, 0);
          const percentage = ((cluster.size / totalCustomers) * 100).toFixed(1);
          const displayNumber = getClusterNumber(clusterId, idx);
          return (
            <Grid item xs={12} sm={6} md={3} key={clusterId}>
              <Paper elevation={1} sx={{ 
                p: 2, 
                textAlign: 'center', 
                background: 'rgba(255,255,255,0.24)',
                color: '#111',
                borderRadius: 3,
                boxShadow: '0 2px 8px 0 rgba(44,80,184,0.07)',
                m: 1
              }}>
                <Typography variant="h4" color="primary">
                  {cluster.size}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cluster {displayNumber} ({percentage}%)
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default SegmentationResults; 