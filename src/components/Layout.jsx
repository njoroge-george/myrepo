import React from "react";
import { Box, useMediaQuery, useTheme, Toolbar } from "@mui/material";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";
import Footer from "./Footer";
import Topbar from "./Topbar";

const Layout = ({ children, collapsed, setCollapsed }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const sidebarWidth = collapsed ? 80 : 240;
  const rightSidebarWidth = 240;
  const topbarHeight = 100; // default MUI AppBar height

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Fixed Topbar */}
      <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Spacer to offset Topbar height */}
      <Toolbar />

      {/* Main Layout */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          height: `calc(100vh - ${topbarHeight}px)`,
        }}
      >
        {/* Left Sidebar */}
        {!isMobile && (
          <Box
            sx={{
              width: sidebarWidth,
              flexShrink: 0,
              overflowY: "auto",
              borderRight: "1px solid #ddd",
              pt: 2,
            }}
          >
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          </Box>
        )}

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: { xs: 1, md: 2 },
            backgroundColor: "background.default",
            color: "text.primary",
            pt: 2,
          }}
        >
          {children}
        </Box>

        {/* Right Sidebar */}
        {!isMobile && (
          <Box
            sx={{
              width: rightSidebarWidth,
              flexShrink: 0,
              overflowY: "auto",
              borderLeft: "1px solid #ddd",
              pt: 2,
            }}
          >
            <RightSidebar />
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ borderTop: "1px solid #ddd", px: 2, py: 1 }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
