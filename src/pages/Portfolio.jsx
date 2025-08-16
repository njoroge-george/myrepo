// src/pages/Portfolio.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Chip
} from "@mui/material";
import { motion } from "framer-motion";
import { getPortfolio, createPortfolio } from "../api/portfolioAPI";

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    skills: "",
    projects: "",
    contact_email: ""
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const data = await getPortfolio();
      setPortfolio(data);
    } catch (err) {
      console.error("Error fetching portfolio:", err.response?.data || err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required.";
    if (!formData.title.trim()) return "Title is required.";
    if (!formData.contact_email.trim()) return "Contact email is required.";
    if (!formData.skills.trim()) return "Please enter at least one skill.";
    if (!formData.projects.trim()) return "Please enter at least one project.";
    return "";
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      const newData = {
        ...formData,
        skills: formData.skills.split(",").map(s => s.trim()),
        projects: formData.projects.split(",").map(p => ({
          title: p.trim(),
          description: ""
        }))
      };
      await createPortfolio(newData);
      fetchPortfolio();
      setFormData({ name: "", title: "", bio: "", skills: "", projects: "", contact_email: "" });
      setErrorMessage("");
    } catch (err) {
      console.error("Error creating portfolio:", err.response?.data || err.message);
      setErrorMessage("Failed to save portfolio. Check console for details.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1b1b1f, #222831, #2f3640)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 6
      }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontWeight: "bold",
            color: "#f5f6fa",
            textShadow: "0 2px 6px rgba(0,0,0,0.4)"
          }}
        >
          My Portfolio
        </Typography>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", maxWidth: "800px" }}
      >
        <Paper
          sx={{
            p: 4,
            mb: 4,
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "16px",
            backdropFilter: "blur(8px)",
            color: "#fff"
          }}
          elevation={6}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Add Portfolio Info
          </Typography>
          {errorMessage && (
            <Typography sx={{ color: "#ff7675", mb: 2 }}>{errorMessage}</Typography>
          )}
          <Grid container spacing={2}>
            {[
              { label: "Name", name: "name" },
              { label: "Title", name: "title" },
              { label: "Bio", name: "bio", multiline: true, rows: 3 },
              { label: "Skills (comma separated)", name: "skills" },
              { label: "Projects (comma separated)", name: "projects" },
              { label: "Contact Email", name: "contact_email" }
            ].map((field, idx) => (
              <Grid item xs={12} sm={field.name === "bio" ? 12 : 6} key={idx}>
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  multiline={field.multiline || false}
                  rows={field.rows || 1}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#f5f6fa",
                      "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                      "&:hover fieldset": { borderColor: "#00adb5" },
                      "&.Mui-focused fieldset": { borderColor: "#00ffdd" }
                    },
                    "& .MuiInputLabel-root": { color: "#aaa" },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#00ffdd" }
                  }}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSubmit}
                  sx={{
                    py: 1.5,
                    fontSize: "1rem",
                    background: "linear-gradient(90deg, #00adb5, #00ffdd)",
                    color: "#000",
                    fontWeight: "bold",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #00ffdd, #00adb5)"
                    }
                  }}
                >
                  Save
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* Portfolio List */}
      <Grid container spacing={3} sx={{ maxWidth: "1100px" }}>
        {portfolio.map((item, index) => (
          <Grid item xs={12} md={6} key={index}>
            <motion.div whileHover={{ scale: 1.03 }}>
              <Paper
                sx={{
                  p: 3,
                  background: "rgba(255, 255, 255, 0.07)",
                  borderRadius: "14px",
                  backdropFilter: "blur(6px)",
                  color: "#f5f6fa"
                }}
                elevation={4}
              >
                <Typography variant="h5" sx={{ color: "#00ffdd" }}>
                  {item.name}
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  {item.title}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {item.bio}
                </Typography>

                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Skills:
                </Typography>
                {item.skills?.map((skill, i) => (
                  <Chip
                    key={i}
                    label={skill}
                    sx={{
                      mr: 1,
                      mb: 1,
                      background: "#00adb5",
                      color: "#000",
                      fontWeight: "bold"
                    }}
                  />
                ))}

                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Projects:
                </Typography>
                {item.projects?.map((proj, i) => (
                  <Paper
                    key={i}
                    sx={{
                      p: 1,
                      mb: 1,
                      background: "linear-gradient(90deg, #00adb5, #00ffdd)",
                      color: "#000",
                      fontWeight: "bold"
                    }}
                  >
                    <Typography variant="body2">{proj.title}</Typography>
                  </Paper>
                ))}

                <Typography variant="body2" sx={{ mt: 2, color: "#bbb" }}>
                  Contact: {item.contact_email}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
