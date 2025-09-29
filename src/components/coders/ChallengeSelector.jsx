// src/components/coders/ChallengeSelector.jsx
import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  CardActionArea,
} from "@mui/material";
import apiClient from "../../api/apiClient";

const ChallengeSelector = ({ onSelect }) => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const res = await apiClient.get("/challenges");
        setChallenges(res.data.data || []);
      } catch (err) {
        console.error("Error fetching challenges:", err);
      }
    }
    fetchChallenges();
  }, []);

  const getCardColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "#d1fae5"; // green
      case "medium":
        return "#fef3c7"; // yellow
      case "hard":
        return "#fee2e2"; // red
      default:
        return "#e0f2fe"; // blue
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <Typography variant="h5" gutterBottom>
        Choose a Challenge
      </Typography>

      <Grid container spacing={3}>
        {challenges.map((c) => (
          <Grid item xs={12} sm={6} md={4} key={c.id}>
            <Card
              sx={{
                bgcolor: getCardColor(c.difficulty),
                transition: "0.3s",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <CardActionArea onClick={() => onSelect(c)}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {c.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {c.description}
                  </Typography>

                  <Chip
                    label={c.difficulty}
                    color={
                      c.difficulty === "easy"
                        ? "success"
                        : c.difficulty === "medium"
                        ? "warning"
                        : "error"
                    }
                    size="small"
                  />

                  <div
                    style={{
                      marginTop: "8px",
                      display: "flex",
                      gap: "6px",
                      flexWrap: "wrap",
                    }}
                  >
                    {c.tags?.map((tag, idx) => (
                      <Chip
                        key={idx}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ChallengeSelector;
