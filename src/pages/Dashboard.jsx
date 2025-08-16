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
  0% { background-color: rgba(255,0,0,0.8); }
  50% { background-color: rgba(255,0,0,0.4); }
  100% { background-color: rgba(255,0,0,0.8); }
`;

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [favRecipe, setFavRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Finance
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get('http://localhost:5000/api/finance');
        setEntries(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load finance entries:', err);
        setError('Failed to load finance data');
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  // Tasks
  useEffect(() => {
    axios.get('http://localhost:5000/api/todos')
      .then(res => setTasks(res.data))
      .catch(err => console.error('Failed to load tasks:', err));
  }, []);

  // Projects
  useEffect(() => {
    axios.get('http://localhost:5000/api/projects')
      .then(res => setProjects(res.data))
      .catch(err => console.error('Failed to load projects:', err));
  }, []);

  // Favourite Recipe
  useEffect(() => {
    axios.get('http://localhost:5000/api/recipes')
      .then(res => setFavRecipe(res.data))
      .catch(err => console.error('Failed to load favourite recipe:', err));
  }, []);

  // Finance totals
  const totalIncome = entries.filter(e => e.type === 'income').reduce((acc, cur) => acc + Number(cur.amount), 0);
  const totalExpenses = entries.filter(e => e.type === 'expense').reduce((acc, cur) => acc + Number(cur.amount), 0);
  const totalDebts = entries.filter(e => e.type === 'debt').reduce((acc, cur) => acc + Number(cur.amount), 0);
  const balance = totalIncome - totalExpenses - totalDebts;

  // Expense chart
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
          '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
          '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
          '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
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
        labels: { color: '#faffb8', font: { size: 14 } },
      },
      title: {
        display: true,
        text: 'Expense Distribution by Category',
        color: '#aaffaa',
        font: { size: 18, weight: 'bold' },
      },
    },
    scales: {
      x: { ticks: { color: '#faffb8' }, grid: { color: 'rgba(255,255,255,0.1)' } },
      y: { beginAtZero: true, ticks: { color: '#faffb8' }, grid: { color: 'rgba(255,255,255,0.1)' } },
    },
  };

  const cardStyle = {
    background: 'linear-gradient(145deg, rgba(40,0,60,0.9), rgba(0,0,50,0.9))',
    boxShadow: 'inset 0 5px 1px rgba(255,255,0,0.6),  0 5px 1px rgba(0,255,0,0.5)',
    borderRadius: 3,
    color: '#faffb8',
    minHeight: 120,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    transition: 'transform 0.3s ease',
    '&:hover': { transform: 'scale(1.05)' }
  };

  // Task counts
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const ongoingTasks = tasks.filter(t => t.status === 'ongoing').length;

  // Project counts
  const pendingProjects = projects.filter(p => p.status === 'pending').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const ongoingProjects = projects.filter(p => p.status === 'ongoing').length;

  return (
    <Box sx={{ minHeight: '100vh', p: 3, background: 'linear-gradient(135deg, #0d0d2b, #2b0030)', color: '#faffb8' }}>
      <Typography variant="h4" mb={3} fontWeight="bold">
        Dashboard Overview
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : error ? (
        <Typography color="error" align="center" mb={5}>
          {error}
        </Typography>
      ) : (
        <>
          {/* Finance cards */}
          <Grid container spacing={3} mb={5}>
            <Grid item xs={12} md={3}><Card sx={cardStyle}><CardContent><Typography variant="h6">Total Income</Typography><Typography variant="h4" fontWeight="bold" color="success.main">${totalIncome.toLocaleString()}</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card sx={cardStyle}><CardContent><Typography variant="h6">Total Expenses</Typography><Typography variant="h4" fontWeight="bold" color="error">${totalExpenses.toLocaleString()}</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card sx={cardStyle}><CardContent><Typography variant="h6">Balance</Typography><Typography variant="h4" fontWeight="bold" color={balance < 0 ? 'error' : 'success.main'}>${balance.toLocaleString()}</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={3}><Card sx={{ ...cardStyle, ...(totalDebts > 1000 && { animation: `${flashRed} 1s infinite` }) }}><CardContent><Typography variant="h6">Total Debts</Typography><Typography variant="h4" fontWeight="bold" color="#ff7043">${totalDebts.toLocaleString()}</Typography></CardContent></Card></Grid>
          </Grid>

          {/* Task, Recipe, Project cards */}
          <Grid container spacing={3} mb={5}>
            <Grid item xs={12} md={2.4}><Card sx={cardStyle}><CardContent><Typography variant="h6">Pending Tasks</Typography><Typography variant="h4" fontWeight="bold" color="warning.main">{pendingTasks}</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={2.4}><Card sx={cardStyle}><CardContent><Typography variant="h6">Completed Tasks</Typography><Typography variant="h4" fontWeight="bold" color="success.main">{completedTasks}</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={2.4}><Card sx={cardStyle}><CardContent><Typography variant="h6">Ongoing Tasks</Typography><Typography variant="h4" fontWeight="bold" color="info.main">{ongoingTasks}</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={2.4}><Card sx={cardStyle}><CardContent><Typography variant="h6">Favourite Recipe</Typography><Typography variant="body1">{favRecipe ? favRecipe.title : 'No favourite set'}</Typography></CardContent></Card></Grid>
            <Grid item xs={12} md={2.4}><Card sx={cardStyle}><CardContent><Typography variant="h6">Projects</Typography><Typography variant="body2">Pending: {pendingProjects}</Typography><Typography variant="body2">Completed: {completedProjects}</Typography><Typography variant="body2">Ongoing: {ongoingProjects}</Typography></CardContent></Card></Grid>
          </Grid>

          {/* Expense chart */}
          <Grid container justifyContent="center" mb={5}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                background: 'linear-gradient(145deg, rgba(40,0,60,0.9), rgba(0,0,50,0.9))',
                boxShadow: '0 0 25px rgba(255,255,0,0.6), 0 0 45px rgba(0,255,0,0.5)',
                borderRadius: 3,
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
