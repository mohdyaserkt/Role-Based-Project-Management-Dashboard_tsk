import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  Box,
  Paper,
  Chip,
  Stack,
  Grid,
  useMediaQuery,
  useTheme,
  Button,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { fetchEmployeeProjects } from '../projects/projectSlice';
import { fetchEmployeeTasks, updateTaskStatus } from '../tasks/taskSlice';

const statusColors = {
  todo: 'default',
  'in-progress': 'info',
  completed: 'success',
};

export default function EmployeeDashboard() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { user } = useSelector(state => state.auth);
  const projects = useSelector(state => state.projects);
  const tasks = useSelector(state => state.tasks);

  const [editTask, setEditTask] = useState(null); 

  useEffect(() => {
    if (!user) return;
    dispatch(fetchEmployeeProjects(user._id));
    dispatch(fetchEmployeeTasks(user._id));
  }, [dispatch, user]);


  const myProjects = projects.ids
    .map(id => projects.entities[id])
    .filter(p => p?.team?.some(u => u._id === user?._id));

  
  const myTasks = tasks.ids
    .map(id => tasks.entities[id])
    .filter(task => task?.assignedTo === user?._id)
    .map(task => {
      const project = typeof task.project === 'object' ? task.project : {};
      const assignee = projects.ids
        .map(pid => projects.entities[pid])
        .flatMap(p => p?.team || [])
        .find(u => u._id === task.assignedTo);

      return {
        ...task,
        id: task._id,
        projectName: project?.title || 'N/A',
        assignedToName: assignee?.name || 'N/A',
      };
    });

 

  const handleStatus = async (taskId, newStatus) => {
    await dispatch(updateTaskStatus({ id: taskId, status: newStatus }));
    setEditTask(null);
  };


  const taskColumns = [
    { field: 'title', headerName: 'Task', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1.5 },
    { field: 'projectName', headerName: 'Project', width: 160 },
    { field: 'assignedToName', headerName: 'Assignee', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      renderCell: ({ row }) =>
        editTask?.id === row.id ? (
          <Chip
            label={row.status}
            color={statusColors[row.status]}
            onClick={() => setEditTask({ id: row.id, status: row.status })}
          />
        ) : (
          <Chip
            label={row.status}
            color={statusColors[row.status]}
            variant="outlined"
          />
        ),
    },
    {
  field: 'actions',
  headerName: 'Actions',
  width: 280,
  renderCell: ({ row }) =>
    editTask?.id === row.id ? (
      <Stack direction="row" spacing={1}>
        <Button size="small" variant="outlined" onClick={() => handleStatus(row.id, 'todo')}>
          Todo
        </Button>
        <Button size="small" variant="outlined" onClick={() => handleStatus(row.id, 'in-progress')}>
          In Progress
        </Button>
        <Button size="small" variant="outlined" onClick={() => handleStatus(row.id, 'completed')}>
          Completed
        </Button>
      </Stack>
    ) : (
      <Button size="small" onClick={() => setEditTask({ id: row.id, status: row.status })}>
        Change Status
      </Button>
    ),
}
  ];

  return (
    <Box p={isMobile ? 2 : 4}>
      <Typography variant="h4" mb={3}>
        Employee Dashboard
      </Typography>

      
      <Typography variant="h5" mb={2}>
        Assigned Projects ({myProjects.length})
      </Typography>
      <Grid container spacing={2} mb={4}>
        {myProjects.map(p => (
          <Grid item xs={12} sm={6} md={4} key={p._id}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">{p.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {p.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

     
      <Typography variant="h5" mb={2}>
        My Tasks ({myTasks.length})
      </Typography>
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <div style={{ minWidth: 700, height: 420 }}>
          <DataGrid
            rows={myTasks}
            columns={taskColumns}
            getRowId={row => row._id}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            loading={tasks.loading}
            autoHeight
          />
        </div>
      </Box>
    </Box>
  );
}
