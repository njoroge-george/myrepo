import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  MenuItem,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { fetchFitnessEntries, createFitnessEntry, deleteFitnessEntry } from '../api/fitnessAPI';
import { LineChart, PieChart, BarChart, Bar,  Pie, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ActiveWorkoutRankingTable from '../components/ActiveWorkoutRankingTable';
import WorkoutSummaryChart from '../components/WorkoutSummaryChart';



export default function Fitness() {
  const [form, setForm] = useState({
    workout_type: '',
    duration: '',
    calories: '',
    workout_date: '',
    reps: '',
    name: '',
  });

  const [reps, setReps] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const workoutGroups = {
    Chest: [
      "Diamond Push-ups",
      "V-ups",
      "Front Stretch Push-ups",
      "Wide Push-ups",
      "Decline full body Push-ups",
    ],
    Legs: ["Squats"],
    Abs: ["Front Barbell Raise", "Sit-ups", "Bicycle Crunches"],
    FullBody: ["Running"],
    Glutes: ["Glute Bridges"],
    Shoulders: ["Pike Push-ups", "Triceps Dips"],
  };

  const workoutTypes = Object.keys(workoutGroups);

  // Function to group workouts by month
  const getMonthlyWorkoutData = (workouts) => {
    const monthlyData = {};

    workouts.forEach((w) => {
      if (w.workout_date) {
        const date = new Date(w.workout_date);
        const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!monthlyData[month]) {
          monthlyData[month] = { month, count: 0 };
        }
        monthlyData[month].count += 1;
      }
    });

    return Object.values(monthlyData);
  };

  const loadWorkouts = async () => {
    try {
      const data = await fetchFitnessEntries();
      setWorkouts(data);
    } catch (err) {
      console.error('Failed to fetch fitness data', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await deleteFitnessEntry(editId);
      }
      await createFitnessEntry(form);
      setForm({ workout_type: '', duration: '', calories: '', workout_date: '', reps: '', name: '' });
      setEditId(null);
      loadWorkouts();
    } catch (err) {
      console.error('Submission failed', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFitnessEntry(id);
      loadWorkouts();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleEdit = (w) => {
    setForm({
      workout_type: w.workout_type,
      duration: w.duration,
      calories: w.calories,
      workout_date: w.workout_date?.slice(0, 10),
      reps: w.reps,
      name: w.name,
    });
    setEditId(w.id);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

// Prepare data for monthly total reps
  const getMonthlyRepsData = (workouts) => {
    const monthlyReps = {};

    workouts.forEach((w) => {
      if (w.workout_date && w.reps) {
        const date = new Date(w.workout_date);
        const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        monthlyReps[month] = (monthlyReps[month] || 0) + Number(w.reps);
      }
    });

    // Convert to array
    return Object.entries(monthlyReps).map(([month, reps]) => ({ month, reps }));
  };
  return (
    <Box p={3} sx={{ bgcolor: '#0f172a', minHeight: '100vh', color: '#fff' }}>
      <Typography variant="h4" mb={2} sx={{ fontWeight: 'bold', color: '#38bdf8', textShadow: '0 0 10px #38bdf8' }}>
        Nick Fitness Tracker
      </Typography>

      {/* Form */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: 'inset 0px 10px 1px rgba(56,189,248,0.7)', bgcolor: '#1e293b' }}>
        <form onSubmit={handleSubmit}>
          <TextField
            select
            label="Workout Type"
            fullWidth
            margin="normal"
            value={form.workout_type}
            onChange={(e) => setForm({ ...form, workout_type: e.target.value, name: '' })}
            InputLabelProps={{ style: { color: '#38bdf8' } }}
            sx={{ input: { color: 'white' } }}
          >
            {workoutTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Workout Name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            InputLabelProps={{ style: { color: '#38bdf8' } }}
            sx={{ input: { color: 'white' } }}
            disabled={!form.workout_type}
          >
            {(workoutGroups[form.workout_type] || []).map((workout) => (
              <MenuItem key={workout} value={workout}>
                {workout}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Duration (min)"
            type="number"
            fullWidth
            margin="normal"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            InputLabelProps={{ style: { color: '#38bdf8' } }}
            sx={{ input: { color: 'white' } }}
          />

          <TextField
            label="Calories"
            type="number"
            fullWidth
            margin="normal"
            value={form.calories}
            onChange={(e) => setForm({ ...form, calories: e.target.value })}
            InputLabelProps={{ style: { color: '#38bdf8' } }}
            sx={{ input: { color: 'white' } }}
          />

          <TextField
            label="Fitness Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true, style: { color: '#38bdf8' } }}
            value={form.workout_date}
            onChange={(e) => setForm({ ...form, workout_date: e.target.value })}
            sx={{ input: { color: 'white' } }}
          />

          <TextField
            label="Reps"
            type="number"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true, style: { color: '#38bdf8' } }}
            value={form.reps}
            onChange={(e) => setForm({ ...form, reps: e.target.value })}
          />

          <TextField
              label="Date"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true, style: { color: '#38bdf8' } }}
              value={form.date}
              onChange={(e) => setForm({ ...form, workout_date: e.target.value })}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, bgcolor: '#38bdf8', '&:hover': { bgcolor: '#0ea5e9', boxShadow: '0px 0px 15px #38bdf8' } }}
          >
            {editId ? 'Update Fitness' : 'Add Fitness'}
          </Button>
        </form>
      </Paper>

      {/* Chart */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: 'inset 0px 10px 1px rgba(34,197,94,0.7)', bgcolor: '#1e293b' }}>
        <Typography variant="h6" mb={2} sx={{ color: '#22c55e', textShadow: '0 0 8px #22c55e' }}>
          Workout Trends
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={workouts}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="workout_date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #38bdf8' }} />
            <Legend />
            <Line type="monotone" dataKey="calories" stroke="#facc15" strokeWidth={2} />
            <Line type="monotone" dataKey="duration" stroke="#38bdf8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Extra Charts */}
      <Box display="flex" gap={3} flexWrap="wrap" mb={3}>
        {/* Calories per Workout */}
        <Paper sx={{ flex: 1, minWidth: 300, p: 2, borderRadius: 3, boxShadow: 'inset 0px 10px 1px rgba(239,68,68,0.7)', bgcolor: '#1e293b' }}>
          <Typography variant="h6" mb={2} sx={{ color: '#ef4444', textShadow: '0 0 8px #ef4444' }}>
            Calories per Workout
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={workouts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ef4444' }} />
              <Legend />
              <Line type="monotone" dataKey="calories" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        {/* Workout Type Distribution */}
        <Paper sx={{ flex: 1, minWidth: 300, p: 2, borderRadius: 3, boxShadow: 'inset 0px 10px 1px rgba(250,204,21,0.7)', bgcolor: '#1e293b' }}>
          <Typography variant="h6" mb={2} sx={{ color: '#facc15', textShadow: '0 0 8px #facc15' }}>
            Workout Name Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={Object.values(
                  workouts.reduce((acc, w) => {
                    acc[w.name] = acc[w.name] || { name: w.name, value: 0 };
                    acc[w.name].value += 1;
                    return acc;
                  }, {})
                )}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#38bdf8"
                label
              />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #facc15' }} />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Monthly Workouts Bar Chart */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: 'inset 0px 10px 1px rgba(250,204,21,0.7)', bgcolor: '#1e293b' }}>
        <Typography variant="h6" mb={2} sx={{ color: '#facc15', textShadow: '0 0 8px #facc15' }}>
          Monthly Workouts
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getMonthlyWorkoutData(workouts)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #facc15' }} />
            <Legend />
            <Bar dataKey="count" fill="#38bdf8" barSize={50} animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Monthly Total Reps Chart */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: 'inset 0px 10px 1px rgba(139,92,246,0.7)', bgcolor: '#1e293b' }}>
        <Typography variant="h6" mb={2} sx={{ color: '#8b5cf6', textShadow: '0 0 8px #8b5cf6' }}>
          Monthly Total Reps
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getMonthlyRepsData(workouts)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #8b5cf6' }} />
            <Legend />
            <Bar dataKey="reps" fill="#8b5cf6" barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </Paper>



      {/* Table */}
      <Paper sx={{ borderRadius: 3, boxShadow: 'inset 0px 10px 2px rgba(250,204,21,0.6)', bgcolor: '#1e293b' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#facc15', fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ color: '#facc15', fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ color: '#facc15', fontWeight: 'bold' }}>Reps</TableCell>
                <TableCell sx={{ color: '#facc15', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: '#facc15', fontWeight: 'bold' }}>Duration</TableCell>
                <TableCell sx={{ color: '#facc15', fontWeight: 'bold' }}>Calories</TableCell>

                <TableCell sx={{ color: '#facc15', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workouts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((w) => (
                  <TableRow key={w.id} sx={{ '&:hover': { bgcolor: '#0f172a', boxShadow: '0px 0px 10px #38bdf8' } }}>
                    <TableCell sx={{ color: 'white' }}>{w.workout_date?.slice(0, 10)}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{w.workout_type}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{w.reps}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{w.name}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{w.duration} min</TableCell>
                    <TableCell sx={{ color: 'white' }}>{w.calories} cal</TableCell>

                    {/* Actions */}
                    <TableCell>
                      <IconButton onClick={() => handleEdit(w)} sx={{ color: '#38bdf8' }}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(w.id)} sx={{ color: '#ef4444' }}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={workouts.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ color: 'white' }}
        />
      </Paper>

      {/* Your existing content: charts, table, etc. */}

      {/* Add the ranking table with dark background styling */}
      <Box
        sx={{
          bgcolor: '#1e293b', // same dark background as your other sections
          p: 2,
          borderRadius: 3,
          boxShadow: 'inset 0px 10px 1px rgba(250,204,21,0.7)', // optional, matching your style
          mb: 3,
        }}
      >
        <Typography variant="h6" mb={2} sx={{ color: '#facc15', textShadow: '0 0 8px #facc15' }}>
          Active Workout Rankings
        </Typography>
        <ActiveWorkoutRankingTable workouts={workouts} />
      </Box>

      <WorkoutSummaryChart workouts={workouts} />
    </Box>
  );
}
