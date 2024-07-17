import {
  Avatar,
  AvatarGroup,
  Chip,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { capitalCase } from "change-case";
import React from "react";
import { fDate } from "../../utils/formatTime";
import { useNavigate } from "react-router-dom";
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
function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  const nameParts = name.split(" ");
  const initials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[1][0]}`
      : `${nameParts[0][0]}`;
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: initials,
  };
}

function ProjectDisplayCard({ project }) {
  const duedate = fDate(project.dueDate);
  const navigate = useNavigate();
  const handleViewProject = () => {
    navigate(`/projects/${project._id}`);
  };
  return (
    <>
      <Paper
        key={project.id}
        sx={{
          p: "0.5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "start",
        }}
        elevation={3}
      >
        <Stack
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Tooltip title="View Project">
            <Chip
              onClick={handleViewProject}
              label={capitalCase(project?.title)}
              color="primary"
              sx={{
                width: "100%",
                fontWeight: "bold",
                "&:hover": { cursor: "pointer" },
              }}
            />
          </Tooltip>
        </Stack>
        <Stack
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        ></Stack>
        <Typography variant="body1">Due date: {duedate}</Typography>
        <Typography variant="string" color="text.secondary">
          {project.description}
        </Typography>

        <Typography variant="string">Members</Typography>
        <AvatarGroup max={5}>
          {project.assignees.map((assignee) => (
            <Tooltip
              title={`${
                assignee.name ? capitalCase(assignee.name) : "Unknown"
              }- ${assignee.role}`}
              key={assignee._id}
            >
              <Avatar
                {...stringAvatar(
                  assignee.name ? capitalCase(assignee.name) : "Unknown"
                )}
                src={assignee.avartarUrl}
              />
            </Tooltip>
          ))}
        </AvatarGroup>

        <Paper sx={{ width: "100%", height: "50px" }} elevation={5}>
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              height: "50px",
              p: "5px",
            }}
            spacing={1}
          >
            <Stack
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: "5px",
              }}
            >
              <Typography variant="string">{project.taskCount}</Typography>
              <Typography variant="string" color="text.secondary">
                Tasks
              </Typography>
            </Stack>
            <Chip
              label={capitalCase(project?.status)}
              sx={{
                fontWeight: "bold",

                fontSize: "10px",

                ...getStatusStyles(project?.status),
              }}
            />
          </Stack>
        </Paper>
      </Paper>
    </>
  );
}

export default ProjectDisplayCard;
