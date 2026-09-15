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
        { withCredentials: true }
      );
      
      // ✅ Token localStorage mein save karo
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        console.log('✅ Token saved to localStorage');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message ||
        (error.message === 'Network Error'
          ? 'Network Error: Cannot connect to server. Please check backend deployment or CORS settings.'
          : error.message) ||
        'Login failed';
      return rejectWithValue(errorMessage);
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
      // ✅ Token remove karo
      localStorage.removeItem('adminToken');
      return null;
    } catch (error) {
      localStorage.removeItem('adminToken');
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Agar token nahi hai toh skip
      if (!token) {
        return rejectWithValue('No token');
      }

      const response = await axios.get(
        `${API_URL}/admin/me`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data.data;
    } catch (error) {
      // ✅ Token invalid hai toh remove karo
      localStorage.removeItem('adminToken');
      return rejectWithValue(
        error.response?.data?.message || 'Not authenticated'
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${API_URL}/admin/profile`,
        profileData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    admin: null,
    isAuthenticated: false,
    loading: false,
    initialCheckDone: false,
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
      state.initialCheckDone = false;
      state.error = null;
      localStorage.removeItem('adminToken');
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.admin = action.payload;
        state.initialCheckDone = true;
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.admin = null;
        state.error = action.payload;
      })
      // LOGOUT
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.admin = null;
      })
      .addCase(logoutAdmin.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.admin = null;
      })
      // GET ME
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.admin = action.payload;
        state.initialCheckDone = true;
      })
      .addCase(getMe.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.admin = null;
        state.initialCheckDone = true;
      })
      // UPDATE PROFILE
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.admin = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, resetAuth } = authSlice.actions;
export default authSlice.reducer; 