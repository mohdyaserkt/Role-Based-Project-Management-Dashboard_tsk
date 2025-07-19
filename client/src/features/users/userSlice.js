import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import api from '../../api/axios';

const usersAdapter = createEntityAdapter({
  selectId: (user) => user._id,        
});


export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/users');
      return data; 
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Server error');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/users', payload);
      return data; 
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Server error');
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'users/updateUserRole',
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/users/role/${id}`, { role });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Server error');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState({
    loading: false,
    error: null,
  }),
  reducers: {},
  extraReducers: (builder) => {
   
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        usersAdapter.setAll(state, action.payload);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    
    builder.addCase(createUser.fulfilled, (state, action) => {
      usersAdapter.addOne(state, action.payload);
    });

    
    builder.addCase(updateUserRole.fulfilled, (state, action) => {
      usersAdapter.upsertOne(state, action.payload);
    });
  },
});

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors((state) => state.users);

export default userSlice.reducer;