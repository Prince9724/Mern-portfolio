import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const loginAdmin = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/admin/login`, 
        { email, password }, 
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      console.log('✅ Login successful:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Login error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutAdmin = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(
        `${API_URL}/admin/logout`, 
        {}, 
        { withCredentials: true }
      );
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/admin/me`, 
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      console.log('✅ GetMe successful:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ GetMe error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Not authenticated');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/admin/profile`,
        profileData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      console.log('✅ Profile updated:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Profile update error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    admin: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAuth: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.admin = action.payload;
        console.log('✅ Auth state updated: Logged in');
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('❌ Auth state: Login failed');
      })
      // Logout
      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.admin = null;
        console.log('✅ Auth state: Logged out');
      })
      .addCase(logoutAdmin.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.admin = null;
      })
      // Get Me
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.admin = action.payload;
        console.log('✅ Auth state: User verified');
      })
      .addCase(getMe.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.admin = null;
        console.log('❌ Auth state: User not authenticated');
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.admin = action.payload;
        console.log('✅ Auth state: Profile updated');
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload;
        console.error('❌ Auth state: Profile update failed');
      });
  },
});

export const { clearError, resetAuth } = authSlice.actions;
export default authSlice.reducer;