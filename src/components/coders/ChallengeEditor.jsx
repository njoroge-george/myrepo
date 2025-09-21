import { Paper, Typography, Box, Button } from "@mui/material";
import ChallengeForm from "./ChallengeForm";

const ChallengeEditor = ({ challenge, onBack }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {challenge ? "Edit Challenge" : "Create New Challenge"}
      </Typography>
      <ChallengeForm challenge={challenge} />
      <Box sx={{ mt: 3 }}>
        <Button variant="outlined" onClick={onBack}>
          Back to All Challenges
        </Button>
      </Box>
    </Paper>
  );
};

export default ChallengeEditor;
