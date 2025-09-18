import { Card, Typography, Avatar, Tooltip, Box } from "@mui/material";

export default function FitnessBadgesCard({ badges }) {
    return (
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" mb={2}>Badges Earned</Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
                {badges.map((badge, i) => (
                    <Tooltip key={i} title={badge.name}>
                        <Avatar src={badge.image} alt={badge.name} />
                    </Tooltip>
                ))}
            </Box>
        </Card>
    );
}
