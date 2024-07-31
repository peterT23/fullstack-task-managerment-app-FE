import apiService from "../../app/apiService";
import { toast } from "react-toastify";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { cloudinaryFileUpload } from "../../utils/cloudinaryFile";

const initialState = {
  status: "idle",
  error: null,
  currentPageComments: [],
  commentsById: {},
};

export const getCommentsOfTask = createAsyncThunk(
  "comments/getCommentsOfTask",
  async ({ taskId, page = 1, limit = 1000 }, thunkAPI) => {
    try {
      const res = await apiService.get(`/tasks/${taskId}/comments`, {
        params: {
          page,
          limit,
        },
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createNewComment = createAsyncThunk(
  "comments/createNewComment",
  async ({ taskId, comment, referenceDocument, documentType }, thunkAPI) => {
    try {
      //upload referenceDocument to cloudinary
      const referenceDocumentUrl = await cloudinaryFileUpload(
        referenceDocument
      );

      const res = await apiService.post("/comments", {
        taskId,
        content: comment,
        referenceDocument: referenceDocumentUrl,
        documentType,
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const deleteSingleComment = createAsyncThunk(
  "comments/deleteSingleComment",
  async ({ commentId, taskId }, thunkAPI) => {
    try {
      const res = await apiService.delete(`/comments/${commentId}`, { taskId });
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
        state.currentPageComments.push(comment._id);
        state.commentsById[comment._id] = comment;

        toast("Create comment successfully");
      })
      .addCase(createNewComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        toast.error(action.error.message);
      });
    builder
      .addCase(getCommentsOfTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCommentsOfTask.fulfilled, (state, action) => {
        state.status = "succeded";
        state.error = "";
        const { comments, count, totalPages } = action.payload.data;
        comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        comments.forEach((comment) => {
          state.commentsById[comment._id] = comment;
          if (!state.currentPageComments.includes(comment._id))
            state.currentPageComments.push(comment._id);
        });
        state.currentPageComments = comments.map((comment) => comment._id);

        state.totalComments = count;
        state.totalPages = totalPages;
      })
      .addCase(getCommentsOfTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        toast.error(action.error.message);
      });
    builder
      .addCase(deleteSingleComment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteSingleComment.fulfilled, (state, action) => {
        state.status = "succeded";
        state.error = "";
        const { comment } = action.payload.data;
        state.currentPageComments = state.currentPageComments.filter(
          (commentId) => commentId !== comment._id
        );
        delete state.commentsById[comment._id];
        toast("Delete comment successfully");
      })
      .addCase(deleteSingleComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        toast.error(action.error.message);
      });
  },
});
export default commentSlice.reducer;
