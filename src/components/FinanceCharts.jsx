import React, { useMemo } from "react";
import { Paper, Typography, Box } from "@mui/material";
import { Bar, Line } from "react-chartjs-2";
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
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

// Helper to get month label
function getMonthStr(dateStr) {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// The component expects an `entries` prop (array of finance entries)
export default function FinanceCharts({ entries = [] }) {
    // Group by month
    const monthGroups = useMemo(() => {
        const groups = {};
        entries.forEach(e => {
            const m = getMonthStr(e.date);
            if (!groups[m]) groups[m] = { income: 0, expense: 0, debt: 0 };
            if (e.type === "income") groups[m].income += Number(e.amount);
            else if (e.type === "expense") groups[m].expense += Number(e.amount);
            else if (e.type === "debt") groups[m].debt += Number(e.amount);
        });
        return groups;
    }, [entries]);

    // Group expenses by category
    const expenseByCategory = useMemo(() => {
        const cats = {};
        entries.forEach(e => {
            if (e.type === "expense" && e.category) {
                cats[e.category] = (cats[e.category] || 0) + Number(e.amount);
            }
        });
        return cats;
    }, [entries]);
    const expenseCategories = Object.keys(expenseByCategory);
    const expenseAmounts = expenseCategories.map(cat => expenseByCategory[cat]);

    const months = Object.keys(monthGroups).sort();
    const barData = {
        labels: months,
        datasets: [
            {
                label: "Income",
                data: months.map(m => monthGroups[m].income),
                backgroundColor: "#2e7d32",
            },
            {
                label: "Expense",
                data: months.map(m => monthGroups[m].expense),
                backgroundColor: "#d32f2f",
            },
            {
                label: "Debt",
                data: months.map(m => monthGroups[m].debt),
                backgroundColor: "#ffa000",
            },
        ],
    };
    const barOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Monthly Income / Expense / Debt" },
        },
    };

    // Line chart for cumulative balance
    const lineLabels = months;
    let balance = 0;
    const lineDataArr = months.map(m => {
        balance += monthGroups[m].income - monthGroups[m].expense - monthGroups[m].debt;
        return balance;
    });
    const lineData = {
        labels: lineLabels,
        datasets: [
            {
                label: "Cumulative Balance",
                data: lineDataArr,
                fill: true,
                borderColor: "#1976d2",
                backgroundColor: "rgba(25, 118, 210, 0.12)",
                tension: 0.4,
            },
        ],
    };
    const lineOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Balance Over Time" },
        },
    };

    // Expenditure per category chart
    const expenseCatData = {
        labels: expenseCategories,
        datasets: [
            {
                label: "Expenditure per Category",
                data: expenseAmounts,
                backgroundColor: "#d32f2f",
                borderRadius: 6,
            },
        ],
    };
    const expenseCatOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Expenditure per Category" },
        },
        scales: {
            x: { ticks: { color: "#222" }, grid: { color: "rgba(0,0,0,0.04)" } },
            y: { beginAtZero: true, ticks: { color: "#222" }, grid: { color: "rgba(0,0,0,0.07)" } },
        },
    };

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, background: "#fff", mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
                Finance Workflow Charts
            </Typography>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
                <Box sx={{ flex: 1, minWidth: 300, height: 320 }}>
                    <Bar data={barData} options={barOptions} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 300, height: 320 }}>
                    <Line data={lineData} options={lineOptions} />
                </Box>
            </Box>
            <Box sx={{ mt: 4, minWidth: 700, height: 320 }}>
                <Bar data={expenseCatData} options={expenseCatOptions} />
            </Box>
        </Paper>
    );
}