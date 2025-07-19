import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { MenuItem, Select, FormControl, CircularProgress } from '@mui/material';
import { updateUserRole } from '../users/userSlice';

export default function UserTable() {
  const dispatch = useDispatch();
  const { ids, entities, loading } = useSelector(state => state.users);

  const [pendingId, setPendingId] = useState(null);

  const handleRoleChange = (id, newRole) => {
    setPendingId(id);
    dispatch(updateUserRole({ id, role: newRole }))
      .unwrap()
      .finally(() => setPendingId(null));
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    {
      field: 'role',
      headerName: 'Role',
      width: 160,
      renderCell: ({ id, value }) => (
        <FormControl size="small" sx={{ width: 140 }}>
          {pendingId === id ? (
            <CircularProgress size={20} />
          ) : (
            <Select
              value={value}
              onChange={(e) => handleRoleChange(id, e.target.value)}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="employee">Employee</MenuItem>
            </Select>
          )}
        </FormControl>
      ),
    },
  ];

  const rows = ids.map(id => ({ id, ...entities[id] }));

  return (
    <div style={{ height: 360, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        loading={loading}
      />
    </div>
  );
}