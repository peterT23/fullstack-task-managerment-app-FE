import apiService from "../../app/apiService";
import { toast } from "react-toastify";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  error: null,
  currentPageComments: [],
  commentsById: {},
};

export const createNewComment = createAsyncThunk(
  "comments/createNewComment",
  async ({ taskId, comment }, thunkAPI) => {
    try {
      const res = await apiService.post("/comments", {
        taskId,
        content: comment,
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewComment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createNewComment.fulfilled, (state, action) => {
        state.status = "succeded";
        state.error = "";
        const { comment } = action.payload.data;
        console.log("comment", comment);
        toast("Create comment successfully");
      })
      .addCase(createNewComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        toast.error(action.error.message);
      });
  },
});
export default commentSlice.reducer;
