import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { loginUser } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { setUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!username) newErrors.username = 'Please enter your username';
    if (!password) newErrors.password = 'Please enter your password';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const result = await loginUser(username, password);

      if (result.success) {
        setUser(result.user);
        navigate('/');
      } else {
        alert(result.message);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={Boolean(errors.username)}
            helperText={errors.username}
          />

          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={Boolean(errors.password)}
            helperText={errors.password}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Log In
          </Button>

          <Button
            component={Link}
            to="/register"
            variant="text"
            fullWidth
            sx={{ mt: 2 }}
          >
            Don't have an account? Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;
