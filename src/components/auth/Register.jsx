import { useState } from "react";
import { registerUser } from "../api/auth.jsx";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(form);
            setMessage("Registration successful! Please log in.");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setMessage(err.response?.data?.message || "Registration failed.");
        }
    };

    return (
        <Box component={Paper} elevation={3} p={4} maxWidth={400} width="100%" textAlign="center">
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Register
            </Typography>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <TextField label="Username" name="username" value={form.username} onChange={handleChange} required />
                <TextField label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
                <TextField label="Password" type="password" name="password" value={form.password} onChange={handleChange} required />
                <Button variant="contained" color="success" type="submit">Register</Button>
            </form>

            <Typography variant="body2" sx={{ mt: 2 }}>
                Already have an account?{" "}
                <Button onClick={() => navigate("/login")} color="primary">
                    Login
                </Button>
            </Typography>

            {message && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {message}
                </Typography>
            )}
        </Box>
    );
}
