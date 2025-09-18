import React, { useEffect, useState } from "react";
import { Card, Typography, Button, Box } from "@mui/material";
import { fetchFitnessEntries } from '../../api/fitnessAPI';

export default function FitnessSummary() {
    const [summary, setSummary] = useState({
        totalWorkouts: 0,
        totalCalories: 0,
        lastWorkout: null,
    });
    useEffect(() => {
        const loadSummary = async () => {
            try {
                const data = await fetchFitnessEntries();
                const totalWorkouts = data.length;
                const totalCalories = data.reduce((sum, w) => sum + Number(w.calories || 0), 0);
                const lastWorkout = data[data.length - 1];
                setSummary({ totalWorkouts, totalCalories, lastWorkout });
            } catch (err) {
                console.error("Failed to load fitness summary", err);
            }
        };
        loadSummary();
    }, []);

    return (
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" mb={2}>Fitness Summary</Typography>
            <Typography variant="body1">Workouts this week: {summary.totalWorkouts}</Typography>
            <Typography variant="body1">Calories burned: {summary.totalCalories} kcal</Typography>
            {summary.lastWorkout && (
                <Typography variant="body1">
                    Last workout: {summary.lastWorkout.workout_type} on {summary.lastWorkout.workout_date?.slice(0, 10)}
                </Typography>
            )}
            <Box mt={2}>
                <Button variant="outlined" href="/fitness">View Full Tracker</Button>
            </Box>
        </Card>
    );
}
