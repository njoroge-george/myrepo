import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import CoderCard from './CoderCard';
import { getSubmissionsByCoder } from '../../api/submissions';
import { getCoders } from '../../api/coders';

const CoderProfile = () => {
  const { id } = useParams();
  const [coder, setCoder] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoder = async () => {
      try {
        const res = await getCoders();
        const found = res.data.find((c) => c.id === parseInt(id));
        setCoder(found);
      } catch (err) {
        console.error('Failed to fetch coder:', err);
      }
    };

    const fetchSubmissions = async () => {
      try {
        const res = await getSubmissionsByCoder(id);
        setSubmissions(res.data);
      } catch (err) {
        console.error('Failed to fetch submissions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoder();
    fetchSubmissions();
  }, [id]);

  if (loading || !coder) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  const accepted = submissions.filter((s) => s.status === 'Accepted').length;
  const rejected = submissions.length - accepted;
  const avgScore = submissions.length
    ? submissions.reduce((acc, s) => acc + s.score, 0) / submissions.length
    : 0;

  return (
    <Box sx={{ p: 2 }}>
      <CoderCard
        coder={coder}
        stats={{
          total: submissions.length,
          accepted,
          rejected,
          avgScore,
        }}
      />

      <Typography variant="h6" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
        Submission History
      </Typography>

      <Grid container spacing={2}>
        {submissions.map((sub) => (
          <Grid item xs={12} md={6} key={sub.id}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {sub.Challenge?.title || 'Unknown Challenge'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Status: {sub.status} | Score: {sub.score.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Submitted: {new Date(sub.createdAt).toLocaleString()}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  backgroundColor: '#f5f5f5',
                  p: 1,
                  borderRadius: 1,
                }}
              >
                {sub.code}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CoderProfile;
