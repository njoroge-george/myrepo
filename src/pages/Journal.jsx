import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    IconButton,
    Chip,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    CircularProgress,
} from '@mui/material';
import { Edit, Delete, Save, Cancel, StarBorder, Star } from '@mui/icons-material';
import { getNotes, addNote, updateNote, deleteNote } from '../api/notesAPI.jsx';
import { motion } from 'framer-motion';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

function NoteCard({ note, onUpdate, onDelete, onTogglePin }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(note.text);

    const handleSave = () => {
        onUpdate(note.id, { text: editText });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditText(note.text);
    };

    const tagColor = {
        idea: 'primary',
        task: 'secondary',
        urgent: 'error',
        personal: 'success',
    };

    return (
        <motion.div>
            <Paper
                sx={{
                    p: 2,
                    borderLeft: `5px solid`,
                    borderColor: tagColor[note.tags] ? `${tagColor[note.tags]}.main` : 'primary.main',
                    background: '#fff',
                    color: 'text.primary',
                    boxShadow: 2,
                    borderRadius: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: 4,
                    },
                }}
            >
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        {new Date(note.date).toLocaleString()}
                    </Typography>
                    <Chip
                        label={`#${note.tags}`}
                        color={tagColor[note.tags] || 'primary'}
                        variant="outlined"
                        size="small"
                        sx={{ my: 1 }}
                    />
                    {isEditing ? (
                        <TextField
                            fullWidth
                            multiline
                            variant="standard"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            sx={{ my: 1 }}
                            autoFocus
                        />
                    ) : (
                        <Typography sx={{ my: 1, whiteSpace: 'pre-wrap' }}>{note.text}</Typography>
                    )}
                </Box>
                <Box sx={{ mt: 1, alignSelf: 'flex-end' }}>
                    {isEditing ? (
                        <>
                            <IconButton onClick={handleSave} size="small" color="success">
                                <Save />
                            </IconButton>
                            <IconButton onClick={handleCancel} size="small" color="error">
                                <Cancel />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <IconButton onClick={() => setIsEditing(true)} size="small" color="primary">
                                <Edit />
                            </IconButton>
                            <IconButton onClick={() => onDelete(note.id)} size="small" color="error">
                                <Delete />
                            </IconButton>
                            <IconButton onClick={() => onTogglePin(note.id, note.pinned)} size="small" color="warning">
                                {note.pinned ? <Star /> : <StarBorder />}
                            </IconButton>
                        </>
                    )}
                </Box>
            </Paper>
        </motion.div>
    );
}

