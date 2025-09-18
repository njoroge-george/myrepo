import { Grid, Card, Typography, Avatar, Box } from '@mui/material';

const cardStyle = {
    p: 2,
    borderRadius: 3,
    boxShadow: 2,
    backgroundColor: '#fff',
};

export default function ProfileStats() {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
                <Card sx={cardStyle}>
                    <Typography variant="h6">Workouts Completed</Typography>
                    <Typography variant="h4">128</Typography>
                </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Card sx={cardStyle}>
                    <Typography variant="h6">Badges Earned</Typography>
                    <Box mt={1} display="flex" gap={1}>
                        <Avatar src="/badge1.png" />
                        <Avatar src="/badge2.png" />
                    </Box>
                </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Card sx={cardStyle}>
                    <Typography variant="h6">Current Goal</Typography>
                    <Typography variant="body1">Run 50km this month</Typography>
                </Card>
            </Grid>
        </Grid>
    );
}
