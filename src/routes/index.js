import React from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashBoard from "../features/DashBoard/DashBoard";

import BlankLayout from "../layouts/BlankLayout";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AuthRequire from "./AuthRequire";
import UsersPage from "../features/Users/UsersPage";
import ProjectsPage from "../features/Projects/ProjectsPage";

import ProjectDetailPage from "../features/Projects/ProjectDetailPage";
import TaskDetailPage from "../features/Tasks/TaskDetail/TaskDetailPage";
import ProfileSettingPage from "../features/Me Setting/ProfileSettingPage";

function Router() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthRequire>
            <MainLayout />
          </AuthRequire>
        }
      >
        <Route index element={<DashBoard />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="projects/:projectId/task" element={<TaskDetailPage />} />
        <Route path="me/profile" element={<ProfileSettingPage />} />
      </Route>
      {/* /// */}
      <Route element={<BlankLayout />}>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
}

export default Router;
