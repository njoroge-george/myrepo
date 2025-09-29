// src/components/coders/CodeEditor.jsx
import React, { useRef, useEffect, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import { submitCode } from "../../api/submissions";
import { useAuth } from "../auth/AuthContext";
import ChallengePrompt from "./ChallengePrompt";

const CodeEditor = ({ challenge, goBack, onSubmitResult }) => {
  const monaco = useMonaco();
  const editorRef = useRef(null);
  const { auth } = useAuth();

  const [code, setCode] = useState(
    "function solve() {\n  return 'hello world';\n}"
  );
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  // Register snippets & completions
  useEffect(() => {
    if (monaco) {
      monaco.languages.registerCompletionItemProvider("javascript", {
        provideCompletionItems: () => ({
          suggestions: [
            {
              label: "log",
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: "console.log($1);",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Log output to console",
            },
            {
              label: "forloop",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                "for (let i = 0; i < ${1:array}.length; i++) {",
                "\tconst element = ${1:array}[i];",
                "\t$0",
                "}",
              ].join("\n"),
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Basic for loop snippet",
            },
          ],
        }),
      });
    }
  }, [monaco]);

  // Run submission
  const handleRun = async () => {
    if (!auth?.id || !challenge?.id) {
      setOutput("❌ Missing coder or challenge context.");
      return;
    }

    setLoading(true);
    try {
      const res = await submitCode({
        coderId: auth.id,
        challengeId: challenge.id,
        code,
        language: "javascript",
      });

      const { passedTests, totalTests, score, status, submission } = res;
      const resultText = `✅ Status: ${status}\nScore: ${score}%\nPassed: ${passedTests}/${totalTests}\n\nFeedback: ${
        submission?.feedback || "No feedback yet."
      }`;

      setOutput(resultText);

      if (status === "passed" && onSubmitResult) {
        onSubmitResult({ user: auth.name, challenge: challenge.title });
      }
    } catch (err) {
      console.error("Submission error:", err);
      setOutput("❌ Error submitting code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 100px)", gap: 2 }}>
      {/* Challenge prompt panel */}
      <Paper
        elevation={3}
        sx={{
          width: "30%",
          p: 2,
          overflowY: "auto",
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <ChallengePrompt challenge={challenge} />
      </Paper>

      {/* Editor & Output */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              if (typeof goBack === "function") {
                goBack();
              } else {
                window.history.back(); // fallback navigation
              }
            }}
          >
            ← Back
          </Button>
          <Typography variant="h6">{challenge.title}</Typography>
        </Box>

        {/* Code Editor */}
        <Paper
          elevation={3}
          sx={{ flexGrow: 1, borderRadius: 2, overflow: "hidden" }}
        >
          <Editor
            height="100%"
            width="100%"
            language="javascript"
            theme="vs-dark"
            value={code}
            onMount={(editor) => (editorRef.current = editor)}
            onChange={(val) => setCode(val || "")}
            options={{
              minimap: { enabled: false },
              automaticLayout: true,
              quickSuggestions: true,
              tabCompletion: "on",
              snippetSuggestions: "inline",
              fontSize: 14,
            }}
          />
        </Paper>

        {/* Controls & Output */}
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleRun}
            disabled={loading}
            sx={{ mr: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Run Code"}
          </Button>

          <Paper
            elevation={2}
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: "background.default",
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Output
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <TextField
              multiline
              fullWidth
              variant="outlined"
              value={output}
              InputProps={{
                readOnly: true,
                sx: { fontFamily: "monospace" },
              }}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default CodeEditor;
