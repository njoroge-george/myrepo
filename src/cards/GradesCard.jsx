import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Chip, Stack, CircularProgress, Box } from "@mui/material";
import { getGrades } from "../api/Grade.jsx";
import SchoolIcon from "@mui/icons-material/School";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const GRADE_POINTS = {
    A: 12,
    "A-": 11,
    "B+": 10,
    B: 9,
    "B-": 8,
    "C+": 7,
    C: 6,
    "C-": 5,
    "D+": 4,
    D: 3,
    "D-": 2,
    E: 1,
};

function average(nums) {
    if (!nums.length) return 0;
    return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export default function GradesCard({ cardStyle }) {
    const [stats, setStats] = useState({
        total: 0,
        avg: 0,
        bestGrade: "",
        bestPoints: 0,
        bestSubject: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            try {
                const data = await getGrades();
                const rows = Array.isArray(data) ? data : [];
                const pointsArr = rows.map(r => GRADE_POINTS[r.grade] || 0);
                const avg = Number(average(pointsArr).toFixed(2));
                // Best grade: highest points, most recent if tie
                let bestRow = null;
                for (const r of rows) {
                    if (!bestRow || (GRADE_POINTS[r.grade] || 0) > (GRADE_POINTS[bestRow.grade] || 0) ||
                        ((GRADE_POINTS[r.grade] || 0) === (GRADE_POINTS[bestRow.grade] || 0) &&
                            new Date(r.date || r.createdAt || 0) > new Date(bestRow.date || bestRow.createdAt || 0))) {
                        bestRow = r;
                    }
                }
                setStats({
                    total: rows.length,
                    avg,
                    bestGrade: bestRow?.grade || "",
                    bestPoints: bestRow ? (GRADE_POINTS[bestRow.grade] || 0) : 0,
                    bestSubject: bestRow?.subject || "",
                });
            } catch {
                setStats({ total: 0, avg: 0, bestGrade: "", bestPoints: 0, bestSubject: "" });
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    return (
        <Card sx={cardStyle}>
            <CardContent>
                <Typography variant="h6" mb={1}>Grades Overview</Typography>
                {loading ? (
                    <CircularProgress color="primary" size={28} />
                ) : (
                    <Box>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <SchoolIcon color="primary" />
                            <Typography variant="body2">Total Grades</Typography>
                            <Chip label={stats.total} color="primary" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <TrendingUpIcon color="success" />
                            <Typography variant="body2">Average Points</Typography>
                            <Chip label={stats.avg} color="success" />
                        </Stack>
                        {stats.bestGrade && (
                            <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                                <EmojiEventsIcon color="warning" />
                                <Typography variant="body2">Best Grade</Typography>
                                <Chip label={stats.bestGrade} color="warning" />
                                <Typography variant="body2" color="text.secondary">
                                    ({stats.bestPoints} pts, {stats.bestSubject})
                                </Typography>
                            </Stack>
                        )}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}