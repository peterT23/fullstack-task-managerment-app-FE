import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";

const initialState = {
  status: "idle",
  error: null,
  currentPageUsers: [],
  usersById: {},
  totalPages: 1,
};

export const getUsers = createAsyncThunk(
  "users/getUsers",
  async ({ page = 1, limit = 5, filterName }, thunkAPI) => {
    try {
      const res = await apiService.get("/users", {
        params: {
          page,
          limit,
          name: filterName,
        },
      });

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const getSingleUser = createAsyncThunk(
  "users/getSingleUser",
  async ({ id }, thunkAPI) => {
    try {
      const res = await apiService.get(`/users/${id}`);

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteSingleUser = createAsyncThunk(
  "users/deleteSingleUser",
  async ({ id }, thunkAPI) => {
    try {
      const res = await apiService.delete(`/users/${id}`);
      return res.data;
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const createMemberAccount = createAsyncThunk(
  "users/createMemberAccount",
  async ({ name, email, role, password }, thunkAPI) => {
    try {
      const res = await apiService.post("/users/member", {
        name,
        email,
        password,
        role,
      });

      return res.data;
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.status = "succeded";
        state.error = "";

        const { users, count, totalPages } = action.payload.data;
        users.forEach((user) => {
          state.usersById[user._id] = user;
          if (!state.currentPageUsers.includes(user._id))
            state.currentPageUsers.push(user._id);
        });
        state.currentPageUsers = users.map((user) => user._id);

        state.totalUsers = count;
        state.totalPages = totalPages;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        toast.error(action.error.message);
      });
    builder
      .addCase(deleteSingleUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteSingleUser.fulfilled, (state, action) => {
        state.status = "succeded";
        state.error = "";
        const { _id } = action.payload.data;
        state.currentPageUsers = state.currentPageUsers.filter(
          (userId) => userId !== _id
        );
        delete state.usersById[_id];
        toast("Delete member successfully");
      })
      .addCase(deleteSingleUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        // toast.error(action.error.message);
      });
    builder
      .addCase(createMemberAccount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createMemberAccount.fulfilled, (state, action) => {
        state.status = "succeded";
        state.error = "";
        const { user } = action.payload.data;
        state.currentPageUsers.pop();
        state.currentPageUsers.unshift(user._id);
        state.usersById[user._id] = user;

        toast("Create member successfully");
      })
      .addCase(createMemberAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
