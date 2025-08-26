import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Chip, Stack, CircularProgress, Box } from "@mui/material";
import { getTodos } from "../api/todoAPI.jsx";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import AutorenewIcon from '@mui/icons-material/Autorenew';

const statusColor = {
    pending: 'warning',
    ongoing: 'info',
    completed: 'success',
};

export default function TodoCard({ cardStyle }) {
    const [stats, setStats] = useState({ pending: 0, ongoing: 0, completed: 0, total: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            try {
                const todos = await getTodos();
                const pending = todos.filter(t => t.status === "pending").length;
                const ongoing = todos.filter(t => t.status === "ongoing").length;
                const completed = todos.filter(t => t.status === "completed").length;
                setStats({
                    pending, ongoing, completed,
                    total: todos.length
                });
            } catch {
                setStats({ pending: 0, ongoing: 0, completed: 0, total: 0 });
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    return (
        <Card sx={cardStyle}>
            <CardContent>
                <Typography variant="h6" mb={1}>Task Overview</Typography>
                {loading ? (
                    <CircularProgress color="primary" size={28} />
                ) : (
                    <Box>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <AssignmentLateIcon color="warning" />
                            <Typography variant="body2">Pending</Typography>
                            <Chip label={stats.pending} color="warning" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <AutorenewIcon color="info" />
                            <Typography variant="body2">Ongoing</Typography>
                            <Chip label={stats.ongoing} color="info" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <AssignmentTurnedInIcon color="success" />
                            <Typography variant="body2">Completed</Typography>
                            <Chip label={stats.completed} color="success" />
                        </Stack>
                        <Typography variant="subtitle2" color="text.secondary" mt={2}>
                            Total Tasks: <b>{stats.total}</b>
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}