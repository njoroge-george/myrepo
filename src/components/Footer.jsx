import React from "react";
import { Box, Typography, Link, IconButton, Stack } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function Footer() {
    const SIDEBAR_WIDTH = 250;

    return (
        <Box
            component="footer"
            sx={{
                position: "fixed",
                left: { xs: 0, md: `${SIDEBAR_WIDTH}px` },
                bottom: 0,
                width: { xs: "100vw", md: `calc(100vw - ${SIDEBAR_WIDTH}px)` },
                zIndex: 100,
                background: "linear-gradient(90deg,#1976d2 0%,#2196f3 100%)",
                color: "#fff",
                textAlign: "center",
                borderTop: "1px solid #1565c0",
                boxShadow: "0px -2px 10px rgba(25,118,210,0.07)",
                py: { xs: 0.5, md: 0.75 },
                px: { xs: 0.5, md: 2 },
                fontSize: { xs: 12, md: 14 },
                minHeight: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 1 }}>
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
            <Typography variant="body2" sx={{ mx: 1, fontSize: 13 }}>
                &copy; {new Date().getFullYear()} G.Nichols Logistics Dashboard
            </Typography>
            <Typography variant="caption" sx={{ mr: 1, fontSize: 11, color: "#e3f2fd" }}>
                Made with <FavoriteIcon fontSize="small" color="error" sx={{ verticalAlign: "middle" }} /> React & MUI
            </Typography>
        </Box>
    );
}