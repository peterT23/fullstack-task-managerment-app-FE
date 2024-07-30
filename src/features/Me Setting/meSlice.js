import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";
import { cloudinaryUpload } from "../../utils/cloudinary";

const initialState = {
  status: "idle",
  error: null,
  updatedProfile: null,
};

export const updateMeProfile = createAsyncThunk(
  "users/updateMeProfile",
  async (
    {
      userId,
      facebookLink,
      linkedinLink,
      twitterLink,
      name,
      avatarUrl,
      phone,
      languages,
      description,
      jobTitle,
    },
    thunkAPI
  ) => {
    try {
      const avatarURL = await cloudinaryUpload(avatarUrl);

      const res = await apiService.put(`/me/${userId}`, {
        facebookLink,
        linkedinLink,
        twitterLink,
        name,
        avatarUrl: avatarURL,
        phone,
        languages,
        description,
        jobTitle,
      });

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const meSlice = createSlice({
  name: "me",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateMeProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateMeProfile.fulfilled, (state, action) => {
        state.status = "succeded";
        state.error = "";
        state.updatedProfile = action.payload;
        toast("Update profile successfully");
      })
      .addCase(updateMeProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        toast.error(action.error.message);
      });
  },
});

export default meSlice.reducer;
