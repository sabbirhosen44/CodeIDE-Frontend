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
      });
  },
});

export const { clearError, clearCurrentUser, setCurrentPage } =
  userSlice.actions;
export default userSlice.reducer;
