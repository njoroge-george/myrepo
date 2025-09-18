import { Card, CardContent, Typography, Button, Stack } from "@mui/material";

export const ChallengeCard = ({ challenge, onStart, onEdit, onDelete, isAdmin }) => {
    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="h6">{challenge.title}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {challenge.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Difficulty: {challenge.difficulty}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button variant="contained" size="small" onClick={() => onStart(challenge.id)}>
                        Start
                    </Button>

                    {isAdmin && (
                        <>
                            <Button variant="outlined" size="small" onClick={() => onEdit(challenge)}>
                                Edit
                            </Button>
                            <Button variant="outlined" color="error" size="small" onClick={() => onDelete(challenge.id)}>
                                Delete
                            </Button>
                        </>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
};
