export const USER_ROLES = {
  ADMIN: 'admin',
  PARTICIPANT: 'user',
};

export const TABS = [
  { label: 'Code Editor', value: 0 },
  { label: 'Discussion', value: 1 },
  { label: 'Leaderboard', value: 2 },
  { label: 'Stats', value: 3 },
  { label: 'Admin', value: 4, adminOnly: true },
  { label: 'Voice Rooms', value: 5 },
];