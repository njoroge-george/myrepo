import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const MainContent = ({ tab, isLoading, ...props }) => {
  switch (tab) {
    case 0:
      return <props.CodeEditor {...props} />;
    case 1:
      return <props.Discussion {...props} />;
    case 2:
      return <props.Leaderboard {...props} />;
    case 3:
      return <props.Stats {...props} />;
    case 4:
      return <props.AdminPanel {...props} />;
    case 5:
      return <props.VoiceRoom {...props} />;
    case 6: <props.ChallengeWorkspace {...props} />;
    default:
      return null;
  }
};

export default MainContent;