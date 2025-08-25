import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getMyProjects
} from "../../api/projectApi";
import api from "../../api/api";


export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProjects();
      if (Array.isArray(response)) return response;
      if (response.projects) return response.projects;
      return [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch projects"
      );
    }
  }
);

export const addProject = createAsyncThunk(
  "projects/addProject",
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await createProject(projectData);
      return response.project;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add project"
      );
    }
  }
);

// 🔹 Edit project
export const editProject = createAsyncThunk(
  "projects/editProject",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await updateProject(id, updates);
      return response.project; // ✅ return the updated project only
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update project"
      );
    }
  }
);

// 🔹 Delete project
export const removeProject = createAsyncThunk(
  "projects/removeProject",
  async (id, { rejectWithValue }) => {
    try {
      await deleteProject(id);
      return id; // ✅ return deleted project ID
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete project"
      );
    }
  }
);
export const fetchMyProjects = createAsyncThunk(
  "projects/fetchMyProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/api/users/projects");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch projects");
    }
  }
);
export const fetchuserProjects = createAsyncThunk(
  "projects/fetchMyProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyProjects();
      return response; // already array of projects
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user projects"
      );
    }
  }
);

const initialState = {
  projects: [],
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Add project
      .addCase(addProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })

      // 🔹 Edit project
      .addCase(editProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.projects[index] = action.payload; // ✅ replaces with updated project
        }
      })
      // 🔹 Fetch only my projects
      .addCase(fetchuserProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchuserProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchuserProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔹 Delete project
      .addCase(removeProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p._id !== action.payload);
      });

},
});

export default projectSlice.reducer;
