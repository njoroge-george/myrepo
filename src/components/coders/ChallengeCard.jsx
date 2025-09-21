
import React from 'react';
import { Card, CardContent, Typography, Chip, Button, Stack, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const difficultyColors = {
  Easy: 'success',
  Medium: 'warning',
  Hard: 'error',
};

const ChallengeCard = ({ challenge }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ width: '100%', mb: 2, boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Typography variant="h6">{challenge.title}</Typography>
          <Chip
            label={challenge.difficulty}
            color={difficultyColors[challenge.difficulty] || 'default'}
            size="small"
          />
        </Box>

        <Typography variant="body2" sx={{ mt: 1 }}>
          {challenge.description.slice(0, 100)}...
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
          {challenge.tags.map((tag, idx) => (
            <Chip key={idx} label={tag} variant="outlined" size="small" />
          ))}
        </Stack>

        <Button
          variant="contained"
          size="small"
          sx={{ mt: 2 }}
          onClick={() => navigate(`/challenges/${challenge.id}`)}
        >
          View Challenge
        </Button>
      </CardContent>
    </Card>
  );
};

export default ChallengeCard;
