import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
    Routes,
    Route,
    Navigate,
    useNavigate,
} from 'react-router-dom';

import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import Footer from './components/Footer.jsx';

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
import Documents from "./pages/Documents.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import BackendCode  from "./pages/BackendCode.jsx";
import ChordManager from './pages/ChordManager.jsx';

function Layout({ children, collapsed, setCollapsed }) {
    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Sidebar collapsed={collapsed} />
            <Box sx={{ flexGrow: 1 }}>
                <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />
                {children}
                <Box sx={{ pb: { xs: 5, md: 6 } }}>
                    <Footer />
                </Box>
            </Box>
        </Box>
    );
}


// ✅ Protect routes
function PrivateRoute({ children }) {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" />;
}

const theme = createTheme();

export default function App() {
    const [collapsed, setCollapsed] = useState(false);
    const [authenticated, setAuthenticated] = useState(!!localStorage.getItem("token"));

    // Auto-refresh authentication state
    useEffect(() => {
        setAuthenticated(!!localStorage.getItem("token"));
    }, []);

    useEffect(() => {
        // Always clear token on refresh
        localStorage.removeItem("token");
        setAuthenticated(false);
    }, []);


    return (
        <ThemeProvider theme={theme}>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
                <Route path="/register" element={<Register />} />

                {/* Private dashboard routes */}
                <Route path="/overview" element={<PrivateRoute><Layout collapsed={collapsed} setCollapsed={setCollapsed}><Dashboard /></Layout></PrivateRoute>} />
                <Route path="/contacts" element={<PrivateRoute><Layout collapsed={collapsed} setCollapsed={setCollapsed}><Contacts /></Layout></PrivateRoute>} />
                <Route path="/finance" element={<PrivateRoute><Layout collapsed={collapsed} setCollapsed={setCollapsed}><Finance /></Layout></PrivateRoute>} />
                <Route path="/fitness" element={<PrivateRoute><Layout collapsed={collapsed} setCollapsed={setCollapsed}><Fitness /></Layout></PrivateRoute>} />
                <Route path="/journal" element={<PrivateRoute><Layout collapsed={collapsed} setCollapsed={setCollapsed}><Journal /></Layout></PrivateRoute>} />
                <Route path="/projects" element={<PrivateRoute><Layout collapsed={collapsed} setCollapsed={setCollapsed}><Projects /></Layout></PrivateRoute>} />
                <Route path="/skills" element={<PrivateRoute><Layout collapsed={collapsed} setCollapsed={setCollapsed}><Skills /></Layout></PrivateRoute>} />
                <Route path="/contacts/:contactId/comms" element={<PrivateRoute><Layout collapsed={collapsed} setCollapsed={setCollapsed}><ContactCommunications /></Layout></PrivateRoute>} />
                <Route path="/portfolio" element={<PrivateRoute><Layout collapsed={collapsed} setCollapsed={setCollapsed}><Portfolio /></Layout></PrivateRoute>} />
                <Route path="/to_do" element={<PrivateRoute><Layout collapsed={collapsed} setCollapsed={setCollapsed}><To_do /></Layout></PrivateRoute>} />
                <Route path="/recipe" element={<PrivateRoute><Layout collapsed={collapsed} setCollapsed={setCollapsed}><Recipe /></Layout></PrivateRoute>} />
                <Route path="/chat" element={<PrivateRoute><Layout collapsed={collapsed} setCollapsed={setCollapsed}><ChatPage /></Layout></PrivateRoute>} />
                <Route path="/contact" element={<PrivateRoute><Layout collapsed={collapsed} setCollapsed={setCollapsed}><ContactPage /></Layout></PrivateRoute>} />
                <Route path="/adminmail" element={<PrivateRoute><Layout collapsed={collapsed} setCollapsed={setCollapsed}><AdminMailPage /></Layout></PrivateRoute>} />
                <Route path="/gradepage" element={<PrivateRoute><Layout collapsed={collapsed} setCollapsed={setCollapsed}><GradePage /></Layout></PrivateRoute>} />
                <Route path="/documents" element={<PrivateRoute><Layout collapsed={collapsed} setCollapsed={setCollapsed}><Documents /></Layout></PrivateRoute>} />
                <Route path="/backendcode" element={<PrivateRoute><Layout collapsed={collapsed} setCollapsed={setCollapsed}><BackendCode /></Layout></PrivateRoute>} />
                <Route path="/chordmanager" element={<PrivateRoute><Layout collapsed={collapsed} setCollapsed={setCollapsed}><ChordManager /></Layout></PrivateRoute>} />

                {/* Default redirect */}
                <Route path="*" element={<Navigate to={authenticated ? "/overview" : "/login"} />} />
            </Routes>
        </ThemeProvider>
    );
}
