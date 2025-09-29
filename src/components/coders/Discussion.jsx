import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  IconButton,
  Divider,
  Avatar,
  Collapse,
  Select,
  MenuItem,
  Modal,
  Fade,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";
import { ThumbUp, Reply, Edit, Close } from "@mui/icons-material";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import dayjs from "dayjs";

// Import your actual API functions here
import {
  getDiscussions,
  createDiscussion,
  addReply,
  toggleLikeDiscussion,
  
  updateCoderAvatar,
} from "../../api/discussionAPI";
import { getCoders } from "../../api/coders";

const simulatePresence = (coders, setActiveIds) => {
  const interval = setInterval(() => {
    if (!coders || coders.length === 0) {
      setActiveIds([]);
      return;
    }
    const activeCount = Math.max(1, Math.floor(Math.random() * coders.length) + 1);
    const shuffled = [...coders].sort(() => 0.5 - Math.random());
    const activeIds = shuffled.slice(0, activeCount).map(c => c.id);
    setActiveIds(activeIds);
  }, 5000);
  return () => clearInterval(interval);
};

const ReplyInput = ({ discussionId, onReply, disabled }) => {
  const [replyText, setReplyText] = useState("");
  const handleReply = () => {
    if (!replyText.trim()) return;
    onReply(discussionId, replyText);
    setReplyText("");
  };
  return (
    <Box sx={{ mt: 2, ml: 6 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Write a reply..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        sx={{ mb: 1 }}
        aria-label="Reply input"
        disabled={disabled}
      />
      <Button
        size="small"
        variant="outlined"
        onClick={handleReply}
        disabled={disabled || !replyText.trim()}
      >
        Reply
      </Button>
    </Box>
  );
};

const CoderProfileModal = ({ open, onClose, coder }) => {
  if (!coder) return null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            width: 300,
            maxWidth: "90%",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">{coder.name || "Anonymous"}</Typography>
            <IconButton size="small" onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
          <Avatar
            src={coder.avatar || ""}
            alt={coder.name || "Coder"}
            sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
          />
          <Typography variant="body1" align="center">
            Coder ID: {coder.id}
          </Typography>
        </Box>
      </Fade>
    </Modal>
  );
};

const CoderAvatar = ({ coder, isActive, onChangeAvatar, onProfileOpen }) => {
  const [avatarUrl, setAvatarUrl] = useState(coder.avatar || "");
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    setAvatarUrl(coder.avatar || "");
  }, [coder.avatar]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadstart = () => setUploadProgress(0);
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
      reader.onloadend = async () => {
        setAvatarUrl(reader.result);
        setUploadProgress(0);
        if (onChangeAvatar) {
          onChangeAvatar(coder.id, reader.result);
        }
        // Save avatar to backend as base64 string
        try {
          await updateCoderAvatar(coder.id, reader.result);
        } catch (err) {
          // You could notify error here if needed
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Box sx={{ position: "relative", cursor: "pointer" }} onClick={() => onProfileOpen(coder)}>
        <Avatar
          src={avatarUrl}
          alt={coder.name || "Coder"}
          sx={{
            width: 50,
            height: 50,
            border: isActive ? "3px solid green" : "1px solid gray",
            boxSizing: "border-box",
            cursor: "pointer",
          }}
        />
        {isActive && (
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 12,
              height: 12,
              bgcolor: "green",
              borderRadius: "50%",
              border: "2px solid white",
            }}
          />
        )}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <CircularProgress
            size={50}
            sx={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
            variant="determinate"
            value={uploadProgress}
          />
        )}
      </Box>
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        id={`avatar-upload-${coder.id}`}
        onChange={handleAvatarChange}
      />
      <label htmlFor={`avatar-upload-${coder.id}`}>
        <IconButton component="span" size="small" aria-label="Change avatar" title="Change avatar">
          <Edit fontSize="small" />
        </IconButton>
      </label>
    </Box>
  );
};

