import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { keyframes } from '@mui/system';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const flashRed = keyframes`
  0% { background-color: rgba(255,0,0,0.1); }
  50% { background-color: rgba(255,0,0,0.05); }
  100% { background-color: rgba(255,0,0,0.1); }
`;

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [favRecipe, setFavRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get('http://localhost:5001/api/finance');
        setEntries(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load finance data');
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5001/api/todos')
        .then(res => setTasks(res.data))
        .catch(() => {});
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5001/api/projects')
        .then(res => setProjects(res.data))
        .catch(() => {});
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5001/api/recipes')
        .then(res => setFavRecipe(res.data))
        .catch(() => {});
  }, []);

  const totalIncome = entries.filter(e => e.type === 'income').reduce((acc, cur) => acc + Number(cur.amount), 0);
  const totalExpenses = entries.filter(e => e.type === 'expense').reduce((acc, cur) => acc + Number(cur.amount), 0);
  const totalDebts = entries.filter(e => e.type === 'debt').reduce((acc, cur) => acc + Number(cur.amount), 0);
  const balance = totalIncome - totalExpenses - totalDebts;

  const expenseEntries = entries.filter((e) => e.type === 'expense');
  const categoryTotals = expenseEntries.reduce((acc, cur) => {
    acc[cur.category] = (acc[cur.category] || 0) + Number(cur.amount);
    return acc;
  }, {});

  const expenseBarData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: 'Expenses by Category',
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#1976d2', '#388e3c', '#fbc02d', '#d32f2f', '#7b1fa2',
          '#0288d1', '#c2185b', '#ffa000', '#388e3c', '#0288d1',
        ],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const expenseBarOptions = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#333', font: { size: 14 } },
      },
      title: {
        display: true,
        text: 'Expense Distribution by Category',
        color: '#222',
        font: { size: 18, weight: 'bold' },
      },
    },
    scales: {
      x: { ticks: { color: '#333' }, grid: { color: 'rgba(0,0,0,0.05)' } },
      y: { beginAtZero: true, ticks: { color: '#333' }, grid: { color: 'rgba(0,0,0,0.05)' } },
    },
  };

  const cardStyle = {
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    borderRadius: 8,
    color: '#222',
    minHeight: 120,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    transition: 'transform 0.3s ease',
    '&:hover': { transform: 'scale(1.03)', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const ongoingTasks = tasks.filter(t => t.status === 'ongoing').length;

  const pendingProjects = projects.filter(p => p.status === 'pending').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const ongoingProjects = projects.filter(p => p.status === 'ongoing').length;

  return (
      <Box sx={{ minHeight: '100vh', p: 3, background: '#f7f9fc', color: '#222' }}>
        <Typography variant="h4" mb={3} fontWeight="bold" color="primary">
          Dashboard Overview
        </Typography>

        {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
              <CircularProgress color="primary" />
            </Box>
        ) : error ? (
            <Typography color="error" align="center" mb={5}>
              {error}
            </Typography>
        ) : (
            <>
              <Grid container spacing={3} mb={5}>
                <Grid item xs={12} md={3}>
                  <Card sx={cardStyle}>
                    <CardContent>
                      <Typography variant="h6">Total Income</Typography>
                      <Typography variant="h4" fontWeight="bold" color="success.main">
                        ${totalIncome.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={cardStyle}>
                    <CardContent>
                      <Typography variant="h6">Total Expenses</Typography>
                      <Typography variant="h4" fontWeight="bold" color="error.main">
                        ${totalExpenses.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={cardStyle}>
                    <CardContent>
                      <Typography variant="h6">Balance</Typography>
                      <Typography variant="h4" fontWeight="bold" color={balance < 0 ? 'error.main' : 'success.main'}>
                        ${balance.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ ...cardStyle, ...(totalDebts > 1000 && { animation: `${flashRed} 1s infinite` }) }}>
                    <CardContent>
                      <Typography variant="h6">Total Debts</Typography>
                      <Typography variant="h4" fontWeight="bold" color="#ff7043">
                        ${totalDebts.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Grid container spacing={3} mb={5}>
                <Grid item xs={12} md={2.4}>
                  <Card sx={cardStyle}>
                    <CardContent>
                      <Typography variant="h6">Pending Tasks</Typography>
                      <Typography variant="h4" fontWeight="bold" color="warning.main">
                        {pendingTasks}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={2.4}>
                  <Card sx={cardStyle}>
                    <CardContent>
                      <Typography variant="h6">Completed Tasks</Typography>
                      <Typography variant="h4" fontWeight="bold" color="success.main">
                        {completedTasks}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={2.4}>
                  <Card sx={cardStyle}>
                    <CardContent>
                      <Typography variant="h6">Ongoing Tasks</Typography>
                      <Typography variant="h4" fontWeight="bold" color="info.main">
                        {ongoingTasks}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={2.4}>
                  <Card sx={cardStyle}>
                    <CardContent>
                      <Typography variant="h6">Favourite Recipe</Typography>
                      <Typography variant="body1">
                        {favRecipe ? favRecipe.title : 'No favourite set'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={2.4}>
                  <Card sx={cardStyle}>
                    <CardContent>
                      <Typography variant="h6">Projects</Typography>
                      <Typography variant="body2">Pending: {pendingProjects}</Typography>
                      <Typography variant="body2">Completed: {completedProjects}</Typography>
                      <Typography variant="body2">Ongoing: {ongoingProjects}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Grid container justifyContent="center" mb={5}>
                <Paper
                    elevation={4}
                    sx={{
                      p: 3,
                      background: '#fff',
                      boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
                      borderRadius: 8,
                      width: 1400,
                      height: 400,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                >
                  <Bar data={expenseBarData} options={expenseBarOptions} width={1380} height={380} />
                </Paper>
              </Grid>
            </>
        )}
      </Box>
  );
}