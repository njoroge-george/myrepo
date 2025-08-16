// src/pages/Todo.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button, IconButton, Grid,
  Select, MenuItem, Chip, Stack, InputLabel, FormControl
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../api/todoAPI';

const statusColor = {
  pending: '#ffb74d',    // amber
  ongoing: '#4fc3f7',    // light blue
  completed: '#81c784',  // green
};

const priorityColor = {
  low: '#9e9e9e',
  medium: '#29b6f6',
  high: '#ef5350',
};

const cardSx = {
  p: 2,
  borderRadius: 3,
  background: 'linear-gradient(135deg, rgba(25,255,25,0.52), rgba(255,255,255,0.01))',
  boxShadow: '0 8px 30px rgba(2,6,23,0.6)',
  transition: 'transform 300ms ease, box-shadow 300ms ease',
  '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 60px rgba(2,6,23,0.8)' }
};

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  const emptyForm = {
    id: null,
    title: '',
    details: '',
    priority: 'medium',
    due_date: '',
    status: 'pending'
  };
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState({ status: '', priority: '' });
  const [query, setQuery] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.priority) params.priority = filter.priority;
      if (query) params.q = query;
      const data = await getTodos(params);
      setTodos(data);
    } catch (err) {
      console.error(err);
      alert('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const resetForm = () => setForm(emptyForm);

  const onSave = async () => {
    if (!form.title.trim()) { alert('Title required'); return; }
    try {
      if (form.id) {
        await updateTodo(form.id, form);
        setTodos(prev => prev.map(t => (t.id === form.id ? { ...t, ...form } : t)));
      } else {
        const created = await createTodo(form);
        setTodos(prev => [created, ...prev]);
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Save failed');
    }
  };

  const onEdit = (t) => {
    // convert due_date to YYYY-MM-DD if exists
    const due = t.due_date ? (t.due_date.slice ? t.due_date.slice(0,10) : t.due_date) : '';
    setForm({ ...t, due_date: due });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(x => x.id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const toggleComplete = async (t) => {
    const updated = { ...t, status: t.status === 'completed' ? 'pending' : 'completed' };
    try {
      await updateTodo(t.id, updated);
      setTodos(prev => prev.map(x => (x.id === t.id ? updated : x)));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  return (
    <Box sx={{ p: 4, minHeight: '100vh', background: 'radial-gradient(circle at 10% 10%, #1a1133 0%, #080814 100%)', color: '#fff' }}>
      <style>{`
        @keyframes float { 0% { transform: translateY(0) } 50% { transform: translateY(-6px) } 100% { transform: translateY(0) } }
        .glow { box-shadow: 0 6px 30px rgba(110,100,255,0.08); }
      `}</style>

      <Grid container spacing={3} sx={{ position: 'relative', zIndex: 2 }}>
        <Grid item xs={12}>
          <Paper sx={{ ...cardSx, display:'flex', gap:2, alignItems:'center', flexWrap:'wrap' }}>
            <Typography variant="h5" sx={{ flex: '0 0 auto' }}>Tasks</Typography>

            <TextField
              placeholder="Search title..."
              size="small"
              value={query}
              onChange={e => setQuery(e.target.value)}
              sx={{ minWidth: 240 }}
            />
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel shrink> Status </InputLabel>
              <Select value={filter.status} displayEmpty onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
                <MenuItem value=''>All status</MenuItem>
                <MenuItem value='pending'>Pending</MenuItem>
                <MenuItem value='ongoing'>Ongoing</MenuItem>
                <MenuItem value='completed'>Completed</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel shrink> Priority </InputLabel>
              <Select value={filter.priority} displayEmpty onChange={e => setFilter(f => ({ ...f, priority: e.target.value }))}>
                <MenuItem value=''>All priority</MenuItem>
                <MenuItem value='low'>Low</MenuItem>
                <MenuItem value='medium'>Medium</MenuItem>
                <MenuItem value='high'>High</MenuItem>
              </Select>
            </FormControl>

            <Button variant="contained" onClick={fetch} sx={{ ml: 'auto' }}>Refresh</Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ ...cardSx }}>
            <Typography variant="h6" mb={1}>{form.id ? 'Edit Task' : 'Add Task'}</Typography>

            <TextField label="Title" fullWidth value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} sx={{ mb: 1 }} />
            <TextField label="Details" fullWidth multiline rows={3} value={form.details} onChange={e => setForm(f => ({ ...f, details: e.target.value }))} sx={{ mb: 1 }} />
            <FormControl fullWidth sx={{ mb: 1 }}>
              <InputLabel shrink>Priority</InputLabel>
              <Select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Due date"
              type="date"
              fullWidth
              value={form.due_date || ''}
              onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 1 }}
            />

            <FormControl fullWidth sx={{ mb: 1 }}>
              <InputLabel shrink>Status</InputLabel>
              <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="ongoing">Ongoing</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>

            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button variant="outlined" onClick={resetForm}>Reset</Button>
              <Button variant="contained" onClick={onSave}>{form.id ? 'Update' : 'Add'}</Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ ...cardSx }}>
            <Typography variant="h6" mb={2}>Task list {loading ? '(loading...)' : ''}</Typography>

            <Stack spacing={1}>
              {todos.length === 0 && <Typography color="text.secondary">No tasks yet. Add one!</Typography>}

              {todos.map(t => (
                <Paper key={t.id} sx={{
                  p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  borderLeft: `6px solid ${priorityColor[t.priority] || priorityColor.medium}`,
                  background: t.status === 'completed' ? 'linear-gradient(90deg, rgba(128,203,196,0.04), rgba(128,203,196,0.02))' :
                    t.status === 'ongoing' ? 'linear-gradient(90deg, rgba(79,195,247,0.03), rgba(79,195,247,0.01))' :
                      'transparent',
                  animation: 'float 6s ease-in-out infinite',
                }}>
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{t.title}</Typography>
                      <Chip label={t.priority} size="small" sx={{ bgcolor: priorityColor[t.priority], color: '#fff' }} />
                      <Chip label={t.status} size="small" sx={{ bgcolor: statusColor[t.status], color: '#000' }} />
                    </Stack>

                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>{t.details}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      Due: {t.due_date ? new Date(t.due_date).toLocaleDateString() : '—'} • Created: {new Date(t.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button size="small" onClick={() => toggleComplete(t)} sx={{ textTransform:'none' }}>
                      {t.status === 'completed' ? 'Mark Pending' : 'Mark Done'}
                    </Button>
                    <IconButton size="small" color="info" onClick={() => onEdit(t)}><Edit /></IconButton>
                    <IconButton size="small" color="error" onClick={() => onDelete(t.id)}><Delete /></IconButton>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
