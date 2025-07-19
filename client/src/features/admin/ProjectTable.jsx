import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { createProject, updateProject, deleteProject } from '../projects/projectSlice';

const initialForm = { title: '', description: '', team: [] };

export default function ProjectTable() {
  const dispatch = useDispatch();
  const { ids, entities, loading } = useSelector(state => state.projects);

 
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);

  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  
  const rows = ids.map(id => {
  const entity = entities[id];
  return {
    id,
    ...entity,
    managerName: entity.manager?.name || '—',
  };
});

  const handleOpen = (row) => {
    if (row) {
      setEditId(row.id);
      setForm({ title: row.title, description: row.description, team: row.team });
    } else {
      setEditId(null);
      setForm(initialForm);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    try {
      if (editId) {
        await dispatch(updateProject({ id: editId, body: form })).unwrap();
        setSnack({ open: true, msg: 'Project updated', severity: 'success' });
      } else {
        await dispatch(createProject(form)).unwrap();
        setSnack({ open: true, msg: 'Project created', severity: 'success' });
      }
      handleClose();
    } catch (e) {
      setSnack({ open: true, msg: e || 'Error', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await dispatch(deleteProject(id)).unwrap();
      setSnack({ open: true, msg: 'Project deleted', severity: 'success' });
    } catch (e) {
      setSnack({ open: true, msg: e || 'Error', severity: 'error' });
    }
  };

  
  const columns = [
    { field: 'title', headerName: 'Title', flex: 1, editable: false },
    { field: 'description', headerName: 'Description', flex: 1.5, editable: false },
    {
  field: 'managerName',
  headerName: 'Manager',
  width: 160,
}

,
    {
      field: 'actions',
      type: 'actions',
      width: 100,
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleOpen(row)}
          color="inherit"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(row.id)}
          color="inherit"
        />,
      ],
    },
  ];

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => handleOpen()}
      >
        Add Project
      </Button>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          loading={loading}
          disableSelectionOnClick
        />
      </div>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit Project' : 'Create Project'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Description"
            multiline
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editId ? 'Save Changes' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.severity}>{snack.msg}</Alert>
      </Snackbar>
    </>
  );
}