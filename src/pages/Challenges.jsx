import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import ChallengeList from '../components/coders/ChallengeList';

const Challenges = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Coding Challenge Portal
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse challenges, test your skills, and climb the leaderboard.
        </Typography>
      </Box>

      <ChallengeList />
    </Container>
  );
};

export default Challenges;
