// src/pages/Coding.jsx
import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Divider,
    Box,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Tabs,
    Tab,
    Paper,
    CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ------------------ SELF-CONTAINED API ------------------
const API_BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:5001/api/coding';

const API = {
    getCoders: async () => {
        const res = await fetch(`${API_BASE}/coders`);
        return res.ok ? res.json() : [];
    },
    createCoder: async (data) => {
        const res = await fetch(`${API_BASE}/coders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    },
    getChallenges: async () => {
        const res = await fetch(`${API_BASE}/challenges`);
        return res.ok ? res.json() : [];
    },
    createChallenge: async (data) => {
        const res = await fetch(`${API_BASE}/challenges`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    },
    submitCode: async (data) => {
        const res = await fetch(`${API_BASE}/submissions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    },
    getSubmissionsByCoder: async (coderId) => {
        const res = await fetch(`${API_BASE}/submissions/coder/${coderId}`);
        return res.ok ? res.json() : [];
    },
    getSubmissionsByChallenge: async (challengeId) => {
        const res = await fetch(`${API_BASE}/submissions/challenge/${challengeId}`);
        return res.ok ? res.json() : [];
    },
    deleteSubmission: async (id) => {
        const res = await fetch(`${API_BASE}/submissions/${id}`, { method: 'DELETE' });
        return res.ok ? res.json() : null;
    },
};

// ------------------ COMPONENT ------------------
const Coding = () => {
    const [tab, setTab] = useState(0);
    const [coders, setCoders] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);

    const [newCoder, setNewCoder] = useState('');
    const [newChallenge, setNewChallenge] = useState('');
    const [submissionData, setSubmissionData] = useState({ coderId: '', challengeId: '', code: '' });

    // ------------------ FETCH DATA ------------------
    const fetchAll = async () => {
        setLoading(true);
        try {
            const [coderData, challengeData] = await Promise.all([API.getCoders(), API.getChallenges()]);
            setCoders(coderData);
            setChallenges(challengeData);
        } catch {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const fetchSubmissionsByCoder = async (coderId) => {
        setLoading(true);
        try {
            const data = await API.getSubmissionsByCoder(coderId);
            setSubmissions(data);
        } catch {
            toast.error('Failed to fetch submissions');
        } finally {
            setLoading(false);
        }
    };

    const fetchSubmissionsByChallenge = async (challengeId) => {
        setLoading(true);
        try {
            const data = await API.getSubmissionsByChallenge(challengeId);
            setSubmissions(data);
        } catch {
            toast.error('Failed to fetch submissions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    // ------------------ CREATE ------------------
    const handleCreateCoder = async () => {
        if (!newCoder) return toast.error('Username required');
        setLoading(true);
        try {
            await API.createCoder({ username: newCoder });
            toast.success('Coder created');
            setNewCoder('');
            fetchAll();
        } catch {
            toast.error('Failed to create coder');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateChallenge = async () => {
        if (!newChallenge) return toast.error('Challenge title required');
        setLoading(true);
        try {
            await API.createChallenge({ title: newChallenge });
            toast.success('Challenge created');
            setNewChallenge('');
            fetchAll();
        } catch {
            toast.error('Failed to create challenge');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitCode = async () => {
        const { coderId, challengeId, code } = submissionData;
        if (!coderId || !challengeId || !code) return toast.error('All fields required');
        setLoading(true);
        try {
            await API.submitCode({ coderId, challengeId, code });
            toast.success('Submission created');
            setSubmissionData({ coderId: '', challengeId: '', code: '' });
        } catch {
            toast.error('Failed to submit code');
        } finally {
            setLoading(false);
        }
    };

    // ------------------ DELETE ------------------
    const handleDeleteSubmission = async (id) => {
        if (!id) return;
        setLoading(true);
        try {
            await API.deleteSubmission(id);
            toast.success('Submission deleted');
            setSubmissions(submissions.filter((s) => s.id !== id));
        } catch {
            toast.error('Failed to delete submission');
        } finally {
            setLoading(false);
        }
    };

    // ------------------ RENDER ------------------
    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, color: '#1976d2' }}>Coding Challenge Portal</Typography>

            <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab label="Coders" />
                <Tab label="Challenges" />
                <Tab label="Submissions" />
            </Tabs>

            <Divider sx={{ mb: 3 }} />

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {!loading && tab === 0 && (
                <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                            label="New Coder"
                            value={newCoder}
                            onChange={(e) => setNewCoder(e.target.value)}
                            fullWidth
                        />
                        <Button variant="contained" color="primary" onClick={handleCreateCoder}>Create</Button>
                    </Box>
                    <List>
                        {coders.map((c) => (
                            <ListItem key={c.id} divider>
                                <ListItemText primary={c.username} />
                                <Button variant="outlined" size="small" onClick={() => fetchSubmissionsByCoder(c.id)}>
                                    View Submissions
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}

            {!loading && tab === 1 && (
                <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                            label="New Challenge"
                            value={newChallenge}
                            onChange={(e) => setNewChallenge(e.target.value)}
                            fullWidth
                        />
                        <Button variant="contained" color="secondary" onClick={handleCreateChallenge}>Create</Button>
                    </Box>
                    <List>
                        {challenges.map((ch) => (
                            <ListItem key={ch.id} divider>
                                <ListItemText primary={ch.title} />
                                <Button variant="outlined" size="small" onClick={() => fetchSubmissionsByChallenge(ch.id)}>
                                    View Submissions
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}

            {!loading && tab === 2 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Submit Code</Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                        <TextField
                            select
                            label="Coder"
                            value={submissionData.coderId}
                            onChange={(e) => setSubmissionData({ ...submissionData, coderId: e.target.value })}
                            SelectProps={{ native: true }}
                        >
                            <option value="">Select Coder</option>
                            {coders.map((c) => <option key={c.id} value={c.id}>{c.username}</option>)}
                        </TextField>

                        <TextField
                            select
                            label="Challenge"
                            value={submissionData.challengeId}
                            onChange={(e) => setSubmissionData({ ...submissionData, challengeId: e.target.value })}
                            SelectProps={{ native: true }}
                        >
                            <option value="">Select Challenge</option>
                            {challenges.map((ch) => <option key={ch.id} value={ch.id}>{ch.title}</option>)}
                        </TextField>

                        <TextField
                            label="Code"
                            multiline
                            minRows={4}
                            value={submissionData.code}
                            onChange={(e) => setSubmissionData({ ...submissionData, code: e.target.value })}
                            sx={{ flex: 1 }}
                        />

                        <Button variant="contained" color="success" onClick={handleSubmitCode}>Submit</Button>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6">Submissions</Typography>
                    <List>
                        {submissions.map((s) => (
                            <ListItem key={s.id} divider secondaryAction={
                                <IconButton edge="end" color="error" onClick={() => handleDeleteSubmission(s.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            }>
                                <ListItemText
                                    primary={`Coder: ${s.Coder?.username || s.coderId} | Challenge: ${s.Challenge?.title || s.challengeId}`}
                                    secondary={<pre style={{ whiteSpace: 'pre-wrap' }}>{s.code}</pre>}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}

            <ToastContainer position="top-right" autoClose={2000} />
        </Container>
    );
};

export default Coding;
