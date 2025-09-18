import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function EffectivenessChart({ workouts }) {
    const counts = workouts.reduce((acc, w) => {
        acc[w.workout_type] = (acc[w.workout_type] || 0) + 1;
        return acc;
    }, {});

    const labels = Object.keys(counts);
    const dataValues = Object.values(counts);

    const data = {
        labels,
        datasets: [
            {
                data: dataValues,
                backgroundColor: ["#42a5f5", "#66bb6a", "#ffa726", "#ab47bc", "#ef5350"],
                borderWidth: 1,
            },
        ],
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Workout Effectiveness
                </Typography>
                <Doughnut data={data} />
            </CardContent>
        </Card>
    );
}
