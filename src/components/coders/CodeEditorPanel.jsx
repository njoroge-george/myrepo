import React, { useState } from 'react';
import { Box, Button, Typography, Alert, MenuItem, Select } from '@mui/material';
import { submitCode } from '../../api/submissions';
import { useAuth } from '../auth/AuthContext';
import { useParams } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export default function CodeEditorPanel({ starterCode = '', challengeId }) {
  const [code, setCode] = useState(starterCode);
  const [language, setLanguage] = useState('javascript');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { auth } = useAuth();
  const { id } = useParams();

  const handleSubmit = async () => {
    setMessage('');
    setSubmitting(true);
    try {
      const payload = {
        coderId: auth.id,
        challengeId: challengeId || id,
        code,
        language,
      };
      const res = await submitCode(payload);
      setMessage(`✅ ${res.data.message} | Score: ${res.data.score}`);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>Code Editor</Typography>

      <Select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        sx={{ mb: 2 }}
      >
        <MenuItem value="javascript">JavaScript</MenuItem>
        <MenuItem value="python">Python</MenuItem>
        <MenuItem value="cpp">C++</MenuItem>
      </Select>

      <CodeMirror
        value={code}
        height="300px"
        extensions={[javascript()]}
        onChange={(value) => setCode(value)}
      />

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? 'Submitting...' : 'Submit Code'}
      </Button>

      {message && <Alert severity="info" sx={{ mt: 2 }}>{message}</Alert>}
    </Box>
  );
}
