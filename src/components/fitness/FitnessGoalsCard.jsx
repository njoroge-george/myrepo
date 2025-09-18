import { Card, Typography, LinearProgress, Box } from "@mui/material";

export default function FitnessGoalsCard({ workouts }) {
    const weeklyGoal = 5;
    const calorieGoal = 2500;

    const totalWorkouts = workouts.length;
    const totalCalories = workouts.reduce((sum, w) => sum + Number(w.calories || 0), 0);

    const workoutProgress = Math.min((totalWorkouts / weeklyGoal) * 100, 100);
    const calorieProgress = Math.min((totalCalories / calorieGoal) * 100, 100);

    return (
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" mb={2}>Weekly Goals</Typography>

            <Typography variant="body2">Workouts: {totalWorkouts}/{weeklyGoal}</Typography>
            <LinearProgress variant="determinate" value={workoutProgress} sx={{ mb: 2 }} />

            <Typography variant="body2">Calories Burned: {totalCalories}/{calorieGoal} kcal</Typography>
            <LinearProgress variant="determinate" value={calorieProgress} />
        </Card>
    );
}
