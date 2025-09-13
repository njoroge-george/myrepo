import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

export default function ReminderNotifications() {
    const setReminder = () => {
        if (Notification.permission === "granted") {
            new Notification("Time to Workout!", {
                body: "Stay on track with your fitness goals 💪",
            });
        } else {
            Notification.requestPermission();
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Reminders</Typography>
                <Button variant="contained" onClick={setReminder} sx={{ mt: 2 }}>
                    Set Workout Reminder
                </Button>
            </CardContent>
        </Card>
    );
}
