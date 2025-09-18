import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    MenuItem,
} from "@mui/material";
import { updateChallenge } from "../../api/Coding.jsx";

const difficulties = ["Easy", "Medium", "Hard"];

export const EditChallengeModal = ({ open, onClose, challenge, onSave }) => {
    const [form, setForm] = useState(null);

    useEffect(() => {
        if (challenge && open) {
            setForm({
                id: challenge.id,
                title: challenge.title || "",
                description: challenge.description || "",
                difficulty: challenge.difficulty || "Medium",
                tags: Array.isArray(challenge.tags)
                    ? challenge.tags.join(", ")
                    : challenge.tags || "",
            });
        }
    }, [challenge, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...form,
                tags: form.tags.split(",").map((tag) => tag.trim()),
            };
            const updated = await updateChallenge(payload);
            onSave(updated);
            onClose();
        } catch (err) {
            console.error("Failed to update challenge:", err);
        }
    };

    if (!form) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Edit Challenge</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};
