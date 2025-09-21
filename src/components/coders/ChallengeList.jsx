import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  CircularProgress,
  Box,
  TextField,
  MenuItem,
  Stack
} from '@mui/material';
import ChallengeCard from './ChallengeCard';
import { getChallenges } from '../../api/challenges';

const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

const ChallengeList = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState('All');

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await getChallenges();
      const data = Array.isArray(res.data) ? res.data : res.data?.challenges || [];
      setChallenges(data);
    } catch (err) {
      console.error('Failed to fetch challenges:', err);
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);


const safeChallenges = Array.isArray(challenges) ? challenges : [];
const filtered = safeChallenges.filter((c) =>
  difficultyFilter === 'All' ? true : c.difficulty === difficultyFilter
);

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Coding Challenges
        </Typography>
        <TextField
          select
          label="Filter by Difficulty"
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
        >
          {difficulties.map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((challenge) => (
            <Grid item xs={12} sm={6} md={4} key={challenge.id}>
              <ChallengeCard challenge={challenge} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ChallengeList;
