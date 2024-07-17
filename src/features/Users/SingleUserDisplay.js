import { Avatar, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import React, { useState } from "react";

import { capitalCase } from "change-case";

import SingleDetailUserDisplay from "./SingleDetailUserDisplay";
import UserDeleteModal from "./UserDeleteModal";
import useAuth from "../../hooks/useAuth";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

function SingleUserDisplay({ user }) {
  const [openSingleDetailUserModal, setOpenSingleDetailModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const { user: currentUser } = useAuth();

  const handleSingleDetailUserModalOpen = () => {
    setOpenSingleDetailModal(true);
  };
  const handleSingleDetailUserModalClose = () => {
    setOpenSingleDetailModal(false);
  };
  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false);
  };

  return (
    <>
      <Paper
        key={user.id}
        sx={{
          p: "0.5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
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
          <Chip
            label={capitalCase(user.role)}
            color={user.role === "manager" ? "primary" : "secondary"}
          />

          <Tooltip
            title="Delete User"
            onClick={handleOpenDeleteModal}
            sx={{
              color: "text.secondary",
              display:
                currentUser.role === "manager" && user.role !== "manager"
                  ? "block"
                  : "none",
            }}
          >
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <Avatar
          src={user.avatarUrl}
          alt={user.name}
          sx={{
            mx: "auto",
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: "common.white",
          }}
        />
        <Typography variant="h5" fontWeight="bold">
          {capitalCase(user.name)}
        </Typography>
        <Typography variant="string">{user.email}</Typography>

        <Stack direction="row" spacing={8}>
          <Stack
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="string">{user.projectCount}</Typography>
            <Typography variant="string" color="text.secondary">
              Projects
            </Typography>
          </Stack>
          <Stack
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="string">{user.taskCount}</Typography>
            <Typography variant="string" color="text.secondary">
              Tasks
            </Typography>
          </Stack>
        </Stack>
        <Button onClick={handleSingleDetailUserModalOpen}>View more</Button>
        <SingleDetailUserDisplay
          open={openSingleDetailUserModal}
          handleClose={handleSingleDetailUserModalClose}
          user={user}
        />
        <UserDeleteModal
          openDeleteModal={openDeleteModal}
          handleDeleteModalClose={handleDeleteModalClose}
          MemberUser={user}
        />
      </Paper>
    </>
  );
}

export default SingleUserDisplay;
