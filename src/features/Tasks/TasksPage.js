import React, { useEffect, useState } from "react";

import {
  Avatar,
  AvatarGroup,
  Box,
  Breadcrumbs,
  Chip,
  Container,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { fDate } from "../../utils/formatTime";

import { DataGrid } from "@mui/x-data-grid";
import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { stringAvatar } from "../../utils/nameToLetterAvatar";
import { capitalCase } from "change-case";
import { useDispatch, useSelector } from "react-redux";
import { getTasksAsync } from "./taskSlice";
import useAuth from "../../hooks/useAuth";
import TaskDeleteModal from "./TaskDetail/TaskDeleteModal";

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

const getPriorityStyles = (status) => {
  switch (status) {
    case "medium":
      return {
        color: "#FFA200",
      };
    case "high":
      return {
        color: "#FF0080",
      };
    default:
      return {
        color: "#00C421",
      };
  }
};

function TasksPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const filterName = searchParams.get("filterName") || "";

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [selectedTaskId, setSelectedTaskId] = useState("");

  const navigate = useNavigate();

  const { user: currentUser } = useAuth();

  useEffect(() => {
    dispatch(
      getTasksAsync({
        page: 1,
        limit: 1000,
        filterName,
      })
    );
  }, [filterName, dispatch]);

  const { currentPageTasks, tasksById, totalTasks } = useSelector(
    (state) => state.tasks
  );

  const tasks = currentPageTasks.map((taskId) => tasksById[taskId]);

  const handleOpenDeleteModal = (id) => {
    // handle delete logic
    setSelectedTaskId(id);
    setOpenDeleteModal(true);
  };
  const handleCloseDeleteModal = (id) => {
    // handle delete logic
    setOpenDeleteModal(false);
    // selectedTaskId("");
  };

  const handleClickView = (id) => {
    navigate(`/projects/${id}/task`);
  };

  const rows = tasks.map((task) => ({
    id: task._id,
    task: task,
    project: task?.projectId?.title,
    assignees: task?.assignees,
    status: task?.status,
    priority: task?.priority,
    startDate: fDate(task?.startDate),
    dueDate: fDate(task?.dueDate),
  }));

  const columnArr = [
    {
      field: "task",
      headerName: "TASK",
      flex: 1,
      minWidth: 120,
      renderCell: ({ value }) => (
        <Chip
          onClick={() => handleClickView(value?.projectId._id)}
          label={capitalCase(value?.title)}
          color="primary"
          sx={{
            width: "100%",
            fontWeight: "bold",
            "&:hover": { cursor: "pointer" },
          }}
        />
      ),
    },
    {
      field: "project",
      headerName: "PROJECT",
      flex: 1.2,
      minWidth: 120,
      renderCell: ({ value }) => (
        <Typography
          fontWeight="bold"
          height="100%"
          sx={{ display: "flex", alignItems: "center" }}
        >
          {value}
        </Typography>
      ),
    },
    {
      field: "assignees",
      headerName: "ASSIGNEES",
      flex: 1.2,
      minWidth: 100,
      renderCell: ({ value }) => (
        <AvatarGroup max={6} sx={{ display: "flex", justifyContent: "start" }}>
          {value.map((assignee) => (
            <Tooltip
              title={`${
                assignee.name ? assignee.name.toUpperCase() : "Unknown"
              }- ${assignee?.role}`}
              key={assignee?._id}
            >
              <Avatar
                {...stringAvatar(
                  assignee.name ? capitalCase(assignee?.name) : "Unknown"
                )}
                src={assignee.avatarUrl}
              />
            </Tooltip>
          ))}
        </AvatarGroup>
      ),
    },
    { field: "startDate", headerName: "START DATE", flex: 1, minWidth: 80 },
    { field: "dueDate", headerName: "DUE DATE", flex: 1, minWidth: 80 },
    {
      field: "status",
      headerName: "STATUS",
      flex: 1,
      minWidth: 120,
      renderCell: ({ value }) => (
        <Chip
          label={capitalCase(value)}
          sx={{
            fontWeight: "bold",
            fontSize: "10px",
            ...getStatusStyles(value),
          }}
        />
      ),
    },
    {
      field: "priority",
      headerName: "PRIORITY",
      flex: 1,
      minWidth: 80,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          sx={{
            fontWeight: "bold",
            width: "80px",
            height: "25px",
            fontSize: "12px",
            ...getPriorityStyles(value),
          }}
        />
      ),
    },
    {
      field: "id",
      headerName: " Delete ",
      minWidth: 120,
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            sx={{ color: "red" }}
            onClick={() => handleOpenDeleteModal(value)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const columns =
    currentUser.role === "manager"
      ? columnArr
      : columnArr.slice(0, columnArr.length - 1);

  return (
    <Container maxWidth="lg" sx={{ pb: 3 }}>
      <Typography variant="h5" fontWeight="bold">
        Projects
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: "50px" }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link component={RouterLink} underline="hover" color="primary" to="/">
            Home
          </Link>
          <Typography color="text.primary">Tasks</Typography>
        </Breadcrumbs>
      </Stack>
      <Typography
        variant="subtitle"
        sx={{ color: "text.secondary", ml: 1, mb: "100px" }}
      >
        {totalTasks > 1
          ? `${totalTasks} Tasks found`
          : totalTasks === 1
          ? `${totalTasks} Task found`
          : "No Tasks found"}
      </Typography>
      <Box
        component="div"
        sx={{
          overflowX: "auto",
          width: {
            xs: "310px",
            sm: "550px",
            md: "780px",
            lg: "1000px",
            xl: "1500px",
          },
          height: 800,
        }}
      >
        <DataGrid
          sx={{ width: "1600px" }}
          rows={rows}
          columns={columns}
          pagination
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25, page: 0 },
            },
          }}
        />
      </Box>
      <TaskDeleteModal
        open={openDeleteModal}
        handleClose={handleCloseDeleteModal}
        taskId={selectedTaskId}
      />
    </Container>
  );
}

export default TasksPage;
