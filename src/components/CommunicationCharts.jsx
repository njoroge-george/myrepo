import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default function CommunicationCharts({ data }) {
    const typeCounts = data.reduce((acc, curr) => {
        acc[curr.type] = (acc[curr.type] || 0) + 1;
        return acc;
    }, {});

    const nameCounts = data.reduce((acc, curr) => {
        acc[curr.name] = (acc[curr.name] || 0) + 1;
        return acc;
    }, {});

    return (
        <Box mt={4}>
            <Typography variant="h6">Communication by Type</Typography>
            <Doughnut
                data={{
                    labels: Object.keys(typeCounts),
                    datasets: [
                        {
                            label: 'Count',
                            data: Object.values(typeCounts),
                            backgroundColor: ['#1976d2', '#4caf50', '#f44336', '#ff9800'],
                        },
                    ],
                }}
            />

            <Typography variant="h6" mt={4}>Communication by Person</Typography>
            <Bar
                data={{
                    labels: Object.keys(nameCounts),
                    datasets: [
                        {
                            label: 'Messages/Calls',
                            data: Object.values(nameCounts),
                            backgroundColor: '#1976d2',
                        },
                    ],
                }}
                options={{
                    indexAxis: 'y',
                }}
            />
        </Box>
    );
}
