// src/pages/Journal.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Grid, IconButton,
  Chip, useTheme, MenuItem, Select, FormControl, InputLabel, CircularProgress
} from '@mui/material';
import { Edit, Delete, Save, Cancel, StarBorder, Star } from '@mui/icons-material';
import { getNotes, addNote, updateNote, deleteNote } from '../api/notesAPI.jsx';
import { motion } from 'framer-motion';

function NoteCard({ note, onUpdate, onDelete, onTogglePin }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(note.text);
  const theme = useTheme();

  const handleSave = () => {
    onUpdate(note.id, { text: editText });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(note.text);
  };

  const noteCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const tagColor = {
    idea: 'primary',
    task: 'secondary',
    urgent: 'error',
    personal: 'success'
  };

  return (
    <motion.div variants={noteCardVariants}>
      <Paper
        sx={{
          p: 2,
          position: 'relative',
          borderLeft: `5px solid ${theme.palette[tagColor[note.tags] || 'primary'].main}`,
          background: 'linear-gradient(145deg, rgba(40,0,60,0.9), rgba(0,0,50,0.9))',
          color: '#faffb8',
          boxShadow: '0 0 15px rgba(255,255,0,0.4), 0 0 25px rgba(0,255,0,0.3)',
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 0 20px rgba(255,255,0,0.6), 0 0 35px rgba(0,255,0,0.4)'
          }
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" sx={{ color: '#9affff' }} gutterBottom>
            {new Date(note.date).toLocaleString()}
          </Typography>
          <Chip
            label={`#${note.tags}`}
            color={tagColor[note.tags] || 'primary'}
            variant="outlined"
            size="small"
            sx={{ my: 1, color: '#fff' }}
          />
          {isEditing ? (
            <TextField
              fullWidth
              multiline
              variant="standard"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              sx={{ my: 1 }}
              autoFocus
            />
          ) : (
            <Typography sx={{ my: 1, whiteSpace: 'pre-wrap', color: '#ffffa5' }}>
              {note.text}
            </Typography>
          )}
        </Box>
        <Box sx={{ mt: 1, alignSelf: 'flex-end' }}>
          {isEditing ? (
            <>
              <IconButton onClick={handleSave} size="small"><Save sx={{ color: '#aaffaa' }} /></IconButton>
              <IconButton onClick={handleCancel} size="small"><Cancel sx={{ color: '#ffaaaa' }} /></IconButton>
            </>
          ) : (
            <>
              <IconButton onClick={() => setIsEditing(true)} size="small"><Edit sx={{ color: '#ffff88' }} /></IconButton>
              <IconButton onClick={() => onDelete(note.id)} size="small"><Delete sx={{ color: '#ff8888' }} /></IconButton>
              <IconButton onClick={() => onTogglePin(note.id, note.pinned)} size="small">
                {note.pinned ? <Star sx={{ color: 'gold' }} /> : <StarBorder sx={{ color: '#ffff88' }} />}
              </IconButton>
            </>
          )}
        </Box>
      </Paper>
    </motion.div>
  );
}

export default function Journal() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [newTag, setNewTag] = useState('idea');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getNotes();
      setNotes(res.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    const noteData = { text: newNote, date: new Date().toISOString(), tags: newTag, pinned: false };
    const res = await addNote(noteData);
    setNotes(prevNotes => [res.data, ...prevNotes]);
    setNewNote('');
  };

  const handleDeleteNote = async (id) => {
    await deleteNote(id);
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  };

  const handleUpdateNote = async (id, updatedData) => {
    const res = await updateNote(id, updatedData);
    setNotes(prevNotes => prevNotes.map(note => (note.id === id ? res.data : note)));
  };

  const handleTogglePin = async (id, currentPinned) => {
    const res = await updateNote(id, { pinned: !currentPinned });
    setNotes(prevNotes => prevNotes.map(note => (note.id === id ? res.data : note)));
  };

  const exportNotes = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notes_export_${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredNotes = useMemo(() =>
    notes.filter(note =>
      note.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.toLowerCase().includes(searchTerm.toLowerCase())
    ), [notes, searchTerm]);

  const pinnedNotes = useMemo(() => filteredNotes.filter(note => note.pinned), [filteredNotes]);
  const otherNotes = useMemo(() => filteredNotes.filter(note => !note.pinned), [filteredNotes]);

  const renderNotesGrid = (noteList) => (
    <Grid container spacing={2}>
      {noteList.map((note) => (
        <Grid item xs={12} sm={6} md={4} key={note.id}>
          <NoteCard
            note={note}
            onDelete={handleDeleteNote}
            onUpdate={handleUpdateNote}
            onTogglePin={handleTogglePin}
          />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{
      p: 3,
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d0d2b, #2b0030)',
      color: '#faffb8'
    }}>
      <Typography variant="h4" gutterBottom>Journal</Typography>
      <Typography variant="subtitle1" sx={{ mb: 2, color: '#aaffaa' }}>
        You have {notes.length} total notes.
      </Typography>

      <Paper sx={{
        p: 2, mb: 4, borderRadius: 2,
        background: 'rgba(20,0,40,0.8)',
        boxShadow: '0 0 15px rgba(255,255,0,0.4), 0 0 25px rgba(0,255,0,0.3)',
        color: '#fff'
      }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={9}>
            <TextField fullWidth multiline rows={3}
                       label="What's on your mind?" value={newNote}
                       onChange={(e) => setNewNote(e.target.value)}
                       InputLabelProps={{ style: { color: '#ffff88' } }}
                       sx={{ input: { color: '#faffb8' } }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="tag-label" sx={{ color: '#ffff88' }}>Tag</InputLabel>
              <Select
                labelId="tag-label"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                sx={{ color: '#faffb8' }}
              >
                <MenuItem value="idea">Idea</MenuItem>
                <MenuItem value="task">Task</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
                <MenuItem value="personal">Personal</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            <Button variant="contained" sx={{
              background: 'linear-gradient(90deg, #8800ff, #0000aa)',
              color: '#fff',
              boxShadow: '0 0 10px rgba(255,255,0,0.6)'
            }} onClick={handleAddNote}>
              Add Note
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
        <Grid item xs={12} md={9}>
          <TextField
            placeholder="Search notes by text or tag..."
            fullWidth variant="outlined" size="small"
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ input: { color: '#faffb8' } }}
          />
        </Grid>
        <Grid item xs={12} md={3} sx={{ textAlign: 'right' }}>
          <Button variant="outlined" sx={{
            color: '#ffff88',
            borderColor: '#ffff88',
            boxShadow: '0 0 10px rgba(255,255,0,0.6)'
          }} onClick={exportNotes}>
            Export All Notes
          </Button>
        </Grid>
      </Grid>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {pinnedNotes.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" color="primary" gutterBottom>Pinned</Typography>
              {renderNotesGrid(pinnedNotes)}
            </Box>
          )}
          <Box>
            <Typography variant="h6" gutterBottom>Notes</Typography>
            {renderNotesGrid(otherNotes)}
          </Box>
        </>
      )}
    </Box>
  );
}
