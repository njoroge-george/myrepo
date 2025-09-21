import React, { useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/MenuOpen';
import { AuthContext } from '../components/auth/AuthContext';

export default function Topbar({ collapsed, setCollapsed }) {
  const { auth, setRole } = useContext(AuthContext);
  const role = auth?.role || 'guest';

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: '#004081',
        zIndex: theme.zIndex.drawer + 1, // ensures it's above sidebar if needed
        width: '100%',
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          px: 2,
          py: isMobile ? 1 : 2,
        }}
      >
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setCollapsed(!collapsed)}
            sx={{ color: '#fff' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant={isMobile ? 'body1' : 'h6'}
            noWrap
            sx={{ color: '#fff', fontWeight: 'bold' }}
          >
            Logistics Management System
          </Typography>
        </Box>

        {/* Right Section */}
        {auth && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
              mt: isMobile ? 1 : 0,
            }}
          >
            <Typography variant="body2" sx={{ color: '#fff' }}>
              Role: <strong>{role}</strong>
            </Typography>
            <ToggleButtonGroup
              value={role}
              exclusive
              size={isMobile ? 'small' : 'medium'}
              onChange={(e, newRole) => {
                if (newRole) {
                  console.log('Role change to:', newRole);
                  setRole(newRole);
                }
              }}
              sx={{
                backgroundColor: '#ffffff10',
                borderRadius: 2,
                '& .Mui-selected': {
                  backgroundColor: '#00c6ff',
                  color: '#fff',
                },
              }}
            >
              <ToggleButton value="admin">Admin</ToggleButton>
              <ToggleButton value="participant">Participant</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
