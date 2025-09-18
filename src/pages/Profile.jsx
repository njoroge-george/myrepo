import React, { useEffect, useState } from "react";
import {
    Box, Typography, Paper, Grid, Chip, Divider
} from "@mui/material";
import { motion } from "framer-motion";
import ProfileProjects from "../components/profile/ProfileProjects.jsx";
import CalendarWidget from "../components/profile/CalendarWidget.jsx"; // 👈 Add this component
import FitnessSummary from "../components/fitness/FitnessSummary";
import FitnessStatsCard from "../components/fitness/FitnessStatsCard";
import { getPortfolio } from "../api/portfolioAPI.jsx";
import {fetchFitnessEntries} from "../api/fitnessAPI.jsx";

import FitnessGoalsCard from "../components/fitness/FitnessGoalsCard";
import FitnessLevelCard from "../components/fitness/FitnessLevelCard";
import FitnessBadgesCard from "../components/fitness/FitnessBadgesCard";

export default function Profile() {
    const [portfolio, setPortfolio] = useState([]);
    const [ workouts, setWorkouts] = useState([]);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const data = await getPortfolio();
                setPortfolio(data);
            } catch (err) {
                console.error("Error fetching portfolio:", err.response?.data || err.message);
            }
        };
        fetchPortfolio();
    }, []);

    useEffect(() => {
        const loadWorkouts = async () => {
            const data = await fetchFitnessEntries();
            setWorkouts(data);
        };
        loadWorkouts();
    }, []);

    return (
        <Box sx={{ minHeight: "100vh", background: "#f5f5f5", py: 6 }}>
            <Typography variant="h4" align="center" mb={4} fontWeight="bold" color="primary">
                My Profile Overview
            </Typography>

            {/* Portfolio Entries */}
            <Grid container spacing={3} sx={{ maxWidth: "1200px", mx: "auto" }}>
                {portfolio.map((item, index) => (
                    <Grid item xs={12} md={6} key={index}>
                        <motion.div whileHover={{ scale: 1.02 }}>
                            <Paper sx={{ p: 3, borderRadius: "10px", boxShadow: 2 }}>
                                <Typography variant="h5" color="primary" fontWeight="bold">{item.name}</Typography>
                                <Typography variant="subtitle1" mb={2}>{item.title}</Typography>
                                <Typography variant="body1" mb={2}>{item.bio}</Typography>

                                <Typography variant="subtitle2" mb={1}>Skills:</Typography>
                                {item.skills?.map((skill, i) => (
                                    <Chip key={i} label={skill} sx={{ mr: 1, mb: 1 }} />
                                ))}

                                <Typography variant="subtitle2" mt={2} mb={1}>Projects:</Typography>
                                {item.projects?.map((proj, i) => (
                                    <Paper key={i} sx={{ p: 1, mb: 1 }}>
                                        <Typography variant="body2">{proj.title}</Typography>
                                    </Paper>
                                ))}

                                <Typography variant="body2" mt={2} color="text.secondary">
                                    Contact: {item.contact_email}
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            {/* Divider */}
            <Divider sx={{ my: 6 }} />

            {/* Stats + Calendar Section */}
            <Grid container spacing={4} sx={{ maxWidth: "1200px", mx: "auto" }}>


                <Grid item xs={12} md={6}>
                    <Typography variant="h6" mb={2}>My Calendar</Typography>
                    <CalendarWidget />
                </Grid>
            </Grid>

            {/* Divider */}
            <Divider sx={{ my: 6 }} />

            {/* Skills + Projects Section */}
            <Grid container spacing={4} sx={{ maxWidth: "1200px", mx: "auto" }}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" mb={2}>Projects</Typography>
                    <ProfileProjects />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" mb={2}>Fitness Overview</Typography>
                    <FitnessSummary />
                </Grid>
                <Grid item sx={12} md={6}>
                    <FitnessStatsCard workouts={workouts} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <FitnessGoalsCard workouts={workouts} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <FitnessLevelCard workouts={workouts} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <FitnessBadgesCard badges={[{ name: "Consistency", image: "/badge1.png" }, { name: "Beast Mode", image: "/badge2.png" }]} />
                </Grid>
            </Grid>
        </Box>
    );
}
