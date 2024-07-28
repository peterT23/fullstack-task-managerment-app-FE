import { Box, Button, Divider, Modal, Stack, Typography } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { deleteAsyncSingleTask, deleteSingleTask } from "../taskSlice";

function TaskDeleteModal({ handleClose, open, taskId }) {
  const dispatch = useDispatch();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: 260, sm: 380 },
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 2,
    borderRadius: 2,
  };

  const handleDelete = () => {
    dispatch(deleteSingleTask({ taskId }));
    dispatch(deleteAsyncSingleTask({ taskId }));
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
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

export default TaskDeleteModal;
