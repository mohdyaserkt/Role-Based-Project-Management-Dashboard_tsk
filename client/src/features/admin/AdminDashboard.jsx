import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import { Typography, Paper, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TaskIcon from '@mui/icons-material/Task';

import { fetchUsers } from '../users/userSlice';
import { fetchProjects } from '../projects/projectSlice';
import { fetchTasks } from '../tasks/taskSlice';

import UserTable   from './UserTable';
import ProjectTable from './ProjectTable';
import TaskTable    from './TaskTable';

const StatCard = ({ icon: Icon, label, value }) => (
  <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
    <Icon fontSize="large" color="primary" />
    <Box>
      <Typography variant="h6">{value}</Typography>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
    </Box>
  </Paper>
);

export default function AdminDashboard() {
  const dispatch = useDispatch();

  const users    = useSelector(state => state.users);
  const projects = useSelector(state => state.projects);
  const tasks    = useSelector(state => state.tasks);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>Admin Dashboard</Typography>

      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 12, sm: 4 }}>   
          <StatCard icon={PeopleIcon} label="Total Users" value={users.ids.length} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard icon={AssignmentIcon} label="Total Projects" value={projects.ids.length} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard icon={TaskIcon} label="Total Tasks" value={tasks.ids.length} />
        </Grid>
      </Grid>

      <Typography variant="h5" mt={4} mb={1}>Users</Typography>
      <UserTable />

      <Typography variant="h5" mt={4} mb={1}>Projects</Typography>
      <ProjectTable />

      <Typography variant="h5" mt={4} mb={1}>Tasks</Typography>
      <TaskTable />
    </Box>
  );
}