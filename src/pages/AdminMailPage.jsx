import React, { useEffect, useState } from "react";
import { getAllMessages, replyToMessage, markMessageRead, deleteMessage } from "../api/adminAPI.jsx";
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Divider,
    Grid,
    Chip,
    IconButton,
    Tooltip,
    Badge,
    Avatar,
    Menu,
    MenuItem,
} from "@mui/material";
import { Delete, MailOutline, MarkEmailRead, MarkEmailUnread, Reply } from "@mui/icons-material";
import { deepPurple, green, grey, red } from '@mui/material/colors';

// Format date/time utility
const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleString();
};

const AdminMailPage = () => {
    const [messages, setMessages] = useState([]);
    const [replyText, setReplyText] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(false);

    // Fetch all messages on mount
    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const res = await getAllMessages();
                setMessages(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Error fetching messages:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);

    // Advanced: Mark as read/unread
    const handleMarkRead = async (id, read) => {
        try {
            await markMessageRead(id, read);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === id ? { ...msg, read: read } : msg
                )
            );
        } catch (err) {
            console.error("Error marking read:", err);
        }
    };

    // Advanced: Delete message
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this message?")) return;
        try {
            await deleteMessage(id);
            setMessages((prev) => prev.filter((msg) => msg.id !== id));
        } catch (err) {
            console.error("Error deleting message:", err);
            alert("Failed to delete message");
        }
    };

    // Handle sending reply
    const handleReply = async (id, email) => {
        try {
            await replyToMessage(id, replyText[id] || "");
            alert(`Reply sent to ${email}`);
            setReplyText((prev) => ({ ...prev, [id]: "" }));
        } catch (err) {
            console.error("Error sending reply:", err);
            alert("Failed to send reply");
        }
    };

    // Advanced: Filtering
    const filteredMessages = messages.filter((msg) => {
        if (filter === "all") return true;
        if (filter === "unread") return !msg.read;
        if (filter === "read") return !!msg.read;
        return true;
    });

    // Advanced: Message menu (for actions)
    const handleMenuOpen = (event, id) => {
        setAnchorEl({ anchor: event.currentTarget, id });
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{
            p: { xs: 1, md: 3 },
            bgcolor: grey[50],
            minHeight: "100vh"
        }}>
            <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
                Admin Mailbox
            </Typography>

            <Box sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap"
            }}>
                <Chip
                    label="All"
                    color={filter === "all" ? "primary" : "default"}
                    onClick={() => setFilter("all")}
                    sx={{ mr: 1 }}
                />
                <Chip
                    label={
                        <Badge badgeContent={messages.filter(m => !m.read).length} color="error">
                            Unread
                        </Badge>
                    }
                    color={filter === "unread" ? "error" : "default"}
                    onClick={() => setFilter("unread")}
                    sx={{ mr: 1 }}
                />
                <Chip
                    label="Read"
                    color={filter === "read" ? "success" : "default"}
                    onClick={() => setFilter("read")}
                    sx={{ mr: 1 }}
                />
                <Chip
                    label={`Total: ${messages.length}`}
                    color="default"
                />
            </Box>

            {loading ? (
                <Typography>Loading messages...</Typography>
            ) : filteredMessages.length === 0 ? (
                <Typography>No messages to display.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {filteredMessages.map((msg) => (
                        <Grid item xs={12} md={6} lg={4} key={msg.id}>
                            <Paper elevation={4} sx={{
                                p: 3,
                                borderLeft: `8px solid ${msg.read ? green[500] : deepPurple[500]}`,
                                bgcolor: msg.read ? grey[100] : "#fff",
                                transition: "background 0.3s"
                            }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                    <Avatar sx={{
                                        bgcolor: deepPurple[500],
                                        mr: 2
                                    }}>
                                        {msg.sender_name?.[0]?.toUpperCase() || "?"}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" color="textSecondary">
                                            From: <span style={{ fontWeight: "bold" }}>{msg.sender_name}</span> <span style={{ color: grey[700] }}>({msg.email})</span>
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Subject: {msg.subject || <i>No subject</i>}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }} />
                                    <Tooltip title="Actions">
                                        <IconButton onClick={(e) => handleMenuOpen(e, msg.id)}>
                                            <MailOutline />
                                        </IconButton>
                                    </Tooltip>
                                    {anchorEl && anchorEl.id === msg.id && (
                                        <Menu
                                            anchorEl={anchorEl.anchor}
                                            open={Boolean(anchorEl)}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuItem onClick={() => { handleMarkRead(msg.id, !msg.read); handleMenuClose(); }}>
                                                {msg.read ? <MarkEmailUnread sx={{ mr: 1 }} /> : <MarkEmailRead sx={{ mr: 1 }} />}
                                                {msg.read ? "Mark as Unread" : "Mark as Read"}
                                            </MenuItem>
                                            <MenuItem onClick={() => { handleDelete(msg.id); handleMenuClose(); }}>
                                                <Delete sx={{ mr: 1, color: red[400] }} />
                                                Delete Message
                                            </MenuItem>
                                        </Menu>
                                    )}
                                </Box>

                                <Divider sx={{ my: 1 }} />

                                <Typography variant="body1" sx={{ mb: 2, color: grey[800] }}>
                                    {msg.message}
                                </Typography>

                                <Box sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 1,
                                    gap: 2,
                                    flexWrap: "wrap"
                                }}>
                                    <Chip
                                        icon={<MailOutline />}
                                        label={msg.read ? "Read" : "Unread"}
                                        color={msg.read ? "success" : "warning"}
                                        size="small"
                                    />
                                    <Chip
                                        label={`Received: ${formatDate(msg.received_at || msg.created_at)}`}
                                        color="default"
                                        size="small"
                                    />
                                    {msg.reply && (
                                        <Chip
                                            icon={<Reply />}
                                            label={`Replied: ${formatDate(msg.replySentAt || msg.reply?.sent_at)}`}
                                            color="info"
                                            size="small"
                                        />
                                    )}
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <TextField
                                        label="Write a reply..."
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={replyText[msg.id] || ""}
                                        onChange={(e) =>
                                            setReplyText((prev) => ({
                                                ...prev,
                                                [msg.id]: e.target.value,
                                            }))
                                        }
                                        sx={{ mb: 1 }}
                                        color="primary"
                                    />
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<Reply />}
                                        onClick={() => handleReply(msg.id, msg.email)}
                                        disabled={!replyText[msg.id]}
                                        sx={{ mr: 1 }}
                                    >
                                        Send Reply
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<Delete />}
                                        onClick={() => handleDelete(msg.id)}
                                        sx={{ ml: 1 }}
                                    >
                                        Delete
                                    </Button>
                                </Box>

                                {msg.reply && (
                                    <>
                                        <Divider sx={{ my: 1 }} />
                                        <Box sx={{
                                            bgcolor: green[50],
                                            p: 2,
                                            borderRadius: 2,
                                            border: `1px solid ${green[200]}`,
                                            mt: 1
                                        }}>
                                            <Typography variant="subtitle2" color="success.main" fontWeight="bold" mb={0.5}>
                                                Sent reply:
                                            </Typography>
                                            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                                {msg.reply.text || msg.reply}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {formatDate(msg.replySentAt || msg.reply?.sent_at)}
                                            </Typography>
                                        </Box>
                                    </>
                                )}
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default AdminMailPage;