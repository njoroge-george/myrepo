// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ThemeContextProvider from "./ThemeContext.jsx";
import {AuthProvider} from "./components/auth/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeContextProvider>
               <AuthProvider>
                   <App />
               </AuthProvider>
            </ThemeContextProvider>
        </BrowserRouter>
    </React.StrictMode>
);
