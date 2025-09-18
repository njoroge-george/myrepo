import { useEffect, useState, useRef, useContext } from "react";
import { Paper, Typography, Button, Box } from "@mui/material";
import Editor from "@monaco-editor/react";
import { submitCode, fetchTestCases } from "../../api/Coding.jsx";
import { AuthContext } from "../auth/AuthContext.jsx";

const AUTOSAVE_INTERVAL = 30000;
const CHALLENGE_DURATION = 15 * 60;

export const CodeEditorPanel = ({ challenge, onSubmit, onClose }) => {
  const { auth } = useContext(AuthContext);
  const coderId = auth?.id;
  const challengeId = challenge?.id;

  const [code, setCode] = useState("// Write your solution here...");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(CHALLENGE_DURATION);
  const [testCases, setTestCases] = useState([]);
  const timerRef = useRef(null);

  // ⏱️ Countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // 💾 Autosave
  useEffect(() => {
    if (!challengeId || !coderId) return;
    const interval = setInterval(() => {
      localStorage.setItem(`autosave-${challengeId}-${coderId}`, code);
    }, AUTOSAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [code, challengeId, coderId]);

  // 🧠 Load autosaved code
  useEffect(() => {
    if (!challengeId || !coderId) return;
    const saved = localStorage.getItem(`autosave-${challengeId}-${coderId}`);
    if (saved) setCode(saved);
  }, [challengeId, coderId]);

  // 🧪 Fetch test cases
  useEffect(() => {
    const loadTestCases = async () => {
      try {
        const cases = await fetchTestCases(challengeId);
        setTestCases(cases);
      } catch (err) {
        console.error("Failed to load test cases:", err);
      }
    };
    if (challengeId) loadTestCases();
  }, [challengeId]);

  const formatTime = (seconds) =>
    `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;


  const handleSubmit = async () => {
    if (!challengeId || !coderId) {
      setFeedback("Error: Missing challenge or user information.");
      return;
    }

    setSubmitting(true);
    setFeedback("");

    try {
      const result = await submitCode({ challengeId, coderId, code });
      const { message, passedTests, totalTests, score } = result;
      setFeedback(
        `${message}\nPassed ${passedTests}/${totalTests} tests\nScore: ${score?.toFixed(1) ?? "N/A"}%`
      );
    } catch (err) {
      console.error("Submission error:", err);
      setFeedback("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };
  useEffect(() => {
  timerRef.current = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(timerRef.current);
        handleSubmit();
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  return () => clearInterval(timerRef.current);
}, []);

  if (!challengeId || !coderId) {
    return (
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography color="error">
          Cannot render editor: missing challenge or user information.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">Time Left: {formatTime(timeLeft)}</Typography>
        {onClose && (
          <Button variant="outlined" onClick={onClose}>
            Close Editor
          </Button>
        )}
      </Box>

      <Editor
        height="400px"
        defaultLanguage="javascript"
        value={code}
        onChange={(value) => setCode(value || "")}
        theme="vs-dark"
      />

      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || timeLeft === 0}
        >
          {submitting ? "Submitting..." : "Submit Code"}
        </Button>
      </Box>

      {feedback && (
        <Typography variant="body2" color="secondary" sx={{ mt: 2, whiteSpace: "pre-line" }}>
          {feedback}
        </Typography>
      )}

      {testCases.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1">Sample Test Cases:</Typography>
          {testCases.map((tc, i) => (
            <Typography key={i} variant="body2" sx={{ whiteSpace: "pre-line", mt: 1 }}>
              Input: {tc.input}
              {"\n"}Expected Output: {tc.expectedOutput}
            </Typography>
          ))}
        </Box>
      )}
    </Paper>
  );
};
