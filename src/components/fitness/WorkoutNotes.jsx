import React from "react";
import { Card, CardContent, Typography, List, ListItem, ListItemText } from "@mui/material";

const workoutGuidelines = [
    { name: "Push-ups", note: "Keep your back straight, lower until elbows at 90°." },
    { name: "Squats", note: "Feet shoulder-width apart, go down until thighs parallel." },
    { name: "Sit-ups", note: "Engage your core, don’t pull on your neck." },
];

export default function WorkoutNotes() {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Workout Guidelines
                </Typography>
                <List>
                    {workoutGuidelines.map((w) => (
                        <ListItem key={w.name}>
                            <ListItemText primary={w.name} secondary={w.note} />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
}
