import { Card, Typography, Box } from '@mui/material';
import FitnessProgressRing from './FitnessProgressRing';

export default function FitnessStatsCard({ workouts }) {
    const totalWorkouts = workouts.length;
    const totalCalories = workouts.reduce((sum, w) => sum + Number(w.calories || 0), 0);
    const weeklyGoal = 5;
    const level = Math.floor(totalWorkouts / 10); // Example logic

    return (
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" mb={2}>Fitness Progress</Typography>
            <Box display="flex" alignItems="center" gap={3}>
                <Box width={120}>
                    <FitnessProgressRing value={totalWorkouts} goal={weeklyGoal} />
                </Box>
                <Box>
                    <Typography variant="body1">Workouts: {totalWorkouts}</Typography>
                    <Typography variant="body1">Calories Burned: {totalCalories} kcal</Typography>
                    <Typography variant="body1">Level: {level}</Typography>
                </Box>
            </Box>
        </Card>
    );
}
