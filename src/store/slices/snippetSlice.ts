import type { SnippetState } from "@/types";
import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
  PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { error } from "console";

const API = import.meta.env.VITE_API_URL;

const initialState: SnippetState = {
  snippets: [],
  currentSnippet: null,
  isLoading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  totalCount: 0,
};

// create snippet
export const createSnippet = createAsyncThunk(
  "snippet/createSnippet",
  async (
    snippetData: {
      title: string;
      description: string;
      tags: string[];
      code: string;
      language: string;
      author: {
        _id: string;
        name: string;
        email: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No authentication token");
      }

      console.log(snippetData);

      const response = await axios.post(`${API}/snippets`, snippetData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create snippet"
      );
    }
  }
);

// get user snippets
export const getUserSnippets = createAsyncThunk(
  "snippet/getUserSnippets",
  async () => {}
);

// get all snippets
export const getSnippets = createAsyncThunk(
  "snippet/getAlSnippets",
  async (
    params: {
      language?: string;
      tags?: string;
      search?: string;
      sortBy?: string;
      page?: number;
      limit?: number;
    },
    { rejectWithValue }
  ) => {
    const queryParams = new URLSearchParams();

    if (params.language) queryParams.append("language", params.language);
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    try {
      const response = await axios.get(
        `${API}/snippets/?${queryParams.toString()}`
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create snippet"
      );
    }
  }
);

// get single snippet
export const getSnippet = createAsyncThunk(
  "snippet/getSnippet",
  async (snippetId: string, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.get(`${API}/snippets/${snippetId}`, {
        headers,
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch snippet data"
      );
    }
  }
);

// Toggle like snippet
export const toggleLikeSnippet = createAsyncThunk(
  "snippet/toggleLikeSnippet",
  async (snippetId: string, { rejectWithValue }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return rejectWithValue("No authentication token");
    }

    try {
      const response = await axios.post(
        `${API}/snippets/${snippetId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to like snippet"
      );
    }
  }
);

// Update snippet
export const updateSnippet = createAsyncThunk(
  "snippet/updateSnippet",
  async () => {}
);

// Delete snippet
export const deleteSnippet = createAsyncThunk(
  "snippet/deleteSnippet",
  async () => {}
);

// Add comment to snippet
export const addComment = createAsyncThunk(
  "snippet/addComment",
  async (
    { snippetID, content }: { snippetID: string; content: string },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No authentication token");
    }

    try {
      const response = await axios.post(
        `${API}/snippets/${snippetID}/comments`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data.data);

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add comment"
      );
    }
  }
);

// Delete comment
export const deleteComment = createAsyncThunk(
  "snippet/deleteComment",
  async () => {}
);

const snippetSlice = createSlice({
  name: "snippet",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentSnippet: (state) => {
      state.currentSnippet = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSnippet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSnippet.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.snippets.push(action.payload);
      })
      .addCase(createSnippet.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get All Snippets
      .addCase(getSnippets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSnippets.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.snippets = action.payload.data;
      })
      .addCase(getSnippets.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // get single snippet details
      .addCase(getSnippet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSnippet.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.currentSnippet = action.payload;
      })
      .addCase(getSnippet.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // toggle like snippet
      .addCase(toggleLikeSnippet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        toggleLikeSnippet.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          const { snippetId, isLiked, likeCount } = action.payload;

          if (state.currentSnippet && state.currentSnippet?._id === snippetId) {
            state.currentSnippet.likeCount = likeCount;
            state.currentSnippet.isLiked = isLiked;
          }
        }
      )
      .addCase(
        toggleLikeSnippet.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      )
      .addCase(addComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;

        if (
          state.currentSnippet &&
          state.currentSnippet._id.toString() ===
            action.payload.snippet.toString()
        ) {
          if (!state.currentSnippet.comments) {
            state.currentSnippet.comments = [];
          }
          state.currentSnippet.comments.push(action.payload);
        }
      })
      .addCase(addComment.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentSnippet } = snippetSlice.actions;
export default snippetSlice.reducer;