export default function Journal() {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [newTag, setNewTag] = useState('idea');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Chart Data
    const notesByTag = notes.reduce(
        (acc, note) => {
            acc[note.tags] = (acc[note.tags] || 0) + 1;
            return acc;
        },
        { idea: 0, task: 0, urgent: 0, personal: 0 }
    );

    const barData = {
        labels: ['Idea', 'Task', 'Urgent', 'Personal'],
        datasets: [
            {
                label: 'Notes by Tag',
                data: [
                    notesByTag.idea,
                    notesByTag.task,
                    notesByTag.urgent,
                    notesByTag.personal,
                ],
                backgroundColor: [
                    '#1976d2', // primary
                    '#9c27b0', // secondary
                    '#d32f2f', // error
                    '#388e3c', // success
                ],
                borderRadius: 6,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#222' } },
            title: { display: true, text: 'Notes Count by Tag', color: '#222', font: { size: 18 } },
        },
        scales: {
            x: { ticks: { color: '#222' }, grid: { color: 'rgba(0,0,0,0.05)' } },
            y: { ticks: { color: '#222' }, grid: { color: 'rgba(0,0,0,0.05)' }, beginAtZero: true },
        },
    };

    const today = new Date();
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().slice(0, 10);
    });

    const notesByDate = last7Days.map(date =>
        notes.filter(note => note.date.startsWith(date)).length
    );

    const lineData = {
        labels: last7Days,
        datasets: [
            {
                label: 'Notes Added',
                data: notesByDate,
                borderColor: '#1976d2',
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 5,
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#222' } },
            title: { display: true, text: 'Notes Added (Last 7 Days)', color: '#222', font: { size: 18 } },
        },
        scales: {
            x: { ticks: { color: '#222' }, grid: { color: 'rgba(0,0,0,0.05)' } },
            y: { ticks: { color: '#222' }, grid: { color: 'rgba(0,0,0,0.05)' }, beginAtZero: true },
        },
    };

    const loadNotes = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await getNotes();
            setNotes(res.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
        } catch (error) {
            console.error('Failed to load notes:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadNotes();
    }, [loadNotes]);

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        const noteData = { text: newNote, date: new Date().toISOString(), tags: newTag, pinned: false };
        const res = await addNote(noteData);
        setNotes(prevNotes => [res.data, ...prevNotes]);
        setNewNote('');
    };

    const handleDeleteNote = async (id) => {
        await deleteNote(id);
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    };

    const handleUpdateNote = async (id, updatedData) => {
        const res = await updateNote(id, updatedData);
        setNotes(prevNotes => prevNotes.map(note => (note.id === id ? res.data : note)));
    };

    const handleTogglePin = async (id, currentPinned) => {
        const res = await updateNote(id, { pinned: !currentPinned });
        setNotes(prevNotes => prevNotes.map(note => (note.id === id ? res.data : note)));
    };

    const exportNotes = () => {
        const dataStr = JSON.stringify(notes, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `notes_export_${new Date().toISOString()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredNotes = useMemo(
        () =>
            notes.filter(
                (note) =>
                    note.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    note.tags.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [notes, searchTerm]
    );

    const pinnedNotes = useMemo(() => filteredNotes.filter(note => note.pinned), [filteredNotes]);
    const otherNotes = useMemo(() => filteredNotes.filter(note => !note.pinned), [filteredNotes]);

    const renderNotesGrid = (noteList) => (
        <Grid container spacing={2}>
            {noteList.map((note) => (
                <Grid item xs={12} sm={6} md={4} key={note.id}>
                    <NoteCard note={note} onDelete={handleDeleteNote} onUpdate={handleUpdateNote} onTogglePin={handleTogglePin} />
                </Grid>
            ))}
        </Grid>
    );

    return (
        <Box
            sx={{
                p: 3,
                minHeight: '100vh',
                background: '#f9f9f9',
                color: 'text.primary',
            }}
        >
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Journal
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                You have {notes.length} total notes.
            </Typography>

            {/* Charts */}
            <Grid container spacing={4} mb={5}>
                <Grid item xs={12} sx={{ height: 320 }}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            background: '#fff',
                            boxShadow: 2,
                            borderRadius: 3,
                        }}
                    >
                        <Bar data={barData} options={barOptions} />
                    </Paper>
                </Grid>
                <Grid item xs={12} sx={{ height: 320 }}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            background: '#fff',
                            boxShadow: 2,
                            borderRadius: 3,
                        }}
                    >
                        <Line data={lineData} options={lineOptions} />
                    </Paper>
                </Grid>
            </Grid>

            {/* Add Note Input Area */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Paper
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        background: '#fff',
                        boxShadow: 2,
                        width: '100%',
                        maxWidth: 700,
                    }}
                >
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={9}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="What's on your mind?"
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel id="tag-label">Tag</InputLabel>
                                <Select
                                    labelId="tag-label"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                >
                                    <MenuItem value="idea">Idea</MenuItem>
                                    <MenuItem value="task">Task</MenuItem>
                                    <MenuItem value="urgent">Urgent</MenuItem>
                                    <MenuItem value="personal">Personal</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: 'right' }}>
                            <Button
                                variant="contained"
                                onClick={handleAddNote}
                                sx={{ fontWeight: 'bold' }}
                            >
                                Add Note
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            {/* Search and Export */}
            <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
                <Grid item xs={12} md={9}>
                    <TextField
                        placeholder="Search notes by text or tag..."
                        fullWidth
                        variant="outlined"
                        size="small"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={3} sx={{ textAlign: 'right' }}>
                    <Button
                        variant="outlined"
                        onClick={exportNotes}
                    >
                        Export All Notes
                    </Button>
                </Grid>
            </Grid>

            {/* Notes Lists */}
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {pinnedNotes.length > 0 && (
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" color="primary" gutterBottom>
                                Pinned
                            </Typography>
                            {renderNotesGrid(pinnedNotes)}
                        </Box>
                    )}
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Notes
                        </Typography>
                        {renderNotesGrid(otherNotes)}
                    </Box>
                </>
            )}
        </Box>
    );
}