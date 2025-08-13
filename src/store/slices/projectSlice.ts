import type { Project, ProjectState } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  totalCount: 0,
};

// fetch user projects
export const fetchUserProjects = createAsyncThunk(
  "project/fetchUserProjects",
  async (
    params: {
      search?: string;
      page?: number;
      limit?: number;
    } = {},
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No authentication token");

    try {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append("search", params.search);
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());

      const response = await axios.get(
        `${API}/projects?${queryParams.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch projects";
      return rejectWithValue(message);
    }
  }
);

//fetch user single project
export const fetchProjectById = createAsyncThunk(
  "project/fetchProjectById",
  async (projectId: string, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No authentication token");
    }

    try {
      const response = await axios.get(`${API}/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch project";
      return rejectWithValue(message);
    }
  }
);

// Create project from template
export const createProjectFromTemplate = createAsyncThunk(
  "project/createProjectFromTemplate",
  async (
    projectData: {
      templateId: string;
      name: string;
      description?: string;
    },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No authentication token");

    try {
      const response = await axios.post(`${API}/projects`, projectData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create project";
      return rejectWithValue(message);
    }
  }
);

// Update project
export const updateProject = createAsyncThunk(
  "project/updateProject",
  async (
    {
      projectId,
      projectData,
    }: { projectId: string; projectData: Partial<Project> },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No authentication token");

    try {
      const response = await axios.put(
        `${API}/projects/${projectId}`,
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update project";
      return rejectWithValue(message);
    }
  }
);

// Delete project
export const deleteProject = createAsyncThunk(
  "project/deleteProject",
  async (projectId: string, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No authentication token");

    try {
      await axios.delete(`${API}/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return projectId;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete project";
      return rejectWithValue(message);
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Projects
      .addCase(fetchUserProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload.data || [];
        state.totalCount = action.payload.total || 0;
        state.totalPages = action.payload.pages || 0;
        state.currentPage = action.payload.page || 1;
      })
      .addCase(fetchUserProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.projects = [];
      })

      // Fetch Project By ID
      .addCase(fetchProjectById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProject = action.payload;
        const existingIndex = state.projects.findIndex(
          (project) => project._id === action.payload._id
        );
        if (existingIndex !== -1) {
          state.projects[existingIndex] = action.payload;
        }
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.currentProject = null;
      })

      // Create Project From Template
      .addCase(createProjectFromTemplate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProjectFromTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createProjectFromTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Project
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.projects.findIndex(
          (project) => project._id === action.payload._id
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?._id === action.payload._id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete Project
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = state.projects.filter(
          (project) => project._id !== action.payload
        );
        if (state.currentProject?._id === action.payload) {
          state.currentProject = null;
        }
        state.totalCount -= 1;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentProject, setCurrentPage } =
  projectSlice.actions;
export default projectSlice.reducer;
