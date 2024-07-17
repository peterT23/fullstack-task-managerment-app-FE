import {
  Avatar,
  Button,
  Divider,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import PersonRemoveAlt1OutlinedIcon from "@mui/icons-material/PersonRemoveAlt1Outlined";
import { capitalCase } from "change-case";
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
function ProjectDetailPageMemberDisplay({ currentProject }) {
  return (
    <Stack direction="row" justifyContent="space-evenly">
      <Paper elevation={5}>
        <Stack
          direction="column"
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: "100%", p: "20px" }}
        >
          <Stack
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
            spacing={10}
          >
            <Typography variant="h6">Project Members</Typography>
            <Tooltip title="Assign member to project">
              <Button>
                <PersonAddAltOutlinedIcon />
              </Button>
            </Tooltip>
          </Stack>
          <Divider />

          <Stack
            sx={{ width: { sm: "500px", xs: "200px" } }}
            direction="column"
            justifyContent="space-between"
            spacing={3}
          >
            {currentProject.assignees.map((assignee) => (
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ flexWrap: { xs: "wrap", sm: "noWrap" } }}
                spacing={5}
              >
                <Avatar
                  {...stringAvatar(
                    assignee.name ? capitalCase(assignee.name) : "Unknown"
                  )}
                  src={assignee.avartarUrl}
                />
                <Stack
                  direction="column"
                  alignItems="start"
                  justifyContent="start"
                  width="100%"
                >
                  <Typography fontWeight="Bold">
                    {capitalCase(assignee.name)}
                  </Typography>
                  <Typography>{assignee.email}</Typography>
                </Stack>
                <Tooltip title="Unassign member">
                  <Button>
                    <PersonRemoveAlt1OutlinedIcon />
                  </Button>
                </Tooltip>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default ProjectDetailPageMemberDisplay;
