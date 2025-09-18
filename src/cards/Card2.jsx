import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const Card2 = ({ title, content, style }) => {
    return (
        <Card sx={{...style}}>
            <CardContent>
                <Typography variant= 'h6' gutterBottom >
                    {title}
                </Typography>
                <Typography variant='body2' color='secondary'>
                    {content}
                </Typography>
            </CardContent>
        </Card>
    )
}
export default Card2;