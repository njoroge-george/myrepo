import { useState, useEffect } from "react";
import {
    Grid,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button,
} from "@mui/material";

// Helper to get YYYY-MM-DD in local timezone
function getLocalDateYYYYMMDD() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 10);
}

export default function Form({ onAdd, workoutToEdit }) {
    const [id, setId] = useState(null);
    const [name, setName] = useState("");
    const [reps, setReps] = useState("");
    const [type, setType] = useState("");
    const [date, setDate] = useState(getLocalDateYYYYMMDD());

    const workoutGroups = {
        Chest: [
            "Diamond Push-ups",
            "V-ups",
            "Front Stretch Push-ups",
            "Wide Push-ups",
            "Decline full body Push-ups",
        ],
        Legs: ["Squats"],
        Abs: ["Front Barbell Raise", "Sit-ups", "Bicycle Crunches"],
        FullBody: ["Running"],
        Glutes: ["Glute Bridges"],
        Shoulders: ["Pike Push-ups", "Triceps Dips"],
    };

    const workoutTypes = [
        "Abs",
        "Chest",
        "Legs",
        "Arms",
        "Shoulders",
        "Full Body",
        "Glutes",
        "Core",
        "Triceps",
        "Biceps",
        "Quadriceps",
    ];

    // 👉 If editing, pre-fill form
    useEffect(() => {
        if (workoutToEdit) {
            setId(workoutToEdit.id || null);
            setName(workoutToEdit.name || "");
            setType(workoutToEdit.type || "");
            setReps(workoutToEdit.reps || "");
            setDate(workoutToEdit.date || getLocalDateYYYYMMDD());
        } else {
            setId(null);
            setName("");
            setType("");
            setReps("");
            setDate(getLocalDateYYYYMMDD());
        }
    }, [workoutToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !reps || !type || !date) {
            alert("Please fill in all fields!");
            return;
        }

        try {
            await onAdd(id, {
                name,
                reps: Number(reps),
                type,
                date,
            });
            // Reset
            setId(null);
            setName("");
            setReps("");
            setType("");
            setDate(getLocalDateYYYYMMDD());
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                        <InputLabel>Fitness</InputLabel>
                        <Select
                            value={name}
                            label="Fitness"
                            onChange={(e) => setName(e.target.value)}
                        >
                            {Object.entries(workoutGroups).flatMap(([group, workouts]) =>
                                workouts.map((workout, i) => (
                                    <MenuItem key={`${group}-${i}`} value={workout}>
                                        {`${group} - ${workout}`}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={type}
                            label="Type"
                            onChange={(e) => setType(e.target.value)}
                        >
                            {workoutTypes.map((t, i) => (
                                <MenuItem key={i} value={t}>
                                    {t}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        required
                        type="number"
                        label="Reps"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        required
                        type="date"
                        label="Date"
                        InputLabelProps={{ shrink: true }}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        {id ? "Update Fitness" : "Add Fitness"}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}
