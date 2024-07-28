import {
  Box,
  Breadcrumbs,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import LoadingScreen from "../../../components/LoadingScreen";
import { Link as RouterLink, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { getTasksByStatus } from "../taskSlice";
import AddTaskIcon from "@mui/icons-material/AddTask";
import useAuth from "../../../hooks/useAuth";
import NewTaskCreateModal from "./NewTaskCreateModal";
import TaskContainerrrrr from "./TaskContainerrrrr";

function TaskDetailPage() {
  const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false);
  const { user: currentUser } = useAuth();
  const params = useParams();
  const { projectId } = params;
  const dispatch = useDispatch();
  const { status, tasksByStatus } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(getTasksByStatus({ projectId }));
  }, [dispatch, projectId]);

  const handleOpenCreateTaskModal = () => {
    setOpenCreateTaskModal(true);
  };
  const handleCloseCreateTaskModal = () => {
    setOpenCreateTaskModal(false);
  };
  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="h5" fontWeight="bold">
        Task Detail
      </Typography>

      <Stack direction="column" spacing={5}>
        <Stack direction="row" spacing={2}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              component={RouterLink}
              underline="hover"
              color="primary"
              to="/"
            >
              Home
            </Link>
            <Link
              component={RouterLink}
              underline="hover"
              color="primary"
              to="/projects"
            >
              Project
            </Link>
            <Link
              component={RouterLink}
              underline="hover"
              color="primary"
              to={-1}
            >
              Task Detail Page
            </Link>
            <Typography color="text.primary">Task Detail Page</Typography>
          </Breadcrumbs>
          <Box flexGrow={1}></Box>
          {/* <Button variant="contained">Add new task</Button> */}
          {currentUser.role === "manager" ? (
            <Tooltip title="Add new Task">
              <IconButton onClick={handleOpenCreateTaskModal}>
                <AddTaskIcon color="primary" />
              </IconButton>
            </Tooltip>
          ) : (
            ""
          )}
        </Stack>
        {status === "loading" ? (
          <LoadingScreen />
        ) : (
          // <TaskContainer tasksByStatus={tasksByStatus} />
          <TaskContainerrrrr tasksByStatus={tasksByStatus} />
        )}
      </Stack>
      <NewTaskCreateModal
        open={openCreateTaskModal}
        handleClose={handleCloseCreateTaskModal}
      />
    </Box>
  );
}

export default TaskDetailPage;
