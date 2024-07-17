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
import React from "react";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import { fDate } from "../../utils/formatTime";
import { capitalCase } from "change-case";
import useAuth from "../../hooks/useAuth";

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
function ProjectDetailPageNameCard({ currentProject }) {
  const theme = useTheme();
  const startDate = fDate(currentProject.startDate);
  const dueDate = fDate(currentProject.dueDate);

  const { user: currentUser } = useAuth();
  const members = currentProject.assignees.length;
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
              label={capitalCase(currentProject?.status)}
              sx={{
                fontWeight: "bold",

                fontSize: "10px",

                ...getStatusStyles(currentProject?.status),
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
        <Typography textAlign="center">{currentProject.description}</Typography>
      </Stack>
    </Paper>
  );
}

export default ProjectDetailPageNameCard;
