import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/Users/userSlice";
import projectReducer from "../features/Projects/projectSlice";

const rootReducer = { users: userReducer, projects: projectReducer };

const store = configureStore({
  reducer: rootReducer,
});

export default store;
