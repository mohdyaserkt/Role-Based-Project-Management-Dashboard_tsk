import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Select,
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../projects/projectSlice';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../tasks/taskSlice';
import { fetchUsers } from '../users/userSlice';

const initialProject = { title: '', description: '', team: [] };
const initialTask = { title: '', description: '', assignedTo: '', projectId: '' };

const statusColors = {
  todo: 'default',
  'in-progress': 'info',
  completed: 'success',
};

export default function ManagerDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const projects   = useSelector(state => state.projects);
  const allTasks   = useSelector(state => state.tasks);
  const users      = useSelector(state => state.users);


  const myProjects = projects.ids
  .map(id => projects.entities[id])
  .filter(p => p?.manager?._id === user?._id)
  .map(p => ({
    ...p,
    teamSize: Array.isArray(p.team) ? p.team.length : 0,
  }));


const allManagerTasks = allTasks.ids
  .map(id => {
    const t = allTasks.entities[id];
    if (!t) return null;

    const projectId = typeof t.project === 'string' ? t.project : t.project?._id;
    const projectTitle = typeof t.project === 'string'
      ? projects.entities[t.project]?.title ?? ''
      : t.project?.title ?? '';

    const assigneeId = typeof t.assignedTo === 'string' ? t.assignedTo : t.assignedTo?._id;
    const assigneeName = typeof t.assignedTo === 'string'
      ? users.entities[t.assignedTo]?.name ?? ''
      : t.assignedTo?.name ?? '';

    return {
      ...t,
      projectId,
      projectName: projectTitle,
      assignedToId: assigneeId,
      assignedToName: assigneeName,
    };
  })
  .filter(t => t && myProjects.some(p => p._id === t.projectId));



  const [projectDialog, setProjectDialog] = useState(false);
  const [projectForm, setProjectForm] = useState(initialProject);
  const [editProjectId, setEditProjectId] = useState(null);

  const [taskDialog, setTaskDialog] = useState(false);
  const [taskForm, setTaskForm] = useState(initialTask);
  const [editTaskId, setEditTaskId] = useState(null);

 
  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchUsers());
  }, [dispatch, user]);
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch, user,allTasks]);
  const handleSaveProject = async () => {
    try {
      editProjectId
        ? await dispatch(updateProject({ id: editProjectId, body: projectForm })).unwrap()
        : await dispatch(createProject({ ...projectForm, manager: user._id })).unwrap();
      setProjectDialog(false);
    } catch {}
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete project and all its tasks?')) return;
    await dispatch(deleteProject(id));
  };

  const handleSaveTask = async () => {
    try {
      const payload = { ...taskForm };
      editTaskId
        ? await dispatch(updateTask({ id: editTaskId, body: payload })).unwrap()
        : await dispatch(createTask(payload)).unwrap();
      setTaskDialog(false);
    } catch {}
  };

  const handleDeleteTask = async (id) => {
    await dispatch(deleteTask(id));
  };

  
  const projectCols = [
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1.5 },
    {
  field: 'teamSize',
  headerName: 'Team Size',
  width: 100,
},

    {
      field: 'actions',
      type: 'actions',
      width: 120,
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => {
            setEditProjectId(row._id);
            setProjectForm({ title: row.title, description: row.description, team: row.team });
            setProjectDialog(true);
          }}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteProject(row._id)}
        />,
      ],
    },
  ];

  const taskCols = [
  { field: 'title', headerName: 'Task', flex: 1 },
  { field: 'description', headerName: 'Description', flex: 1.5 },
 { field: 'projectName', headerName: 'Project', width: 160 },
{ field: 'assignedToName', headerName: 'Assignee', width: 150 },

  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: ({ row }) => (
      <Chip label={row?.status} color={statusColors[row?.status]} size="small" />
    ),
  },
  {
    field: 'actions',
    type: 'actions',
    width: 120,
    getActions: ({ row }) => [
      <GridActionsCellItem
        icon={<EditIcon />}
        label="Edit"
        onClick={() => {
          setEditTaskId(row._id);
          setTaskForm({
            title: row.title,
            description: row.description,
            assignedTo: row.assignedTo?._id ?? row.assignedTo,
            projectId: row.project?._id ?? row.project,
          });
          setTaskDialog(true);
        }}
      />,
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Delete"
        onClick={() => handleDeleteTask(row._id)}
      />,
    ],
  },
];

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>Manager Dashboard</Typography>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">My Projects ({myProjects.length})</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditProjectId(null);
            setProjectForm(initialProject);
            setProjectDialog(true);
          }}
        >
          Add Project
        </Button>
      </Box>

      <div style={{ height: 300, width: '100%', marginBottom: 30 }}>
        <DataGrid
          rows={myProjects}
          columns={projectCols}
          pageSize={5}
          rowsPerPageOptions={[5]}
          loading={projects.loading}
          disableSelectionOnClick
          getRowId={(row) => row._id}
        />
      </div>

      <Box display="flex" justifyContent="space-between" my={2}>
        <Typography variant="h5">All My Tasks ({allManagerTasks.length})</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditTaskId(null);
            setTaskForm(initialTask);
            setTaskDialog(true);
          }}
        >
          Add Task
        </Button>
      </Box>

      <div style={{ height: 450, width: '100%' }}>
        <DataGrid
          rows={allManagerTasks}
          columns={taskCols}
          pageSize={8}
          rowsPerPageOptions={[8]}
          loading={allTasks.loading}
          disableSelectionOnClick
          getRowId={(row) => row._id}
        />
      </div>

      <Dialog
        open={projectDialog}
        onClose={() => setProjectDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editProjectId ? 'Edit Project' : 'Create Project'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Title"
            value={projectForm.title}
            onChange={(e) =>
              setProjectForm({ ...projectForm, title: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Description"
            multiline
            rows={3}
            value={projectForm.description}
            onChange={(e) =>
              setProjectForm({ ...projectForm, description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProjectDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveProject} variant="contained">
            {editProjectId ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={taskDialog}
        onClose={() => setTaskDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editTaskId ? 'Edit Task' : 'Create Task'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Task Title"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Description"
            multiline
            rows={3}
            value={taskForm.description}
            onChange={(e) =>
              setTaskForm({ ...taskForm, description: e.target.value })
            }
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Project</InputLabel>
            <Select
              value={taskForm.projectId}
              onChange={(e) =>
                setTaskForm({ ...taskForm, projectId: e.target.value })
              }
            >
              {myProjects.map(p => (
                <MenuItem key={p._id} value={p._id}>
                  {p.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Assign To</InputLabel>
            <Select
              value={taskForm.assignedTo}
              onChange={(e) =>
                setTaskForm({ ...taskForm, assignedTo: e.target.value })
              }
            >
              {users.ids
                .map(id => users.entities[id])
                .filter(u => u?.role === 'employee')
                .map(u => (
                  <MenuItem key={u._id} value={u._id}>
                    {u.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaskDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveTask} variant="contained">
            {editTaskId ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}