import { useState, useContext } from "react";
import { loginUser } from "../../api/auth.jsx";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext.jsx";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await loginUser(form);
      const token = res?.data?.token;
      if (!token) throw new Error("No token received");

      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      const { id, role, name } = payload;

      setAuth({ token, id, role, name });
      navigate("/challenges"); // ✅ use your actual dashboard route
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{ p: 4, maxWidth: 400, width: "100%", textAlign: "center" }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Login
        </Typography>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <TextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            autoComplete="username"
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don’t have an account?{" "}
          <Button onClick={() => navigate("/register")} color="secondary">
            Register
          </Button>
        </Typography>

        {message && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
      </Paper>
    </Box>
  );
}
