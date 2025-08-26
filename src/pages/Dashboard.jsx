import React from 'react';
import { Box, Typography, Grid, useMediaQuery, Paper } from '@mui/material';
import { keyframes } from '@mui/system';
import TodoCard from '../cards/TodoCard.jsx';
import ContactsCard from '../cards/ContactsCard.jsx';
import MailsCard from '../cards/MailsCard.jsx';
import FinanceCard from '../cards/FinanceCard.jsx';
import JournalCard from '../cards/JournalCard.jsx';
import FitnessCard from '../cards/FitnessCard.jsx';
import ProjectsCard from '../cards/ProjectsCard.jsx';
import RecipesCard from '../cards/RecipesCard.jsx';
import GradesCard from '../cards/GradesCard.jsx';
import SkillsCard from '../cards/SkillsCard.jsx';
import DashboardActivityBarChart from '../components/DashboardActivityBarChart';

const flashRed = keyframes`
  0% { background: #fff; }
  50% { background: #ffebee; }
  100% { background: #fff; }
`;

export default function Dashboard() {
  const isXs = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme => theme.breakpoints.between('sm', 'md'));
  const chartHeight = isXs ? 250 : isSm ? 300 : 380;
  const chartWidth = isXs ? 320 : isSm ? 600 : 1380;

  const cardStyle = {
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    borderRadius: 8,
    color: '#222',
    minHeight: 120,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    transition: 'transform 0.3s ease',
    '&:hover': { transform: 'scale(1.03)', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }
  };

  return (
      <Box sx={{ minHeight: '100vh', p: { xs: 1, sm: 2, md: 3 }, background: '#f7f9fc', color: '#222' }}>
        <Typography variant="h4" mb={3} fontWeight="bold" color="primary"
                    sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
          Main Logistics Overview
        </Typography>

        <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} mb={{ xs: 3, md: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}><FinanceCard cardStyle={cardStyle} /></Grid>
          <Grid item xs={12} sm={6} md={2.4}><JournalCard cardStyle={cardStyle} /></Grid>
          <Grid item xs={12} sm={6} md={2.4}><FitnessCard cardStyle={cardStyle} /></Grid>
          <Grid item xs={12} sm={6} md={2.4}><RecipesCard cardStyle={cardStyle} flashRed={flashRed} /></Grid>
          <Grid item xs={12} sm={6} md={2.4}><GradesCard cardStyle={cardStyle} /></Grid>
          <Grid item xs={12} sm={6} md={2.4}><MailsCard cardStyle={cardStyle} /></Grid>
        </Grid>

        <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} mb={{ xs: 3, md: 5 }}>
          <Grid item xs={12} sm={6} md={2.4}><TodoCard cardStyle={cardStyle} /></Grid>
          <Grid item xs={12} sm={6} md={2.4}><ContactsCard cardStyle={cardStyle} /></Grid>
          <Grid item xs={12} sm={6} md={2.4}><ProjectsCard cardStyle={cardStyle} /></Grid>
          <Grid item xs={12} sm={6} md={2.4}><SkillsCard cardStyle={cardStyle} /></Grid>
          <Grid item xs={12} sm={6} md={2.4}><DashboardActivityBarChart cardStyle={cardStyle} /></Grid>
        </Grid>

      </Box>

    );
}