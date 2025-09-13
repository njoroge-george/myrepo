import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import {
  fetchFitnessEntries,
  createFitnessEntry,
  updateFitnessEntry,
  deleteFitnessEntry,
} from "../api/fitnessAPI";

// Components
import WorkoutForm from "../../fitness/WorkoutForm";
import WorkoutTable from "../../fitness/WorkoutTable";
import AIAgent from "../../fitness/AIAgent";
import EffectivenessChart from "../../fitness/EffectivenessChart";
import WorkoutNotes from "../../fitness/WorkoutNotes";
import Levels from "../../fitness/Levels";
import Badges from "../../fitness/Badges";
import CaloriesTracker from "../../fitness/CaloriesTracker";
import ReminderNotifications from "../../fitness/ReminderNotifications";
import WorkoutAnimation from "../../fitness/WorkoutAnimation";
import WorkoutPlans from "../../fitness/WorkoutPlans";

export default function Fitness() {
  const [form, setForm] = useState({
    workout_type: "",
    duration: "",
    calories: "",
    workout_date: "",
    reps: "",
    name: "",
  });
  const [workouts, setWorkouts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const workoutGroups = {
    Chest: ["Diamond Push-ups", "V-ups", "Wide Push-ups"],
    Legs: ["Squats", "Lunges"],
    Abs: ["Sit-ups", "Planks"],
    FullBody: ["Running", "Burpees"],
    Glutes: ["Glute Bridges"],
    Shoulders: ["Pike Push-ups", "Triceps Dips"],
  };
  const workoutTypes = Object.keys(workoutGroups);

  const loadWorkouts = async () => {
    try {
      const data = await fetchFitnessEntries();
      setWorkouts(data);
    } catch (err) {
      console.error("Failed to fetch fitness data", err);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateFitnessEntry(editId, form);
      } else {
        await createFitnessEntry(form);
      }
      setForm({ workout_type: "", duration: "", calories: "", workout_date: "", reps: "", name: "" });
      setEditId(null);
      loadWorkouts();
    } catch (err) {
      console.error("Submission failed", err);
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

  const handleDelete = async (id) => {
    try {
      await deleteFitnessEntry(id);
      loadWorkouts();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
      <Box sx={{ bgcolor: "#f9f9f9", minHeight: "100vh", py: 4 }}>
        <Box sx={{ maxWidth: 1300, mx: "auto" }}>
          <Typography variant="h4" mb={3} fontWeight="bold" align="center" color="primary">
            Nick Fitness Tracker (AI Enhanced)
          </Typography>

          {/* Workout Form */}
          <WorkoutForm
              form={form}
              setForm={setForm}
              handleSubmit={handleSubmit}
              editId={editId}
              workoutTypes={workoutTypes}
              workoutGroups={workoutGroups}
          />

          {/* Workout Table */}
          <WorkoutTable
              workouts={workouts}
              page={page}
              rowsPerPage={rowsPerPage}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
          />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}><AIAgent /></Grid>
            <Grid item xs={12} md={6}><EffectivenessChart workouts={workouts} /></Grid>
            <Grid item xs={12} md={6}><WorkoutNotes /></Grid>
            <Grid item xs={12} md={6}><Levels workouts={workouts} /></Grid>
            <Grid item xs={12} md={6}><CaloriesTracker workouts={workouts} /></Grid>
            <Grid item xs={12} md={6}><Badges workouts={workouts} /></Grid>
            <Grid item xs={12} md={6}><ReminderNotifications /></Grid>
            <Grid item xs={12} md={6}><WorkoutAnimation /></Grid>
            <Grid item xs={12}><WorkoutPlans /></Grid>
          </Grid>
        </Box>
      </Box>
  );
}
