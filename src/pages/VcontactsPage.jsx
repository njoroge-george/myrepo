import React, { useState } from 'react';
import { sendMessage } from '../api/adminAPI.jsx';
import {
    TextField,
    Button,
    Box,
    Snackbar,
    Alert,
    Paper,
    Typography,
    InputAdornment
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import SubjectIcon from '@mui/icons-material/Subject';
import MessageIcon from '@mui/icons-material/Message';

const ContactPage = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await sendMessage(form);
            setAlert({ open: true, message: 'Message sent successfully!', severity: 'success' });
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            console.error(err);
            setAlert({ open: true, message: 'Failed to send message', severity: 'error' });
        }
    };

    const handleClose = () => {
        setAlert({ ...alert, open: false });
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper elevation={6} sx={{ p: 4, borderRadius: 10, maxWidth: 500, width: '100%' }}>
                <Typography variant="h5" align="center" fontWeight="bold" color="primary" mb={3}>
                    Contact Us
                </Typography>
                <Box component="form" noValidate autoComplete="off">
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SubjectIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Message"
                        name="message"
                        value={form.message}
                        multiline
                        rows={4}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MessageIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        sx={{ mt: 2, fontWeight: 'bold', borderRadius: 2 }}
                        onClick={handleSubmit}
                    >
                        Send Message
                    </Button>
                </Box>
                <Snackbar
                    open={alert.open}
                    autoHideDuration={3000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        onClose={handleClose}
                        severity={alert.severity}
                        sx={{ width: '100%' }}
                    >
                        {alert.message}
                    </Alert>
                </Snackbar>
            </Paper>
        </Box>
    );
};

export default ContactPage;