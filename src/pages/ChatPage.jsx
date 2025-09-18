// src/pages/ChatPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText,
    Typography, TextField, Button, Divider, Stack, IconButton, CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

import { fetchChatHistory, createChatSocket } from '../api/Chat.jsx';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [input, setInput] = useState('');
    const [typingUsers, setTypingUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [joined, setJoined] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [rooms, setRooms] = useState(['General', 'Random', 'Tech']);
    const chatRef = useRef();
    const messagesEndRef = useRef();

 //FetchchatHistory
     useEffect(() => {
         if (!roomName) return;
         const getHistory = async () => {
             try{
                 const history = await fetchChatHistory(roomName);
                 setMessages(history);
             }catch(err){
                 console.error('Failed to fethc chat history:', err);
             }
         };
         getHistory();
     }, [roomName]);

    // Initialize socket when joined and roomName is set
    useEffect(() => {
        if (!joined || !roomName) return;

        chatRef.current = createChatSocket(username, roomName);

        // Subscribe to socket events
        chatRef.current.onMessage(msg => setMessages(prev => [...prev, msg]));
        chatRef.current.onUsers(setUsers);
        chatRef.current.onTyping(({ username: typingUser, isTyping }) => {
            setTypingUsers(prev => {
                if (isTyping) return [...new Set([...prev, typingUser])];
                else return prev.filter(u => u !== typingUser);
            });
        });
        chatRef.current.onHistory(setMessages);

        return () => chatRef.current.disconnect();
    }, [joined, username, roomName]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Send message
    const sendMessage = e => {
        e.preventDefault();
        if (!input.trim()) return;
        chatRef.current.sendMessage(input);
        setInput('');
        chatRef.current.sendTyping(false);
    };

    // Typing indicator
    const handleInputChange = e => {
        setInput(e.target.value);
        chatRef.current.sendTyping(!!e.target.value);
    };

    // Switch room
    const switchRoom = (newRoom) => {
        if (newRoom === roomName) return;
        chatRef.current.disconnect();
        setRoomName(newRoom);
        setMessages([]);
    };

    // Join screen
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
                        <TextField
                            label="Room"
                            value={roomName}
                            onChange={e => setRoomName(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<PersonIcon />}
                            onClick={() => username && roomName && setJoined(true)}
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

    // Chat screen
    return (
        <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f7fa' }}>
            {/* Rooms List */}
            <Paper elevation={2} sx={{ width: 180, p: 2, borderRadius: 0 }}>
                <Typography variant="h6" fontWeight="bold" mb={1}>Rooms</Typography>
                <List>
                    {rooms.map(r => (
                        <ListItem
                            key={r}
                            button
                            selected={r === roomName}
                            onClick={() => switchRoom(r)}
                        >
                            <ListItemText primary={r} />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {/* Users List */}
            <Paper elevation={2} sx={{ width: 200, p: 2, borderRadius: 0 }}>
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
                        <Box
                            key={idx}
                            sx={{
                                mb: 2,
                                display: 'flex',
                                justifyContent: msg.User?.username === username ? 'flex-end' : 'flex-start'
                            }}
                        >
                            <Paper
                                elevation={1}
                                sx={{
                                    p: 1.5,
                                    maxWidth: '70%',
                                    bgcolor: msg.User?.username === username ? 'primary.main' : 'grey.200',
                                    color: msg.User?.username === username ? 'white' : 'black',
                                    borderRadius: 2
                                }}
                            >
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {msg.User?.username || msg.username}
                                </Typography>
                                <Typography variant="body1">{msg.text}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ''}
                                </Typography>
                            </Paper>
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
