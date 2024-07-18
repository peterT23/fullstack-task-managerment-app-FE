// import {
//   Avatar,
//   Button,
//   Chip,
//   Divider,
//   Paper,
//   Stack,
//   Tooltip,
//   Typography,
// } from "@mui/material";
// import React, { useState } from "react";
// import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
// import PersonRemoveAlt1OutlinedIcon from "@mui/icons-material/PersonRemoveAlt1Outlined";
// import { capitalCase } from "change-case";
// import AssignProJectModal from "./AssignProJectModal";
// import { useSelector } from "react-redux";
// import UnassignMemberModal from "./UnassignMemberModal";

// function stringToColor(string) {
//   let hash = 0;
//   let i;

//   /* eslint-disable no-bitwise */
//   for (i = 0; i < string.length; i += 1) {
//     hash = string.charCodeAt(i) + ((hash << 5) - hash);
//   }

//   let color = "#";

//   for (i = 0; i < 3; i += 1) {
//     const value = (hash >> (i * 8)) & 0xff;
//     color += `00${value.toString(16)}`.slice(-2);
//   }
//   /* eslint-enable no-bitwise */

//   return color;
// }

// function stringAvatar(name) {
//   const nameParts = name.split(" ");
//   const initials =
//     nameParts.length > 1
//       ? `${nameParts[0][0]}${nameParts[1][0]}`
//       : `${nameParts[0][0]}`;
//   return {
//     sx: {
//       bgcolor: stringToColor(name),
//     },
//     children: initials,
//   };
// }
// function ProjectDetailPageMemberDisplay() {
//   const { selectedProject: currentProject } = useSelector(
//     (state) => state.projects
//   );

//   const [openAssignProjectToMemberModal, setOpenAssignProjectToMemberModal] =
//     useState(false);
//   const [openUnassignMemberModal, setOpenUnassignMemberModal] = useState(false);
//   const [selectedAssigneeId, setSelectedAssigneeId] = useState(null);

//   const handleOpenAssignProjectToMembersModal = () => {
//     setOpenAssignProjectToMemberModal(true);
//   };
//   const handleCloseAssignProjectToMembersModal = () => {
//     setOpenAssignProjectToMemberModal(false);
//   };

//   const handleOpenUnassignMemberModal = (assigneeId) => {
//     setSelectedAssigneeId(assigneeId);
//     setOpenUnassignMemberModal(true);
//   };
//   const handleCloseUnassignMemberModal = () => {
//     setSelectedAssigneeId(null);
//     setOpenUnassignMemberModal(false);
//   };

//   return (
//     <Stack direction="row" justifyContent="space-evenly">
//       <Paper elevation={5}>
//         <Stack
//           direction="column"
//           justifyContent="space-between"
//           alignItems="center"
//           sx={{ width: "100%", p: "20px" }}
//         >
//           <Stack
//             direction="row"
//             justifyContent="space-evenly"
//             alignItems="center"
//             spacing={10}
//           >
//             <Typography variant="h6">Project Members</Typography>
//             <Tooltip title="Assign member to project">
//               <Button onClick={handleOpenAssignProjectToMembersModal}>
//                 <PersonAddAltOutlinedIcon />
//               </Button>
//             </Tooltip>
//           </Stack>
//           <Divider />

//           <Stack
//             sx={{ width: { sm: "500px", xs: "200px" } }}
//             direction="column"
//             justifyContent="space-between"
//             spacing={3}
//           >
//             {currentProject?.assignees.map((assignee) => (
//               <Stack
//                 direction="row"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 sx={{ flexWrap: { xs: "wrap", sm: "noWrap" } }}
//                 spacing={5}
//                 key={assignee?._id}
//               >
//                 <Avatar
//                   {...stringAvatar(
//                     assignee?.name ? capitalCase(assignee?.name) : "Unknown"
//                   )}
//                   src={assignee?.avartarUrl}
//                 />
//                 <Stack
//                   direction="column"
//                   alignItems="start"
//                   justifyContent="start"
//                   width="100%"
//                 >
//                   <Typography fontWeight="Bold">
//                     {capitalCase(assignee?.name)}
//                   </Typography>
//                   <Typography>{assignee?.email}</Typography>
//                 </Stack>
//                 <Chip
//                   label={capitalCase(assignee?.role)}
//                   color={assignee?.role === "manager" ? "primary" : "secondary"}
//                   sx={{
//                     width: "100",
//                     height: 30,
//                     margin: "5px",
//                     textAlign: "center",
//                   }}
//                 />
//                 <Tooltip title="Unassign member">
//                   <Button
//                     onClick={() => handleOpenUnassignMemberModal(assignee?._id)}
//                   >
//                     <PersonRemoveAlt1OutlinedIcon />
//                   </Button>
//                 </Tooltip>
//               </Stack>
//             ))}
//           </Stack>
//         </Stack>
//       </Paper>
//       <AssignProJectModal
//         handleClose={handleCloseAssignProjectToMembersModal}
//         open={openAssignProjectToMemberModal}
//       />
//       <UnassignMemberModal
//         openUnassignMemberModal={openUnassignMemberModal}
//         handleCloseUnassignMemberModal={handleCloseUnassignMemberModal}
//         assigneeId={selectedAssigneeId}
//       />
//     </Stack>
//   );
// }

