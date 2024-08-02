// import { Box, Button, Divider, Modal, Stack, Typography } from "@mui/material";
// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { unassignMemberFromProject } from "./projectSlice";
// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: { xs: 240, sm: 300 },
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 2,
//   borderRadius: 2,
// };
// function UnassignMemberModal({
//   openUnassignMemberModal,
//   handleCloseUnassignMemberModal,
//   assigneeId,
// }) {
//   const dispatch = useDispatch();
//   const { selectedProject: currentProject } = useSelector(
//     (state) => state.projects
//   );
//   const projectId = currentProject._id;
//   const handleUnassign = () => {
//     dispatch(unassignMemberFromProject({ projectId, assigneeId }));
//     handleCloseUnassignMemberModal();
//   };
//   return (
//     <Modal
//       open={openUnassignMemberModal}
//       onClose={handleCloseUnassignMemberModal}
//     >
//       <Box sx={style}>
//         <Stack direction="column" spacing={3}>
//           <Typography id="modal-modal-title" variant="h6" component="h2">
//             Are you sure want to unassign this member out from the project?
//           </Typography>
//           <Divider />
//           <Button variant="contained" onClick={handleUnassign}>
//             Unassign
//           </Button>
//           <Button onClick={handleCloseUnassignMemberModal}>Cancel</Button>
//         </Stack>
//       </Box>
//     </Modal>
//   );
// }

// export default UnassignMemberModal;
import { Box, Button, Divider, Modal, Stack, Typography } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { unassignMemberFromProject } from "../projectSlice";
import LoadingScreen from "../../../components/LoadingScreen";

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

function UnassignMemberModal({
  openUnassignMemberModal,
  handleCloseUnassignMemberModal,
  assigneeId,
}) {
  const dispatch = useDispatch();
  const { selectedProject: currentProject } = useSelector(
    (state) => state.projects
  );

  if (!currentProject) {
    return <LoadingScreen />;
  }

  const projectId = currentProject._id;

  const handleUnassign = () => {
    dispatch(unassignMemberFromProject({ projectId, assigneeId }));
    handleCloseUnassignMemberModal();
  };

  return (
    <Modal
      open={openUnassignMemberModal}
      onClose={handleCloseUnassignMemberModal}
    >
      <Box sx={style}>
        <Stack direction="column" spacing={3}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to unassign this member from the project?
          </Typography>
          <Divider />
          <Button variant="contained" onClick={handleUnassign}>
            Unassign
          </Button>
          <Button onClick={handleCloseUnassignMemberModal}>Cancel</Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default UnassignMemberModal;
