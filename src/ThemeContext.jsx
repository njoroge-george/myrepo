// src/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { createTheme } from "@mui/material/styles";

const ThemeContext = createContext();

export default function ThemeProviderCustom({ children }) {
    const [darkMode, setDarkMode] = useState(false);
    const [font, setFont] = useState("Roboto, sans-serif");
    const [brightness, setBrightness] = useState(100); // %
    const [language, setLanguage] = useState("en");

    // Load saved settings from localStorage
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("settings")) || {};
        setDarkMode(saved.darkMode ?? false);
        setFont(saved.font || "Roboto, sans-serif");
        setBrightness(saved.brightness ?? 100);
        setLanguage(saved.language || "en");
    }, []);

    // Save to localStorage whenever settings change
    useEffect(() => {
        localStorage.setItem(
            "settings",
            JSON.stringify({ darkMode, font, brightness, language })
        );
    }, [darkMode, font, brightness, language]);

    const theme = createTheme({
        palette: {
            mode: darkMode ? "dark" : "light",
        },
        typography: {
            fontFamily: font,
        },
    });

    return (
        <ThemeContext.Provider
            value={{
                theme,
                darkMode,
                setDarkMode,
                font,
                setFont,
                brightness,
                setBrightness,
                language,
                setLanguage,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export const useThemeContext = () => useContext(ThemeContext);
