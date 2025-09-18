import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

export default function CaloriesTracker({ workouts }) {
    const totalCalories = workouts.reduce((sum, w) => sum + Number(w.calories || 0), 0);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Calories Burned</Typography>
                <Typography variant="h5" color="secondary">{totalCalories} kcal</Typography>
            </CardContent>
        </Card>
    );
}
