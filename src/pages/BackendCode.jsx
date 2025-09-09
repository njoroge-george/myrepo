// src/pages/CodesDashboard.jsx
import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
} from "@mui/material";
import { Edit, Delete, Visibility, Add } from "@mui/icons-material";
import {
    getCodes,
    getCodeById,
    createCode,
    updateCode,
    deleteCode,
} from "../api/backendcodeAPI.jsx";

const BackendCode = () => {
    const [codes, setCodes] = useState([]);
    const [selectedCode, setSelectedCode] = useState(null);
    const [openView, setOpenView] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [formData, setFormData] = useState({ title: "", description: "" });
    const [editingId, setEditingId] = useState(null);

    // Load all codes
    useEffect(() => {
        fetchCodes();
    }, []);

    const fetchCodes = async () => {
        try {
            const { data } = await getCodes();
            setCodes(data);
        } catch (err) {
            console.error("Error fetching codes:", err);
        }
    };

    // 🔍 View details
    const handleView = async (id) => {
        try {
            const { data } = await getCodeById(id);
            setSelectedCode(data);
            setOpenView(true);
        } catch (err) {
            console.error("Error fetching code:", err);
        }
    };

    // 📝 Open form for new code
    const handleAdd = () => {
        setEditingId(null);
        setFormData({ title: "", description: "" });
        setOpenForm(true);
    };

    // 📝 Open form for editing
    const handleEdit = (code) => {
        setEditingId(code.id);
        setFormData({ title: code.title, description: code.description });
        setOpenForm(true);
    };

    // 💾 Submit form (create or update)
    const handleSubmit = async () => {
        try {
            if (editingId) {
                await updateCode(editingId, formData);
            } else {
                await createCode(formData);
            }
            setOpenForm(false);
            fetchCodes();
        } catch (err) {
            console.error("Error saving code:", err);
        }
    };

    // 🗑️ Delete
    const handleDelete = async (id) => {
        try {
            await deleteCode(id);
            fetchCodes();
        } catch (err) {
            console.error("Error deleting code:", err);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <Typography variant="h4" gutterBottom>
                Codes Dashboard
            </Typography>

            {/* ➕ Add Button */}
            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAdd}
                sx={{ mb: 2 }}
            >
                Add Code
            </Button>

            {/* Codes Grid */}
            <Grid container spacing={2}>
                {codes.map((code) => (
                    <Grid item xs={12} sm={6} md={4} key={code.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{code.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {code.description?.slice(0, 80)}...
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <IconButton color="secondary" onClick={() => handleView(code.id)}>
                                    <Visibility />
                                </IconButton>
                                <IconButton color="primary" onClick={() => handleEdit(code)}>
                                    <Edit />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleDelete(code.id)}>
                                    <Delete />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* 🔍 View Modal */}
            <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Code Details</DialogTitle>
                <DialogContent>
                    {selectedCode ? (
                        <>
                            <Typography variant="h6">Title:</Typography>
                            <Typography>{selectedCode.title}</Typography>
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                Description:
                            </Typography>
                            <Typography>{selectedCode.description}</Typography>
                        </>
                    ) : (
                        <Typography>Loading...</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenView(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* 📝 Add/Edit Modal */}
            <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingId ? "Edit Code" : "Add Code"}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Title"
                        margin="normal"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        margin="normal"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenForm(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editingId ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default BackendCode;
