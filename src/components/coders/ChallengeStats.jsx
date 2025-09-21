// src/features/challenges/components/ChallengeStats.jsx
import { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  LinearProgress,
  Grid,
  CircularProgress,
} from "@mui/material";
import { getSubmissionsByChallenge } from "../../api/Coding";

const ChallengeStats = ({ challengeId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubmissionsByChallenge(challengeId).then((res) => {
      const submissions = res.data;
      const total = submissions.length;
      const accepted = submissions.filter((s) => s.status === "Accepted");
      const rejected = submissions.filter((s) => s.status === "Rejected");
      const avgScore =
        total > 0
          ? Math.round(
              submissions.reduce((sum, s) => sum + s.score, 0) / total
            )
          : 0;

      setStats({
        total,
        accepted: accepted.length,
        rejected: rejected.length,
        acceptanceRate: total > 0 ? Math.round((accepted.length / total) * 100) : 0,
        avgScore,
      });
      setLoading(false);
    });
  }, [challengeId]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Challenge Stats
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body2">Total Submissions</Typography>
          <Typography variant="h6">{stats.total}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">Accepted</Typography>
          <Typography variant="h6" color="success.main">
            {stats.accepted}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2">Acceptance Rate</Typography>
          <LinearProgress
            variant="determinate"
            value={stats.acceptanceRate}
            sx={{ height: 10, borderRadius: 5 }}
          />
          <Typography variant="caption">{stats.acceptanceRate}%</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2">Average Score</Typography>
          <LinearProgress
            variant="determinate"
            value={stats.avgScore}
            color="secondary"
            sx={{ height: 10, borderRadius: 5 }}
          />
          <Typography variant="caption">{stats.avgScore}%</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ChallengeStats;
