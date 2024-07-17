import apiService from "../../app/apiService";
import { toast } from "react-toastify";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  error: null,
  currentPageProjects: [],
  projectsById: {},
  totalPages: 1,
};

export const getProjects = createAsyncThunk(
  "projecs/getProjects",
  async ({ page = 1, limit = 10, filterName, filterStatus }, thunkAPI) => {
    try {
      const res = await apiService.get("/projects", {
        params: {
          page,
          limit,
          title: filterName,
          status: filterStatus,
        },
      });

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const createProject = createAsyncThunk(
  "projecs/createProject",
  async ({ title, description, dueDate, assignees }, thunkAPI) => {
    try {
      const res = await apiService.post("/projects", {
        title,
        description,
        dueDate,
        assignees,
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProjects.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.status = "succeded";
        state.error = "";

        const { projects, count, totalPages } = action.payload.data;

        projects.forEach((project) => {
          state.projectsById[project._id] = project;

          if (!state.currentPageProjects.includes(project._id))
            state.currentPageProjects.push(project._id);
        });
        state.currentPageProjects = projects.map((project) => project._id);
        state.totalProjects = count;
        state.totalPages = totalPages;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        toast.error(action.error.message);
      });
    builder
      .addCase(createProject.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.status = "succeded";
        state.error = "";
        const { project } = action.payload.data;
        state.currentPageProjects.pop();
        state.currentPageProjects.unshift(project._id);
        state.projectsById[project._id] = project;
        toast("Create project successfully");
      })
      .addCase(createProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default projectSlice.reducer;
