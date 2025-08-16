import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title
} from 'chart.js';
import { Box, Typography } from '@mui/material';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title
);

const computeMonthlyTotals = (workouts) => {
    const totals = {};
    workouts.forEach(w => {
        if (!w.date) return;
        const month = w.date.slice(0, 7);
        totals[month] = (totals[month] || 0) + (w.reps || 0);
    });
    return Object.entries(totals)
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .map(([month, totalReps]) => ({ month, totalReps }));
};

export default function BodyFitMonthlyChart({ workouts }) {
    const monthlyData = computeMonthlyTotals(workouts);

    const chartData = {
        labels: monthlyData.map(m => m.month),
        datasets: [
            {
                label: 'Total Reps per Month',
                data: monthlyData.map(m => m.totalReps),
                fill: false,
                borderColor: '#1976d2',
                backgroundColor: '#2ef700',
                tension: 0.1,
                pointRadius: 6,
                pointBackgroundColor: '#2ef700',
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Monthly Reps Progress',
                font: { size: 18 }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Reps'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Month'
                }
            }
        }
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" align="center" sx={{ mb: 2 }}>
                📅 Monthly Progress
            </Typography>
            <Line data={chartData} options={chartOptions} />
        </Box>
    );
}
