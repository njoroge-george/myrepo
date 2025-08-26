import React, { useState } from 'react';
import { Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // <-- use MUI's ThemeProvider
import {
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';

import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';

import Dashboard from './pages/Dashboard.jsx';
import Contacts from './pages/Contacts.jsx';
import Finance from './pages/Finance.jsx';
import Fitness from './pages/Fitness.jsx';
import Journal from './pages/Journal.jsx';
import Projects from './pages/Projects.jsx';
import Skills from './pages/Skills.jsx';
import ChatPage from './pages/ChatPage.jsx';
import To_do from './pages/Todo.jsx';
import ContactCommunications from './pages/ContactCommunications';
import Recipe from './pages/Recipe.jsx';
import Portfolio from './pages/Portfolio.jsx';
import ContactPage from './pages/VcontactsPage.jsx';
import AdminMailPage from './pages/AdminMailPage.jsx';
import GradePage from './pages/GradePage.jsx';
import Footer from './components/Footer.jsx';

function Layout({ children, collapsed, setCollapsed }) {
    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Sidebar collapsed={collapsed} />
            <Box sx={{ flexGrow: 1 }}>
                <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />
                {children}
            </Box>
            <Box sx={{ pb: { xs: 5, md: 6 } }}>
                <Footer />
            </Box>
        </Box>
    );
}

const theme = createTheme(); // Optionally, customize your theme here

export default function App() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <ThemeProvider theme={theme}>
            <Routes>
                <Route path="/overview" element={<Layout collapsed={collapsed} setCollapsed={setCollapsed}><Dashboard /></Layout>} />
                <Route path="/contacts" element={<Layout collapsed={collapsed} setCollapsed={setCollapsed}><Contacts /></Layout>} />
                <Route path="/finance" element={<Layout collapsed={collapsed} setCollapsed={setCollapsed}><Finance /></Layout>} />
                <Route path="/fitness" element={<Layout collapsed={collapsed} setCollapsed={setCollapsed}><Fitness /></Layout>} />
                <Route path="/journal" element={<Layout collapsed={collapsed} setCollapsed={setCollapsed}><Journal /></Layout>} />
                <Route path="/projects" element={<Layout collapsed={collapsed} setCollapsed={setCollapsed}><Projects /></Layout>} />
                <Route path="/skills" element={<Layout collapsed={collapsed} setCollapsed={setCollapsed}><Skills /></Layout>} />
                <Route path="/contacts/:contactId/comms" element={<Layout collapsed={collapsed} setCollapsed={setCollapsed}><ContactCommunications /></Layout>} />
                <Route path="/portfolio" element={<Layout collapsed={collapsed} setCollapsed={setCollapsed}><Portfolio /></Layout>} />
                <Route path="/to_do" element={<Layout collapsed={collapsed} setCollapsed={setCollapsed}><To_do /></Layout>} />
                <Route path="/recipe" element={<Layout collapsed={collapsed} setCollapsed={setCollapsed}><Recipe /></Layout>} />
                <Route path="/chat" element={<Layout collapsed={collapsed} setCollapsed={setCollapsed}><ChatPage /></Layout>} />
                <Route path="/contact" element={<Layout collapsed={collapsed} setCollapsed={setCollapsed}><ContactPage /></Layout>} />
                <Route path="/adminmail" element={<Layout collapsed={collapsed} setCollapsed={setCollapsed}><AdminMailPage /></Layout>} />
                <Route path="/gradepage" element={<Layout collapsed={collapsed} setCollapsed={setCollapsed}><GradePage /></Layout>} />
                <Route path="*" element={<Navigate to="/overview" />} />
            </Routes>

        </ThemeProvider>
    );
}