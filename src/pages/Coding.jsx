import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { useAuth } from '../components/auth/AuthContext';
import TopBar from '../components/coders/TopBar';
import ChallengeSelector from '../components/coders/ChallengeSelector';
import Discussion from '../components/coders/Discussion';
import Leaderboard from '../components/coders/Leaderboard';
import Stats from '../components/coders/Stats';
import VoiceRoom from '../components/coders/VoiceRoom';
import AdminPanel from '../components/coders/AdminPanel';
import { USER_ROLES, TABS } from '../components/coders/Constants';
import ChallengePanel from '../components/coders/ChallengePanel';
import CodeEditor from '../components/coders/CodeEditor';

const Coding = () => {
  const { auth: user } = useAuth();
  const [tab, setTab] = useState(0);
  const [room, setRoom] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const filteredTabs = TABS.filter(
    (t) => !(t.adminOnly && user.role !== USER_ROLES.ADMIN)
  );

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar roomName="Coding Room" />

      <Tabs value={tab} onChange={(e, val) => setTab(val)}>
        {filteredTabs.map((t) => (
          <Tab key={t.value} label={t.label} />
        ))}
      </Tabs>

      {tab === 0 &&
        (selectedChallenge ? (
          <CodeEditor
            challenge={selectedChallenge}
            goBack={() => setSelectedChallenge(null)}
          />
        ) : (
          <ChallengeSelector onSelect={setSelectedChallenge} />
        ))}

      {tab === 1 && (
        selectedChallenge ? (
         <Discussion 
           challengeId={selectedChallenge.id} 
           currentUser={user} 
         />
        ) : (
          <Box sx={{ p: 3 }}>
            <Typography variant="body1" color="text.secondary">
              Please select a challenge to view discussions.
            </Typography>
          </Box>
        )
      )}

      {tab === 2 && <Leaderboard user={user} />}
      {tab === 3 && <Stats user={user} />}
      {tab === 4 && user.role === USER_ROLES.ADMIN && <AdminPanel />}

      {tab === 5 && (
        <VoiceRoom
          room={room}
          joinRoom={setRoom}
          leaveRoom={() => setRoom(null)}
        />
      )}

      {tab === 6 && <ChallengePanel user={user} />}
    </Box>
  );
};

export default Coding;