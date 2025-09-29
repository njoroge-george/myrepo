// VoiceRoom.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
} from "@mui/material";
import { Mic, MicOff, Edit } from "@mui/icons-material";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5001");

const VoiceRoom = ({ currentUser, coderId }) => {
  const [room, setRoom] = useState(null);
  const [users, setUsers] = useState([]);
  const [muted, setMuted] = useState(false);
  const [discussion, setDiscussion] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(null);

  const messagesEndRef = useRef(null);

  // Auto-scroll discussion
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [discussion, typing]);

  // Join room
  const joinRoom = async (roomName) => {
    setRoom(roomName);
    socket.emit("joinRoom", { roomId: roomName, coder: { name: currentUser, id: coderId } });

    // Load previous discussion
    try {
      const res = await axios.get(`http://localhost:5001/api/messages/${roomName}`);
      setDiscussion(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Leave room
  const leaveRoom = () => {
    socket.emit("leaveRoom", { roomId: room, coder: { name: currentUser, id: coderId } });
    setRoom(null);
    setUsers([]);
    setDiscussion([]);
  };

  // Toggle mute
  const toggleMute = () => {
    setMuted((prev) => !prev);
    socket.emit("toggleMute", { roomId: room, coder: { id: coderId, muted: !muted } });
  };

  // Handle typing
  const handleTyping = (text) => {
    setNewMessage(text);
    socket.emit("typing", { roomId: room, coder: { name: currentUser } });
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const msg = { text: newMessage, coderId, roomId: room };
    try {
      await axios.post("http://localhost:5001/api/messages", msg);
    } catch (err) {
      console.error(err);
    }

    socket.emit("message", { roomId: room, coder: { name: currentUser }, text: newMessage });
    setDiscussion((prev) => [...prev, { user: currentUser, text: newMessage }]);
    setNewMessage("");
  };

  // Listen for socket updates
  useEffect(() => {
    socket.on("roomUpdate", (participants) => setUsers(participants));
    socket.on("message", (msg) => setDiscussion((prev) => [...prev, msg]));
    socket.on("typing", (text) => {
      setTyping(text);
      setTimeout(() => setTyping(null), 2000);
    });

    return () => {
      socket.off("roomUpdate");
      socket.off("message");
      socket.off("typing");
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Avatar editing
  const handleAvatarChange = (id) => {
    const newAvatar = prompt("Enter new avatar URL:");
    if (!newAvatar) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, avatar: newAvatar } : u))
    );
    socket.emit("updateAvatar", { roomId: room, coderId: id, avatar: newAvatar });
  };

  return (
    <Box>
      <Typography variant="h6">🎙️ Voice Rooms</Typography>

      {room ? (
        <>
          <Typography sx={{ mt: 1 }}>Room: {room}</Typography>

          {/* Users cards */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
            {users.map((u) => (
              <Paper
                key={u.id}
                sx={{
                  p: 1,
                  textAlign: "center",
                  width: 120,
                  borderRadius: 2,
                  border: u.muted ? "2px solid red" : "2px solid green",
                  position: "relative",
                  animation: u.speaking ? "pulse 1s infinite" : "none",
                }}
              >
                <Avatar
                  src={u.avatar}
                  alt={u.name}
                  sx={{ width: 56, height: 56, mx: "auto", cursor: "pointer" }}
                  onClick={() => handleAvatarChange(u.id)}
                />
                <Typography variant="caption">{u.name}</Typography>
                <Typography variant="caption" color={u.muted ? "red" : "green"}>
                  {u.muted ? "Muted" : "Speaking"}
                </Typography>
                {u.speaking && <LinearProgress sx={{ mt: 1 }} />}
              </Paper>
            ))}
          </Box>

          {/* Controls */}
          <Box sx={{ mt: 2 }}>
            <IconButton onClick={toggleMute}>{muted ? <MicOff color="error" /> : <Mic color="success" />}</IconButton>
            <Button onClick={leaveRoom} variant="outlined" sx={{ ml: 2 }}>Leave Room</Button>
          </Box>

          {/* Discussion */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1">💬 Discussion</Typography>
            <Paper sx={{ maxHeight: 250, overflowY: "auto", p: 1, mb: 1 }}>
              <List>
                {discussion.map((d, i) => {
                  const isMe = d.user === currentUser;
                  return (
                    <ListItem key={i} sx={{ justifyContent: isMe ? "flex-end" : "flex-start" }}>
                      <Paper
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          maxWidth: "70%",
                          bgcolor: isMe ? "primary.main" : "grey.200",
                          color: isMe ? "white" : "black",
                        }}
                      >
                        <ListItemText primary={d.user} secondary={d.text} />
                      </Paper>
                    </ListItem>
                  );
                })}
                <div ref={messagesEndRef} />
              </List>
            </Paper>

            {typing && <Typography sx={{ fontStyle: "italic", color: "gray", mb: 1 }}>{typing}</Typography>}

            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => handleTyping(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button onClick={sendMessage} variant="contained">Send</Button>
            </Box>
          </Box>
        </>
      ) : (
        <>
          <Button onClick={() => joinRoom("Room 1")} variant="contained" sx={{ m: 1 }}>Join Room 1</Button>
          <Button onClick={() => joinRoom("Room 2")} variant="contained" sx={{ m: 1 }}>Join Room 2</Button>
        </>
      )}

      {/* Waves animation */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </Box>
  );
};

export default VoiceRoom;
