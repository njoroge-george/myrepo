import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Divider,
  Stack
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// ⭐️ Star Titles
function getStars(count) {
  if (count >= 10000) return "Overlord!";
  if (count >= 9000) return "Annihilator!";
  if (count >= 8000) return "Conqueror!";
  if (count >= 7000) return "Devastator!";
  if (count >= 6000) return "Destroyer!";
  if (count >= 5000) return "Executioner!";
  if (count >= 4000) return "Warlord!";
  if (count >= 3000) return "Punisher!";
  if (count >= 2000) return "Enforcer!";
  if (count >= 1000) return "Grunt!";
  if (count > 500 && count <= 999) return "Pro!";
  if (count > 300 && count <= 500) return "Advanced!";
  if (count <= 300) return "Beginner!";
  return "-";
}

// 🧭 Vibes
function getVibe(count) {
  if (count >= 10000) return "Supreme authority over the grind. No one tougher.";
  if (count >= 9000) return "You erase weakness. Nothing survives.";
  if (count >= 8000) return "You own the battlefield. Every rep a victory.";
  if (count >= 7000) return "You leave nothing standing. Total domination.";
  if (count >= 6000) return "You break limits. Limits break others.";
  if (count >= 5000) return "No shortcuts. Just results—and they hurt.";
  if (count >= 4000) return "You command the grind. No easy days.";
  if (count >= 3000) return "You crush weakness. Relentless pain, relentless gain.";
  if (count >= 2000) return "You hit hard. You don't back down.";
  if (count >= 1000) return "You're in the fight. No mercy, no quit.";
  return "Starters!";
}

// Bright, vibrant colors for pie slices
const COLORS = [
  "#FF6F61", "#6B5B95", "#88B04B", "#F7CAC9", "#92A8D1",
  "#FFA500", "#00CED1", "#FFD700", "#FF69B4", "#7CFC00"
];

export default function ActiveWorkoutRankingTable({ workouts }) {
  // Sum reps by workout
  const summary = workouts.reduce((acc, workout) => {
    const name = workout.name;
    const reps = Number(workout.reps) || 0;
    acc[name] = (acc[name] || 0) + reps;
    return acc;
  }, {});

  // Sort by totalReps descending
  const sorted = Object.entries(summary)
    .map(([name, totalReps]) => ({ name, totalReps }))
    .sort((a, b) => b.totalReps - a.totalReps);

  // Data for pie chart
  const pieData = sorted.slice(0, 15); // top 15

  return (
    <Card sx={{ mb: 3, bgcolor: "#1a1a1a" }}>
      <CardHeader
        title="🏆 Fitness Activity Ranking"
        sx={{ color: "#ffd700" }}
      />
      <CardContent>
        {pieData.length === 0 ? (
          <Typography variant="body2" sx={{ textAlign: "center", mt: 2, color: "#ccc" }}>
            No workout data to display.
          </Typography>
        ) : (
          <>
            {/* Wrap ResponsiveContainer with explicit height */}
            <div style={{ width: "100%", height: 400, marginBottom: '16px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="totalReps"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    innerRadius={80}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#333",
                      borderColor: "#ffd700",
                      color: "#fff"
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 14, fill: "#ffd700" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <Divider sx={{ my: 2, borderColor: "#ffd700" }} />

            <Stack spacing={2}>
              {pieData.map((entry) => (
                <Card
                  key={entry.name}
                  variant="outlined"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    bgcolor: "#2a2a2a",
                    borderColor: "#ffd700",
                    borderRadius: 2,
                    borderWidth: 1,
                    borderStyle: "solid"
                  }}
                >
                  <Typography variant="subtitle1" sx={{ color: "#ffd700" }}>
                    {entry.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#fafafa" }}>
                    {entry.totalReps} reps - {getStars(entry.totalReps)}
                  </Typography>
                  <Typography variant="caption" sx={{ maxWidth: 200, color: "#ccc" }}>
                    {getVibe(entry.totalReps)}
                  </Typography>
                </Card>
              ))}
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
}