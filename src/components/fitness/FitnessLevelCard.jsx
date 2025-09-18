import React from "react";
import { Card, CardContent, Typography, LinearProgress } from "@mui/material";

export default function Levels({ workouts }) {
    const totalWorkouts = workouts.length;
    const level = Math.floor(totalWorkouts / 5); // every 5 workouts = 1 level
    const progress = (totalWorkouts % 5) * 20;

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Level Progress</Typography>
                <Typography>Current Level: {level}</Typography>
                <LinearProgress variant="determinate" value={progress} sx={{ mt: 2 }} />
            </CardContent>
        </Card>
    );
}
