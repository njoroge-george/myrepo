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
        // Update
        await axios.put(`${API_URL}/${entity}/${form.id}`, form);
        setData(prev => prev.map(item => (item.id === form.id ? form : item)));
      } else {
        // Create
        const res = await axios.post(`${API_URL}/${entity}`, form);
        setData(prev => [res.data, ...prev]);
      }
      // Reset form
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
          p={3}
          minWidth='100vw'
          mx="auto"
          sx={{
            position: 'relative',
            zIndex: 1,
            overflow: 'hidden',
            minHeight: '100vh',
            background: 'linear-gradient(-135deg, #000000, #2b0030)',
            backgroundSize: '600% 600%',
            animation: 'gradientShift 30s ease infinite',
            borderRadius: 2,
            boxShadow: '0 0 30px rgba(0,0,0,0.7)',
            transformStyle: 'preserve-3d',
            perspective: 1000,
            color: '#fff',
          }}
      >
      {/*  <style>{`*/}
      {/*  @keyframes gradientShift {*/}
      {/*    0% {background-position: 0% 50%;}*/}
      {/*    50% {background-position: 100% 50%;}*/}
      {/*    100% {background-position: 0% 50%;}*/}
      {/*  }*/}
      {/*`}</style>*/}

        <Typography
            variant="h3"
            mb={4}
            sx={{
              color: '#fff',
              textShadow: 'inset 0 0 10px rgba(255,255,255,0.5)',
              textAlign: 'center',
              fontWeight: 'bold',
            }}
        >
          Learning Management
        </Typography>Notes

        <Grid container spacing={2}>
          {/* Courses Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, background: '#318', borderRadius:  5 }}>
              <Typography
                  variant="h5"
                  mb={2}
                  sx={{ color: '#fff'}}
              >
                Courses
              </Typography>

              <Box mb={3} style={{ overflowX: 'auto' }}>
                <Table size="small" sx={{ color: '#fff' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#fff' }}>Name</TableCell>
                      <TableCell sx={{ color: '#fff' }}>Description</TableCell>
                      <TableCell align="right" sx={{ color: '#fff' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {courses.map(c => (
                        <TableRow key={c.id}>
                          <TableCell>{c.name}</TableCell>
                          <TableCell>{c.description}</TableCell>
                          <TableCell align="right">
                            <IconButton sx={{ color: '#90caf9' }} onClick={() => handleEdit(c, setCourseForm)}>
                              <Edit />
                            </IconButton>
                            <IconButton
                                sx={{ color: '#f44336' }}
                                onClick={() => handleDelete('courses', c.id, setCourses)}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>

              <Box>
                <Typography
                    variant="subtitle1"
                    mb={1}
                    sx={{ color: '#fff', mb: 1 }}
                >
                  {courseForm.id ? 'Edit Course' : 'Add New Course'}
                </Typography>
                <TextField
                    label="Name"
                    value={courseForm.name}
                    onChange={(e) => setCourseForm((f) => ({ ...f, name: e.target.value }))}
                    fullWidth
                    sx={{ mb: 1, input: { color: '#fff' }, label: { color: '#bbb' } }}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Description"
                    value={courseForm.description}
                    onChange={(e) => setCourseForm((f) => ({ ...f, description: e.target.value }))}
                    fullWidth
                    multiline
                    rows={3}
                    sx={{ mb: 1, input: { color: '#fff' }, label: { color: '#bbb' } }}
                    InputLabelProps={{ shrink: true }}
                />
                <Button
                    variant="contained"
                    sx={{ backgroundColor: '#2196f3', ':hover': { backgroundColor: '#1976d2' } }}
                    onClick={() => handleSave('courses', courseForm, setCourseForm, setCourses)}
                >
                  {courseForm.id ? 'Update' : 'Add'}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Achievements Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, background: '#318', borderRadius:  5 }}>
              <Typography
                  variant="h5"
                  mb={2}
                  sx={{ color: '#fff' }}
              >
                Achievements
              </Typography>

              <Table size="small" sx={{ color: '#fff' }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#fff' }}>Title</TableCell>
                    <TableCell sx={{ color: '#fff' }}>Description</TableCell>
                    <TableCell align="right" sx={{ color: '#fff' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {achievements.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell>{a.title}</TableCell>
                        <TableCell>{a.description}</TableCell>
                        <TableCell align="right">
                          <IconButton sx={{ color: '#90caf9' }} onClick={() => handleEdit(a, setAchievementForm)}>
                            <Edit />
                          </IconButton>
                          <IconButton
                              sx={{ color: '#f44336' }}
                              onClick={() => handleDelete('achievements', a.id, setAchievements)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Box>
                <Typography
                    variant="subtitle1"
                    mb={1}
                    sx={{ color: '#fff', mb: 1 }}
                >
                  {achievementForm.id ? 'Edit Achievement' : 'Add New Achievement'}
                </Typography>
                <TextField
                    label="Title"
                    value={achievementForm.title}
                    onChange={(e) => setAchievementForm((f) => ({ ...f, title: e.target.value }))}
                    fullWidth
                    sx={{ mb: 1, input: { color: '#fff' }, label: { color: '#bbb' } }}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Description"
                    value={achievementForm.description}
                    onChange={(e) => setAchievementForm((f) => ({ ...f, description: e.target.value }))}
                    fullWidth
                    multiline
                    rows={3}
                    sx={{ mb: 1, input: { color: '#fff' }, label: { color: '#bbb' } }}
                    InputLabelProps={{ shrink: true }}
                />
                <Button
                    variant="contained"
                    sx={{ backgroundColor: '#2196f3', ':hover': { backgroundColor: '#1976d2' } }}
                    onClick={() => handleSave('achievements', achievementForm, setAchievementForm, setAchievements)}
                >
                  {achievementForm.id ? 'Update' : 'Add'}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Resources Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, background: '#318', borderRadius:  5 }}>
              <Typography
                  variant="h5"
                  mb={2}
                  sx={{ color: '#fff'}}
              >
                Resources
              </Typography>

              <Table size="small" sx={{ color: '#fff' }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#fff' }}>Title</TableCell>
                    <TableCell sx={{ color: '#fff' }}>URL</TableCell>
                    <TableCell align="right" sx={{ color: '#fff' }}>Actions</TableCell>
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
                              style={{ color: '#90caf9' }}
                          >
                            {r.url}
                          </a>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton sx={{ color: '#90caf9' }} onClick={() => handleEdit(r, setResourceForm)}>
                            <Edit />
                          </IconButton>
                          <IconButton
                              sx={{ color: '#f44336' }}
                              onClick={() => handleDelete('resources', r.id, setResources)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Box>
                <Typography
                    variant="subtitle1"
                    mb={1}
                    sx={{ color: '#fff' }}
                >
                  {resourceForm.id ? 'Edit Resource' : 'Add New Resource'}
                </Typography>
                <TextField
                    label="Title"
                    value={resourceForm.title}
                    onChange={(e) => setResourceForm((f) => ({ ...f, title: e.target.value }))}
                    fullWidth
                    sx={{ mb: 1, input: { color: '#fff' }, label: { color: '#bbb' } }}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="URL"
                    value={resourceForm.url}
                    onChange={(e) => setResourceForm((f) => ({ ...f, url: e.target.value }))}
                    fullWidth
                    sx={{ mb: 1, input: { color: '#fff' }, label: { color: '#bbb' } }}
                    InputLabelProps={{ shrink: true }}
                />
                <Button
                    variant="contained"
                    sx={{ backgroundColor: '#2196f3', ':hover': { backgroundColor: '#1976d2' } }}
                    onClick={() => handleSave('resources', resourceForm, setResourceForm, setResources)}
                >
                  {resourceForm.id ? 'Update' : 'Add'}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Practice Logs Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, background: '#318', borderRadius:  5 }}>
              <Typography
                  variant="h5"
                  mb={2}
                  sx={{ color: '#fff'}}
              >
                Practice Logs
              </Typography>

              <Table size="small" sx={{ color: '#fff' }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#fff' }}>Activity</TableCell>
                    <TableCell sx={{ color: '#fff' }}>Date</TableCell>
                    <TableCell align="right" sx={{ color: '#fff' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {practiceLogs.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>{p.activity}</TableCell>
                        <TableCell>{new Date(p.date).toLocaleDateString()}</TableCell>
                        <TableCell align="right">
                          <IconButton sx={{ color: '#90caf9' }} onClick={() => handleEdit(p, setPracticeLogForm)}>
                            <Edit />
                          </IconButton>
                          <IconButton
                              sx={{ color: '#f44336' }}
                              onClick={() => handleDelete('practice-logs', p.id, setPracticeLogs)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Box>
                <Typography
                    variant="subtitle1"
                    mb={1}
                    sx={{ color: '#fff' }}
                >
                  {practiceLogForm.id ? 'Edit Practice Log' : 'Add New Practice Log'}
                </Typography>
                <TextField
                    label="Activity"
                    value={practiceLogForm.activity}
                    onChange={(e) => setPracticeLogForm((f) => ({ ...f, activity: e.target.value }))}
                    fullWidth
                    sx={{ mb: 1, input: { color: '#fff' }, label: { color: '#bbb' } }}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Date"
                    type="date"
                    value={practiceLogForm.date ? practiceLogForm.date.slice(0, 10) : ''}
                    onChange={(e) => setPracticeLogForm((f) => ({ ...f, date: e.target.value }))}
                    fullWidth
                    sx={{ mb: 1, input: { color: '#fff' }, label: { color: '#bbb' } }}
                    InputLabelProps={{ shrink: true }}
                />
                <Button
                    variant="contained"
                    sx={{ backgroundColor: '#2196f3', ':hover': { backgroundColor: '#1976d2' } }}
                    onClick={() => handleSave('practice-logs', practiceLogForm, setPracticeLogForm, setPracticeLogs)}
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