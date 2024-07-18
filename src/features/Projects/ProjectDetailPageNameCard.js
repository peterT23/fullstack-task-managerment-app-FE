import { useTheme } from "@mui/material/styles";
import {
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import { fDate } from "../../utils/formatTime";
import { capitalCase } from "change-case";
import useAuth from "../../hooks/useAuth";
import ProjectEditModal from "./ProjectEditModal";
import { useSelector } from "react-redux";
import ProjectDeleteModal from "./ProjectDeleteModal";

const getStatusStyles = (status) => {
  switch (status) {
    case "archive":
      return {
        backgroundColor: "orange",
        color: "white",
      };
    case "ongoing":
      return {
        backgroundColor: "blue",
        color: "white",
      };
    case "review":
      return {
        backgroundColor: "purple",
        color: "white",
      };
    case "done":
      return {
        backgroundColor: "green",
        color: "white",
      };
    case "pending":
      return {
        backgroundColor: "grey",
        color: "white",
      };
    default:
      return {
        backgroundColor: "grey",
        color: "white",
      };
  }
};
function ProjectDetailPageNameCard() {
  const theme = useTheme();
  const { user: currentUser } = useAuth();
  const [openProjectEditModal, setOpenProjectEditModal] = useState(false);
  const [openProjectDeleteModal, setOpenProjectDeleteModal] = useState(false);
  const { selectedProject: currentProject } = useSelector(
    (state) => state.projects
  );

  // Kiểm tra xem currentProject có giá trị không
  if (!currentProject) {
    return null; // Hoặc bạn có thể hiển thị một thông báo lỗi hoặc loading state nào đó
  }
  const startDate = currentProject.startDate
    ? fDate(currentProject.startDate)
    : "N/A";
  const dueDate = currentProject.dueDate
    ? fDate(currentProject.dueDate)
    : "N/A";

  const members = currentProject.assignees.length || 0;

  const handleOpenEditModal = () => {
    setOpenProjectEditModal(true);
  };
  const handleCloseEditModal = () => {
    setOpenProjectEditModal(false);
  };

  const handleOpenProjectDeleteModal = () => {
    setOpenProjectDeleteModal(true);
  };
  const handleCloseProjectDeleteModal = () => {
    setOpenProjectDeleteModal(false);
  };
  return (
    <Paper
      elevation={10}
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: "white",
        p: "12px",
      }}
    >
      <Stack direction="column" justifyContent="center" alignItems="center">
        <Stack
          direction="row"
          spacing={5}
          flexWrap="wrap"
          justifyContent="space-evenly"
          alignItems="center"
          sx={{ width: { xs: 260, sm: "100%" } }}
        >
          <Typography variant="h5">{currentProject.title}</Typography>

          <Stack direction="row" justifyContent="space-between">
            <Stack
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100px",
                padding: "10px",
              }}
            >
              <Typography variant="subtitle1">Start Date:</Typography>
              <Typography variant="subtitle1">{startDate}</Typography>
            </Stack>
            <Stack
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100px",
                padding: "10px",
              }}
            >
              <Typography variant="subtitle1">Due Date:</Typography>
              <Typography variant="subtitle1">{dueDate}</Typography>
            </Stack>
          </Stack>
          <Stack
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle1">Total Members:</Typography>
            <Typography variant="subtitle1">{members}</Typography>
          </Stack>
          <Stack
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Chip
              label={capitalCase(currentProject.status)}
              sx={{
                fontWeight: "bold",

                fontSize: "10px",

                ...getStatusStyles(currentProject.status),
              }}
            />
          </Stack>
          {currentUser.role === "manager" ? (
            <Stack direction="row">
              <Stack
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Tooltip title="Edit project">
                  <Button
                    onClick={handleOpenEditModal}
                    sx={{
                      width: "30px",
                      height: "40px",
                      backgroundColor: "white",
                      "&:hover": { backgroundColor: "#c6c7c8" },
                      m: "5px",
                    }}
                  >
                    <EditCalendarOutlinedIcon />
                  </Button>
                </Tooltip>
              </Stack>
              <Stack
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Tooltip title="Delete project">
                  <Button
                    onClick={handleOpenProjectDeleteModal}
                    sx={{
                      width: "30px",
                      height: "40px",
                      m: "5px",
                      backgroundColor: "white",
                      "&:hover": { backgroundColor: "#c6c7c8" },
                    }}
                  >
                    <DeleteSweepOutlinedIcon />
                  </Button>
                </Tooltip>
              </Stack>
            </Stack>
          ) : (
            ""
          )}
        </Stack>
        <Divider sx={{ color: "white" }}>
          <Typography variant="h6"> Project Description</Typography>
        </Divider>
        <Typography textAlign="center">
          {currentProject?.description}
        </Typography>
      </Stack>
      <ProjectEditModal
        currentProject={currentProject}
        handleCloseEditModal={handleCloseEditModal}
        openProjectEditModal={openProjectEditModal}
      />
      <ProjectDeleteModal
        openProjectDeleteModal={openProjectDeleteModal}
        handleClose={handleCloseProjectDeleteModal}
      />
    </Paper>
  );
}

export default ProjectDetailPageNameCard;
