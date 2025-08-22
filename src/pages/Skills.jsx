import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Button,
  Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Grid
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Learning() {
  // --- STATES ---
  const [courses, setCourses] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [resources, setResources] = useState([]);
  const [practiceLogs, setPracticeLogs] = useState([]);

  // Forms state
  const [courseForm, setCourseForm] = useState({ id: null, name: '', description: '' });
  const [achievementForm, setAchievementForm] = useState({ id: null, title: '', description: '' });
  const [resourceForm, setResourceForm] = useState({ id: null, title: '', url: '' });
  const [practiceLogForm, setPracticeLogForm] = useState({ id: null, activity: '', date: '' });

  // --- FETCH DATA ---
  const fetchAll = async () => {
    try {
      const [coursesRes, achievementsRes, resourcesRes, logsRes] = await Promise.all([
        axios.get(`${API_URL}/courses`),
        axios.get(`${API_URL}/achievements`),
        axios.get(`${API_URL}/resources`),
        axios.get(`${API_URL}/practice-logs`)
      ]);
      setCourses(coursesRes.data);
      setAchievements(achievementsRes.data);
      setResources(resourcesRes.data);
      setPracticeLogs(logsRes.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // --- HANDLERS ---
  const handleSave = async (entity, form, setForm, setData) => {
    if (entity === 'courses' && !form.name) {
      alert('Name is required');
      return;
    }
    if ((entity === 'achievements' || entity === 'resources') && !form.title) {
      alert('Title is required');
      return;
    }
    if (entity === 'resources' && !form.url) {
      alert('URL is required');
      return;
    }
    if (entity === 'practice-logs' && (!form.activity || !form.date)) {
      alert('Activity and date are required');
      return;
    }

    try {
      if (form.id) {
        await axios.put(`${API_URL}/${entity}/${form.id}`, form);
        setData(prev => prev.map(item => (item.id === form.id ? form : item)));
      } else {
        const res = await axios.post(`${API_URL}/${entity}`, form);
        setData(prev => [res.data, ...prev]);
      }
      if (entity === 'courses') setCourseForm({ id: null, name: '', description: '' });
      if (entity === 'achievements') setAchievementForm({ id: null, title: '', description: '' });
      if (entity === 'resources') setResourceForm({ id: null, title: '', url: '' });
      if (entity === 'practice-logs') setPracticeLogForm({ id: null, activity: '', date: '' });
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save. Check console for details.');
    }
  };

  const handleDelete = async (entity, id, setData) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`${API_URL}/${entity}/${id}`);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete.');
    }
  };

  const handleEdit = (form, setForm) => {
    setForm(form);
  };

  return (
      <Box
          sx={{
            p: 4,
            minHeight: '100vh',
            background: '#f9f9f9',
            color: 'text.primary',
          }}
      >
        <Typography
            variant="h4"
            mb={4}
            fontWeight="bold"
            align="center"
            color="primary"
        >
          Learning Management
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {/* Courses Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, background: '#fff', borderRadius: 4, boxShadow: 2 }}>
              <Typography variant="h5" mb={2} fontWeight="bold" color="primary">
                Courses
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><b>Name</b></TableCell>
                    <TableCell><b>Description</b></TableCell>
                    <TableCell align="right"><b>Actions</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.map(c => (
                      <TableRow key={c.id}>
                        <TableCell>{c.name}</TableCell>
                        <TableCell>{c.description}</TableCell>
                        <TableCell align="right">
                          <IconButton color="primary" onClick={() => handleEdit(c, setCourseForm)}>
                            <Edit />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete('courses', c.id, setCourses)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box mt={2}>
                <Typography variant="subtitle1" mb={1}>
                  {courseForm.id ? 'Edit Course' : 'Add New Course'}
                </Typography>
                <TextField
                    label="Name"
                    value={courseForm.name}
                    onChange={(e) => setCourseForm((f) => ({ ...f, name: e.target.value }))}
                    fullWidth
                    sx={{ mb: 1 }}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Description"
                    value={courseForm.description}
                    onChange={(e) => setCourseForm((f) => ({ ...f, description: e.target.value }))}
                    fullWidth
                    multiline
                    rows={3}
                    sx={{ mb: 1 }}
                    InputLabelProps={{ shrink: true }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSave('courses', courseForm, setCourseForm, setCourses)}
                    fullWidth
                >
                  {courseForm.id ? 'Update' : 'Add'}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Achievements Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, background: '#fff', borderRadius: 4, boxShadow: 2 }}>
              <Typography variant="h5" mb={2} fontWeight="bold" color="primary">
                Achievements
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><b>Title</b></TableCell>
                    <TableCell><b>Description</b></TableCell>
                    <TableCell align="right"><b>Actions</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {achievements.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell>{a.title}</TableCell>
                        <TableCell>{a.description}</TableCell>
                        <TableCell align="right">
                          <IconButton color="primary" onClick={() => handleEdit(a, setAchievementForm)}>
                            <Edit />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete('achievements', a.id, setAchievements)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box mt={2}>
                <Typography variant="subtitle1" mb={1}>
                  {achievementForm.id ? 'Edit Achievement' : 'Add New Achievement'}
                </Typography>
                <TextField
                    label="Title"
                    value={achievementForm.title}
                    onChange={(e) => setAchievementForm((f) => ({ ...f, title: e.target.value }))}
                    fullWidth
                    sx={{ mb: 1 }}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Description"
                    value={achievementForm.description}
                    onChange={(e) => setAchievementForm((f) => ({ ...f, description: e.target.value }))}
                    fullWidth
                    multiline
                    rows={3}
                    sx={{ mb: 1 }}
                    InputLabelProps={{ shrink: true }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSave('achievements', achievementForm, setAchievementForm, setAchievements)}
                    fullWidth
                >
                  {achievementForm.id ? 'Update' : 'Add'}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Resources Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, background: '#fff', borderRadius: 4, boxShadow: 2 }}>
              <Typography variant="h5" mb={2} fontWeight="bold" color="primary">
                Resources
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><b>Title</b></TableCell>
                    <TableCell><b>URL</b></TableCell>
                    <TableCell align="right"><b>Actions</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resources.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.title}</TableCell>
                        <TableCell>
                          <a
                              href={r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#1976d2', textDecoration: 'underline' }}
                          >
                            {r.url}
                          </a>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton color="primary" onClick={() => handleEdit(r, setResourceForm)}>
                            <Edit />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete('resources', r.id, setResources)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box mt={2}>
                <Typography variant="subtitle1" mb={1}>
                  {resourceForm.id ? 'Edit Resource' : 'Add New Resource'}
                </Typography>
                <TextField
                    label="Title"
                    value={resourceForm.title}
                    onChange={(e) => setResourceForm((f) => ({ ...f, title: e.target.value }))}
                    fullWidth
                    sx={{ mb: 1 }}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="URL"
                    value={resourceForm.url}
                    onChange={(e) => setResourceForm((f) => ({ ...f, url: e.target.value }))}
                    fullWidth
                    sx={{ mb: 1 }}
                    InputLabelProps={{ shrink: true }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSave('resources', resourceForm, setResourceForm, setResources)}
                    fullWidth
                >
                  {resourceForm.id ? 'Update' : 'Add'}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Practice Logs Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, background: '#fff', borderRadius: 4, boxShadow: 2 }}>
              <Typography variant="h5" mb={2} fontWeight="bold" color="primary">
                Practice Logs
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><b>Activity</b></TableCell>
                    <TableCell><b>Date</b></TableCell>
                    <TableCell align="right"><b>Actions</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {practiceLogs.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>{p.activity}</TableCell>
                        <TableCell>{new Date(p.date).toLocaleDateString()}</TableCell>
                        <TableCell align="right">
                          <IconButton color="primary" onClick={() => handleEdit(p, setPracticeLogForm)}>
                            <Edit />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete('practice-logs', p.id, setPracticeLogs)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box mt={2}>
                <Typography variant="subtitle1" mb={1}>
                  {practiceLogForm.id ? 'Edit Practice Log' : 'Add New Practice Log'}
                </Typography>
                <TextField
                    label="Activity"
                    value={practiceLogForm.activity}
                    onChange={(e) => setPracticeLogForm((f) => ({ ...f, activity: e.target.value }))}
                    fullWidth
                    sx={{ mb: 1 }}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Date"
                    type="date"
                    value={practiceLogForm.date ? practiceLogForm.date.slice(0, 10) : ''}
                    onChange={(e) => setPracticeLogForm((f) => ({ ...f, date: e.target.value }))}
                    fullWidth
                    sx={{ mb: 1 }}
                    InputLabelProps={{ shrink: true }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSave('practice-logs', practiceLogForm, setPracticeLogForm, setPracticeLogs)}
                    fullWidth
                >
                  {practiceLogForm.id ? 'Update' : 'Add'}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
  );
}

export default Learning;