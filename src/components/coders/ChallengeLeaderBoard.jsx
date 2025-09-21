import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';

const ChallengeLeaderboard = ({ submissions }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!submissions || submissions.length === 0) return null;

  const sorted = [...submissions].sort((a, b) => b.score - a.score);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold" gutterBottom>
        Leaderboard
      </Typography>

      <Table size={isMobile ? 'small' : 'medium'}>
        <TableHead>
          <TableRow>
            <TableCell>Coder</TableCell>
            <TableCell>Score</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Submitted At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((sub, idx) => (
            <TableRow key={sub.id}>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar sx={{ width: 24, height: 24 }}>
                    {sub.Coder?.name?.[0] || '?'}
                  </Avatar>
                  <Typography variant="body2">{sub.Coder?.name || 'Unknown'}</Typography>
                </Box>
              </TableCell>
              <TableCell>{sub.score.toFixed(1)}%</TableCell>
              <TableCell>{sub.status}</TableCell>
              <TableCell>{new Date(sub.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default ChallengeLeaderboard;
