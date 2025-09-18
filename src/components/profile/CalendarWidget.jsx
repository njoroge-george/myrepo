import React from "react";
import { Paper } from "@mui/material";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

export default function CalendarWidget() {
    return (
        <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
            <Calendar />
        </Paper>
    );
}
