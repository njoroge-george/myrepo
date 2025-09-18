import { Card, Typography, Chip, Box } from '@mui/material';

export default function ProfileSkills() {
    const skills = ['React', 'Material UI', 'Framer Motion', 'Node.js', 'Firebase'];

    return (
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2, backgroundColor: '#fff' }}>
            <Typography variant="h6">Skills</Typography>
            <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                {skills.map(skill => (
                    <Chip key={skill} label={skill} variant="outlined" />
                ))}
            </Box>
        </Card>
    );
}
