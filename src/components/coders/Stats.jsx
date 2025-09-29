import React from 'react';
import { Typography, Paper, Box, Grid } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const StatCard = ({ icon, label, value }) => (
  <Paper elevation={3} sx={{ p: 2, textAlign: 'center', minWidth: 120 }}>
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
      {icon}
    </Box>
    <Typography variant="h6">{value}</Typography>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
  </Paper>
);

const Stats = ({ usersCount, challengesCount, totalSolves }) => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>
      Platform Stats 📊
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <StatCard
          icon={<PeopleIcon fontSize="large" color="primary" />}
          label="Total Users"
          value={usersCount}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <StatCard
          icon={<AssignmentIcon fontSize="large" color="secondary" />}
          label="Challenges Created"
          value={challengesCount}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <StatCard
          icon={<CheckCircleIcon fontSize="large" color="success" />}
          label="Challenges Solved"
          value={totalSolves}
        />
      </Grid>
    </Grid>
  </Box>
);

export default Stats;
