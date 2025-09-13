import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    IconButton,
    Drawer,
    TextField,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import axios from "axios";

export default function AIAgent() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [chats, setChats] = useState([]);
    const chatEndRef = useRef(null);

    // Fetch chat history on mount
    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const res = await axios.get("http://localhost:5001/api/aichat");
            setChats(res.data);
            scrollToBottom();
        } catch (err) {
            console.error("Error fetching chats:", err);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        try {
            const res = await axios.post("http://localhost:5001/api/aichat/ask", {
                message: input,
            });

            setChats([res.data, ...chats]); // prepend new chat
            setInput("");
            scrollToBottom();
        } catch (err) {
            console.error("Error sending chat:", err);
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    return (
        <>
            {/* Floating Chat Button (bottom-right) */}
            <IconButton
                onClick={() => setOpen(true)}
                sx={{
                    position: "fixed",
                    bottom: 16,
                    right: 16,
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": { bgcolor: "primary.dark" },
                    zIndex: 1300,
                }}
            >
                <ChatIcon />
            </IconButton>

            {/* Chat Drawer */}
            <Drawer
                anchor="right"
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: { width: 400, p: 4, display: "flex", flexDirection: "column", height: "80vh" },
                }}
            >
                <Typography variant="h6" gutterBottom>
                    AI Workout Assistant
                </Typography>

                {/* Chat History */}
                <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
                    <List>
                        {chats.map((chat) => (
                            <ListItem key={chat.id} sx={{ display: "block" }}>
                                <ListItemText
                                    primary={`You: ${chat.userMessage}`}
                                    secondary={`AI: ${chat.aiResponse}`}
                                />
                            </ListItem>
                        ))}
                        <div ref={chatEndRef} />
                    </List>
                </Box>

                {/* Input */}
                <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Ask AI..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    />
                    <Button variant="contained" onClick={handleSend}>
                        Send
                    </Button>
                </Box>
            </Drawer>
        </>
    );
}
