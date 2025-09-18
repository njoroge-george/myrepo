import React from 'react';
import { Box, Typography, Grid, useMediaQuery, useTheme } from '@mui/material';
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';

// Card imports
import Card1 from '../cards/Card1';
import Card2 from '../cards/Card2';
import Card3 from '../cards/Card3';
import Card4 from '../cards/Card4';
import FinanceCard from '../cards/FinanceCard';
import JournalCard from '../cards/JournalCard';
import FitnessCard from '../cards/FitnessCard';
import RecipesCard from '../cards/RecipesCard';
import GradesCard from '../cards/GradesCard';
import MailsCard from '../cards/MailsCard';
import TodoCard from '../cards/TodoCard';
import ContactsCard from '../cards/ContactsCard';
import ProjectsCard from '../cards/ProjectsCard';
import SkillsCard from '../cards/SkillsCard';
import DashboardActivityBarChart from '../components/DashboardActivityBarChart';

export default function Dashboard() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const cardStyle = {
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    borderRadius: 3,
    backgroundColor: '#ffffff',
    minHeight: 140,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 2,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
    },
  };

  const AnimatedCard = ({ children }) => (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {children}
      </motion.div>
  );

  return (
      <Box
          sx={{
            minHeight: '100vh',
            px: { xs: 2, sm: 3, md: 4 },
            py: 4,
            backgroundColor: '#f5f5f5',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
      >
        <Typography
            variant="h4"
            mb={4}
            fontWeight="bold"
            color="primary"
            align="center"
            sx={{ fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' } }}
        >
          George Logistics Overview
        </Typography>

        <Grid container spacing={3} sx={{ maxWidth: 1200, width: '100%' }}>
          {/* Section: Quick Access */}
          <Grid item xs={12}>
            <Typography variant="h6" color="textSecondary" mb={1}>Quick Access</Typography>
          </Grid>

          {[Card1, Card4, Card2, Card3].map((Card, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <AnimatedCard>
                  <Card style={cardStyle} title="Quick Card" content="Modular card layout" />
                </AnimatedCard>
              </Grid>
          ))}

          {/* Section: Personal Tools */}
          <Grid item xs={12}>
            <Typography variant="h6" color="textSecondary" mt={2} mb={1}>Personal Tools</Typography>
          </Grid>

          {[FinanceCard, JournalCard, FitnessCard, RecipesCard, GradesCard, MailsCard].map((Card, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <AnimatedCard>
                  <Link to={`/${Card.name.toLowerCase().replace('card', '')}`} style={{ textDecoration: 'none' }}>
                    <Card style={cardStyle} />
                  </Link>
                </AnimatedCard>
              </Grid>
          ))}

          {/* Section: Productivity */}
          <Grid item xs={12}>
            <Typography variant="h6" color="textSecondary" mt={2} mb={1}>Productivity</Typography>
          </Grid>

          {[TodoCard, ContactsCard, ProjectsCard, SkillsCard].map((Card, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <AnimatedCard>
                  <Card style={cardStyle} />
                </AnimatedCard>
              </Grid>
          ))}

          {/* Section: Activity Chart */}
          <Grid item xs={12}>
            <Typography variant="h6" color="textSecondary" mt={2} mb={1}>Activity Overview</Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <AnimatedCard>
              <Box sx={{ backgroundColor: '#fff', borderRadius: 3, boxShadow: 2, p: 3 }}>
                <DashboardActivityBarChart />
              </Box>
            </AnimatedCard>
          </Grid>
        </Grid>
      </Box>
  );
}
