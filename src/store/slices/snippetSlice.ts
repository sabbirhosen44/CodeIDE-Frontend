import type { SnippetState } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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
  async () => {}
);

// get user snippets
export const getUserSnippets = createAsyncThunk(
  "snippet/getUserSnippets",
  async () => {}
);

// get all snippets
export const getSnippets = createAsyncThunk(
  "snippet/getSnippets",
  async () => {}
);

// get single snippet
export const getSnippet = createAsyncThunk(
  "snippet/getSnippet",
  async () => {}
);

// Toggle like snippet
export const toggleLikeSnippet = createAsyncThunk(
  "snippet/toggleLikeSnippet",
  async () => {}
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
  async () => {}
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
  extraReducers: (builder) => {},
});

export const { clearError, clearCurrentSnippet } = snippetSlice.actions;
export default snippetSlice.reducer;
