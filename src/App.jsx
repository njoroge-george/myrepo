import React, { useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import Layout from "./components/Layout.jsx";

// Pages
import Dashboard from "./pages/Dashboard.jsx";
import Contacts from "./pages/Contacts.jsx";
import Finance from "./pages/Finance.jsx";
import Fitness from "./pages/Fitness.jsx";
import Journal from "./pages/Journal.jsx";
import Projects from "./pages/Projects.jsx";
import Skills from "./pages/Skills.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ToDo from "./pages/Todo.jsx";
import ContactCommunications from "./pages/ContactCommunications.jsx";
import Recipe from "./pages/Recipe.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import ContactPage from "./pages/VcontactsPage.jsx";
import AdminMailPage from "./pages/AdminMailPage.jsx";
import GradePage from "./pages/GradePage.jsx";
import Documents from "./pages/Documents.jsx";
import BackendCode from "./pages/BackendCode.jsx";
import ChordManager from "./pages/ChordManager.jsx";
import Accounts from "./pages/Accounts.jsx";
import Coding from "./pages/Coding.jsx";
import Settings from "./pages/Settings.jsx";
import Profile from "./pages/Profile.jsx";
import Challenges from "./pages/Challenges.jsx";
import ChallengeView from "./components/coders/ChallengeView.jsx";

// Auth
import Register from "./components/auth/Register.jsx";
import Login from "./components/auth/Login.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

// Theme Context
import { useThemeContext } from "./ThemeContext.jsx";

// 🔐 Role-based route config
const protectedRoutes = [
  { path: "/overview", element: <Dashboard /> },
  { path: "/contacts", element: <Contacts /> },
  { path: "/contacts/:contactId/comms", element: <ContactCommunications /> },
  { path: "/finance", element: <Finance /> },
  { path: "/fitness", element: <Fitness /> },
  { path: "/journal", element: <Journal /> },
  { path: "/projects", element: <Projects /> },
  { path: "/skills", element: <Skills /> },
  { path: "/portfolio", element: <Portfolio /> },
  { path: "/to_do", element: <ToDo /> },
  { path: "/recipe", element: <Recipe /> },
  { path: "/chat", element: <ChatPage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/adminmail", element: <AdminMailPage />, roles: ["admin"] },
  { path: "/gradepage", element: <GradePage /> },
  { path: "/documents", element: <Documents /> },
  { path: "/backendcode", element: <BackendCode /> },
  { path: "/chordmanager", element: <ChordManager /> },
  { path: "/accounts", element: <Accounts /> },
  { path: "/coding", element: <Coding /> },
  { path: "/settings", element: <Settings /> },
  { path: "/profile", element: <Profile /> },
  { path: "/challenges", element: <Challenges /> },
  { path: "/challenges/:id", element: <ChallengeView /> }
];

// 🧠 Auth bootstrap
function getInitialAuth() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      token,
      id: payload.id || null,
      role: payload.role || "participant",
      name: payload.name || "User",
    };
  } catch {
    return null;
  }
}

// 🚀 App Component
function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [auth, setAuth] = useState(getInitialAuth);
  const { theme } = useThemeContext();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login setAuthenticated={setAuth} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        {protectedRoutes.map(({ path, element, roles = ["admin", "participant"] }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute allowedRoles={roles} auth={auth}>
                <Layout collapsed={collapsed} setCollapsed={setCollapsed}>
                  {element}
                </Layout>
              </ProtectedRoute>
            }
          />
        ))}

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to={auth ? "/overview" : "/login"} />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
