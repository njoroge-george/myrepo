// src/pages/Contacts.jsx
import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, IconButton, TextField,
    Table, TableHead, TableBody, TableRow, TableCell, Paper
} from '@mui/material';
import { Add, Edit, Delete, Message } from '@mui/icons-material';
import {
    getContacts, createContact, updateContact, deleteContact
} from '../api/contactsAPI';
import ContactFormDialog from '../components/ContactFormDialog';
import { useNavigate } from 'react-router-dom';

export default function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState('');
    const [openForm, setOpenForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const navigate = useNavigate();

    const loadContacts = async () => {
        const { data } = await getContacts({ q: search });
        setContacts(data.data);
    };

    useEffect(() => {
        loadContacts();
    }, []);

    const handleAdd = () => {
        setEditData(null);
        setOpenForm(true);
    };

    const handleSave = async (formData) => {
        if (editData) {
            await updateContact(editData.id, formData);
        } else {
            await createContact(formData);
        }
        setOpenForm(false);
        loadContacts();
    };

    const handleEdit = (contact) => {
        setEditData(contact);
        setOpenForm(true);
    };

    const handleDelete = async (id) => {
        await deleteContact(id);
        loadContacts();
    };

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
                    onClick={loadContacts}
                >
                    Search
                </Button>
            </Box>

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
                                key={c.id}
                                sx={{
                                    bgcolor: '#fff',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: '#f0f4ff'
                                    }
                                }}
                            >
                                <TableCell>{c.name}</TableCell>
                                <TableCell>{c.email}</TableCell>
                                <TableCell>{c.phone}</TableCell>
                                <TableCell>{c.address}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(c)} color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(c.id)}>
                                        <Delete />
                                    </IconButton>
                                    <IconButton color="info" onClick={() => navigate(`/contacts/${c.id}/comms`)}>
                                        <Message />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <ContactFormDialog
                open={openForm}
                onClose={() => setOpenForm(false)}
                onSave={handleSave}
                initialData={editData}
            />
        </Box>
    );
}