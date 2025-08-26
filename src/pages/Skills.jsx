import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Button,
  Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Grid, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import {
  getCourses, addCourse, updateCourse, deleteCourse,
  getAchievements, addAchievement, updateAchievement, deleteAchievement,
  getResources, addResource, updateResource, deleteResource,
  getPracticeLogs, addPracticeLog, updatePracticeLog, deletePracticeLog,
} from '../api/learningAPI.jsx'; // <-- use .js unless you have JSX in API!

function Learning() {
  // --- STATES ---
  const [courses, setCourses] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [resources, setResources] = useState([]);
  const [practiceLogs, setPracticeLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  // Forms state
  const [courseForm, setCourseForm] = useState({ id: null, name: '', description: '' });
  const [achievementForm, setAchievementForm] = useState({ id: null, title: '', description: '' });
  const [resourceForm, setResourceForm] = useState({ id: null, title: '', url: '' });
  const [practiceLogForm, setPracticeLogForm] = useState({ id: null, activity: '', date: '' });

  // --- FETCH DATA ---
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [coursesRes, achievementsRes, resourcesRes, logsRes] = await Promise.all([
        getCourses(),
        getAchievements(),
        getResources(),
        getPracticeLogs()
      ]);
      setCourses(Array.isArray(coursesRes) ? coursesRes : []);
      setAchievements(Array.isArray(achievementsRes) ? achievementsRes : []);
      setResources(Array.isArray(resourcesRes) ? resourcesRes : []);
      setPracticeLogs(Array.isArray(logsRes) ? logsRes : []);
      setAlert({ open: false, message: '', severity: 'success' });
    } catch (err) {
      setAlert({ open: true, message: 'Failed to load data', severity: 'error' });
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // --- HANDLERS ---
  const handleSave = async (entity, form, setForm, setData) => {
    try {
      let res;
      if (entity === 'courses') {
        if (!form.name) return setAlert({ open: true, message: 'Name is required', severity: 'warning' });
        if (form.id) {
          res = await updateCourse(form.id, form);
          setData(prev => prev.map(item => (item.id === form.id ? res : item)));
        } else {
          res = await addCourse(form);
          setData(prev => [res, ...prev]);
        }
        setCourseForm({ id: null, name: '', description: '' });
      }
      if (entity === 'achievements') {
        if (!form.title) return setAlert({ open: true, message: 'Title is required', severity: 'warning' });
        if (form.id) {
          res = await updateAchievement(form.id, form);
          setData(prev => prev.map(item => (item.id === form.id ? res : item)));
        } else {
          res = await addAchievement(form);
          setData(prev => [res, ...prev]);
        }
        setAchievementForm({ id: null, title: '', description: '' });
      }
      if (entity === 'resources') {
        if (!form.title) return setAlert({ open: true, message: 'Title is required', severity: 'warning' });
        if (!form.url) return setAlert({ open: true, message: 'URL is required', severity: 'warning' });
        if (form.id) {
          res = await updateResource(form.id, form);
          setData(prev => prev.map(item => (item.id === form.id ? res : item)));
        } else {
          res = await addResource(form);
          setData(prev => [res, ...prev]);
        }
        setResourceForm({ id: null, title: '', url: '' });
      }
      if (entity === 'practice-logs') {
        if (!form.activity || !form.date) return setAlert({ open: true, message: 'Activity and date are required', severity: 'warning' });
        if (form.id) {
          res = await updatePracticeLog(form.id, form);
          setData(prev => prev.map(item => (item.id === form.id ? res : item)));
        } else {
          res = await addPracticeLog(form);
          setData(prev => [res, ...prev]);
        }
        setPracticeLogForm({ id: null, activity: '', date: '' });
      }
      setAlert({ open: true, message: 'Saved successfully!', severity: 'success' });
    } catch (err) {
      console.error('Save error:', err);
      setAlert({ open: true, message: 'Failed to save. Check console for details.', severity: 'error' });
    }
  };

  const handleDelete = async (entity, id, setData) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      if (entity === 'courses') await deleteCourse(id);
      if (entity === 'achievements') await deleteAchievement(id);
      if (entity === 'resources') await deleteResource(id);
      if (entity === 'practice-logs') await deletePracticeLog(id);
      setData(prev => prev.filter(item => item.id !== id));
      setAlert({ open: true, message: 'Deleted successfully!', severity: 'success' });
    } catch (err) {
      console.error('Delete error:', err);
      setAlert({ open: true, message: 'Failed to delete.', severity: 'error' });
    }
  };

  const handleEdit = (form, setForm) => {
    setForm(form);
  };

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  // --- UI
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