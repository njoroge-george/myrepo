import React from "react";
import { Card, CardContent, TextField, Button, MenuItem, Stack, Typography, Box } from "@mui/material";
import WorkoutAnimation from "./WorkoutAnimation.jsx"; // Make sure path is correct

export default function WorkoutForm({
                                        form,
                                        setForm,
                                        handleSubmit,
                                        editId,
                                        workoutTypes,
                                        workoutGroups,
                                    }) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
            }}
        >
            <Card sx={{ width: 360, borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h6" mb={2} fontWeight="bold" align="center">
                        {editId ? "Edit Workout" : "Add New Workout"}
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            {/* Workout Type */}
                            <TextField
                                select
                                label="Workout Type"
                                fullWidth
                                value={form.workout_type}
                                onChange={(e) => setForm({ ...form, workout_type: e.target.value, name: "" })}
                            >
                                {workoutTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>

                            {/* Workout Name */}
                            <TextField
                                select
                                label="Workout Name"
                                fullWidth
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                disabled={!form.workout_type}
                            >
                                {(workoutGroups[form.workout_type] || []).map((workout) => (
                                    <MenuItem key={workout} value={workout}>
                                        {workout}
                                    </MenuItem>
                                ))}
                            </TextField>

                            {/* Duration */}
                            <TextField
                                label="Duration (min)"
                                type="number"
                                fullWidth
                                value={form.duration}
                                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                            />

                            {/* Calories */}
                            <TextField
                                label="Calories"
                                type="number"
                                fullWidth
                                value={form.calories}
                                onChange={(e) => setForm({ ...form, calories: e.target.value })}
                            />

                            {/* Date */}
                            <TextField
                                label="Workout Date"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={form.workout_date}
                                onChange={(e) => setForm({ ...form, workout_date: e.target.value })}
                            />

                            {/* Reps */}
                            <TextField
                                label="Reps"
                                type="number"
                                fullWidth
                                value={form.reps}
                                onChange={(e) => setForm({ ...form, reps: e.target.value })}
                            />

                            {/* Submit Button */}
                            <Button type="submit" variant="contained" fullWidth sx={{ mt: 1.5, fontWeight: "bold" }}>
                                {editId ? "Update Workout" : "Add Workout"}
                            </Button>
                        </Stack>
                    </form>

                    {/* Display Animation dynamically if a workout is selected */}
                    {form.name && (
                        <Box mt={3}>
                            <WorkoutAnimation workoutName={form.name} />
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
