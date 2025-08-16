import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Button,
  Select, MenuItem, InputLabel, FormControl,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { saveEntry, getEntries, updateEntry, deleteEntry } from '../api/financeApi';

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
        minWidth: '800px',
        py: 4,
        px: { xs: 2, md: 6 },
        background: 'linear-gradient(135deg, #0a0a40, #2c005f)',
        color: '#ffeb3b'
      }}>
        <Paper elevation={8} sx={{
          p: 4,
          maxWidth: 800,
          mx: 'auto',
          borderRadius: 4,
          background: 'linear-gradient(135deg, #0a0a40 50%, #202e5f 50%)',
          boxShadow: 'inset 0px 4px 1px rgba(155, 0, 255, 0.9)',
          color: '#aefc2f'
        }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#ffeb3b' }}>
            Finance Tracker
          </Typography>
          <Typography variant="body1" mb={3} sx={{ color: '#000000' }}>
            Track your income and expenses easily.
          </Typography>

          <Box display="flex" flexDirection="column" gap={2} mb={3}>
            <FormControl fullWidth>
              <InputLabel id="type-label" sx={{ color: '#aefc2f' }}>Type</InputLabel>
              <Select
                  labelId="type-label"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  sx={{ color: '#aefc2f' }}
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} fullWidth sx={{ input: { color: '#ffeb3b' } }} />
            <TextField label="Category" value={category} onChange={(e) => setCategory(e.target.value)} fullWidth sx={{ input: { color: '#ffeb3b' } }} />
            <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth sx={{ input: { color: '#ffeb3b' } }} />
            <Button variant="contained" onClick={handleAddOrUpdateEntry} size="large"
                    sx={{
                      bgcolor: '#6a1b9a',
                      '&:hover': { bgcolor: '#8e24aa', boxShadow: '0px 0px 20px #ffeb3b' },
                      color: '#ffeb3b',
                      fontWeight: 'bold'
                    }}>
              {editIndex !== null ? 'Update Entry' : 'Add Entry'}
            </Button>
          </Box>
        </Paper>

        {/* Table View */}
        <Box mt={5} minWidth={1400} mx="auto">
          <Typography variant="h5" mb={2} fontWeight="bold" sx={{ color: '#ffeb3b' }}>Your Entries</Typography>
          {entries.length === 0 ? (
              <Typography sx={{ color: '#aefc2f' }}>No entries yet.</Typography>
          ) : (
            <TableContainer
              component={Paper}
              sx={{
                width: '100%',
                boxShadow: 'inset 0px 4px 1px rgba(155, 0, 255, 0.5)',
                borderRadius: '12px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #0a0a40, #2c005f)',
                color: '#ffffff',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: '0px 0px 2px rgba(255, 235, 59, 0.5)',
                  transform: 'scale(1.005)',
                }
              }}
            >
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{
                  background: 'linear-gradient(135deg, #1a237e 50%, #4a148c 50%)',
                  '& th': {
                    color: '#ffeb3b',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    textShadow: '0px 0px 1px rgba(255,255,0,0.7)',
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
                          bgcolor: entry.type === 'income'
                            ? 'rgba(0, 200, 150, 0.2)'
                            : 'rgba(255, 0, 150, 0.15)',
                          transition: 'all 0.25s ease',
                          '&:hover': {
                            transform: 'scale(1.02)',
                            boxShadow: entry.type === 'income'
                              ? '0px 0px 15px rgba(0, 255, 150, 0.6)'
                              : '0px 0px 15px rgba(255, 0, 150, 0.6)',
                            bgcolor: entry.type === 'income'
                              ? 'rgba(0, 255, 150, 0.25)'
                              : 'rgba(255, 0, 150, 0.2)',
                          },
                          '& td': { color: '#ffffff' }
                        }}
                      >
                        <TableCell>{entry.type.toUpperCase()}</TableCell>
                        <TableCell>${parseFloat(entry.amount).toFixed(2)}</TableCell>
                        <TableCell>{entry.category}</TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEdit(index)} sx={{ color: '#ffeb3b' }}>
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(index)} sx={{ color: '#ff3d00' }}>
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
                sx={{ color: '#ffeb3b', borderTop: '1px solid rgba(255,255,255,0.2)' }}
              />
            </TableContainer>

          )}
        </Box>
      </Box>
  );
}
