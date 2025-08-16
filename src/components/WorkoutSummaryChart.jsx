import React from 'react';
import { Box, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WorkoutSummaryChart = ({ workouts }) => {
    // Aggregate totals per workout name
    const dataMap = {};

    workouts.forEach((w) => {
        const name = w.name;
        if (!name) return; // skip if name is undefined or null
        if (!dataMap[name]) {
            dataMap[name] = {
                name: name,
                reps: 0,
                calories: 0,
                duration: 0,
            };
        }
        dataMap[name].reps += Number(w.reps || 0);
        dataMap[name].calories += Number(w.calories || 0);
        dataMap[name].duration += Number(w.duration || 0);
    });

    const data = Object.values(dataMap);

    return (
        <Box
            sx={{
                bgcolor: '#0f172a', // dark background
                p: 3,
                borderRadius: 3,
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)',
                mb: 4,
            }}
        >
            <Typography
                variant="h6"
                mb={2}
                sx={{
                    color: '#facc15',
                    textShadow: '0 0 8px #facc15',
                    textAlign: 'center',
                }}
            >
                Workout Totals by Name
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    {/* <CartesianGrid strokeDasharray="3 3" stroke="#444" /> */}
                    <XAxis dataKey="name" stroke="#facc15" />
                    <YAxis stroke="#facc15" />
                    <Tooltip contentStyle={{ backgroundColor: '#222', borderColor: '#facc15', color: '#fff' }} />
                    <Legend wrapperStyle={{ color: '#facc15' }} />
                    {/* Reps */}
                    <Bar dataKey="reps" fill="#ef4444" name="Reps" radius={[10, 10, 0, 0]} />
                    {/* Calories */}
                    <Bar dataKey="calories" fill="#3b82f6" name="Calories" radius={[10, 10, 0, 0]} />
                    {/* Duration */}
                    <Bar dataKey="duration" fill="#10b981" name="Duration" radius={[10, 10, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default WorkoutSummaryChart;