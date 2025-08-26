import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Chip, Stack, CircularProgress, Box } from "@mui/material";
import { getContacts } from "../api/Contacts.jsx";
import ContactsIcon from '@mui/icons-material/Contacts';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

export default function ContactCard({ cardStyle }) {
    const [stats, setStats] = useState({ total: 0, withEmail: 0, withPhone: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            try {
                const res = await getContacts();
                // Accept either array or { data: [] }
                const contacts = Array.isArray(res) ? res : res?.data?.data || res?.data || [];
                const withEmail = contacts.filter(c => c.email && c.email !== '-').length;
                const withPhone = contacts.filter(c => c.phone && c.phone !== '-').length;
                setStats({
                    total: contacts.length,
                    withEmail,
                    withPhone,
                });
            } catch {
                setStats({ total: 0, withEmail: 0, withPhone: 0 });
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    return (
        <Card sx={cardStyle}>
            <CardContent>
                <Typography variant="h6" mb={1}>Contact Overview</Typography>
                {loading ? (
                    <CircularProgress color="primary" size={28} />
                ) : (
                    <Box>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <ContactsIcon color="primary" />
                            <Typography variant="body2">Total Contacts</Typography>
                            <Chip label={stats.total} color="primary" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <EmailIcon color="info" />
                            <Typography variant="body2">With Email</Typography>
                            <Chip label={stats.withEmail} color="info" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <PhoneIcon color="success" />
                            <Typography variant="body2">With Phone</Typography>
                            <Chip label={stats.withPhone} color="success" />
                        </Stack>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}