import apiService from "../../app/apiService";
import { toast } from "react-toastify";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  error: null,
  tasksByStatus: {},
  activeId: null,
  isDragging: false,
  currentPageTasks: [],
  tasksById: {},
  totalPages: 1,
  selectedTask: null,
};

export const getTasksByStatus = createAsyncThunk(
  "tasks/getTasksByStatus",
  async ({ projectId }, thunkAPI) => {
    try {
      const res = await apiService.get(`/projects/${projectId}/tasks/status`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateAsyncTaskStatusAndOrder = createAsyncThunk(
  "tasks/updateTaskStatusAndOrder",
  async ({ projectId, updatedTasks }, thunkAPI) => {
    try {
      const res = await apiService.put(`/projects/${projectId}/tasks/reorder`, {
        updatedTasks,
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createTaskAsync = createAsyncThunk(
  "tasks/createTask",
  async (
    { projectId, title, description, dueDate, startDate, assignees, priority },
    thunkAPI
  ) => {
    try {
      const res = await apiService.post("/tasks", {
        projectId,
        title,
        description,
        dueDate,
        startDate,
        assignees,
        priority,
      });
      return res.data;
    } catch (error) {
      toast.error(error.message);

      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const deleteAsyncSingleTask = createAsyncThunk(
  "tasks/deleteAsyncSingleTask",
  async ({ taskId }, thunkAPI) => {
    try {
      const res = await apiService.delete(`/tasks/${taskId}`);
      return res.data;
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getSingleTaskAsync = createAsyncThunk(
  "tasks/getSingleTask",
  async ({ taskId }, thunkAPI) => {
    try {
      const res = await apiService.get(`/tasks/${taskId}`);
      return res.data;
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const editTaskAsync = createAsyncThunk(
  "tasks/editTaskAsync",
  async (
    { taskId, title, description, dueDate, assignees, priority, startDate },
    thunkAPI
  ) => {
    try {
      const res = await apiService.put(`/tasks/${taskId}`, {
        title,
        description,
        dueDate,
        assignees,
        priority,
        startDate,
      });
      return res.data;
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getTasksAsync = createAsyncThunk(
  "tasks/getTasksAsync",
  async ({ page = 1, limit = 10, filterName }, thunkAPI) => {
    try {
      const res = await apiService.get(`/tasks`, {
        params: {
          page,
          limit,
          title: filterName,
        },
      });
      return res.data;
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setDraggingState: (state, action) => {
      state.activeId = action.payload.activeId;
      state.isDragging = true;
    },
    resetDraggingState: (state) => {
      state.activeId = null;
      state.isDragging = false;
    },
    updateTaskStatusAndOrder: (state, action) => {
      state.tasksByStatus = action.payload;
    },
    getSingleTask: (state, action) => {},
    deleteSingleTask: (state, action) => {
      const { taskId } = action.payload;
      Object.keys(state.tasksByStatus).forEach((status) => {
        state.tasksByStatus[status] = state.tasksByStatus[status].filter(
          (task) => taskId !== task._id
        );
        // Cập nhật lại thứ tự các task sau khi xoá

        state.tasksByStatus[status].forEach((task, index) => {
          task.order = index + 1;
        });
      });

      state.currentPageTasks = state.currentPageTasks.filter(
        (id) => taskId !== id
      );

      delete state.tasksById[taskId];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasksAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTasksAsync.fulfilled, (state, action) => {
        state.status = "succeded";
        state.error = "";

        const { tasks, count, totalPages } = action.payload.data;

        tasks.forEach((task) => {
          state.tasksById[task._id] = task;

          if (!state.currentPageTasks.includes(task._id))
            state.currentPageTasks.push(task._id);
        });
        state.currentPageTasks = tasks.map((task) => task._id);
        state.totalTasks = count;
        state.totalPages = totalPages;
      })
      .addCase(getTasksAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        toast.error(action.error.message);
      });
    builder
      .addCase(getTasksByStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTasksByStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = "";
        const { tasksByStatus } = action.payload.data;
        state.tasksByStatus = tasksByStatus;
      })
      .addCase(getTasksByStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        toast.error(action.error.message);
      });

    // builder
    //   .addCase(updateAsyncTaskStatusAndOrder.pending, (state) => {
    //     state.status = "loading";
    //   })
    //   .addCase(updateAsyncTaskStatusAndOrder.fulfilled, (state, action) => {
    //     state.status = "succeeded";
    //     state.error = "";
    //     const { tasksByStatus, updatedTasks } = action.payload.data;
    //     console.log("updatedTasks", updatedTasks);
    //   })
    //   .addCase(updateAsyncTaskStatusAndOrder.rejected, (state, action) => {
    //     state.status = "failed";
    //     state.error = action.error.message;
    //     toast.error(action.error.message);
    //   });

    builder
      .addCase(createTaskAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createTaskAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = "";
        const { task } = action.payload.data;
        console.log("task", task);
        state.tasksByStatus.pending.push(task);
        toast("Create Task successfully");
      })
      .addCase(createTaskAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        toast.error(action.error.message);
      });
    builder
      .addCase(getSingleTaskAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSingleTaskAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = "";
        const { task } = action.payload.data;
        state.selectedTask = task;
        console.log("task", task);
      })
      .addCase(getSingleTaskAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        toast.error(action.error.message);
      });
    builder
      .addCase(editTaskAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editTaskAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = "";
        const { task } = action.payload.data;
        const status = task.status;
        const index = state.tasksByStatus[status].findIndex(
          (tas) => tas._id === task._id
        );
        state.tasksByStatus[status][index] = task;
      })
      .addCase(editTaskAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        toast.error(action.error.message);
      });
  },
});

export const {
  setDraggingState,
  resetDraggingState,
  updateTaskStatusAndOrder,
  getSingleTask,
  deleteSingleTask,
} = taskSlice.actions;

export default taskSlice.reducer;
