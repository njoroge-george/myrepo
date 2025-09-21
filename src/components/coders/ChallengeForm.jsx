import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Chip,
  Stack,
  Typography,
  Paper,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { createChallenge } from '../../api/challenges';
import { useNavigate } from 'react-router-dom';

const difficulties = ['Easy', 'Medium', 'Hard'];

const ChallengeForm = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    difficulty: '',
    tags: [],
    starterCode: '',
  });
  const [tagInput, setTagInput] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddTag = () => {
    if (tagInput && !form.tags.includes(tagInput)) {
      setForm({ ...form, tags: [...form.tags, tagInput] });
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setForm({ ...form, tags: form.tags.filter(tag => tag !== tagToDelete) });
  };

  const handleSubmit = async () => {
    try {
      await createChallenge(form); // Add token if needed
      navigate('/challenges');
    } catch (err) {
      console.error('Challenge creation failed:', err);
    }
  };

  return (
    <Paper elevation={4} sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold" gutterBottom>
        Create New Challenge
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
        />

        <TextField
          label="Difficulty"
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
          select
          fullWidth
        >
          {difficulties.map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </TextField>

        <Box>
          <TextField
            label="Add Tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
            fullWidth
          />
          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
            {form.tags.map((tag, idx) => (
              <Chip
                key={idx}
                label={tag}
                onDelete={() => handleDeleteTag(tag)}
                size="small"
              />
            ))}
          </Stack>
        </Box>

        <TextField
          label="Starter Code"
          name="starterCode"
          value={form.starterCode}
          onChange={handleChange}
          multiline
          rows={6}
          fullWidth
          sx={{ fontFamily: 'monospace' }}
        />

        <Button variant="contained" onClick={handleSubmit}>
          Submit Challenge
        </Button>
      </Stack>
    </Paper>
  );
};

export default ChallengeForm;
