import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';

const Card4 = () => {
    return (
        <Card >
            <CardContent>
                {/* Header Section */}
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h6" component="div" fontWeight="bold">
                        Dashboard Card
                    </Typography>
                    {/* Optional: Add an icon or badge here */}
                </Box>

                {/* Main Content */}
                <Typography variant="body2" gutterBottom>
                    This is a sample dashboard card. Use it to display key stats, charts, or other important information.
                </Typography>

                {/* Stats / Data */}
                <Box display="flex" justifyContent="space-around" mt={2}>
                    <Box textAlign="center">
                        <Typography variant="h5" fontWeight="bold">
                            75%
                        </Typography>
                        <Typography variant="caption">Progress</Typography>
                    </Box>
                    <Box textAlign="center">
                        <Typography variant="h5" fontWeight="bold">
                            120
                        </Typography>
                        <Typography variant="caption">Users</Typography>
                    </Box>
                </Box>

                {/* Action Button */}
                <Box display="flex" justifyContent="flex-end" mt={3}>
                    <Button variant="outlined" color="inherit" size="small">
                        View Details
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default Card4;