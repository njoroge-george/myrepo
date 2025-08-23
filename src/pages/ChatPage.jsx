// src/pages/ChatPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { createChatSocket } from '../api/Chat.jsx';
import {
    Box, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText,
    Typography, TextField, Button, Divider, Stack, IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CircularProgress from '@mui/material/CircularProgress';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [input, setInput] = useState('');
    const [typingUsers, setTypingUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [joined, setJoined] = useState(false);
    const chatSocketRef = useRef();
    const messagesEndRef = useRef();

    useEffect(() => {
        if (!joined) return;
        chatSocketRef.current = createChatSocket(username);

        chatSocketRef.current.onMessage(msg => {
            setMessages(prev => [...prev, msg]);
        });

        chatSocketRef.current.onUsers(userList => {
            setUsers(userList);
        });

        chatSocketRef.current.onTyping(({ username: typingUser, isTyping }) => {
            setTypingUsers(prev => {
                if (isTyping) {
                    return [...new Set([...prev, typingUser])];
                } else {
                    return prev.filter(u => u !== typingUser);
                }
            });
        });

        chatSocketRef.current.onHistory(history => {
            setMessages(history);
        });

        return () => {
            chatSocketRef.current.disconnect();
        };
    }, [joined, username]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = e => {
        e.preventDefault();
        if (input.trim()) {
            chatSocketRef.current.sendMessage(input);
            setInput('');
            chatSocketRef.current.sendTyping(false);
        }
    };

    const handleInputChange = e => {
        setInput(e.target.value);
        chatSocketRef.current.sendTyping(!!e.target.value);
    };

    if (!joined) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
                <Paper elevation={3} sx={{ p: 4, minWidth: 350 }}>
                    <Stack spacing={2} alignItems="center">
                        <ChatBubbleIcon color="primary" sx={{ fontSize: 40 }} />
                        <Typography variant="h5" fontWeight="bold">Join the Chat</Typography>
                        <TextField
                            label="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<PersonIcon />}
                            onClick={() => username && setJoined(true)}
                            fullWidth
                            size="large"
                        >
                            Join
                        </Button>
                    </Stack>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f7fa' }}>
            {/* Users List */}
            <Paper elevation={2} sx={{ width: 280, p: 2, borderRadius: 0 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <PeopleIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">Online Users</Typography>
                </Stack>
                <Divider />
                <List>
                    {users.map(u => (
                        <ListItem key={u} selected={u === username}>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: u === username ? 'primary.main' : 'grey.400' }}>
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={u}
                                primaryTypographyProps={{
                                    fontWeight: u === username ? 'bold' : 'normal',
                                    color: u === username ? 'primary.main' : 'text.primary'
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {/* Chat Area */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
                    {messages.length === 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                            <CircularProgress />
                        </Box>
                    )}
                    {messages.map((msg, idx) => (
                        <Box key={idx} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: msg.username === username ? 'primary.main' : 'grey.400', mr: 1 }}>
                                <PersonIcon />
                            </Avatar>
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    fontWeight={msg.username === username ? 'bold' : 'normal'}
                                    color={msg.username === username ? 'primary.main' : 'text.primary'}
                                    component="span"
                                >
                                    {msg.username}
                                </Typography>
                                <Typography variant="body1" component="span" sx={{ ml: 1 }}>
                                    {msg.text}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                                    {msg.time ? new Date(msg.time).toLocaleTimeString() : ''}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                    <div ref={messagesEndRef} />
                </Box>
                <Divider />
                <Box sx={{ p: 2, bgcolor: '#fff' }}>
                    {typingUsers.filter(u => u !== username).length > 0 && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {typingUsers.filter(u => u !== username).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                        </Typography>
                    )}
                    <form onSubmit={sendMessage}>
                        <Stack direction="row" spacing={2}>
                            <TextField
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Type a message..."
                                fullWidth
                                variant="outlined"
                                size="small"
                            />
                            <IconButton type="submit" color="primary" size="large" disabled={!input.trim()}>
                                <SendIcon />
                            </IconButton>
                        </Stack>
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default ChatPage;