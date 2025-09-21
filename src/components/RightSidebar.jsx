import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  LinearProgress,
  IconButton,
  CircularProgress,
  Paper,
  Card,
  CardContent,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";

import MessageIcon from "@mui/icons-material/Message";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { getAllMessages } from "../api/adminAPI.jsx";
import { getProjects } from "../api/projectsAPI.jsx";

const drawerWidth = 240;

const RightSidebar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [chats, setChats] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const sms = await getAllMessages();
        const projectData = await getProjects();

        setChats(Array.isArray(sms.data) ? sms.data : []);
        setProjects(Array.isArray(projectData) ? projectData : projectData?.data || []);
      } catch (err) {
        console.error("Sidebar data fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: { xs: "none", sm: "block" },
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "linear-gradient(90deg, #1583AA, #004081)",
          backdropFilter: "blur(10px)",
          color: "#fff",
          borderLeft: "1px solid rgba(255,255,255,0.1)",
        },
      }}
    >
      {/* Spacer to offset Topbar */}
      <Toolbar />

      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ p: 2 }}>
          {/* Profile */}
          <Card elevation={3} sx={{ mb: 2, borderRadius: 2, background: "#ffffff10" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "primary.main", width: 50, height: 50 }}>
                <AccountCircleIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" color="#fff">
                  George Njoroge
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Admin
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Chats */}
          <Paper sx={{ p: 2, mb: 2, borderRadius: 2, background: "#ffffff10" }} elevation={2}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Chats
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} />
              </Box>
            ) : chats.length > 0 ? (
              <List dense>
                {chats.map((chat, idx) => (
                  <motion.div key={chat.id || idx} whileHover={{ scale: 1.02 }}>
                    <ListItem sx={{ borderRadius: 1, mb: 1 }}>
                      <ListItemIcon>
                        <MessageIcon color="secondary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={chat.subject || "New Message"}
                        secondary={`${chat.body || chat.content || ""} • ${
                          chat.createdAt ? new Date(chat.createdAt).toLocaleString() : "Just now"
                        }`}
                      />
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No new messages
              </Typography>
            )}
          </Paper>

          {/* Projects */}
          <Paper sx={{ p: 2, mb: 2, borderRadius: 2, background: "#ffffff10" }} elevation={2}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Projects Progress
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} />
              </Box>
            ) : projects.length > 0 ? (
              projects.map((t, idx) => (
                <Box key={t.id || idx} mb={2}>
                  <Typography variant="body2" fontWeight="500">
                    {t.title}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Number(t.progress) || 0}
                    sx={{ borderRadius: 1, height: 8, mt: 0.5 }}
                  />
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No projects available
              </Typography>
            )}
          </Paper>

          {/* Quick Actions */}
          <Paper sx={{ p: 2, borderRadius: 2, background: "#ffffff10" }} elevation={2}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Quick Actions
            </Typography>
            <Box display="flex" justifyContent="space-around" mt={1}>
              <IconButton color="primary" onClick={handleSettingsClick}>
                <SettingsIcon />
              </IconButton>
              <IconButton color="error" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Box>
          </Paper>
        </Box>
      </motion.div>
    </Drawer>
  );
};

export default RightSidebar;
