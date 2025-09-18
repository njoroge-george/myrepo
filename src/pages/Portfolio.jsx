import React, { useState } from "react";
import {
    Box, Typography, Paper, TextField, Button, Grid
} from "@mui/material";
import { motion } from "framer-motion";
import { createPortfolio } from "../api/portfolioAPI.jsx";
import { useNavigate } from "react-router-dom";

export default function Portfolio() {
    const [formData, setFormData] = useState({
        name: "", title: "", bio: "", skills: "", projects: "", contact_email: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!formData.name.trim()) return "Name is required.";
        if (!formData.title.trim()) return "Title is required.";
        if (!formData.contact_email.trim()) return "Contact email is required.";
        if (!formData.skills.trim()) return "Please enter at least one skill.";
        if (!formData.projects.trim()) return "Please enter at least one project.";
        return "";
    };

    const handleSubmit = async () => {
        const validationError = validateForm();
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        try {
            const newData = {
                ...formData,
                skills: formData.skills.split(",").map(s => s.trim()),
                projects: formData.projects.split(",").map(p => ({ title: p.trim(), description: "" }))
            };
            await createPortfolio(newData);
            setFormData({ name: "", title: "", bio: "", skills: "", projects: "", contact_email: "" });
            setErrorMessage("");
            navigate("/profile"); // Redirect after submission
        } catch (err) {
            console.error("Error creating portfolio:", err.response?.data || err.message);
            setErrorMessage("Failed to save portfolio. Check console for details.");
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", background: "#f9f9f9", display: "flex", flexDirection: "column", alignItems: "center", py: 6 }}>
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
                <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>Create Portfolio</Typography>
            </motion.div>

            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} style={{ width: "100%", maxWidth: "700px" }}>
                <Paper sx={{ p: 4, mb: 4, background: "#fff", borderRadius: "12px", boxShadow: 2 }} elevation={3}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>Add Portfolio Info</Typography>
                    {errorMessage && <Typography sx={{ color: "error.main", mb: 2 }}>{errorMessage}</Typography>}
                    <Grid container spacing={2}>
                        {[
                            { label: "Name", name: "name" },
                            { label: "Title", name: "title" },
                            { label: "Bio", name: "bio", multiline: true, rows: 3 },
                            { label: "Skills (comma separated)", name: "skills" },
                            { label: "Projects (comma separated)", name: "projects" },
                            { label: "Contact Email", name: "contact_email" }
                        ].map((field, idx) => (
                            <Grid item xs={12} sm={field.name === "bio" ? 12 : 6} key={idx}>
                                <TextField
                                    fullWidth
                                    label={field.label}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    multiline={field.multiline || false}
                                    rows={field.rows || 1}
                                    variant="outlined"
                                />
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                <Button variant="contained" fullWidth onClick={handleSubmit} sx={{ py: 1.5, fontSize: "1rem", fontWeight: "bold" }}>
                                    Save & View Profile
                                </Button>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Paper>
            </motion.div>
        </Box>
    );
}
