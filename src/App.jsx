// src/App.jsx
import React, { useState } from 'react';
import { Box } from '@mui/material';
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

import To_do from './pages/Todo.jsx';
import ContactCommunications from './pages/ContactCommunications';
import Recipe from './pages/Recipe.jsx';
import Portfolio from './pages/Portfolio.jsx';

export default function App() {
    const [collapsed, setCollapsed] = useState(false);

    const Layout = ({ children }) => (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Sidebar collapsed={collapsed} />
            <Box sx={{ flexGrow: 1 }}>
                <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />
                {children}
            </Box>
        </Box>
    );

    return (
        <Routes>
            <Route path="/overview" element={<Layout><Dashboard /></Layout>} />
            <Route path="/contacts" element={<Layout><Contacts /></Layout>} />
            <Route path="/finance" element={<Layout><Finance /></Layout>} />
            <Route path="/fitness" element={<Layout><Fitness /></Layout>} />
            <Route path="/journal" element={<Layout><Journal /></Layout>} />
            <Route path="/projects" element={<Layout><Projects /></Layout>} />
            <Route path="/skills" element={<Layout><Skills /></Layout>} />
          <Route path="/contacts/:contactId/comms" element={<Layout><ContactCommunications /></Layout>} />
          <Route path="/portfolio" element={<Layout><Portfolio /></Layout>} />
            <Route path="/to_do" element={<Layout><To_do /></Layout>} />
          <Route path="/recipe" element={<Layout><Recipe/></Layout>} />
            <Route path="*" element={<Navigate to="/overview" />} />
        </Routes>
    );
}
