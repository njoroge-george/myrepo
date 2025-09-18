import { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
    Paper,
} from "@mui/material";
import { createChallenge } from "../../api/Coding.jsx";

const difficulties = ["Easy", "Medium", "Hard"];

export const ChallengeForm = ({ onCreate }) => {
    const [form, setForm] = useState({
        title: "",
        description: "",
        difficulty: "Medium",
        tags: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const challengeData = {
                ...form,
                tags: form.tags,
            };
            const newChallenge = await createChallenge(challengeData);
            onCreate(newChallenge); // update parent list
            setForm({ title: "", description: "", difficulty: "Medium", tags: "" });
        } catch (err) {
            console.error("Challenge creation failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
                Create New Challenge
            </Typography>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <TextField
                    label="Title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Description"
                    name="description"
                    multiline
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Difficulty"
                    name="difficulty"
                    select
                    value={form.difficulty}
                    onChange={handleChange}
                >
                    {difficulties.map((level) => (
                        <MenuItem key={level} value={level}>
                            {level}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Tags (comma-separated)"
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                />
                <Button variant="contained" type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Challenge"}
                </Button>
            </form>
        </Paper>
    );
};
