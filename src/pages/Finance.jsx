// src/pages/FinanceCard.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Button,
  Select, MenuItem, InputLabel, FormControl,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import FinanceCharts from '../components/FinanceCharts.jsx'
import { saveEntry, getEntries, updateEntry, deleteEntry } from '../api/financeApi.jsx';

export default function Finance() {
  const [entries, setEntries] = useState([]);
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddOrUpdateEntry = async () => {
    if (!type || !amount || !category) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const date = new Date().toLocaleString();
      const newEntry = { type, amount, category, description, date };

      if (editIndex !== null) {
        const id = entries[editIndex].id;
        await updateEntry(id, newEntry);
        const updatedEntries = [...entries];
        updatedEntries[editIndex] = { ...updatedEntries[editIndex], ...newEntry };
        setEntries(updatedEntries);
        setEditIndex(null);
      } else {
        const saved = await saveEntry(newEntry);
        setEntries([...entries, saved]);
      }

      setType('income');
      setAmount('');
      setCategory('');
      setDescription('');
    } catch (err) {
      console.error('Error saving entry:', err);
      alert('Failed to save entry. Please check the server.');
    }
  };

  const handleEdit = (index) => {
    const entry = entries[index];
    setType(entry.type);
    setAmount(entry.amount);
    setCategory(entry.category);
    setDescription(entry.description);
    setEditIndex(index);
  };

  const handleDelete = async (index) => {
    try {
      const id = entries[index].id;
      await deleteEntry(id);
      setEntries(entries.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Error deleting entry:', err);
      alert('Failed to delete entry.');
    }
  };

  useEffect(() => {
    async function fetchEntries() {
      try {
        const data = await getEntries();
        setEntries(data);
      } catch (err) {
        console.error('Failed to load entries:', err);
      }
    }
    fetchEntries();
  }, []);

  return (
      <Box sx={{
        minHeight: '100vh',
        py: 4,
        px: { xs: 2, md: 6 },
        background: '#f9f9f9',
        color: 'text.primary'
      }}>
        <Paper elevation={3} sx={{
          p: 4,
          maxWidth: 800,
          mx: 'auto',
          borderRadius: 4,
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          color: 'text.primary'
        }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Finance Tracker
          </Typography>
          <Typography variant="body1" mb={3}>
            Track your income and expenses easily.
          </Typography>

          <Box display="flex" flexDirection="column" gap={2} mb={3}>
            <FormControl fullWidth>
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                  labelId="type-label"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} fullWidth />
            <TextField label="Category" value={category} onChange={(e) => setCategory(e.target.value)} fullWidth />
            <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth />
            <Button variant="contained" onClick={handleAddOrUpdateEntry} size="large"
                    sx={{
                      bgcolor: 'primary.main',
                      color: '#fff',
                      fontWeight: 'bold',
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}>
              {editIndex !== null ? 'Update Entry' : 'Add Entry'}
            </Button>
          </Box>
        </Paper>

        {/* Table View */}
        <Box mt={5} mx="auto" maxWidth={1400}>
          <Typography variant="h5" mb={2} fontWeight="bold">
            Your Entries
          </Typography>
          {entries.length === 0 ? (
              <Typography>No entries yet.</Typography>
          ) : (
              <TableContainer
                  component={Paper}
                  sx={{
                    width: '100%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                    borderRadius: '12px',
                    background: '#fff',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                      transform: 'scale(1.005)',
                    }
                  }}
              >
                <Table sx={{ minWidth: 650 }}>
                  <TableHead sx={{
                    background: '#f5f5f5',
                    '& th': {
                      color: 'text.primary',
                      fontWeight: 'bold',
                      fontSize: '1rem'
                    }
                  }}>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entries
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((entry, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                  bgcolor: '#fff',
                                  transition: 'all 0.25s ease',
                                  '&:hover': {
                                    background: '#f0f4ff',
                                    transform: 'scale(1.01)',
                                  }
                                }}
                            >
                              <TableCell>{entry.type.toUpperCase()}</TableCell>
                              <TableCell>${parseFloat(entry.amount).toFixed(2)}</TableCell>
                              <TableCell>{entry.category}</TableCell>
                              <TableCell>{entry.description}</TableCell>
                              <TableCell>{entry.date}</TableCell>
                              <TableCell>
                                <IconButton onClick={() => handleEdit(index)} color="primary">
                                  <Edit />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(index)} color="error">
                                  <Delete />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                        ))}
                  </TableBody>
                </Table>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={entries.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
          )}
        </Box>
        {/* Charts */}
        <Box mt={5} mx="auto" maxWidth={1400}>
          <Typography variant="h5" mb={2} fontWeight="bold">
              Financial  Overview
            </Typography>
            <FinanceCharts entries={entries} />
        </Box>
      </Box>
  );
}