// export default ProjectDetailPageMemberDisplay;
import {
  Avatar,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import PersonRemoveAlt1OutlinedIcon from "@mui/icons-material/PersonRemoveAlt1Outlined";
import { capitalCase } from "change-case";
import AssignProJectModal from "./AssignProJectModal";
import { useSelector } from "react-redux";
import UnassignMemberModal from "./UnassignMemberModal";
import LoadingScreen from "../../components/LoadingScreen";
import useAuth from "../../hooks/useAuth";

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

function ProjectDetailPageMemberDisplay() {
  const { selectedProject: currentProject, status } = useSelector(
    (state) => state.projects
  );

  const [openAssignProjectToMemberModal, setOpenAssignProjectToMemberModal] =
    useState(false);
  const [openUnassignMemberModal, setOpenUnassignMemberModal] = useState(false);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState(null);

  const handleOpenAssignProjectToMembersModal = () => {
    setOpenAssignProjectToMemberModal(true);
  };
  const handleCloseAssignProjectToMembersModal = () => {
    setOpenAssignProjectToMemberModal(false);
  };

  const handleOpenUnassignMemberModal = (assigneeId) => {
    setSelectedAssigneeId(assigneeId);
    setOpenUnassignMemberModal(true);
  };
  const handleCloseUnassignMemberModal = () => {
    setSelectedAssigneeId(null);
    setOpenUnassignMemberModal(false);
  };

  const currentUser = useAuth();

  if (!currentProject) {
    return <LoadingScreen />;
  }

  return (
    <Stack direction="row" justifyContent="space-evenly">
      {status === "loading" ? (
        <LoadingScreen />
      ) : (
        <>
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
                {currentUser.manager === "manager" ? (
                  <Tooltip title="Assign member to project">
                    <Button onClick={handleOpenAssignProjectToMembersModal}>
                      <PersonAddAltOutlinedIcon />
                    </Button>
                  </Tooltip>
                ) : (
                  ""
                )}
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
                    key={assignee._id}
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
                        {assignee.name ? capitalCase(assignee.name) : "Unknown"}
                      </Typography>
                      <Typography>{assignee.email}</Typography>
                    </Stack>
                    <Chip
                      label={
                        assignee.role ? capitalCase(assignee.role) : "Unknown"
                      }
                      color={
                        assignee.role === "manager" ? "primary" : "secondary"
                      }
                      sx={{
                        width: "100",
                        height: 30,
                        margin: "5px",
                        textAlign: "center",
                      }}
                    />
                    {currentUser.role === "manager" ? (
                      <Tooltip title="Unassign member">
                        <Button
                          onClick={() =>
                            handleOpenUnassignMemberModal(assignee._id)
                          }
                        >
                          <PersonRemoveAlt1OutlinedIcon />
                        </Button>
                      </Tooltip>
                    ) : (
                      ""
                    )}
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Paper>
          <AssignProJectModal
            handleClose={handleCloseAssignProjectToMembersModal}
            open={openAssignProjectToMemberModal}
          />
          {selectedAssigneeId && (
            <UnassignMemberModal
              openUnassignMemberModal={openUnassignMemberModal}
              handleCloseUnassignMemberModal={handleCloseUnassignMemberModal}
              assigneeId={selectedAssigneeId}
            />
          )}
        </>
      )}
    </Stack>
  );
}

export default ProjectDetailPageMemberDisplay;
