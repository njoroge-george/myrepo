import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/MenuOpen';

export default function Topbar({ collapsed, setCollapsed }) {
    return (
        <AppBar position="static" sx={{ bgcolor: '#2d3436' }}>
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => setCollapsed(!collapsed)}
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap>
                    Finance Dashboard
                </Typography>
            </Toolbar>
        </AppBar>
    );
}
