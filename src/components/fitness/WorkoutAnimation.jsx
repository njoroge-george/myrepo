import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress, Box } from "@mui/material";
import axios from "axios";

export default function WorkoutAnimation({ workoutName }) {
    const [animationUrl, setAnimationUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!workoutName) return;

        const fetchAnimation = async () => {
            setLoading(true);
            try {
                const res = await axios.post("http://localhost:5001/api/aichat/generate-image", {
                    prompt: `Animated demonstration of ${workoutName} workout, realistic human figure, gym environment, GIF style`,
                });

                // Assuming your backend returns { imageUrl: "..." }
                setAnimationUrl(res.data.imageUrl);
            } catch (err) {
                console.error("Error fetching workout animation:", err);
                setAnimationUrl(null);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimation();
    }, [workoutName]);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" mb={2}>
                    {workoutName} Animation
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    {loading ? (
                        <CircularProgress />
                    ) : animationUrl ? (
                        <img
                            src={animationUrl}
                            alt={`Animation of ${workoutName}`}
                            style={{ width: "100%", borderRadius: "8px" }}
                        />
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No animation available.
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}
