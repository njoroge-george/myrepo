import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Grid,
  Chip,
  Rating,
  Stack,
  InputAdornment,
  Divider,
} from '@mui/material';
import { Edit, Delete, Add, Tag as TagIcon } from '@mui/icons-material';
import { getRecipes, createRecipe, updateRecipe, deleteRecipe } from '../api/recipeAPI';

const cardSx = {
  p: 3,
  borderRadius: 3,
  background: '#fff',
  boxShadow: 2,
  color: 'text.primary',
  transition: 'box-shadow 0.3s, transform 0.3s',
  '&:hover': {
    boxShadow: 4,
    transform: 'scale(1.01)',
  },
};

export default function Recipe() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const emptyForm = {
    id: null,
    title: '',
    ingredients: '',
    instructions: '',
    tags: [],
    newTag: '',
    rating: 0,
  };

  const [form, setForm] = useState(emptyForm);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const data = await getRecipes();
      setRecipes(data || []);
    } catch (err) {
      console.error('Fetch recipes error', err);
      alert('Failed to load recipes. See console.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const resetForm = () => setForm(emptyForm);

  const handleAddTag = () => {
    const t = form.newTag.trim();
    if (!t) return;
    if (!form.tags.includes(t)) setForm(f => ({ ...f, tags: [...f.tags, t], newTag: '' }));
  };

  const handleRemoveTag = (tag) => {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      alert('Title required');
      return;
    }

    try {
      if (form.id) {
        await updateRecipe(form.id, {
          title: form.title,
          ingredients: form.ingredients,
          instructions: form.instructions,
          tags: form.tags,
          rating: form.rating,
        });
        setRecipes(prev => prev.map(r => (r.id === form.id ? { ...r, ...form } : r)));
      } else {
        const created = await createRecipe({
          title: form.title,
          ingredients: form.ingredients,
          instructions: form.instructions,
          tags: form.tags,
          rating: form.rating,
        });
        setRecipes(prev => [created, ...prev]);
      }
      resetForm();
    } catch (err) {
      console.error('Save recipe error', err);
      alert('Failed to save recipe. See console.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recipe?')) return;
    try {
      await deleteRecipe(id);
      setRecipes(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Delete recipe error', err);
      alert('Failed to delete recipe.');
    }
  };

  const handleEdit = (r) => {
    setForm({ ...r, newTag: '' });
    if (!Array.isArray(r.tags)) setForm(f => ({ ...f, tags: [] }));
  };

  return (
      <Box
          p={4}
          sx={{
            minHeight: '100vh',
            background: '#f9f9f9',
            color: 'text.primary',
          }}
      >
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={5}>
            <Paper sx={{ ...cardSx, minHeight: 420, maxWidth: 420, margin: 'auto' }}>
              <Typography variant="h5" mb={1}>Add / Edit Recipe</Typography>

              <TextField
                  label="Title"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  fullWidth
                  sx={{ mb: 1 }}
                  InputLabelProps={{ shrink: true }}
              />

              <TextField
                  label="Ingredients (comma separated)"
                  value={form.ingredients}
                  onChange={e => setForm(f => ({ ...f, ingredients: e.target.value }))}
                  fullWidth
                  multiline
                  rows={3}
                  sx={{ mb: 1 }}
                  InputLabelProps={{ shrink: true }}
              />

              <TextField
                  label="Instructions"
                  value={form.instructions}
                  onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))}
                  fullWidth
                  multiline
                  rows={4}
                  sx={{ mb: 1 }}
                  InputLabelProps={{ shrink: true }}
              />

              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <TextField
                    label="New tag"
                    value={form.newTag}
                    onChange={e => setForm(f => ({ ...f, newTag: e.target.value }))}
                    size="small"
                    InputProps={{ startAdornment: (<InputAdornment position="start"><TagIcon /></InputAdornment>) }}
                />
                <Button variant="contained" onClick={handleAddTag} startIcon={<Add />}>Add Tag</Button>
              </Stack>

              <Box sx={{ mb: 1 }}>
                {form.tags.map(t => (
                    <Chip
                        key={t}
                        label={t}
                        onDelete={() => handleRemoveTag(t)}
                        sx={{ mr: 0.5, mb: 0.5, bgcolor: '#f5f5f5', color: 'text.primary' }}
                    />
                ))}
              </Box>

              <Divider sx={{ my: 1, borderColor: '#eee' }} />

              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Typography>Rating</Typography>
                <Rating
                    value={form.rating}
                    onChange={(e, v) => setForm(f => ({ ...f, rating: v }))}
                    precision={1}
                    sx={{
                      '& .MuiRating-iconFilled': { color: '#1976d2' },
                    }}
                />
                <Box sx={{ flex: 1 }} />
                <Button variant="outlined" onClick={resetForm}>Reset</Button>
                <Button variant="contained" onClick={handleSave}>Save</Button>
              </Stack>

              <Typography variant="caption" color="text.secondary">Tip: click a recipe in the list to load for editing.</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper sx={{ ...cardSx, p: 2, maxWidth: 700, margin: 'auto' }}>
              <Typography variant="h5" mb={2}>My Recipes</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {loading && <Typography>Loading...</Typography>}

                {!loading && recipes.length === 0 && (
                    <Typography color="text.secondary">No recipes yet. Add something delicious.</Typography>
                )}

                {recipes.map(r => (
                    <Paper key={r.id} sx={{ p: 2, mb: 1, background: '#f5f5f5', color: 'text.primary' }}>
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item xs>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{r.title}</Typography>
                          <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 1 }}>
                            {(Array.isArray(r.tags) ? r.tags : []).map(t => (
                                <Chip key={t} label={t} size="small" sx={{ bgcolor: '#e0e0e0', color: 'text.primary' }} />
                            ))}
                          </Stack>

                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Ingredients: {r.ingredients}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                            {r.instructions && r.instructions.length > 200 ? r.instructions.slice(0, 200) + '...' : r.instructions}
                          </Typography>
                        </Grid>

                        <Grid item>
                          <Stack direction="column" alignItems="flex-end" spacing={1}>
                            <Rating value={r.rating || 0} readOnly sx={{ '& .MuiRating-iconFilled': { color: '#1976d2' } }} />
                            <Stack direction="row">
                              <IconButton size="small" onClick={() => handleEdit(r)} color="primary"><Edit /></IconButton>
                              <IconButton size="small" onClick={() => handleDelete(r.id)} color="error"><Delete /></IconButton>
                            </Stack>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Paper>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
  );
}