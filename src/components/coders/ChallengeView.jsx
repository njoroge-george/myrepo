import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Snackbar,
  Alert,
  Typography,
} from '@mui/material';
import ChallengeDetail from './ChallengeDetail';
import CodeEditor from './CodeEditor';
import ChallengeForm from './ChallengeForm';
import ChallengeLeaderboard from './ChallengeLeaderBoard';
import { getChallengeById } from '../../api/challenges';
import { getSubmissionsByChallenge, submitCode } from '../../api/submissions';
import { useSocket } from '../auth/socket';
import { useAuth } from '../auth/AuthContext';

const fallbackChallenge = {
  title: 'Untitled Challenge',
  description: 'Start coding freely.',
  difficulty: 'Easy',
  tags: [],
  starterCode: '',
};

const ChallengeView = () => {
  const { id } = useParams();
  const socket = useSocket();
  const { auth } = useAuth();
  const userId = auth?.id || null;
  const isAdmin = auth?.role === 'admin';

  const [challenge, setChallenge] = useState(fallbackChallenge);
  const [submissions, setSubmissions] = useState([]);
  const [toast, setToast] = useState(null);

  // 🔹 Fetch challenge and submissions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [challengeRes, submissionsRes] = await Promise.all([
          getChallengeById(id),
          getSubmissionsByChallenge(id),
        ]);
        if (challengeRes?.data) setChallenge(challengeRes.data);
        if (Array.isArray(submissionsRes?.data)) setSubmissions(submissionsRes.data);
      } catch (err) {
        console.warn('⚠️ Backend unreachable or challenge not found:', err.message);
      }
    };
    fetchData();
  }, [id]);

  // 🔹 Socket setup
  useEffect(() => {
    if (!userId || !socket) return;

    socket.emit('joinChallenge', { coderId: userId, challengeId: id });

    const handleNewSubmission = (submission) => {
      setSubmissions((prev) => [submission, ...prev]);
      setToast(`${submission?.Coder?.name || 'Someone'} submitted — ${submission.status}`);
    };

    socket.on('newSubmission', handleNewSubmission);
    return () => socket.off('newSubmission', handleNewSubmission);
  }, [id, socket, userId]);

  // 🔹 Submission handler
  const handleSubmit = async (code, language) => {
    try {
      const res = await submitCode({
        coderId: userId,
        challengeId: id,
        code,
        language,
      });
      setToast(`You submitted — ${res.data.status}`);
    } catch (err) {
      console.error('❌ Submission failed:', err);
      setToast('Submission failed');
    }
  };

  // 🔹 Main layout
  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      {!userId && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You’re not logged in. You can still explore the editor, but submissions won’t be saved.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ChallengeDetail challenge={challenge} />
          <ChallengeLeaderboard submissions={submissions} />
        </Grid>

        <Grid item xs={12} md={6}>
          <CodeEditor
            onSubmit={handleSubmit}
            starterCode={challenge?.starterCode || ''}
            disabled={!userId}
          />
        </Grid>

        {isAdmin && (
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Edit Challenge (Admin Only)
            </Typography>
            <ChallengeForm challenge={challenge} />
          </Grid>
        )}
      </Grid>

      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" variant="filled">
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChallengeView;
