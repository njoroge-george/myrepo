import React from "react";
import { Card, CardContent, Typography, Chip, Stack } from "@mui/material";

export default function Badges({ workouts }) {
    const total = workouts.length;
    const badges = [];

    if (total >= 5) badges.push("Beginner");
    if (total >= 15) badges.push("Intermediate");
    if (total >= 30) badges.push("Advanced");
    if (total >= 50) badges.push("Beast Mode");

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Achievements
                </Typography>
                <Stack direction="row" spacing={1}>
                    {badges.map((badge) => (
                        <Chip key={badge} label={badge} color="primary" />
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
}
