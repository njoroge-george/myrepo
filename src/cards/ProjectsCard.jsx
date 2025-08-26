import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Chip, Stack, CircularProgress, Box } from "@mui/material";
import { getProjects } from "../api/projectsAPI.jsx";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

export default function ProjectsCard({ cardStyle }) {
    const [stats, setStats] = useState({
        total: 0,
        todo: 0,
        inProgress: 0,
        done: 0,
        totalBudget: 0,
        avgProgress: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            try {
                const res = await getProjects();
                const projects = Array.isArray(res) ? res : res.data || [];
                const todo = projects.filter(p => p.status === "todo").length;
                const inProgress = projects.filter(p => p.status === "inProgress").length;
                const done = projects.filter(p => p.status === "done").length;
                const totalBudget = projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
                const avgProgress = projects.length
                    ? Math.round(projects.reduce((sum, p) => sum + (Number(p.progress) || 0), 0) / projects.length)
                    : 0;
                setStats({
                    total: projects.length,
                    todo,
                    inProgress,
                    done,
                    totalBudget,
                    avgProgress,
                });
            } catch {
                setStats({ total: 0, todo: 0, inProgress: 0, done: 0, totalBudget: 0, avgProgress: 0 });
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    return (
        <Card sx={cardStyle}>
            <CardContent>
                <Typography variant="h6" mb={1}>Projects Overview</Typography>
                {loading ? (
                    <CircularProgress color="primary" size={28} />
                ) : (
                    <Box>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <AssignmentIcon color="warning" />
                            <Typography variant="body2">To Do</Typography>
                            <Chip label={stats.todo} color="warning" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <TrendingUpIcon color="info" />
                            <Typography variant="body2">In Progress</Typography>
                            <Chip label={stats.inProgress} color="info" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <AssignmentTurnedInIcon color="success" />
                            <Typography variant="body2">Done</Typography>
                            <Chip label={stats.done} color="success" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <MonetizationOnIcon color="secondary" />
                            <Typography variant="body2">Total Budget</Typography>
                            <Chip label={`$${stats.totalBudget.toLocaleString()}`} color="secondary" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <TrendingUpIcon color="primary" />
                            <Typography variant="body2">Average Progress</Typography>
                            <Chip label={`${stats.avgProgress}%`} color="primary" />
                        </Stack>
                        <Typography variant="subtitle2" color="text.secondary" mt={2}>
                            Total Projects: <b>{stats.total}</b>
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}