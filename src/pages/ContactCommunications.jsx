// src/pages/ContactCommunications.jsx
import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, IconButton, Paper, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import {
    getCommunications, addCommunication, deleteCommunication, getContact
} from '../api/contactsAPI';

export default function ContactCommunications() {
    const { contactId } = useParams();
    const [contact, setContact] = useState(null);
    const [comms, setComms] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [form, setForm] = useState({ type: 'email', direction: 'outbound', body: '' });

    const load = async () => {
        const { data: contactData } = await getContact(contactId);
        setContact(contactData.data);
        const { data: commData } = await getCommunications(contactId);
        setComms(commData.data);
    };

    useEffect(() => { load(); }, []);

    const handleSave = async () => {
        await addCommunication(contactId, form);
        setOpenForm(false);
        setForm({ type: 'email', direction: 'outbound', body: '' });
        load();
    };

    const handleDelete = async (commId) => {
        await deleteCommunication(contactId, commId);
        load();
    };

    return (
        <Box p={3}>
            <Typography variant="h6" gutterBottom>
                Communications for {contact?.first_name} {contact?.last_name}
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => setOpenForm(true)}>Add Communication</Button>

            <Paper sx={{ mt: 2 }}>
                <List>
                    {comms.map((c) => (
                        <ListItem
                            key={c.id}
                            secondaryAction={
                                <IconButton edge="end" color="error" onClick={() => handleDelete(c.id)}>
                                    <Delete />
                                </IconButton>
                            }
                        >
                            <ListItemText
                                primary={`${c.type.toUpperCase()} (${c.direction})`}
                                secondary={`${c.body || ''} — ${new Date(c.occurred_at).toLocaleString()}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth>
                <DialogTitle>Add Communication</DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        label="Type"
                        name="type"
                        value={form.type}
                        onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                        fullWidth
                        margin="dense"
                    >
                        {['email','sms','call','whatsapp','other'].map(t => (
                            <MenuItem key={t} value={t}>{t}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        label="Direction"
                        name="direction"
                        value={form.direction}
                        onChange={(e) => setForm((f) => ({ ...f, direction: e.target.value }))}
                        fullWidth
                        margin="dense"
                    >
                        {['inbound','outbound'].map(d => (
                            <MenuItem key={d} value={d}>{d}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Body / Notes"
                        name="body"
                        value={form.body}
                        onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                        fullWidth
                        margin="dense"
                        multiline
                        rows={3}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenForm(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
