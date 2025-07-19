import { useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';

export default function TaskTable() {
  const { ids, entities, loading } = useSelector(state => state.tasks);

  const columns = [
    { field: 'title', headerName: 'Task', flex: 1 },
    { field: 'projectName', headerName: 'Project', width: 160 },
{ field: 'assignedToName', headerName: 'Assignee', width: 150 },
    { field: 'status', headerName: 'Status', width: 120 },
  ];
const rows = ids.map(id => {
  const task = entities[id];

  return {
    id,
    ...task,
    projectName:
      typeof task.project === 'object' ? task.project.title : '',
    assignedToName:
      typeof task.assignedTo === 'object' ? task.assignedTo.name : '',
  };
});

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