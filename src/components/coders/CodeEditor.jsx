import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  useMediaQuery,
  useTheme
} from '@mui/material';

const languages = ['JavaScript', 'Python', 'C++'];

const CodeEditor = ({ starterCode = '', onSubmit }) => {
  const [code, setCode] = useState(starterCode);
  const [language, setLanguage] = useState(languages[0]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = () => {
    if (code.trim()) {
      onSubmit(code, language);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold" gutterBottom>
        Code Editor
      </Typography>

      <TextField
        select
        label="Language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      >
        {languages.map((lang) => (
          <MenuItem key={lang} value={lang}>
            {lang}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Your Code"
        multiline
        rows={12}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        fullWidth
        sx={{
          fontFamily: 'monospace',
          backgroundColor: '#f5f5f5',
          mb: 2,
        }}
      />

      <Box textAlign="right">
        <Button variant="contained" onClick={handleSubmit}>
          Submit Code
        </Button>
      </Box>
    </Paper>
  );
};

export default CodeEditor;
