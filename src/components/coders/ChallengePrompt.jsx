// src/components/coders/ChallengePrompt.jsx
import React from "react";
import { Paper, Typography, Divider, Box } from "@mui/material";

const ChallengePrompt = ({ challenge }) => {
  if (!challenge) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        p: 3,
        borderRadius: 2,
        overflowY: "auto",
        maxHeight: "100%",
        bgcolor: "background.paper",
      }}
    >
      {/* Title */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {challenge.title || "Challenge"}
      </Typography>

      {/* Description / Prompt */}
      <Typography
        variant="body2"
        sx={{ whiteSpace: "pre-line", mb: 2 }}
        color="text.primary"
      >
        {challenge.prompt || "No challenge loaded."}
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Input format */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Input Format:
        </Typography>
        <Typography variant="body2" color="text.primary">
          {challenge.input || "-"}
        </Typography>
      </Box>

      {/* Output format */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Output Format:
        </Typography>
        <Typography variant="body2" color="text.primary">
          {challenge.output || "-"}
        </Typography>
      </Box>

      {/* Example test cases */}
      {challenge.examples?.length > 0 && (
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Examples:
          </Typography>
          {challenge.examples.map((ex, idx) => (
            <Paper
              key={idx}
              variant="outlined"
              sx={{
                p: 1.5,
                mb: 1,
                borderRadius: 1,
                bgcolor: "background.default",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Input:
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {ex.input}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Output:
              </Typography>
              <Typography variant="body2">{ex.output}</Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default ChallengePrompt;
