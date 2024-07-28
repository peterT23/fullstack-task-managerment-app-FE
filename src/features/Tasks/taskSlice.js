// import apiService from "../../app/apiService";

// import { toast } from "react-toastify";
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   status: "idle",
//   error: null,
//   tasksByStatus: {},
// };

// export const getTasksByStatus = createAsyncThunk(
//   "tasks/getTasksByStatus",
//   async ({ projectId }, thunkAPI) => {
//     try {
//       const res = await apiService.get(`/projects/${projectId}/tasks/status`);
//       return res.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error);
//     }
//   }
// );
// export const updateTaskStatusAndOrder = createAsyncThunk(
//   "tasks/updateTaskStatusAndOrder",
//   async ({ projectId, updatedTasks }, thunkAPI) => {
//     try {
//       const res = await apiService.put(`/projects/${projectId}/tasks/reorder`, {
//         updatedTasks,
//       });
//       return res.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error);
//     }
//   }
// );

// export const createTask = createAsyncThunk(
//   "tasks/createTask",
//   async (
//     { projectId, title, description, dueDate, startDate, assignees, priority },
//     thunkAPI
//   ) => {
//     try {
//       const res = await apiService.post("/tasks", {
//         projectId,
//         title,
//         description,
//         dueDate,
//         startDate,
//         assignees,
//         priority,
//       });
//       return res.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error);
//     }
//   }
// );

// export const taskSlice = createSlice({
//   name: "task",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(getTasksByStatus.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(getTasksByStatus.fulfilled, (state, action) => {
//         state.status = "succeded";
//         state.error = "";
//         const { tasksByStatus } = action.payload.data;
//         state.tasksByStatus = tasksByStatus;
//       })
//       .addCase(getTasksByStatus.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//         toast.error(action.error.message);
//       });
//     // builder
//     //   .addCase(updateTaskStatusAndOrder.pending, (state) => {
//     //     state.status = "loading";
//     //   })
//     //   .addCase(updateTaskStatusAndOrder.fulfilled, (state, action) => {
//     //     state.status = "succeded";
//     //     state.error = "";
//     //     const { tasksByStatus } = action.payload.data;

//     //     // state.tasksByStatus = tasksByStatus;
//     //   })
//     //   .addCase(updateTaskStatusAndOrder.rejected, (state, action) => {
//     //     state.status = "failed";
//     //     state.error = action.error.message;
//     //     toast.error(action.error.message);
//     //   });
//     builder
//       .addCase(createTask.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(createTask.fulfilled, (state, action) => {
//         state.status = "succeded";
//         state.error = "";
//         const { task } = action.payload.data;

//         state.tasksByStatus.pending.push(task);
//       })
//       .addCase(createTask.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//         toast.error(action.error.message);
//       });
//   },
// });

// export default taskSlice.reducer;

import apiService from "../../app/apiService";
import { toast } from "react-toastify";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  error: null,
  tasksByStatus: {},
  activeId: null,
  isDragging: false,
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
    // addNewTask: (state, action) => {
    //   const { data } = action.payload;
    //   console.log("data", data);
    //   state.tasksByStatus.pending.push(data);
    // },
  },
  extraReducers: (builder) => {
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
      })
      .addCase(createTaskAsync.rejected, (state, action) => {
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
  addNewTask,
} = taskSlice.actions;

export default taskSlice.reducer;
