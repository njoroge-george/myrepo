import { Card, Typography, Box, Link } from '@mui/material';

export default function ProfileProjects() {
    const projects = [
        { name: 'Fitness Tracker', url: '/fitness' },
        { name: 'Nutrition Planner', url: '/recipe' },
        { name: 'Progress Visualizer', url: '/dashboard' },
    ];

    return (
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2, backgroundColor: '#fff' }}>
            <Typography variant="h6">Recent Projects</Typography>
            <Box mt={2} display="flex" flexDirection="column" gap={1}>
                {projects.map(project => (
                    <Link key={project.name} href={project.url} underline="hover">
                        {project.name}
                    </Link>
                ))}
            </Box>
        </Card>
    );
}
