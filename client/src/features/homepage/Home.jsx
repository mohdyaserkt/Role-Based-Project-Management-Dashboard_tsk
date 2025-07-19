import { Button, Container, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => (
  <Container maxWidth="sm">
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 3,
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        MERN Full Stack Practical Task
      </Typography>
      <Typography variant="h5" align="center" gutterBottom>
        Role-Based Project Management Dashboard
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/signup"
        >
          Signup (Employees)
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          component={Link}
          to="/login"
        >
          Login (Admin / Manager / Employee)
        </Button>
      </Box>
    </Box>
  </Container>
);

export default HomePage;