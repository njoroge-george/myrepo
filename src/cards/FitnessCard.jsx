import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Chip, Stack, CircularProgress, Box } from "@mui/material";
import { fetchFitnessEntries } from "../api/fitnessAPI.jsx";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import TimerIcon from '@mui/icons-material/Timer';
import WhatshotIcon from '@mui/icons-material/Whatshot';

export default function FitnessCard({ cardStyle }) {
    const [stats, setStats] = useState({
        total: 0,
        totalReps: 0,
        totalCalories: 0,
        totalDuration: 0,
        mostActiveType: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            try {
                const workouts = await fetchFitnessEntries();
                const total = workouts.length;
                const totalReps = workouts.reduce((sum, w) => sum + (Number(w.reps) || 0), 0);
                const totalCalories = workouts.reduce((sum, w) => sum + (Number(w.calories) || 0), 0);
                const totalDuration = workouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0);
                const typeCount = {};
                workouts.forEach(w => {
                    if (w.workout_type) typeCount[w.workout_type] = (typeCount[w.workout_type] || 0) + 1;
                });
                const mostActiveType = Object.entries(typeCount)
                    .sort((a, b) => b[1] - a[1])[0]?.[0] || "";
                setStats({
                    total,
                    totalReps,
                    totalCalories,
                    totalDuration,
                    mostActiveType,
                });
            } catch {
                setStats({ total: 0, totalReps: 0, totalCalories: 0, totalDuration: 0, mostActiveType: "" });
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    return (
        <Card sx={cardStyle}>
            <CardContent>
                <Typography variant="h6" mb={1}>Fitness Overview</Typography>
                {loading ? (
                    <CircularProgress color="primary" size={28} />
                ) : (
                    <Box>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <FitnessCenterIcon color="primary" />
                            <Typography variant="body2">Workouts</Typography>
                            <Chip label={stats.total} color="primary" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <DirectionsRunIcon color="success" />
                            <Typography variant="body2">Total Reps</Typography>
                            <Chip label={stats.totalReps} color="success" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <TimerIcon color="secondary" />
                            <Typography variant="body2">Total Duration</Typography>
                            <Chip label={`${stats.totalDuration} min`} color="secondary" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <WhatshotIcon color="error" />
                            <Typography variant="body2">Total Calories</Typography>
                            <Chip label={`${stats.totalCalories} cal`} color="error" />
                        </Stack>
                        {stats.mostActiveType && (
                            <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                                <FitnessCenterIcon color="warning" />
                                <Typography variant="body2">Most Active Type</Typography>
                                <Chip label={stats.mostActiveType} color="warning" />
                            </Stack>
                        )}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}