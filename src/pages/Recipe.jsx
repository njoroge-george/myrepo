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

// subtle 3D motion styles (CSS-in-JS)
const cardSx = {
  p: 3,
  borderRadius: 3,
  background: 'linear-gradient(135deg, rgba(25,255,255,0.74), rgba(25,255,255,0.12))',
  backdropFilter: 'blur(6px)',
  transformStyle: 'preserve-3d',
  transition: 'transform 350ms ease, box-shadow 350ms ease',
  boxShadow: '0 8px 30px rgba(2,6,23,0.6)',
  '&:hover': {
    transform: 'translateY(-8px) rotateX(3deg) rotateY(2deg) scale(1.01)',
    boxShadow: '0 18px 60px rgba(2,6,23,0.75)',
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

  // fetch
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

  // helpers
  const resetForm = () => setForm(emptyForm);

  const handleAddTag = () => {
    const t = form.newTag.trim();
    if (!t) return;
    if (!form.tags.includes(t)) setForm(f => ({ ...f, tags: [...f.tags, t], newTag: '' }));
  };

  const handleRemoveTag = (tag) => {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
  };

  // Save (create / update)
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
        // push created to top of list
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
    // ensure tags array
    if (!Array.isArray(r.tags)) setForm(f => ({ ...f, tags: [] }));
  };

  // colored rating helper: returns a color based on rating
  const ratingColor = (value) => {
    if (value >= 4) return '#66bb6a'; // green
    if (value >= 2) return '#ffb300'; // amber
    return '#ef5350'; // red
  };

  return (
    <Box
      p={4}
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 10% 10%, #1b0534 0%, #120421 35%, #0b1020 100%)',
        color: '#fff',
      }}
    >
      <style>{`
        /* floating soft lights */
        .bg-orb { position: absolute; width: 420px; height: 420px; border-radius: 50%; filter: blur(80px); opacity: .12; z-index:0 }
        .orb-1 { background: linear-gradient(45deg,#8b3bff,#4f00ff); left: -80px; top: -120px; animation: drift 18s ease-in-out infinite; }
        .orb-2 { background: linear-gradient(45deg,#00ffd1,#00b3ff); right: -100px; bottom: -140px; animation: drift 22s ease-in-out infinite reverse; }
        @keyframes drift { 0% {transform: translateY(0) translateX(0);} 50% {transform: translateY(18px) translateX(8px);} 100% {transform: translateY(0) translateX(0);} }

        /* subtle card tilt on small screens fix */
        @media (max-width:600px){ .recipe-card { transform: none !important } }
      `}</style>

      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />

      <Grid container spacing={3} sx={{ position: 'relative', zIndex: 2 }}>
        <Grid item xs={12} md={5}>
          <Paper className="recipe-card" sx={{ ...cardSx, minHeight: 420 }}>
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
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              ))}
            </Box>

            <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.06)' }} />

            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Typography>Rating</Typography>
              <Rating
                value={form.rating}
                onChange={(e, v) => setForm(f => ({ ...f, rating: v }))}
                precision={1}
                sx={{
                  '& .MuiRating-iconFilled': { color: ratingColor(form.rating) },
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
          <Paper sx={{ ...cardSx, p: 2 }}>
            <Typography variant="h5" mb={2}>My Recipes</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {loading && <Typography>Loading...</Typography>}

              {!loading && recipes.length === 0 && (
                <Typography color="text.secondary">No recipes yet. Add something delicious ✨</Typography>
              )}

              {recipes.map(r => (
                <Paper key={r.id} sx={{ p: 2, mb: 1, background: 'rgba(255,255,255,0.02)' }}>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item xs>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{r.title}</Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 1 }}>
                        {(Array.isArray(r.tags) ? r.tags : []).map(t => (
                          <Chip key={t} label={t} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.04)' }} />
                        ))}
                      </Stack>

                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                        Ingredients: {r.ingredients}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5, color: 'rgba(255,255,255,0.65)' }}>
                        {r.instructions && r.instructions.length > 200 ? r.instructions.slice(0, 200) + '...' : r.instructions}
                      </Typography>
                    </Grid>

                    <Grid item>
                      <Stack direction="column" alignItems="flex-end" spacing={1}>
                        <Rating value={r.rating || 0} readOnly sx={{ '& .MuiRating-iconFilled': { color: ratingColor(r.rating || 0) } }} />
                        <Stack direction="row">
                          <IconButton size="small" onClick={() => handleEdit(r)} sx={{ color: '#90caf9' }}><Edit /></IconButton>
                          <IconButton size="small" onClick={() => handleDelete(r.id)} sx={{ color: '#f44336' }}><Delete /></IconButton>
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


/* ======================================================================
   Frontend API: src/api/recipesAPI.js
   Simple axios wrappers you can drop into your frontend. They assume your
   backend exposes standard REST endpoints at /api/recipes
   ====================================================================== */

