import React from "react";
import { NavLink } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import WorkIcon from "@mui/icons-material/Work";
import BookIcon from "@mui/icons-material/Book";
import ContactsIcon from "@mui/icons-material/Contacts";
import BuildIcon from "@mui/icons-material/Build";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import EmailIcon from "@mui/icons-material/Email";
import FaxIcon from "@mui/icons-material/Fax";
import ScoreIcon from "@mui/icons-material/Score";
import CodeIcon from "@mui/icons-material/Code";
import PianoIcon from "@mui/icons-material/Piano";
import ChatIcon from "@mui/icons-material/Chat";

const navItems = [
  { text: "Overview", path: "/overview", icon: <DashboardIcon /> },
  { text: "Finance", path: "/finance", icon: <AttachMoneyIcon /> },
  { text: "Fitness", path: "/fitness", icon: <FitnessCenterIcon /> },
  { text: "Projects", path: "/projects", icon: <WorkIcon /> },
  { text: "Journal", path: "/journal", icon: <BookIcon /> },
  { text: "Contacts", path: "/contacts", icon: <ContactsIcon /> },
  { text: "ContactComms", path: "/contacts/:contactId/comms", icon: <ContactsIcon /> },
  { text: "Skills", path: "/skills", icon: <BuildIcon /> },
  { text: "To Do", path: "/to_do", icon: <ListAltIcon /> },
  { text: "Recipe", path: "/recipe", icon: <WorkIcon /> },
  { text: "Portfolio", path: "/portfolio", icon: <SettingsIcon /> },
  { text: "Chat", path: "/chat", icon: <ChatIcon /> },
  { text: "Contact", path: "/contact", icon: <EmailIcon /> },
  { text: "AdminMail", path: "/adminmail", icon: <FaxIcon /> },
  { text: "GradePage", path: "/gradepage", icon: <ScoreIcon /> },
  { text: "Documents", path: "/documents", icon: <CodeIcon /> },
  { text: "BackendCode", path: "/backendcode", icon: <CodeIcon /> },
  { text: "ChordManager", path: "/chordmanager", icon: <PianoIcon /> },
  { text: "Accounts", path: "/accounts", icon: <WorkIcon /> },
  { text: "Coding", path: "/coding", icon: <CodeIcon /> },
  { text: "Settings", path: "/settings", icon: <SettingsIcon /> },
  { text: "Profile", path: "/profile", icon: <BookIcon /> },
  { text: "Challenges", path: "/challenges", icon: <BuildIcon /> },
  { text: "Challenge View", path: "/challenges/:id", icon: <BuildIcon /> },
];

const Sidebar = ({ collapsed }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const drawerWidth = collapsed ? 80 : 250;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: { xs: "none", sm: "block" },
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "#fff", // white background
          backdropFilter: "blur(10px)",
          borderRight: "1px solid rgba(255,255,255,0.1)",
        },
      }}
    >
      {/* Spacer to offset Topbar */}
      <Toolbar />

      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ p: 2 }}>
          {/* Heading - larger, bold, well-positioned */}
          <Typography
            variant="h4"
            sx={{
              color: "#1580ff",
              mb: 3,
              fontWeight: "bold",
              fontSize: "1.8rem",
              textAlign: "center",
              paddingTop: 2,
            }}
          >
            Logistics
          </Typography>

          <List>
            {navItems.map(({ text, path, icon }, index) => (
              <motion.div
                key={text}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <ListItemButton
                  component={NavLink}
                  to={path}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: "#ADD8E6", // light blue button background
                    "&.active": {
                      background: "#00eb3b",
                      color: "#fff",
                      boxShadow: "inset 0 0 10px rgba(255,255,255,0.3)",
                    },
                    "&:hover": {
                      backgroundColor: "#87CEFA", // hover color
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>{icon}</ListItemIcon>
                  <ListItemText
                    primary={text}
                    sx={{
                      "& span": {
                        fontWeight: "bold",
                        fontSize: isMobile ? "0.8rem" : "0.95rem",
                        letterSpacing: "0.5px",
                      },
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