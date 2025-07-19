import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import api from '../../api/axios';

const projectsAdapter = createEntityAdapter({
  selectId: (project) => project._id,
});

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/projects');
      return data; 
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Server error');
    }
  }
);

export const fetchEmployeeProjects = createAsyncThunk(
  'projects/fetchEmployeeProjects',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/projects/employee/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Server error');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/projects', payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Server error');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, body }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/projects/${id}`, body);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Server error');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/projects/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Server error');
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState: projectsAdapter.getInitialState({
    loading: false,
    error: null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        projectsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmployeeProjects.fulfilled, (state, action) => {
        projectsAdapter.setAll(state, action.payload);
      })
      .addCase(createProject.fulfilled, projectsAdapter.addOne)
      .addCase(updateProject.fulfilled, projectsAdapter.upsertOne)
      .addCase(deleteProject.fulfilled, projectsAdapter.removeOne);
  },
});

export const {
  selectAll: selectAllProjects,
  selectById: selectProjectById,
} = projectsAdapter.getSelectors((state) => state.projects);

export default projectSlice.reducer;