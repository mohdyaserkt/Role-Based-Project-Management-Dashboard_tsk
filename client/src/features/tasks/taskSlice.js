import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import api from '../../api/axios';

const tasksAdapter = createEntityAdapter({
  selectId: (task) => task._id,
});

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/tasks');
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Server error');
    }
  }
);

export const fetchTasksByProject = createAsyncThunk(
  'tasks/fetchTasksByProject',
  async (projectId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/tasks?projectId=${projectId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Server error');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/tasks', payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Server error');
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/tasks/status/${id}`, { status });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Server error');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, body }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, body);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Server error');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Server error');
    }
  }
);

export const fetchEmployeeTasks = createAsyncThunk(
  'tasks/fetchEmployeeTasks',
  async (employeeId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/tasks/employee/${employeeId}`);
      return data; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Server error');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: tasksAdapter.getInitialState({
    loading: false,
    error: null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        tasksAdapter.setAll(state, action.payload);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTasksByProject.fulfilled, (state, action) => {
        tasksAdapter.setAll(state, action.payload);
      })
      .addCase(fetchEmployeeTasks.fulfilled, tasksAdapter.setAll)
      .addCase(createTask.fulfilled, tasksAdapter.addOne)
      .addCase(updateTaskStatus.fulfilled, tasksAdapter.upsertOne)
      .addCase(updateTask.fulfilled, tasksAdapter.upsertOne)
      .addCase(deleteTask.fulfilled, tasksAdapter.removeOne);
  },
});

export const {
  selectAll: selectAllTasks,
  selectById: selectTaskById,
  selectIds: selectTaskIds,
} = tasksAdapter.getSelectors((state) => state.tasks);

export default taskSlice.reducer;