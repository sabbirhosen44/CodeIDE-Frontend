import { TemplateState, Template } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const initialState: TemplateState = {
  templates: [],
  currentTemplate: null,
  isLoading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  totalCount: 0,
};

export const fetchTemplates = createAsyncThunk(
  "template/fetchTemplates",
  async (
    params: {
      category?: string;
      language?: string;
      framework?: string;
      tags?: string;
      search?: string;
      page?: number;
      limit?: number;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.category) queryParams.append("category", params.category);
      if (params.language) queryParams.append("language", params.language);
      if (params.framework) queryParams.append("framework", params.framework);
      if (params.tags) queryParams.append("tags", params.tags);
      if (params.search) queryParams.append("search", params.search);
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());

      const response = await axios.get(
        `${API}/templates?${queryParams.toString()}`
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch templates"
      );
    }
  }
);

export const createTemplate = createAsyncThunk(
  "template/createTemplate",
  async (templateData: Partial<Template>, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No authentication token");

    console.log(templateData);

    try {
      const response = await axios.post(`${API}/templates`, templateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create template"
      );
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  "template/deleteTemplate",
  async (templateId: string, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No authentication token");

    try {
      const response = await axios.delete(`${API}/templates/${templateId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return templateId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete template"
      );
    }
  }
);

export const incrementDownloads = createAsyncThunk(
  "template/incrementDownloads",
  async (templateId: string, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API}/templates/${templateId}/download`
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to increment downloads"
      );
    }
  }
);

const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTemplate: (state) => {
      state.currentTemplate = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Templates
      .addCase(fetchTemplates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = action.payload.data || [];
        state.totalCount = action.payload.total || 0;
        state.totalPages = action.payload.pages || 0;
        state.currentPage = action.payload.page || 1;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.templates = [];
      })
      // Create Template
      .addCase(createTemplate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete Template
      .addCase(deleteTemplate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = state.templates.filter(
          (template) => template._id !== action.payload
        );
        if (state.currentTemplate?._id === action.payload) {
          state.currentTemplate = null;
        }
        state.totalCount -= 1;
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Increment Downloads
      .addCase(incrementDownloads.pending, (state) => {})
      .addCase(incrementDownloads.fulfilled, (state, action) => {
        const index = state.templates.findIndex(
          (template) => template._id === action.payload._id
        );
        if (index !== -1) {
          state.templates[index] = action.payload;
        }
        if (state.currentTemplate?._id === action.payload._id) {
          state.currentTemplate = action.payload;
        }
      })
      .addCase(incrementDownloads.rejected, (state, action) => {
        console.error("Failed to increment downloads:", action.payload);
      });
  },
});

export const { clearError, clearCurrentTemplate, setCurrentPage } =
  templateSlice.actions;
export default templateSlice.reducer;
