import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const Card1 = () => {
    return (
        <Card >
            <CardContent>
                <Typography variant= 'h6' gutterBottom >
                    Header
                </Typography>
                <Typography variant='body2' color='secondary'>
                    Content
                </Typography>
            </CardContent>
        </Card>
    )
}
export default Card1;