import {
  Avatar,
  AvatarGroup,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Card as MuiCard } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { fDate } from "../../../utils/formatTime";
import { stringAvatar } from "../../../utils/nameToLetterAvatar";
import { capitalCase } from "change-case";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import TaskDeleteModal from "./TaskDeleteModal";
import useAuth from "../../../hooks/useAuth";
import TaskViewModal from "./TaskViewModal";
import TaskEditModal from "./TaskEditModal";
import { useDispatch } from "react-redux";
import { getSingleTask } from "../taskSlice";

// import TaskItem from "./TaskItem";

const getStatusStyles = (status) => {
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
function SortableTask({ id, item, dragOverlay }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openTaskDeleteModal, setOpenTaskDeleteModal] = useState(false);
  const [openTaskViewModal, setOpenTaskViewModal] = useState(false);
  const [openEditTaskModal, setOpenEditTaskModal] = useState(false);

  const handleOpenTaskMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseTaskMenu = () => {
    setAnchorEl(null);
  };

  const startDate = item?.startDate ? fDate(item.startDate) : "startDate";
  const dueDate = item?.dueDate ? fDate(item?.dueDate) : "dueDate";
  const title = item?.title ? item.title.toUpperCase() : "Title";

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data: { item } });

  const dispatch = useDispatch();

  const dndKitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 1 : 0.9, // Chỉnh opacity để không bị mờ khi kéo
    border: isDragging ? "1px solid #2ecc71" : "1px solid transparent",
  };

  const HandleOpenTaskDeleteModal = () => {
    setOpenTaskDeleteModal(true);
    setAnchorEl(null);
  };
  const HandleCloseTaskDeleteModal = () => {
    setOpenTaskDeleteModal(false);
  };
  const handleOpenTaskViewModal = () => {
    setOpenTaskViewModal(true);
    setAnchorEl(null);
  };
  const handleCloseTaskViewModal = () => {
    setOpenTaskViewModal(false);
  };
  const handleOpenTaskEditModal = async () => {
    setOpenEditTaskModal(true);
    dispatch(getSingleTask({ id }));
    setAnchorEl(null);
  };
  const handleCloseTaskEditModal = () => {
    setOpenEditTaskModal(false);
  };

  const { user: currentUser } = useAuth();

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorEl)}
      onClose={handleCloseTaskMenu}
    >
      <MenuItem onClick={handleOpenTaskViewModal} sx={{ mx: 1 }}>
        <VisibilityOutlinedIcon sx={{ mr: "5px" }} /> View Task
      </MenuItem>

      {currentUser.role === "manager" ? (
        <MenuItem onClick={() => handleOpenTaskEditModal(id)} sx={{ m: 1 }}>
          <EditOutlinedIcon sx={{ mr: "5px" }} /> Edit Task
        </MenuItem>
      ) : (
        ""
      )}
      {currentUser.role === "manager" ? (
        <MenuItem onClick={HandleOpenTaskDeleteModal} sx={{ m: 1 }}>
          <DeleteForeverOutlinedIcon sx={{ mr: "5px" }} /> Delete Task
        </MenuItem>
      ) : (
        ""
      )}
    </Menu>
  );

  return (
    <MuiCard
      ref={setNodeRef}
      {...attributes}
      style={dndKitCardStyles}
      sx={{
        width: "100%",
        height: "100%",
        boxShadow: "0px 5px 5px 1px rgba(150, 60, 40, 0.9)",
        overflow: "unset",
        border: "2px solid transparent",

        "&:hover": { borderColor: (theme) => theme.palette.primary.main },
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "5px",

          opacity: isDragging ? 0.7 : 1,
        }}
      >
        <Box sx={{ padding: "0" }}>
          <Stack direction="column" sx={{ opacity: isDragging ? 0.7 : 1 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Chip
                label={item?.priority}
                sx={{
                  fontWeight: "bold",
                  width: "80px",
                  height: "25px",
                  fontSize: "12px",
                  ...getStatusStyles(item?.priority),
                }}
              />
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={Boolean(anchorEl) ? "long-menu" : undefined}
                aria-expanded={Boolean(anchorEl) ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleOpenTaskMenu}
              >
                <MoreVertIcon />
              </IconButton>
            </Stack>
            <Stack
              {...listeners}
              sx={{ cursor: dragOverlay ? "grabbing" : "grab" }}
            >
              <Typography
                gutterBottom
                variant="subtitle"
                fontWeight="bold"
                sx={{ color: "black" }}
              >
                {title}
              </Typography>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle1">{startDate}</Typography>
                <Typography variant="subtitle1">{dueDate}</Typography>
              </Stack>
              <AvatarGroup max={5}>
                {item?.assignees.map((assignee) => (
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
                      src={assignee.avartarUrl}
                    />
                  </Tooltip>
                ))}
              </AvatarGroup>
            </Stack>
          </Stack>
        </Box>
        {renderMenu}
      </div>
      <TaskDeleteModal
        taskId={id}
        open={openTaskDeleteModal}
        handleClose={HandleCloseTaskDeleteModal}
      />
      <TaskViewModal
        task={item}
        open={openTaskViewModal}
        handleClose={handleCloseTaskViewModal}
      />
      <TaskEditModal
        task={item}
        open={openEditTaskModal}
        handleClose={handleCloseTaskEditModal}
      />
    </MuiCard>
  );
}

export default SortableTask;
