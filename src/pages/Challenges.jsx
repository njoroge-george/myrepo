import { useState, useEffect, useContext } from "react";
import { getChallenges, deleteChallenge } from "../api/Coding.jsx";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { ChallengeCard } from "../components/coders/ChallengeCard.jsx";
import { CodeEditorPanel } from "../components/coders/CodeEditorPanel.jsx";
import { ChallengeForm } from "../components/coders/ChallengeForm.jsx";
import { EditChallengeModal } from "../components/coders/EditChallengeModal.jsx";
import { AuthContext } from "../components/auth/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Challenges() {
    const [challenges, setChallenges] = useState([]);
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [challengeToEdit, setChallengeToEdit] = useState(null);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const data = await getChallenges();
                console.log("Fetched challenges:", data);
                setChallenges(data);
            } catch (err) {
                console.error("Error fetching challenges:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchChallenges();
    }, []);

    const handleStartChallenge = (id) => {
        // Find the selected challenge by ID and set it
        const challenge = challenges.find(c => c.id === id);
        setSelectedChallenge(challenge);
        // Only navigate if you want to go to a separate page
        // navigate(`/challenge/${id}`);
    };

    const handleCreateChallenge = (newChallenge) => {
        setChallenges((prev) => [newChallenge, ...prev]);
    };

    const handleEdit = (challenge) => {
        setChallengeToEdit(challenge);
        setEditOpen(true);
    };

    const handleSaveEdit = (updated) => {
        setChallenges((prev) =>
            prev.map((c) => (c.id === updated.id ? updated : c))
        );
    };

    const handleDelete = async (id) => {
        try {
            await deleteChallenge(id);
            setChallenges((prev) => prev.filter((c) => c.id !== id));
        } catch (err) {
            console.error("Failed to delete challenge:", err);
        }
    };

    const handleSubmitCode = (code) => {
        try {
            console.log("Submitting code:", code);
            // Add your code submission logic here
            alert("Code submitted successfully!");
            setSelectedChallenge(null); // Close the editor after submission
        } catch (error) {
            console.error("Error submitting code:", error);
            alert("Failed to submit code. Please try again.");
        }
    };

    const handleCloseEditor = () => {
        setSelectedChallenge(null);
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Coding Challenges
            </Typography>

            {auth?.role === "admin" && (
                <ChallengeForm onCreate={handleCreateChallenge} />
            )}

            {selectedChallenge ? (
                <Box mt={3}>
                    <Typography variant="h5" gutterBottom>
                        {selectedChallenge.title}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {selectedChallenge.description}
                    </Typography>
                    <CodeEditorPanel 
                        challenge={selectedChallenge}
                        onSubmit={handleSubmitCode}
                        onClose={handleCloseEditor}
                    />
                </Box>
            ) : loading ? (
                <CircularProgress />
            ) : (
                challenges.map((challenge) => (
                    <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        onStart={handleStartChallenge}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isAdmin={auth?.role === "admin"}
                    />
                ))
            )}

            <EditChallengeModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                challenge={challengeToEdit}
                onSave={handleSaveEdit}
            />
        </Box>
    );
}