import React from "react";
import {
  Box,
  Typography,
  Link,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const SIDEBAR_WIDTH = 250;

  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        left: isMobile ? 0 : `${SIDEBAR_WIDTH}px`,
        bottom: 0,
        width: isMobile ? "100vw" : `calc(100vw - ${SIDEBAR_WIDTH}px)`,
        zIndex: 100,
        background: "linear-gradient(90deg, #1976d2 0%, #2196f3 100%)",
        color: "#fff",
        borderTop: "1px solid #1565c0",
        boxShadow: "0px -2px 10px rgba(25,118,210,0.07)",
        py: { xs: 0.5, md: 0.75 },
        px: { xs: 1, md: 2 },
        fontSize: { xs: 12, md: 14 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      {/* Social Links */}
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton
          component={Link}
          href="https://github.com/njoroge-george/myrepo"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: "#fff", p: 0.5 }}
          aria-label="GitHub"
          size="small"
        >
          <GitHubIcon fontSize="small" />
        </IconButton>
        <IconButton
          component={Link}
          href="mailto:nicknicc95@gmail.com"
          sx={{ color: "#fff", p: 0.5 }}
          aria-label="Email"
          size="small"
        >
          <EmailIcon fontSize="small" />
        </IconButton>
      </Stack>

      {/* Copyright */}
      <Typography
        variant="body2"
        sx={{
          mx: 1,
          fontSize: { xs: 11, md: 13 },
          textAlign: isMobile ? "center" : "right",
          flexGrow: 1,
        }}
      >
        &copy; {new Date().getFullYear()} G.Nichols Logistics Dashboard
      </Typography>
    </Box>
  );
}
