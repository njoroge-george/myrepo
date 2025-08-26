import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Chip, Stack, CircularProgress, Box, Badge } from "@mui/material";
import { getAllMessages } from "../api/adminAPI.jsx";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import ReplyIcon from '@mui/icons-material/Reply';

export default function MailsCard({ cardStyle }) {
    const [stats, setStats] = useState({
        total: 0,
        unread: 0,
        read: 0,
        replied: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            try {
                const res = await getAllMessages();
                const mails = Array.isArray(res.data) ? res.data : [];
                const unread = mails.filter(m => !m.read).length;
                const read = mails.filter(m => !!m.read).length;
                const replied = mails.filter(m => m.reply).length;
                setStats({
                    total: mails.length,
                    unread,
                    read,
                    replied,
                });
            } catch {
                setStats({ total: 0, unread: 0, read: 0, replied: 0 });
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    return (
        <Card sx={cardStyle}>
            <CardContent>
                <Typography variant="h6" mb={1}>Mailbox Overview</Typography>
                {loading ? (
                    <CircularProgress color="primary" size={28} />
                ) : (
                    <Box>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <Badge badgeContent={stats.unread} color="error">
                                <MailOutlineIcon color="primary" />
                            </Badge>
                            <Typography variant="body2">Total</Typography>
                            <Chip label={stats.total} color="primary" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <MarkEmailUnreadIcon color="error" />
                            <Typography variant="body2">Unread</Typography>
                            <Chip label={stats.unread} color="error" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <MailOutlineIcon color="success" />
                            <Typography variant="body2">Read</Typography>
                            <Chip label={stats.read} color="success" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <ReplyIcon color="info" />
                            <Typography variant="body2">Replied</Typography>
                            <Chip label={stats.replied} color="info" />
                        </Stack>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}