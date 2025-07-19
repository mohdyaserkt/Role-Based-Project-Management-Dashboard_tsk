import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
  Alert,
  Link,
} from '@mui/material';
import { Paper, List, ListItem, ListItemText } from '@mui/material';
import { login, reset } from './authSlice';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { user, loading, error } = useSelector((state) => state.auth);


  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'admin':
          navigate('/admin', { replace: true });
          break;
        case 'manager':
          navigate('/manager', { replace: true });
          break;
        case 'employee':
        default:
          navigate('/employee', { replace: true });
          break;
      }
    }
 
    return () => dispatch(reset());
  }, [user, navigate, dispatch]);

  const onSubmit = ({ email, password }) => {
    dispatch(login({ email, password }));
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent>
          <Typography variant="h4" align="center" mb={2}>
            Sign In
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              {...register('email', { required: 'Email required' })}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              {...register('password', { required: 'Password required' })}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>

            <Typography variant="body2" align="center">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/signup">
                Sign up
              </Link>
            </Typography>
          </Box>
        </CardContent>
      
       <Paper elevation={3} sx={{ p: 3, mt: 3, maxWidth: 400, mx: 'auto' }}>
    <Typography variant="h6" gutterBottom align="center">
      Test Credentials
    </Typography>
    <List dense>
      <ListItem>
        <ListItemText
          primary="Employee 1"
          secondary="testemployee1@gmail.com / pass: 123456"
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Employee 2"
          secondary="testemployee2@gmail.com / pass: 123456"
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Manager"
          secondary="manager@gmail.com / pass: 123456"
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Admin"
          secondary="superadmin@gmail.com / pass: 123456"
        />
      </ListItem>
    </List>
  </Paper></Card>
    </Box>

  );
}