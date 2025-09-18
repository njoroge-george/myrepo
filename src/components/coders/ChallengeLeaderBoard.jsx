import { useEffect, useState } from "react";
import { getSubmissionsByChallenge } from "../../api/Coding.jsx";
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";

export const ChallengeLeaderboard = ({ challengeId }) => {
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        async function fetchLeaderboard() {
            const data = await getSubmissionsByChallenge(challengeId);
            const sorted = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setSubmissions(sorted);
        }
        fetchLeaderboard();
    }, [challengeId]);

    return (
        <Paper sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                Leaderboard
            </Typography>
            {submissions.length === 0 ? (
                <Typography>No submissions yet.</Typography>
            ) : (
                <List>
                    {submissions.map((sub, index) => (
                        <ListItem key={sub.id}>
                            <ListItemText
                                primary={`#${index + 1} - Coder ${sub.coderId}`}
                                secondary={`Submitted: ${new Date(sub.createdAt).toLocaleString()}`}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
};
