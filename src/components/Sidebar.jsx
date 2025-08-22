import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Box
} from '@mui/material';
import { motion } from 'framer-motion';

import DashboardIcon from '@mui/icons-material/Dashboard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import WorkIcon from '@mui/icons-material/Work';
import BookIcon from '@mui/icons-material/Book';
import ContactsIcon from '@mui/icons-material/Contacts';
import BuildIcon from '@mui/icons-material/Build';
import ListAltIcon from '@mui/icons-material/ListAlt';
import FoodIcon from '@mui/icons-material/Settings';
import SettingsIcon from '@mui/icons-material/Settings';
import ChatIcon from '@mui/icons-material/Settings';

const navItems = [
  { text: 'Overview', path: '/overview', icon: <DashboardIcon /> },
  { text: 'Finance', path: '/finance', icon: <AttachMoneyIcon /> },
  { text: 'Fitness', path: '/fitness', icon: <FitnessCenterIcon /> },
  { text: 'Projects', path: '/projects', icon: <WorkIcon /> },
  { text: 'Journal', path: '/journal', icon: <BookIcon /> },
  { text: 'Contacts', path: '/contacts', icon: <ContactsIcon /> },
  { text: 'ContactCommunications', path: '/contacts/:contactId/comms', icon: <ContactsIcon /> },
  { text: 'Skills', path: '/skills', icon: <BuildIcon /> },
  { text: 'To Do', path: '/to_do', icon: <ListAltIcon /> },
  { text: 'Recipe', path: '/recipe', icon: <WorkIcon /> },
    { text: 'Portfolio', path: '/portfolio', icon: <FoodIcon /> },
    { text: 'Settings', path: '/settings', icon: <SettingsIcon /> },
    { text: 'Chat', path: '/chat', icon: <ChatIcon /> },
];

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 250,
          boxSizing: 'border-box',
          background: 'linear-gradient(160deg, rgba(20,20,40,0.95), rgba(50,0,80,0.95))',
          backdropFilter: 'blur(10px)',
          color: '#fff',
          boxShadow: '4px 0 20px rgba(0,0,0,0.6)',
        },
      }}
    >
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              color: '#ffeb3b',
              mb: 2,
              textShadow: '0px 0px 10px rgba(255,255,100,0.8)',
              fontWeight: 'bold',
            }}
          >
            Dashboard Menu
          </Typography>
          <List>
            {navItems.map(({ text, path, icon }, index) => (
              <motion.div
                key={text}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0px 0px 20px rgba(255, 235, 59, 0.6)',
                }}
              >
                <ListItemButton
                  component={NavLink}
                  to={path}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    color: '#ccc',
                    transition: 'all 0.3s ease',
                    '&.active': {
                      background: 'linear-gradient(90deg, #6a1b9a, #ff4081)',
                      color: '#fff',
                      boxShadow: 'inset 0px 0px 12px rgba(255,255,255,0.4)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>{icon}</ListItemIcon>
                  <ListItemText
                    primary={text}
                    sx={{
                      '& span': { fontWeight: 'bold', letterSpacing: '0.5px' },
                    }}
                  />
                </ListItemButton>
              </motion.div>
            ))}
          </List>
        </Box>
      </motion.div>
    </Drawer>
  );
};

export default Sidebar;
