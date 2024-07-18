import { Box, Button, Divider, Modal, Stack, Typography } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteSingleProject } from "./projectSlice";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 240, sm: 300 },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
  borderRadius: 2,
};

function ProjectDeleteModal({ openProjectDeleteModal, handleClose }) {
  const { selectedProject } = useSelector((state) => state.projects);
  const projectId = selectedProject._id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteSingleProject({ projectId }));
    navigate("/projects");
  };
  return (
    <Modal open={openProjectDeleteModal} onClose={handleClose}>
      <Box sx={style}>
        <Stack direction="column" spacing={3}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure want to delete this project?
          </Typography>
          <Divider />
          <Button variant="contained" onClick={handleDelete}>
            Delete
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default ProjectDeleteModal;
