// ImageCard.jsx
import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';

const ProfileCard = ({ imageUrl, title, description }) => {
    return (
        <Card sx={{ borderRadius: 2, boxShadow: 3, maxWidth: 345 }}>
            <CardMedia
                component="img"
                height="200"
                image={imageUrl}
                alt={title}
            />
            {title && (
                <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                        {title}
                    </Typography>
                    {description && (
                        <Typography variant="body2" color="text.secondary">
                            {description}
                        </Typography>
                    )}
                </CardContent>
            )}
        </Card>
    );
};

export default ProfileCard;