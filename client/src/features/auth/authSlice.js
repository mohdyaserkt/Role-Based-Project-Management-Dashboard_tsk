import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";


export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", payload);
      localStorage.setItem("token", data.token);
      return data;         
    } catch (err) {

      alert(err.response?.data?.message)
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/signup", payload);
      localStorage.setItem("token", data.token);
      return data;          
    } catch (err) {
      alert("Signup failed")
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,      
    token: null,     
    loading: false,  
    error: null,     
  },
  reducers: {
    logout: (state) => {
      localStorage.clear();
      state.user = null;
      state.token = null;
      state.error = null;
    },
    reset: (state) => {            
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
        state.token = payload.token;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

     
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
        state.token = payload.token;
      })
      .addCase(signup.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { logout, reset } = authSlice.actions;
export default authSlice.reducer;