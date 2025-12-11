import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserState } from "@/types";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const initialState: UserState = {
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  totalCount: 0,
};

export const getUsers = createAsyncThunk(
  "user/getUsers",
  async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      role?: string;
      plan?: string;
    },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No authentication token");

    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.search) queryParams.append("search", params.search);
      if (params.role) queryParams.append("role", params.role);
      if (params.plan) queryParams.append("plan", params.plan);

      const response = await axios.get(
        `${API}/users?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const getuserDetails = createAsyncThunk(
  "user/getuserDetails",
  async (userId: string, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No authentication token");
    console.log(userId);

    try {
      const response = await axios.get(`${API}/users/${userId}/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users details"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId: string, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No authentication token");

    try {
      const response = await axios.delete(`${API}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return userId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // get all Users
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.data || [];
        state.totalCount = action.payload.total || 0;
        state.totalPages = action.payload.pages || 0;
        state.currentPage = action.payload.page || 1;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.users = [];
      })
      // getUserDetails
      .addCase(getuserDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getuserDetails.fulfilled, (state, action) => {
        const { user, projectCount, snippetCount } = action.payload;

        state.isLoading = false;
        state.currentUser = { ...user, projectCount, snippetCount };
      })
      .addCase(getuserDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // delete user
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter((user) => user._id !== action.payload);
        if (state.currentUser?._id === action.payload) {
          state.currentUser = null;
        }
        state.totalCount -= 1;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentUser, setCurrentPage } =
  userSlice.actions;
export default userSlice.reducer;
