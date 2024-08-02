import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Divider,
  Modal,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import { fDate } from "../../../../utils/formatTime";
import { stringAvatar } from "../../../../utils/nameToLetterAvatar";
import { capitalCase } from "change-case";
import CommentPage from "../../../Comment/CommentPage";
import AttachedFileDisplay from "../../../Comment/AttachedFileDisplay";

import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ShareIcon from "@mui/icons-material/Share";
function TaskViewModal({ task, open, handleClose }) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "280px", sm: "500px", lg: "700px" },
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 2,
    borderRadius: 2,
  };

  const [currentTab, setCurrentTab] = useState("comment");

  const COMMENT_TABS = [
    {
      value: "comment",
      icon: <AccountBoxIcon sx={{ fontSize: 30 }} />,
      component: <CommentPage taskId={task._id} />,
    },
    {
      value: "attachedFile",
      icon: <ShareIcon sx={{ fontSize: 30 }} />,
      component: <AttachedFileDisplay />,
    },
  ];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Stack direction="column" spacing={1}>
          <Stack direction="row" justifyContent="space-between">
            <Typography id="modal-modal-title" variant="h5" component="h2">
              View Task Detail
            </Typography>

            <Button onClick={handleClose}>X</Button>
          </Stack>
          <Divider />
          <Stack direction="column">
            <Typography variant="h6" color="primary">
              Description
            </Typography>
            <Typography variant="body1">{task?.description}</Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="column">
              <Typography variant="h6" color="primary">
                Start Date
              </Typography>
              <Typography variant="body1">{fDate(task?.startDate)}</Typography>
            </Stack>
            <Stack direction="column">
              <Typography variant="h6" color="primary">
                Due Date
              </Typography>
              <Typography variant="body1">{fDate(task?.dueDate)}</Typography>
            </Stack>

            <Stack direction="column">
              <Typography variant="h6" color="primary">
                Assignees
              </Typography>
              <AvatarGroup max={5}>
                {task?.assignees.map((assignee) => (
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
            </Stack>
          </Stack>
          <Tabs
            value={currentTab}
            scrollButtons="auto"
            variant="scrollable"
            allowScrollButtonsMobile
            onChange={(e, value) => setCurrentTab(value)}
            sx={{
              border: "2px solid grey",
              borderRadius: "6px",
              padding: "5px",
            }}
          >
            {COMMENT_TABS.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                label={capitalCase(tab.value)}
                value={tab.value}
              />
            ))}
          </Tabs>
          <Box sx={{ mb: 5 }}></Box>
          {COMMENT_TABS.map((tab) => {
            const isMatched = tab.value === currentTab;
            return isMatched && <Box key={tab.value}>{tab.component}</Box>;
          })}
        </Stack>
      </Box>
    </Modal>
  );
}

export default TaskViewModal;
