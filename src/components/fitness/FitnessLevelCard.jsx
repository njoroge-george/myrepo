import { Card, Typography, LinearProgress, Box } from "@mui/material";

export default function FitnessLevelCard({ workouts }) {
    const totalWorkouts = workouts.length;
    const level = Math.floor(totalWorkouts / 10);
    const xp = totalWorkouts % 10;
    const xpProgress = (xp / 10) * 100;

    return (
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" mb={2}>Level & XP</Typography>
            <Typography variant="body1">Level: {level}</Typography>
            <Typography variant="body2">XP: {xp}/10</Typography>
            <LinearProgress variant="determinate" value={xpProgress} sx={{ mt: 1 }} />
        </Card>
    );
}
