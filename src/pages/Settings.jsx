// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Divider,
    Switch,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    TextField,
    Button,
    Grid,
    Slider,
    Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PaletteIcon from "@mui/icons-material/Palette";
import StorageIcon from "@mui/icons-material/Storage";
import CodeIcon from "@mui/icons-material/Code";
import SecurityIcon from "@mui/icons-material/Security";
import RestoreIcon from "@mui/icons-material/Restore";
import SaveIcon from "@mui/icons-material/Save";
import { useThemeContext } from "../ThemeContext.jsx";
import { getSettings, updateSettings } from "../api/Settings.jsx";

const STORAGE_KEY = "app_settings";

const Settings = () => {
    const { mode, toggleTheme, font, changeFont } = useThemeContext();

    // ✅ Default states
    const [density, setDensity] = useState("spacious");
    const [fontSize, setFontSize] = useState(14);
    const [language, setLanguage] = useState("en");
    const [refreshInterval, setRefreshInterval] = useState(30);
    const [brightness, setBrightness] = useState(100);

    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        inApp: true,
    });

    const [privacy, setPrivacy] = useState({
        anonymize: false,
        sessionTimeout: 30,
    });

    const [developer, setDeveloper] = useState({
        verbose: false,
        sandbox: false,
    });

    const [searchQuery, setSearchQuery] = useState("");

    // ✅ Apply font size globally
    useEffect(() => {
        document.documentElement.style.fontSize = `${fontSize}px`;
    }, [fontSize]);

    // ✅ Apply brightness globally
    useEffect(() => {
        document.body.style.filter = `brightness(${brightness}%)`;
    }, [brightness]);

    // ✅ Load settings
    useEffect(() => {
        async function loadSettings() {
            try {
                const userId = 1;
                const res = await getSettings(userId);
                if (res.success && res.data) {
                    applySettings(res.data);
                    return;
                }
            } catch (err) {
                console.warn("⚠️ Backend load failed, falling back to localStorage");
            }

            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                applySettings(JSON.parse(saved));
            }
        }

        loadSettings();
    }, []);

    // ✅ Apply settings safely
    const applySettings = (parsed) => {
        setDensity(parsed.density ?? "spacious");
        setFontSize(parsed.fontSize ?? 14);
        setLanguage(parsed.language ?? "en");
        setRefreshInterval(parsed.refreshInterval ?? 30);
        setBrightness(parsed.brightness ?? 100);
        setNotifications(
            parsed.notifications ?? { email: true, push: false, inApp: true }
        );
        setPrivacy(parsed.privacy ?? { anonymize: false, sessionTimeout: 30 });
        setDeveloper(parsed.developer ?? { verbose: false, sandbox: false });

        if (parsed.font && parsed.font !== font) changeFont(parsed.font);
        if (parsed.mode && parsed.mode !== mode) toggleTheme();
    };

    // ✅ Save
    const handleSave = async () => {
        const data = {
            mode,
            font,
            density,
            fontSize,
            language,
            refreshInterval,
            brightness,
            notifications,
            privacy,
            developer,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

        try {
            const userId = 1;
            await updateSettings(userId, data);
            alert("✅ Settings saved successfully!");
        } catch (err) {
            console.error("⚠️ Failed to save settings:", err);
            alert("⚠️ Saved locally but failed on server.");
        }
    };

    // ✅ Reset defaults
    const resetSettings = () => {
        applySettings({
            density: "spacious",
            fontSize: 14,
            language: "en",
            refreshInterval: 30,
            brightness: 100,
            notifications: { email: true, push: false, inApp: true },
            privacy: { anonymize: false, sessionTimeout: 30 },
            developer: { verbose: false, sandbox: false },
            font: "Roboto, sans-serif",
            mode: "light",
        });
        localStorage.removeItem(STORAGE_KEY);
    };

    // 🔍 Search filter
    const matchesSearch = (title) =>
        title.toLowerCase().includes(searchQuery.toLowerCase());

    // Sections
    const sections = [
        {
            title: "Appearance",
            icon: <PaletteIcon color="primary" />,
            content: (
                <>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="body1">Dark Mode</Typography>
                        <Switch checked={mode === "dark"} onChange={toggleTheme} />
                    </Box>

                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel>Font</InputLabel>
                        <Select
                            value={font || "Roboto, sans-serif"}
                            onChange={(e) => changeFont(e.target.value)}
                        >
                            <MenuItem value="Roboto, sans-serif">Roboto</MenuItem>
                            <MenuItem value="Poppins, sans-serif">Poppins</MenuItem>
                            <MenuItem value="Montserrat, sans-serif">Montserrat</MenuItem>
                            <MenuItem value="Lora, serif">Lora</MenuItem>
                            <MenuItem value="Merriweather, serif">Merriweather</MenuItem>
                        </Select>
                    </FormControl>

                    <Typography gutterBottom>Font Size</Typography>
                    <Slider
                        value={fontSize}
                        onChange={(e, val) => setFontSize(val)}
                        min={10}
                        max={20}
                        sx={{ mb: 2 }}
                    />

                    <Typography gutterBottom>Brightness</Typography>
                    <Slider
                        value={brightness}
                        onChange={(e, val) => setBrightness(val)}
                        min={50}
                        max={150}
                        sx={{ mb: 2 }}
                    />

                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel>Density</InputLabel>
                        <Select
                            value={density || "spacious"}
                            onChange={(e) => setDensity(e.target.value)}
                        >
                            <MenuItem value="compact">Compact</MenuItem>
                            <MenuItem value="spacious">Spacious</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth size="small">
                        <InputLabel>Language</InputLabel>
                        <Select
                            value={language || "en"}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="fr">French</MenuItem>
                            <MenuItem value="es">Spanish</MenuItem>
                        </Select>
                    </FormControl>
                </>
            ),
        },
        {
            title: "Data & Visualization",
            icon: <StorageIcon color="secondary" />,
            content: (
                <>
                    <Typography gutterBottom>Refresh Interval (seconds)</Typography>
                    <Slider
                        value={refreshInterval}
                        onChange={(e, val) => setRefreshInterval(val)}
                        min={5}
                        max={120}
                        step={5}
                    />
                </>
            ),
        },
        {
            title: "Notifications",
            icon: <NotificationsIcon color="error" />,
            content: (
                <>
                    {["email", "push", "inApp"].map((key) => (
                        <Box
                            key={key}
                            display="flex"
                            justifyContent="space-between"
                            mb={1}
                        >
                            <Typography variant="body1">
                                {key === "inApp" ? "In-App Alerts" : `${key.charAt(0).toUpperCase() + key.slice(1)} Alerts`}
                            </Typography>
                            <Switch
                                checked={notifications[key] ?? false}
                                onChange={() =>
                                    setNotifications((prev) => ({
                                        ...prev,
                                        [key]: !prev[key],
                                    }))
                                }
                            />
                        </Box>
                    ))}
                </>
            ),
        },
        {
            title: "Privacy & Permissions",
            icon: <SecurityIcon color="warning" />,
            content: (
                <>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="body1">Anonymize Data</Typography>
                        <Switch
                            checked={privacy.anonymize ?? false}
                            onChange={() =>
                                setPrivacy({ ...privacy, anonymize: !privacy.anonymize })
                            }
                        />
                    </Box>

                    <TextField
                        fullWidth
                        type="number"
                        label="Session Timeout (minutes)"
                        value={privacy.sessionTimeout ?? 30}
                        onChange={(e) =>
                            setPrivacy({ ...privacy, sessionTimeout: Number(e.target.value) })
                        }
                    />
                </>
            ),
        },
        {
            title: "Developer Tools",
            icon: <CodeIcon color="success" />,
            content: (
                <>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="body1">Verbose Logging</Typography>
                        <Switch
                            checked={developer.verbose ?? false}
                            onChange={() =>
                                setDeveloper({ ...developer, verbose: !developer.verbose })
                            }
                        />
                    </Box>

                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="body1">Sandbox Mode</Typography>
                        <Switch
                            checked={developer.sandbox ?? false}
                            onChange={() =>
                                setDeveloper({ ...developer, sandbox: !developer.sandbox })
                            }
                        />
                    </Box>
                </>
            ),
        },
    ];

    return (
        <Box
            sx={{
                p: 4,
                minHeight: "100vh",
                bgcolor: mode === "dark" ? "#121212" : "#f5f5f5",
                fontFamily: font,
            }}
        >
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Settings
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    Manage your preferences, account, integrations, and advanced controls.
                </Typography>

                {/* 🔍 Search */}
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search settings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ mb: 3 }}
                />

                <Grid container spacing={3}>
                    {sections
                        .filter((s) => matchesSearch(s.title))
                        .map((section) => (
                            <Grid item xs={12} md={6} key={section.title}>
                                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                                        {section.icon}
                                        <Typography variant="h6" fontWeight="bold">
                                            {section.title}
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                    {section.content}
                                </Paper>
                            </Grid>
                        ))}
                </Grid>

                {/* Actions */}
                <Box display="flex" justifyContent="space-between" mt={3}>
                    <Button
                        startIcon={<RestoreIcon />}
                        variant="outlined"
                        color="secondary"
                        onClick={resetSettings}
                    >
                        Reset All to Default
                    </Button>
                    <Button
                        startIcon={<SaveIcon />}
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                    >
                        Save Changes
                    </Button>
                </Box>
            </motion.div>
        </Box>
    );
};

export default Settings;
