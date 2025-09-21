import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Stack,
  Paper,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';

const difficultyColors = {
  Easy: 'success',
  Medium: 'warning',
  Hard: 'error',
};

const ChallengeDetail = ({ challenge }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!challenge) return null;

  return (
    <Paper elevation={4} sx={{ p: 3, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" flexWrap="wrap">
        <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold">
          {challenge.title}
        </Typography>
        <Chip
          label={challenge.difficulty}
          color={difficultyColors[challenge.difficulty] || 'default'}
          size="small"
        />
      </Box>

      <Typography variant="body1" sx={{ mt: 2 }}>
        {challenge.description}
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
        {challenge.tags.map((tag, idx) => (
          <Chip key={idx} label={tag} variant="outlined" size="small" />
        ))}
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" fontWeight="bold">
        Starter Code
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          mt: 1,
          backgroundColor: '#f5f5f5',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          overflowX: 'auto',
        }}
      >
        {challenge.starterCode || '// No starter code provided.'}
      </Paper>
    </Paper>
  );
};

export default ChallengeDetail;
