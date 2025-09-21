// src/features/coders/Coders.jsx
import { useEffect, useState, useContext } from "react";
import { Container, Typography, Grid } from "@mui/material";
import { getCoders } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import CoderCard from "./components/CoderCard";

const Coders = () => {
  const { role } = useContext(AuthContext);
  const [coders, setCoders] = useState([]);

  useEffect(() => {
    getCoders().then((res) => setCoders(res.data));
  }, []);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {role === "admin" ? "All Coders" : "Community"}
      </Typography>
      <Grid container spacing={3}>
        {coders.map((coder) => (
          <Grid item xs={12} sm={6} md={4} key={coder.id}>
            <CoderCard coder={coder} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Coders;
