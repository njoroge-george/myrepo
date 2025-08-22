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
            backgroundColor: ['#bdbdbd', '#90caf9', '#a5d6a7'],
            borderRadius: 6
        }]
    };
    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#222' } },
            title: { display: true, text: 'Projects by Status', color: '#222', font: { size: 18 } },
        },
        scales: {
            x: { ticks: { color: '#222' }, grid: { color: 'rgba(0,0,0,0.05)' } },
            y: { ticks: { color: '#222' }, grid: { color: 'rgba(0,0,0,0.05)' }, beginAtZero: true },
        },
    };

    return (
        <Box sx={{ p: 4, minHeight: '100vh', background: '#f9f9f9', color: 'text.primary' }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                Projects
            </Typography>

            {/* Chart */}
            <Paper elevation={3} sx={{ p: 3, mb: 5, height: 350, background: '#fff', borderRadius: 4 }}>
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
                        background: '#fff',
                        borderRadius: 3,
                        boxShadow: 2,
                        color: 'text.primary'
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
                            />
                            <TextField
                                fullWidth
                                label="Budget"
                                name="budget"
                                value={form.budget}
                                onChange={handleChange}
                                type="number"
                                sx={{ mb: 2 }}
                            />
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="todo">To Do</MenuItem>
                                    <MenuItem value="inProgress">In Progress</MenuItem>
                                    <MenuItem value="done">Done</MenuItem>
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
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{
                                    fontWeight: 'bold',
                                    bgcolor: 'primary.main',
                                    color: '#fff',
                                    '&:hover': { bgcolor: 'primary.dark' },
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
                        background: '#fff',
                        borderRadius: 3,
                        boxShadow: 2,
                        color: 'text.primary'
                    }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Your Projects
                        </Typography>
                        <List>
                            {projects.map((proj) => (
                                <ListItem
                                    key={proj.id}
                                    sx={{
                                        borderBottom: '1px solid #eee',
                                        '&:hover': { backgroundColor: '#f5f5f5' },
                                    }}
                                >
                                    <ListItemText
                                        primary={proj.title}
                                        secondary={`Status: ${proj.status} | Budget: ${proj.budget} | Progress: ${proj.progress}%`}
                                        primaryTypographyProps={{ style: { color: '#222' } }}
                                        secondaryTypographyProps={{ style: { color: '#666' } }}
                                    />
                                    <Button
                                        sx={{ mx: 1 }}
                                        variant="outlined"
                                        color="primary"
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