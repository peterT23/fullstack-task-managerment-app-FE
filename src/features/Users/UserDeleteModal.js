import { Box, Button, Divider, Modal, Stack, Typography } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { deleteSingleUser } from "./userSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 5,
  borderRadius: 2,
};
function UserDeleteModal({
  openDeleteModal,
  handleDeleteModalClose,
  MemberUser,
}) {
  const dispatch = useDispatch();
  const { _id: id } = MemberUser;

  const handleDeleteMember = () => {
    dispatch(deleteSingleUser({ id }));
  };

  return (
    <Modal
      open={openDeleteModal}
      onClose={handleDeleteModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          ...style,
          width: { xs: 200, sm: 300 },
          height: { xs: 200, sm: 170 },
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "end",
          borderRadius: "10px",
          padding: "15px",
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Are you sure want to delete this member?
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "end",
          }}
        >
          <Button
            variant="contained"
            sx={{ height: "30px", width: "20px", mr: "10px" }}
            onClick={handleDeleteMember}
          >
            Yes
          </Button>
          <Button
            variant="outlined"
            sx={{ height: "30px", width: "20px" }}
            onClick={handleDeleteModalClose}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default UserDeleteModal;
