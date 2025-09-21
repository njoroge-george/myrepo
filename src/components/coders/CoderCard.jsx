import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Stack,
  Chip,
  useMediaQuery,
  useTheme
} from '@mui/material';

const CoderCard = ({ coder, stats }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card sx={{ width: '100%', mb: 2, boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {coder.name?.[0] || '?'}
          </Avatar>
          <Box>
            <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight="bold">
              {coder.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {coder.email}
            </Typography>
          </Box>
        </Box>

        {stats && (
          <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
            <Chip label={`Submissions: ${stats.total}`} size="small" />
            <Chip label={`Accepted: ${stats.accepted}`} color="success" size="small" />
            <Chip label={`Rejected: ${stats.rejected}`} color="error" size="small" />
            <Chip label={`Avg Score: ${stats.avgScore.toFixed(1)}%`} size="small" />
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default CoderCard;
