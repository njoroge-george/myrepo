import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Chip, Stack, CircularProgress, Box } from "@mui/material";
import { getNotes } from "../api/notesAPI.jsx";
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';

export default function JournalCard({ cardStyle }) {
    const [stats, setStats] = useState({
        total: 0,
        idea: 0,
        task: 0,
        urgent: 0,
        personal: 0,
        pinned: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            try {
                const res = await getNotes();
                let notes = [];
                if (Array.isArray(res)) notes = res;
                else if (Array.isArray(res.data)) notes = res.data;
                else notes = [];
                setStats({
                    total: notes.length,
                    idea: notes.filter(n => n.tags === "idea").length,
                    task: notes.filter(n => n.tags === "task").length,
                    urgent: notes.filter(n => n.tags === "urgent").length,
                    personal: notes.filter(n => n.tags === "personal").length,
                    pinned: notes.filter(n => n.pinned).length,
                });
            } catch {
                setStats({ total: 0, idea: 0, task: 0, urgent: 0, personal: 0, pinned: 0 });
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    return (
        <Card sx={cardStyle}>
            <CardContent>
                <Typography variant="h6" mb={1}>Notes Overview</Typography>
                {loading ? (
                    <CircularProgress color="primary" size={28} />
                ) : (
                    <Box>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <LightbulbIcon color="primary" />
                            <Typography variant="body2">Ideas</Typography>
                            <Chip label={stats.idea} color="primary" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <AssignmentIcon color="secondary" />
                            <Typography variant="body2">Tasks</Typography>
                            <Chip label={stats.task} color="secondary" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <PriorityHighIcon color="error" />
                            <Typography variant="body2">Urgent</Typography>
                            <Chip label={stats.urgent} color="error" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <PersonIcon color="success" />
                            <Typography variant="body2">Personal</Typography>
                            <Chip label={stats.personal} color="success" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <StarIcon color="warning" />
                            <Typography variant="body2">Pinned</Typography>
                            <Chip label={stats.pinned} color="warning" />
                        </Stack>
                        <Typography variant="subtitle2" color="text.secondary" mt={2}>
                            Total Notes: <b>{stats.total}</b>
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}