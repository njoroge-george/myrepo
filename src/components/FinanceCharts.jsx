import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function FinanceCharts({ entries }) {
    const incomeData = entries.filter(e => e.type === 'income');
    const expenseData = entries.filter(e => e.type === 'expense');

    const categorySums = (data) => {
        const result = {};
        data.forEach(entry => {
            if (!result[entry.category]) result[entry.category] = 0;
            result[entry.category] += parseFloat(entry.amount);
        });
        return result;
    };

    const expenseCategories = categorySums(expenseData);
    const incomeCategories = categorySums(incomeData);

    return (
        <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
                <Paper style={{ padding: 16 }}>
                    <Typography variant="h6" align="center" gutterBottom>
                        Expense Distribution
                    </Typography>
                    <Doughnut
                        data={{
                            labels: Object.keys(expenseCategories),
                            datasets: [{
                                data: Object.values(expenseCategories),
                                backgroundColor: ['#f44336', '#ff9800', '#2196f3', '#9c27b0', '#4caf50'],
                            }]
                        }}
                    />
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper style={{ padding: 16 }}>
                    <Typography variant="h6" align="center" gutterBottom>
                        Income by Category
                    </Typography>
                    <Bar
                        data={{
                            labels: Object.keys(incomeCategories),
                            datasets: [{
                                label: 'Income (Ksh)',
                                data: Object.values(incomeCategories),
                                backgroundColor: '#4caf50',
                            }]
                        }}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: false
                                }
                            }
                        }}
                    />
                </Paper>
            </Grid>
        </Grid>
    );
}
