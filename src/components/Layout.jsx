// Layout.jsx
import React from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";
import Footer from "./Footer";
import Topbar from "./Topbar";

const Layout = ({ children, collapsed, setCollapsed }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Box display="flex" flexDirection="column" height="100vh" overflow="hidden">
            {/* Sticky Topbar */}
            <Box sx={{ position: "sticky", top: 0, zIndex: 1100 }}>
                <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />
            </Box>

            {/* Main Content Area */}
            <Box display="flex" flex="1" overflow="hidden">
                {/* Left Sidebar (hidden on mobile) */}
                {!isMobile && (
                    <Box sx={{ width: collapsed ? 80 : 240, flexShrink: 0 }}>
                        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                    </Box>
                )}

                {/* Scrollable Page Content */}
                <Box
                    flex="1"
                    overflow="auto"
                    p={{ xs: 1, md: 2 }}
                    sx={{
                        backgroundColor: "background.default",
                        color: "text.primary",
                    }}
                >
                    {children}
                </Box>

                {/* Right Sidebar (hidden on mobile) */}
                {!isMobile && (
                    <Box sx={{ width: 240, flexShrink: 0 }}>
                        <RightSidebar />
                    </Box>
                )}
            </Box>

            {/* Sticky Footer */}
            <Box sx={{ position: "sticky", bottom: 0, zIndex: 1000 }}>
                <Footer />
            </Box>
        </Box>
    );
};

export default Layout;
