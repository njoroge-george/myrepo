import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, IconButton, TextField,
    Table, TableHead, TableBody, TableRow, TableCell, Paper, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { Add, Edit, Delete, Message } from '@mui/icons-material';
import {
    getContacts, createContact, updateContact, deleteContact
} from '../api/Contacts.jsx'; // <-- use .js
import ContactFormDialog from '../components/ContactFormDialog';
import { useNavigate } from 'react-router-dom';

export default function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState('');
    const [openForm, setOpenForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
    const navigate = useNavigate();

    // Always use one loadContacts, accepts search
    const loadContacts = async (query = search) => {
        setLoading(true);
        setError('');
        try {
            const res = await getContacts(query ? { q: query } : {});
            // Accept either array or { data: [] }
            let contactsData = Array.isArray(res) ? res : res?.data?.data || res?.data || [];
            setContacts(contactsData);
        } catch (err) {
            setContacts([]);
            setError('Failed to load contacts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadContacts();
        // eslint-disable-next-line
    }, []);

    const handleAdd = () => {
        setEditData(null);
        setOpenForm(true);
    };

    const handleSave = async (formData) => {
        setLoading(true);
        try {
            if (editData) {
                await updateContact(editData.id, formData);
                setAlert({ open: true, message: 'Contact updated!', severity: 'success' });
            } else {
                await createContact(formData);
                setAlert({ open: true, message: 'Contact added!', severity: 'success' });
            }
            setOpenForm(false);
            await loadContacts(); // Ensure fresh list
        } catch (err) {
            setAlert({ open: true, message: 'Save failed', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (contact) => {
        setEditData(contact);
        setOpenForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this contact?')) return;
        setLoading(true);
        try {
            await deleteContact(id);
            setAlert({ open: true, message: 'Contact deleted!', severity: 'success' });
            await loadContacts();
        } catch (err) {
            setAlert({ open: true, message: 'Delete failed', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        loadContacts(search);
    };

    const handleCloseAlert = () => setAlert({ ...alert, open: false });

    return (
        <Box sx={{
            minHeight: '100vh',
            py: 4,
            px: { xs: 2, md: 6 },
            background: '#f9f9f9',
            color: 'text.primary'
        }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Contacts
            </Typography>

            <Box display="flex" gap={2} mb={3}>
                <TextField
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small"
                    variant="outlined"
                />
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAdd}
                    sx={{
                        bgcolor: 'primary.main',
                        color: '#fff',
                        '&:hover': { bgcolor: 'primary.dark' }
                    }}
                >
                    Add Contact
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleSearch}
                    disabled={loading}
                >
                    Search
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            ) : (
                <Paper sx={{
                    boxShadow: 2,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    background: '#fff'
                }}>
                    <Table>
                        <TableHead sx={{
                            background: '#f5f5f5',
                            '& th': {
                                color: 'text.primary',
                                fontWeight: 'bold',
                                fontSize: '1rem'
                            }
                        }}>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contacts.map((c) => (
                                <TableRow
                                    key={c.id || c._id} // Defensive key
                                    sx={{
                                        bgcolor: '#fff',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: '#f0f4ff'
                                        }
                                    }}
                                >
                                    <TableCell>{c.name || '-'}</TableCell>
                                    <TableCell>{c.email || '-'}</TableCell>
                                    <TableCell>{c.phone || '-'}</TableCell>
                                    <TableCell>{c.address || '-'}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEdit(c)} color="primary">
                                            <Edit />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(c.id || c._id)}>
                                            <Delete />
                                        </IconButton>
                                        <IconButton color="info" onClick={() => navigate(`/contacts/${c.id || c._id}/comms`)}>
                                            <Message />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            )}

            <ContactFormDialog
                open={openForm}
                onClose={() => setOpenForm(false)}
                onSave={handleSave}
                initialData={editData}
            />

            <Snackbar
                open={alert.open}
                autoHideDuration={3500}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}