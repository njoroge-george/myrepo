import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import socket from "../auth/socket"; // 🔌 socket.io client
import { getLeaderboard } from "../../api/leaderboard"; // 🗄️ REST API

const Leaderboard = ({ roomId }) => {
  const [leaderboard, setLeaderboard] = useState([]);

  // 🔹 Fetch persisted leaderboard on mount
  useEffect(() => {
    if (!roomId) return;

    (async () => {
      try {
        const res = await getLeaderboard(roomId);
        if (res.success) {
          // format into { coderId, name, solved }
          const formatted = res.data.map((entry) => ({
            coderId: entry.Coder?.id,
            name: entry.Coder?.name,
            solved: entry.solved,
          }));
          setLeaderboard(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      }
    })();
  }, [roomId]);

  // 🔹 Listen for real-time updates
  useEffect(() => {
    if (!roomId) return;

    const eventName = `challengeSolved:${roomId}`;
    socket.emit("joinLeaderboardRoom", { roomId });

    socket.on(eventName, ({ challengeId, coder }) => {
      setLeaderboard((prev) => {
        const existing = prev.find((l) => l.coderId === coder.id);
        if (existing) {
          return prev.map((l) =>
            l.coderId === coder.id ? { ...l, solved: l.solved + 1 } : l
          );
        } else {
          return [...prev, { coderId: coder.id, name: coder.name, solved: 1 }];
        }
      });
    });

    return () => {
      socket.emit("leaveLeaderboardRoom", { roomId });
      socket.off(eventName);
    };
  }, [roomId]);

  // 🔹 Sort leaderboard by solved challenges
  const sorted = [...leaderboard].sort((a, b) => b.solved - a.solved);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Leaderboard 🏆 (Room {roomId})
      </Typography>

      {sorted.length === 0 ? (
        <Typography>No submissions yet in this room.</Typography>
      ) : (
        <List>
          {sorted.map((l, i) => (
            <ListItem key={l.coderId}>
              <ListItemAvatar>
                <Avatar>{l.name?.charAt(0).toUpperCase()}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${i + 1}. ${l.name}`}
                secondary={`${l.solved} challenge${
                  l.solved > 1 ? "s" : ""
                } solved`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Leaderboard;
