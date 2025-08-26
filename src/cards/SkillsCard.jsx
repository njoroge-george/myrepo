import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Chip, Stack, CircularProgress, Box } from "@mui/material";
import {
    getCourses,
    getAchievements,
    getResources,
    getPracticeLogs,
} from "../api/learningAPI.jsx";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import LinkIcon from "@mui/icons-material/Link";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

export default function SkillsCard({ cardStyle }) {
    const [stats, setStats] = useState({
        courses: 0,
        achievements: 0,
        resources: 0,
        practiceLogs: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            try {
                const [coursesRes, achievementsRes, resourcesRes, logsRes] = await Promise.all([
                    getCourses(),
                    getAchievements(),
                    getResources(),
                    getPracticeLogs(),
                ]);
                setStats({
                    courses: Array.isArray(coursesRes) ? coursesRes.length : 0,
                    achievements: Array.isArray(achievementsRes) ? achievementsRes.length : 0,
                    resources: Array.isArray(resourcesRes) ? resourcesRes.length : 0,
                    practiceLogs: Array.isArray(logsRes) ? logsRes.length : 0,
                });
            } catch {
                setStats({ courses: 0, achievements: 0, resources: 0, practiceLogs: 0 });
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    return (
        <Card sx={cardStyle}>
            <CardContent>
                <Typography variant="h6" mb={1}>Learning Overview</Typography>
                {loading ? (
                    <CircularProgress color="primary" size={28} />
                ) : (
                    <Box>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <MenuBookIcon color="primary" />
                            <Typography variant="body2">Courses</Typography>
                            <Chip label={stats.courses} color="primary" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <MilitaryTechIcon color="warning" />
                            <Typography variant="body2">Achievements</Typography>
                            <Chip label={stats.achievements} color="warning" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <LinkIcon color="info" />
                            <Typography variant="body2">Resources</Typography>
                            <Chip label={stats.resources} color="info" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <FitnessCenterIcon color="success" />
                            <Typography variant="body2">Practice Logs</Typography>
                            <Chip label={stats.practiceLogs} color="success" />
                        </Stack>
                        <Typography variant="subtitle2" color="text.secondary" mt={2}>
                            Total Items: <b>{stats.courses + stats.achievements + stats.resources + stats.practiceLogs}</b>
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}