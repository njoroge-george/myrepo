import { useState } from "react";
import { loginUser } from "../api/auth.jsx";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Login({ setAuthenticated }) {
    const [form, setForm] = useState({ username: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await loginUser(form);
            localStorage.setItem("token", res.data.token);
            setAuthenticated(true);
            navigate("/overview");
        } catch (err) {
            setMessage(err.response?.data?.message || "Login failed.");
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
            <Box
                component={Paper}
                elevation={3}
                p={4}
                maxWidth={400}
                width="100%"
                textAlign="center"
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
                    />
                    <TextField
                        label="Password"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <Button variant="contained" color="primary" type="submit">
                        Login
                    </Button>
                </form>

                <Typography variant="body2" sx={{ mt: 2 }}>
                    Don’t have an account?{" "}
                    <Button onClick={() => navigate("/register")} color="secondary">
                        Register
                    </Button>
                </Typography>

                {message && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {message}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}
