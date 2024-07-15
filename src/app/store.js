import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/Users/userSlice";

const rootReducer = { users: userReducer };

const store = configureStore({
  reducer: rootReducer,
});

export default store;
