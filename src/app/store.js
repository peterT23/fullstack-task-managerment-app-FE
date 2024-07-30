import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/Users/userSlice";
import projectReducer from "../features/Projects/projectSlice";
import taskReducer from "../features/Tasks/taskSlice";
import commentReducer from "../../src/features/Comment/commentSlice";
import meReducer from "../../src/features/Me Setting/meSlice";
const rootReducer = {
  users: userReducer,
  projects: projectReducer,
  tasks: taskReducer,
  comments: commentReducer,
  me: meReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
