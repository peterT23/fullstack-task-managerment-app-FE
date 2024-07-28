import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/Users/userSlice";
import projectReducer from "../features/Projects/projectSlice";
import taskReducer from "../features/Tasks/taskSlice";

const rootReducer = {
  users: userReducer,
  projects: projectReducer,
  tasks: taskReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
