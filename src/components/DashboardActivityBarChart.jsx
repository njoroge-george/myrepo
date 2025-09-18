import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
    getTodos,
} from "../api/todoAPI.jsx";
import { getContacts } from "../api/Contacts.jsx";
import { getAllMessages } from "../api/adminAPI.jsx";
import { getEntries } from "../api/financeApi.jsx";
import { getNotes } from "../api/notesAPI.jsx";
import { fetchFitnessEntries } from "../api/fitnessAPI.jsx";
import { getProjects } from "../api/projectsAPI.jsx";
import { getRecipes } from "../api/recipeAPI.jsx";
import { getGrades } from "../api/Grade";
import {
    getCourses,
    getAchievements,
    getResources,
    getPracticeLogs,
} from "../api/learningAPI.jsx";

// Use Chart.js registration if not global
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardActivityBarChart({ cardStyle }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAllStats() {
            setLoading(true);
            try {
                // Fetch all in parallel
                const [
                    todos,
                    contacts,
                    mails,
                    finance,
                    notes,
                    fitness,
                    projects,
                    recipes,
                    grades,
                    courses,
                    achievements,
                    resources,
                    practiceLogs,
                ] = await Promise.all([
                    getTodos(),
                    getContacts(),
                    getAllMessages(),
                    getEntries(),
                    getNotes(),
                    fetchFitnessEntries(),
                    getProjects(),
                    getRecipes(),
                    getGrades(),
                    getCourses(),
                    getAchievements(),
                    getResources(),
                    getPracticeLogs(),
                ]);
                setStats({
                    Tasks: Array.isArray(todos) ? todos.length : 0,
                    Contacts: Array.isArray(contacts) ? contacts.length : 0,
                    AdminMail: Array.isArray(mails?.data) ? mails.data.length : 0,
                    Finance: Array.isArray(finance) ? finance.length : 0,
                    Notes: Array.isArray(notes) ? notes.length : 0,
                    Fitness: Array.isArray(fitness) ? fitness.length : 0,
                    Projects: Array.isArray(projects) ? projects.length : 0,
                    Recipes: Array.isArray(recipes) ? recipes.length : 0,
                    Grades: Array.isArray(grades) ? grades.length : 0,
                    Learning:
                        (Array.isArray(courses) ? courses.length : 0) +
                        (Array.isArray(achievements) ? achievements.length : 0) +
                        (Array.isArray(resources) ? resources.length : 0) +
                        (Array.isArray(practiceLogs) ? practiceLogs.length : 0),
                });
            } catch {
                setStats(null);
            } finally {
                setLoading(false);
            }
        }
        fetchAllStats();
    }, []);

    // Prepare chart data
    const labels = stats ? Object.keys(stats) : [];
    const dataValues = stats ? Object.values(stats) : [];
    const mostActive = stats
        ? labels[dataValues.indexOf(Math.max(...dataValues))]
        : "";
    const leastActive = stats
        ? labels[dataValues.indexOf(Math.min(...dataValues))]
        : "";

    const barData = {
        labels,
        datasets: [
            {
                label: "Records / Items",
                data: dataValues,
                backgroundColor: labels.map(l =>
                    l === mostActive
                        ? "#4caf50"
                        : l === leastActive
                            ? "#d32f2f"
                            : "#1976d2"
                ),
                borderRadius: 6,
            },
        ],
    };
    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: "Most & Least Active Areas",
                font: { size: 18 },
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (context.label === mostActive) label += ' (Most Active)';
                        if (context.label === leastActive) label += ' (Least Active)';
                        return `${label}: ${context.parsed.y}`;
                    }
                }
            }
        },
        scales: {
            x: { ticks: { color: "#222" }, grid: { color: "rgba(0,0,0,0.04)" } },
            y: { beginAtZero: true, ticks: { color: "#222" }, grid: { color: "rgba(0,0,0,0.07)" } },
        },
    };

    return (
        <Card sx={cardStyle}>
            <CardContent>
                <Typography variant="h6" mb={1}>Dashboard Activity Overview</Typography>
                {loading || !stats ? (
                    <Box sx={{ display: "flex", justifyContent: "center", height: 200 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box sx={{ height: 400, width: "1200px" }}>
                        <Bar data={barData} options={barOptions} />
                        <Typography variant="subtitle2" color="text.secondary" mt={0.5}>
                            <span style={{ color: "#4caf50", fontWeight: 600 }}>Most Active:</span> {mostActive} ({stats[mostActive]} items)
                            {" | "}
                            <span style={{ color: "#d32f2f", fontWeight: 600 }}>Least Active:</span> {leastActive} ({stats[leastActive]} items)
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}