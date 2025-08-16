// src/components/ContactFormDialog.jsx
import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Box
} from '@mui/material';

export default function ContactFormDialog({ open, onClose, onSave, initialData }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                address: initialData.address || ''
            });
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                address: ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!formData.name.trim()) {
            alert('Name is required');
            return;
        }
        onSave(formData);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{initialData ? 'Edit Contact' : 'Add Contact'}</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={3}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    );
}