const Discussion = ({ challengeId, currentUser }) => {
  const [discussions, setDiscussions] = useState([]);
  const [coders, setCoders] = useState([]);
  const [activeCoderIds, setActiveCoderIds] = useState([]);
  const [newDiscussion, setNewDiscussion] = useState({ title: "", body: "" });
  const [expanded, setExpanded] = useState({});
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [likeInProgress, setLikeInProgress] = useState(new Set());
  const [replyInProgress, setReplyInProgress] = useState(new Set());
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedCoder, setSelectedCoder] = useState(null);

  useEffect(() => {
    fetchDiscussions();
    fetchCoders();
    // eslint-disable-next-line
  }, [challengeId]);

  useEffect(() => {
    if (coders.length > 0) {
      const cleanup = simulatePresence(coders, setActiveCoderIds);
      return cleanup;
    }
  }, [coders]);

  const fetchDiscussions = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await getDiscussions(challengeId);
      if (response.success) setDiscussions(response.data);
      else setApiError("Failed to load discussions");
    } catch (err) {
      setApiError("Failed to load discussions");
    } finally {
      setLoading(false);
    }
  };

  const fetchCoders = async () => {
    try {
      const response = await getCoders();
      if (response.success) setCoders(response.data);
    } catch (err) {
      // Optionally handle coder load error
    }
  };

  const handleCreateDiscussion = async () => {
    if (!currentUser || !currentUser.id) {
      setApiError("You must be logged in to create a discussion.");
      return;
    }
    if (!newDiscussion.title.trim() || !newDiscussion.body.trim()) return;
    setApiError(null);
    setLoading(true);
    try {
      const payload = {
        title: newDiscussion.title,
        body: newDiscussion.body,
        coderId: currentUser.id,
      };
      const response = await createDiscussion(challengeId, payload);
      if (response.success) {
        setNewDiscussion({ title: "", body: "" });
        await fetchDiscussions();
      } else {
        setApiError("Failed to create discussion");
      }
    } catch (err) {
      setApiError("Failed to create discussion");
    } finally {
      setLoading(false);
    }
  };

  const handleAddReply = async (discussionId, replyBody) => {
    setReplyInProgress((prev) => new Set(prev).add(discussionId));
    try {
      const response = await addReply(discussionId, {
        coderId: currentUser.id,
        body: replyBody,
      });
      if (response.success) await fetchDiscussions();
      else setApiError("Failed to add reply");
    } catch (err) {
      setApiError("Failed to add reply");
    } finally {
      setReplyInProgress((prev) => {
        const newSet = new Set(prev);
        newSet.delete(discussionId);
        return newSet;
      });
    }
  };

  const handleToggleLike = async (discussionId) => {
    if (likeInProgress.has(discussionId)) return;
    setLikeInProgress((prev) => new Set(prev).add(discussionId));

    // Optimistic update
    setDiscussions((prevDiscussions) =>
      prevDiscussions.map((d) => {
        if (d.id === discussionId) {
          const liked = d.likes?.some((like) => like.coderId === currentUser.id);
          let updatedLikes;
          if (liked) {
            updatedLikes = d.likes.filter((like) => like.coderId !== currentUser.id);
          } else {
            updatedLikes = [...(d.likes || []), { coderId: currentUser.id }];
          }
          return { ...d, likes: updatedLikes };
        }
        return d;
      })
    );

    try {
      const response = await toggleLikeDiscussion(discussionId, { coderId: currentUser.id });
      if (!response.success) await fetchDiscussions(); // revert on failure
    } catch (err) {
      await fetchDiscussions();
    } finally {
      setLikeInProgress((prev) => {
        const newSet = new Set(prev);
        newSet.delete(discussionId);
        return newSet;
      });
    }
  };

  const handleExpand = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleAvatarChange = (coderId, newAvatarUrl) => {
    setCoders((prevCoders) =>
      prevCoders.map((c) => (c.id === coderId ? { ...c, avatar: newAvatarUrl } : c))
    );
  };

  const handleCoderProfileOpen = (coder) => {
    if (!coder) return;
    setSelectedCoder(coder);
    setProfileModalOpen(true);
  };

  const handleProfileClose = () => {
    setProfileModalOpen(false);
    setSelectedCoder(null);
  };

  const sortedDiscussions = [...discussions].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "likes") return (b.likes?.length || 0) - (a.likes?.length || 0);
    if (sortBy === "replies") return (b.replies?.length || 0) - (a.replies?.length || 0);
    return 0;
  });

  const discussionBgColor = "#ffe4e1";

  return (
    <Box sx={{ p: 3, backgroundColor: discussionBgColor, borderRadius: 2, mb: 4 }}>
      <Snackbar open={Boolean(apiError)} autoHideDuration={6000} onClose={() => setApiError(null)}>
        <Alert severity="error" onClose={() => setApiError(null)}>
          {apiError}
        </Alert>
      </Snackbar>

      {/* Coders avatars */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        {coders.map((coder) => (
          <CoderAvatar
            key={coder.id}
            coder={coder}
            isActive={activeCoderIds.includes(coder.id)}
            onChangeAvatar={handleAvatarChange}
            onProfileOpen={handleCoderProfileOpen}
          />
        ))}
      </Box>

      {/* Discussions Header */}
      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
        Discussions
      </Typography>

      {/* Sorting */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center" }}>
        <Typography variant="body1" color="text.secondary">
          Share thoughts, ask questions, and collaborate with other coders.
        </Typography>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Sort by</InputLabel>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sort by">
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="likes">Most Liked</MenuItem>
            <MenuItem value="replies">Most Replied</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* New Discussion */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3, p: 2, bgcolor: "#fff0f5" }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Start a New Discussion
          </Typography>
          <TextField
            fullWidth
            label="Title"
            value={newDiscussion.title}
            onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
            sx={{ mb: 2 }}
            aria-label="Discussion Title"
            disabled={loading}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Body"
            value={newDiscussion.body}
            onChange={(e) => setNewDiscussion({ ...newDiscussion, body: e.target.value })}
            sx={{ mb: 2 }}
            aria-label="Discussion Body"
            disabled={loading}
          />
          <Button
            variant="contained"
            onClick={handleCreateDiscussion}
            disabled={loading || !newDiscussion.title.trim() || !newDiscussion.body.trim()}
          >
            {loading ? <CircularProgress size={24} /> : "Post"}
          </Button>
        </CardContent>
      </Card>

      {/* Discussions List */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        sortedDiscussions.map((d) => (
          <motion.div key={d.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 2, backgroundColor: "#ffe4e1", "&:hover": { boxShadow: 5 } }}>
              <CardHeader
                avatar={
                  <Avatar
                    src={d.author?.avatar || ""}
                    alt={d.author?.name || "Anonymous"}
                    sx={{ border: "2px solid transparent", "&:hover": { border: "2px solid #333" }, cursor: "pointer" }}
                    onClick={() => handleCoderProfileOpen(d.author)}
                  />
                }
                title={<Typography variant="subtitle1" fontWeight="bold">{d.title}</Typography>}
                subheader={`${d.author?.name || "Anonymous"} • ${dayjs(d.createdAt).format("MMM D, YYYY h:mm A")}`}
                aria-label={`Discussion titled ${d.title}`}
              />
              <CardContent>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter style={materialDark} language={match[1]} PreTag="div" {...props}>
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>{children}</code>
                      );
                    },
                  }}
                >
                  {d.body}
                </ReactMarkdown>

                {/* Tags */}
                {d.tags?.length > 0 && (
                  <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {d.tags.map((tag, idx) => (
                      <Chip key={idx} label={`#${tag}`} size="small" />
                    ))}
                  </Box>
                )}

                {/* Action Bar */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <IconButton
                    aria-label={d.likes?.some((like) => like.coderId === currentUser.id) ? "Unlike" : "Like"}
                    onClick={() => handleToggleLike(d.id)}
                    size="small"
                    color={d.likes?.some((like) => like.coderId === currentUser.id) ? "primary" : "default"}
                    disabled={likeInProgress.has(d.id)}
                  >
                    <ThumbUp />
                  </IconButton>
                  <Typography variant="caption">{d.likes?.length || 0} likes</Typography>
                  <Button size="small" onClick={() => handleExpand(d.id)} startIcon={<Reply />} aria-expanded={Boolean(expanded[d.id])}>
                    {expanded[d.id] ? `Hide Replies (${d.replies?.length || 0})` : `Show Replies (${d.replies?.length || 0})`}
                  </Button>
                </Box>

                {/* Replies */}
                <Collapse in={expanded[d.id]} sx={{ mt: 2 }}>
                  <Divider sx={{ my: 1 }} />
                  {d.replies?.map((r) => (
                    <Box key={r.id} sx={{ ml: 6, mt: 1, p: 1, borderRadius: 2, bgcolor: "#f5f5f5" }}>
                      <Typography variant="body2" fontWeight="bold">{r.author?.name || "Anonymous"}</Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>{r.body}</Typography>
                      <Typography variant="caption" color="text.secondary">{dayjs(r.createdAt).format("MMM D, YYYY h:mm A")}</Typography>
                    </Box>
                  ))}
                  <ReplyInput discussionId={d.id} onReply={handleAddReply} disabled={replyInProgress.has(d.id)} />
                </Collapse>
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}

      {/* Coder profile modal */}
      <CoderProfileModal open={profileModalOpen} onClose={handleProfileClose} coder={selectedCoder} />
    </Box>
  );
};

export default Discussion;