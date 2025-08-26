import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Chip, Stack, CircularProgress, Box } from "@mui/material";
import { getEntries } from "../api/financeApi.jsx";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function FinanceCard({ cardStyle }) {
    const [stats, setStats] = useState({
        income: 0,
        expense: 0,
        debts: 0,
        balance: 0,
        total: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            try {
                const entries = await getEntries();
                const income = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + Number(e.amount), 0);
                const expense = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + Number(e.amount), 0);
                const debts = entries.filter(e => e.type === 'debt').reduce((sum, e) => sum + Number(e.amount), 0);
                const balance = income - expense - debts;
                setStats({
                    income,
                    expense,
                    debts,
                    balance,
                    total: entries.length,
                });
            } catch {
                setStats({ income: 0, expense: 0, debts: 0, balance: 0, total: 0 });
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    return (
        <Card sx={cardStyle}>
            <CardContent>
                <Typography variant="h6" mb={1}>Finance Overview</Typography>
                {loading ? (
                    <CircularProgress color="primary" size={28} />
                ) : (
                    <Box>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <AttachMoneyIcon color="success" />
                            <Typography variant="body2">Income</Typography>
                            <Chip label={`$${stats.income.toLocaleString()}`} color="success" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <MoneyOffIcon color="error" />
                            <Typography variant="body2">Expense</Typography>
                            <Chip label={`$${stats.expense.toLocaleString()}`} color="error" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <WarningAmberIcon color="warning" />
                            <Typography variant="body2">Debts</Typography>
                            <Chip label={`$${stats.debts.toLocaleString()}`} color="warning" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <AccountBalanceIcon color={stats.balance < 0 ? "error" : "success"} />
                            <Typography variant="body2">Balance</Typography>
                            <Chip
                                label={`$${stats.balance.toLocaleString()}`}
                                color={stats.balance < 0 ? "error" : "success"}
                            />
                        </Stack>
                        <Typography variant="subtitle2" color="text.secondary" mt={2}>
                            Total Records: <b>{stats.total}</b>
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}