import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Grid } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/api/login", { email, password });
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("user_role", response.data.user.role);
      localStorage.setItem("user_id", response.data.user.id);
      setToken(response.data.access_token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Login failed");
      } else {
        setError("Something went wrong. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      sx={{ minHeight: "100vh" }}
      justifyContent="center"
      alignItems="center"
    >
      <Grid item xs={11} sm={8} md={5} lg={4}>
        <Paper elevation={6} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" component="h1" gutterBottom>
              Library Management System
            </Typography>
            <Typography variant="h6" component="h2" gutterBottom>
              Login
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <Typography color="error" variant="body2" align="center">
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                mt: 1,
                bgcolor: "#1e72f1",
                "&:hover": { bgcolor: "#1960caff" },
                py: 1.5,
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
