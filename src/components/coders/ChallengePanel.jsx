import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import ChallengeSelector from './ChallengeSelector';
import CodeEditor from './CodeEditor';
import { getChallenges } from '../../api/challenges';

const ChallengePanel = ({ user, onSolve }) => {
  const [challenges, setChallenges] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [fetching, setFetching] = useState(true);

  // 🔄 Fetch challenges on mount
  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const data = await getChallenges();
        const challengeArray = Array.isArray(data) ? data : data?.challenges || [];
        setChallenges(challengeArray);
        if (challengeArray.length > 0) {
          setSelectedId(challengeArray[0].id);
        }
      } catch (err) {
        console.error("Failed to load challenges:", err);
        setChallenges([]);
      } finally {
        setFetching(false);
      }
    };
    loadChallenges();
  }, []);

  // 🔄 Update selected challenge
  useEffect(() => {
    if (!Array.isArray(challenges)) {
      console.warn("Invalid challenges array:", challenges);
      setSelectedChallenge(null);
      return;
    }

    const challenge = challenges.find(c => c.id === selectedId);
    setSelectedChallenge(challenge || null);
  }, [selectedId, challenges]);

  return (
    <Box sx={{ p: 2 }}>
      {fetching ? (
        <Typography>Loading challenges...</Typography>
      ) : (
        <>
          <ChallengeSelector
            challenges={Array.isArray(challenges) ? challenges : []}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          {selectedChallenge ? (
            <CodeEditor
              challenge={selectedChallenge}
              onSubmitResult={onSolve}
            />
          ) : (
            <Typography variant="body2" sx={{ mt: 2 }}>
              No challenge selected.
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default ChallengePanel;
