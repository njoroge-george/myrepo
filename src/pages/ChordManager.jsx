import React, { useEffect, useState } from "react";
import {
    getChords,
    createChord,
    updateChord,
    deleteChord,
} from "../api/chordAPI.jsx";
import {
    Container,
    Typography,
    Button,
    TextField,
    Card,
    CardContent,
    CardActions,
    Grid,
} from "@mui/material";

const ChordManager = () => {
    const [chords, setChords] = useState([]);
    const [name, setName] = useState("");
    const [notes, setNotes] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchChords();
    }, []);

    const fetchChords = async () => {
        try {
            const res = await getChords();
            if (res.success) setChords(res.data);
        } catch (err) {
            console.error("Error fetching chords:", err);
        }
    };

    const handleSave = async () => {
        if (!name || !notes) return;
        try {
            if (editId) {
                await updateChord(editId, { name, notes, type, description });
            } else {
                await createChord({ name, notes, type, description });
            }
            resetForm();
            fetchChords();
        } catch (err) {
            console.error("Error saving chord:", err);
        }
    };

    const handleEdit = (chord) => {
        setEditId(chord.id);
        setName(chord.name);
        setNotes(chord.notes);
        setType(chord.type);
        setDescription(chord.description);
    };

    const handleDelete = async (id) => {
        try {
            await deleteChord(id);
            fetchChords();
        } catch (err) {
            console.error("Error deleting chord:", err);
        }
    };

    const resetForm = () => {
        setName("");
        setNotes("");
        setType("");
        setDescription("");
        setEditId(null);
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                🎹 Piano Chord Manager
            </Typography>

            {/* Form */}
            <Card sx={{ mb: 4, p: 2, background: editId ? "#fff3e0" : "#e3f2fd" }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {editId ? "✏️ Edit Chord" : "➕ Add New Chord"}
                    </Typography>
                    <TextField label="Chord Name" fullWidth sx={{ mb: 2 }} value={name} onChange={(e) => setName(e.target.value)} />
                    <TextField label="Notes (comma separated)" fullWidth sx={{ mb: 2 }} value={notes} onChange={(e) => setNotes(e.target.value)} />
                    <TextField label="Type" fullWidth sx={{ mb: 2 }} value={type} onChange={(e) => setType(e.target.value)} />
                    <TextField label="Description" fullWidth multiline rows={3} sx={{ mb: 2 }} value={description} onChange={(e) => setDescription(e.target.value)} />

                    <Button variant="contained" color={editId ? "warning" : "primary"} onClick={handleSave} sx={{ mr: 2 }}>
                        {editId ? "Update Chord" : "Save Chord"}
                    </Button>
                    {editId && <Button variant="outlined" onClick={resetForm}>Cancel</Button>}
                </CardContent>
            </Card>

            {/* List */}
            <Grid container spacing={2}>
                {chords.length > 0 ? (
                    chords.map((chord) => (
                        <Grid item xs={12} key={chord.id}>
                            <Card sx={{ p: 2, borderLeft: "5px solid #1976d2" }}>
                                <CardContent>
                                    <Typography variant="h6">{chord.name}</Typography>
                                    <Typography variant="body2">Notes: {chord.notes}</Typography>
                                    <Typography variant="body2">Type: {chord.type}</Typography>
                                    <Typography variant="body2">{chord.description}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button color="primary" onClick={() => handleEdit(chord)}>Edit</Button>
                                    <Button color="error" onClick={() => handleDelete(chord.id)}>Delete</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography>No chords found.</Typography>
                )}
            </Grid>
        </Container>
    );
};

export default ChordManager;
