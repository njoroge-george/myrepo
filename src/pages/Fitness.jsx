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
import { fetchFitnessEntries, createFitnessEntry, deleteFitnessEntry } from '../api/fitnessAPI.jsx';
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

  const getMonthlyRepsData = (workouts) => {
    const monthlyReps = {};
    workouts.forEach((w) => {
      if (w.workout_date && w.reps) {
        const date = new Date(w.workout_date);
        const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        monthlyReps[month] = (monthlyReps[month] || 0) + Number(w.reps);
      }
    });
    return Object.entries(monthlyReps).map(([month, reps]) => ({ month, reps }));
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

  return (
      <Box sx={{ bgcolor: '#f9f9f9', minHeight: '100vh', color: 'text.primary', py: 4 }}>
        <Typography variant="h4" mb={3} fontWeight="bold" align="center" color="primary">
          Nick Fitness Tracker
        </Typography>

        {/* Form */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, maxWidth: 400, width: '100%', background: '#fff' }}>
            <form onSubmit={handleSubmit}>
              <TextField
                  select
                  label="Workout Type"
                  fullWidth
                  margin="normal"
                  value={form.workout_type}
                  onChange={(e) => setForm({ ...form, workout_type: e.target.value, name: '' })}
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
              />
              <TextField
                  label="Calories"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={form.calories}
                  onChange={(e) => setForm({ ...form, calories: e.target.value })}
              />
              <TextField
                  label="Fitness Date"
                  type="date"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  value={form.workout_date}
                  onChange={(e) => setForm({ ...form, workout_date: e.target.value })}
              />
              <TextField
                  label="Reps"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={form.reps}
                  onChange={(e) => setForm({ ...form, reps: e.target.value })}
              />
              <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2, fontWeight: 'bold' }}
              >
                {editId ? 'Update Fitness' : 'Add Fitness'}
              </Button>
            </form>
          </Paper>
        </Box>

        {/* Table */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Paper elevation={2} sx={{ borderRadius: 3, maxWidth: 900, width: '100%', background: '#fff', p: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Date</b></TableCell>
                    <TableCell><b>Type</b></TableCell>
                    <TableCell><b>Reps</b></TableCell>
                    <TableCell><b>Name</b></TableCell>
                    <TableCell><b>Duration</b></TableCell>
                    <TableCell><b>Calories</b></TableCell>
                    <TableCell><b>Actions</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workouts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((w) => (
                      <TableRow key={w.id} sx={{ '&:hover': { background: '#f0f4ff' } }}>
                        <TableCell>{w.workout_date?.slice(0, 10)}</TableCell>
                        <TableCell>{w.workout_type}</TableCell>
                        <TableCell>{w.reps}</TableCell>
                        <TableCell>{w.name}</TableCell>
                        <TableCell>{w.duration} min</TableCell>
                        <TableCell>{w.calories} cal</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEdit(w)} color="primary">
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(w.id)} color="error">
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
            />
          </Paper>
        </Box>

        {/* Charts */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', mb: 4 }}>
          <WorkoutSummaryChart workouts={workouts} />
          {/* Add other charts as needed, using white backgrounds and neutral colors */}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Paper elevation={2} sx={{ borderRadius: 3, maxWidth: 900, width: '100%', background: '#fff', p: 2 }}>
            <Typography variant="h6" mb={2} fontWeight="bold">
              Active Workout Rankings
            </Typography>
            <ActiveWorkoutRankingTable workouts={workouts} />
          </Paper>
        </Box>
      </Box>
  );
}