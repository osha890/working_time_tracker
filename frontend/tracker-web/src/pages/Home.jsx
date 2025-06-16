import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

function Home() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to the Working Time Tracker!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This is the starting point of the application.
        </Typography>
      </Paper>
    </Container>
  );
}

export default Home;
