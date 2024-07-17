import React from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashBoard from "../features/DashBoard/DashBoard";
import UserProfilePage from "../pages/UserProfilePage";
import BlankLayout from "../layouts/BlankLayout";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AuthRequire from "./AuthRequire";
import UsersPage from "../features/Users/UsersPage";
import ProjectsPage from "../features/Projects/ProjectsPage";
import TasksPage from "../features/Tasks/TasksPage";
import ProfileSettingPage from "../pages/ProfileSettingPage";
import ProjectDetailPage from "../features/Projects/ProjectDetailPage";

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
        <Route path="Tasks" element={<TasksPage />} />
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
