import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import {
    getChallenges,
    getSubmissionsByChallenge,
} from "../../api/Coding.jsx";
import { CodeEditorPanel } from "./CodeEditorPanel.jsx";
import { AuthContext } from "../auth/AuthContext.jsx";
import { ChallengeLeaderboard } from "./ChallengeLeaderBoard.jsx";
import {
    Box,
    Typography,
    CircularProgress,
    Paper,
} from "@mui/material";

export default function ChallengeDetail() {
    const { id } = useParams();
    const [challenge, setChallenge] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        async function fetchData() {
            try {
                const all = await getChallenges();
                const found = all.find((c) => c.id === parseInt(id));
                setChallenge(found);

                const subs = await getSubmissionsByChallenge(id);
                setSubmissions(subs);
            } catch (err) {
                console.error("Failed to load challenge detail:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    if (loading) return <CircularProgress />;
    if (!challenge) return <Typography>No challenge found.</Typography>;

    const isExpired = challenge?.expiresAt && new Date(challenge.expiresAt) < new Date();

    if (isExpired) {
        return (
            <Box p={3}>
                <Typography variant="h4" color="error">
                    This challenge has expired.
                </Typography>
            </Box>
        );
    }


    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                {challenge.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
                {challenge.description}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                Difficulty: {challenge.difficulty}
            </Typography>

            <CodeEditorPanel challengeId={challenge.id} coderId={auth?.userId} />

            <Typography variant="h6" sx={{ mt: 4 }}>
                Submissions
            </Typography>
            {submissions.length === 0 ? (
                <Typography>No submissions yet.</Typography>
            ) : (
                submissions.map((sub) => (
                    <Box key={sub.id} sx={{ mb: 2 }}>
                        <Typography variant="body2">
                            Coder: {sub.coderId} | Submitted:{" "}
                            {new Date(sub.createdAt).toLocaleString()}
                        </Typography>
                        <Paper sx={{ p: 2, mt: 1, whiteSpace: "pre-wrap", bgcolor: "#f9f9f9" }}>
                            {sub.code}
                        </Paper>
                    </Box>
                ))
            )}
            <ChallengeLeaderboard challengeId={challenge.id} />
        </Box>
    );
}
