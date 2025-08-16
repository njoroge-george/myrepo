import React, { useEffect, useState } from 'react';
import {
    Box, Typography, TextField, Button, Paper,
    Select, MenuItem, FormControl, InputLabel, List,
    ListItem, ListItemText, Grid
} from '@mui/material';
import { getProjects, createProject, deleteProject, updateProject } from '../api/projectsAPI';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({
        title: '', details: '', budget: '',
        status: 'todo', progress: 0,
        start_date: '', end_date: ''
    });

    const fetchProjects = async () => {
        try {
            const data = await getProjects();
            setProjects(Array.isArray(data) ? data : data.data || []);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        }
    };

    useEffect(() => { fetchProjects(); }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editId) {
            await updateProject(editId, form);
            setEditId(null);
        } else {
            await createProject(form);
        }
        setForm({
            title: '', details: '', budget: '',
            status: 'todo', progress: 0,
            start_date: '', end_date: ''
        });
        fetchProjects();
    };

    const handleDelete = async (id) => {
        await deleteProject(id);
        fetchProjects();
    };

    const handleEdit = (project) => {
        setForm({ ...project });
        setEditId(project.id);
    };

    // Chart data
    const statusCounts = projects.reduce((acc, proj) => {
        acc[proj.status] = (acc[proj.status] || 0) + 1;
        return acc;
    }, {});
    const barData = {
        labels: ['To Do', 'In Progress', 'Done'],
        datasets: [{
            label: 'Number of Projects',
            data: [statusCounts.todo || 0, statusCounts.inProgress || 0, statusCounts.done || 0],
            backgroundColor: ['#ffc107', '#2196f3', '#4caf50'],
            borderRadius: 6
        }]
    };
    const barOptions = { responsive: true, maintainAspectRatio: false };

    return (
        <Box sx={{ p: 4, minHeight: '100vh', background: 'linear-gradient(135deg, #0d0d2b, #2b0030)', color: '#faffb8' }}>
            <Typography variant="h4" gutterBottom>Projects</Typography>

            {/* Chart */}
            <Paper elevation={6} sx={{ p: 3, mb: 5, height: 350, background: '#fff', borderRadius: 4 }}>
                <Bar data={barData} options={barOptions} />
            </Paper>

            {/* Form & List */}
            <Grid container spacing={4} justifyContent="center">
                {/* Form */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{
                        p: 3,
                        maxWidth: 500,
                        margin: 'auto',
                        background: 'rgba(34, 139, 34, 0.8)', // Forest Green for a calm, friendly tone
                        borderRadius: 3,
                        boxShadow: 3,
                    }}>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Title"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                                sx={{ mb: 2 }}
                                InputProps={{
                                    sx: {
                                        backgroundColor: '#f0f8ff', // Light Cyan background for input clarity
                                        borderRadius: 1,
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Details"
                                name="details"
                                value={form.details}
                                onChange={handleChange}
                                multiline
                                rows={3}
                                sx={{ mb: 2 }}
                                InputProps={{
                                    sx: {
                                        backgroundColor: '#f0f8ff',
                                        borderRadius: 1,
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Budget"
                                name="budget"
                                value={form.budget}
                                onChange={handleChange}
                                type="number"
                                sx={{ mb: 2 }}
                                InputProps={{
                                    sx: {
                                        backgroundColor: '#f0f8ff',
                                        borderRadius: 1,
                                    }
                                }}
                            />
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel sx={{ color: '#006400' }}>Status</InputLabel>
                                <Select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    sx={{
                                        backgroundColor: '#f0f8ff',
                                        borderRadius: 1,
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#006400',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#228B22',
                                        }
                                    }}
                                >
                                    <MenuItem value="todo" sx={{ color: '#006400' }}>To Do</MenuItem>
                                    <MenuItem value="inProgress" sx={{ color: '#006400' }}>In Progress</MenuItem>
                                    <MenuItem value="done" sx={{ color: '#006400' }}>Done</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth
                                label="Progress (%)"
                                name="progress"
                                value={form.progress}
                                onChange={handleChange}
                                type="number"
                                sx={{ mb: 2 }}
                                InputProps={{
                                    sx: {
                                        backgroundColor: '#f0f8ff',
                                        borderRadius: 1,
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Start Date"
                                name="start_date"
                                type="date"
                                value={form.start_date}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    sx: {
                                        backgroundColor: '#f0f8ff',
                                        borderRadius: 1,
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                label="End Date"
                                name="end_date"
                                type="date"
                                value={form.end_date}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    sx: {
                                        backgroundColor: '#f0f8ff',
                                        borderRadius: 1,
                                    }
                                }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="success"
                                fullWidth
                                sx={{
                                    backgroundColor: '#4CAF50', // Green for positive action
                                    '&:hover': { backgroundColor: '#45a049' },
                                }}
                            >
                                {editId ? "Update Project" : "Add Project"}
                            </Button>
                        </form>
                    </Paper>
                </Grid>

                {/* List */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{
                        p: 3,
                        maxHeight: 540,
                        overflowY: 'auto',
                        background: 'rgba(25, 25, 112, 0.8)', // Midnight Blue for a professional look
                        borderRadius: 3,
                        boxShadow: 3,
                    }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>Your Projects</Typography>
                        <List>
                            {projects.map((proj) => (
                                <ListItem
                                    key={proj.id}
                                    sx={{
                                        borderBottom: '1px solid rgba(255, 255, 0, 0.2)',
                                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                                    }}
                                >
                                    <ListItemText
                                        primary={proj.title}
                                        secondary={`Status: ${proj.status} | Budget: ${proj.budget} | Progress: ${proj.progress}%`}
                                        primaryTypographyProps={{ style: { color: '#fff' } }}
                                        secondaryTypographyProps={{ style: { color: '#ccc' } }}
                                    />
                                    <Button
                                        sx={{ mx: 1 }}
                                        variant="outlined"
                                        color="info"
                                        onClick={() => handleEdit(proj)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        sx={{ mx: 1 }}
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDelete(proj.id)}
                                    >
                                        Delete
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
