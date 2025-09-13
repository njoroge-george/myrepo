import React from "react";
import { Card, CardContent, Typography, List, ListItem, ListItemText } from "@mui/material";

const plans = [
    { goal: "Weight Loss", workouts: "Running, Jump Rope, HIIT" },
    { goal: "Muscle Gain", workouts: "Push-ups, Squats, Pull-ups" },
    { goal: "Core Strength", workouts: "Planks, Sit-ups, Leg Raises" },
];

export default function WorkoutPlans() {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Workout Plans</Typography>
                <List>
                    {plans.map((p) => (
                        <ListItem key={p.goal}>
                            <ListItemText primary={p.goal} secondary={p.workouts} />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
}
