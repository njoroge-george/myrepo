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

// ✅ Function to compute totals per month
const computeMonthlyTotals = (workouts) => {
    const totals = {};

    workouts.forEach(w => {
        if (!w.date) return;

        // Make sure we use a Date object
        const d = new Date(w.date);
        if (isNaN(d)) return; // skip invalid dates

        // YYYY-MM format
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

        totals[monthKey] = (totals[monthKey] || 0) + (w.reps || 0);
    });

    // Sort and convert to array
    return Object.entries(totals)
        .sort(([a], [b]) => new Date(a + "-01") - new Date(b + "-01"))
        .map(([month, totalReps]) => ({ month, totalReps }));
};

// ✅ Helper to format month labels (e.g., "Sep 2025")
const formatMonth = (monthKey) => {
    const [year, month] = monthKey.split("-");
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
};

export default function BodyFitMonthlyChart({ workouts }) {
    const monthlyData = computeMonthlyTotals(workouts);

    const chartData = {
        labels: monthlyData.map(m => formatMonth(m.month)),
        datasets: [
            {
                label: 'Total Reps per Month',
                data: monthlyData.map(m => m.totalReps),
                fill: false,
                borderColor: '#1976d2',
                backgroundColor: '#2ef700',
                tension: 0.3,
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
                font: { size: 16 }
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
