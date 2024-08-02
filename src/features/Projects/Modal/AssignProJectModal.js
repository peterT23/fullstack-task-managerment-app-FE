import {
  Alert,
  Box,
  Button,
  Divider,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { FFillAndSelect, FormProvider } from "../../../components/form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../Users/userSlice";
import { capitalCase } from "change-case";
import { LoadingButton } from "@mui/lab";
import { assignProjectToMembers } from "../projectSlice";
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

const AssignSchema = Yup.object().shape({
  assignees: Yup.array()
    .of(Yup.string().required("User ID is required")) // Assuming IDs are strings
    .required("Assignees are required")
    .min(1, "At least one assignee is required"),
});
function AssignProJectModal({ handleClose, open }) {
  const defaultValues = {
    assignees: [],
  };

  const methods = useForm({
    resolver: yupResolver(AssignSchema),
    defaultValues,
  });
  const dispatch = useDispatch();
  const params = useParams();
  const { projectId } = params;
  useEffect(() => {
    dispatch(getUsers({ page: 1, limit: 1000 }));
  }, [dispatch]);

  const { currentPageUsers, usersById, status } = useSelector(
    (state) => state.users,
    shallowEqual
  );
  const { selectedProject: currentProject } = useSelector(
    (state) => state.projects
  );

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;
  //remove assignees who was assigned
  let updatedPageUsers = [...currentPageUsers];
  const updatedUsersById = { ...usersById };

  // Remove users who are already assigned to the current project
  currentProject?.assignees.forEach((assignee) => {
    updatedPageUsers = updatedPageUsers.filter((id) => id !== assignee._id);
    delete updatedUsersById[assignee._id];
  });

  // Create options for a select input
  const options = updatedPageUsers.map((id) => {
    return {
      value: id,
      label: `${capitalCase(updatedUsersById[id]?.name)}-${
        updatedUsersById[id]?.email
      }`,
    };
  });

  const onSubmit = async (data) => {
    let { assignees } = data;

    try {
      reset();
      handleClose();
      await dispatch(
        assignProjectToMembers({
          assignees,
          projectId,
        })
      );
    } catch (error) {
      reset();
      setError("responseError", {
        type: "manual",
        message: error.message || "Edit Project failed",
      });
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        {status === "loading" ? (
          <LoadingScreen />
        ) : (
          <Stack direction="column">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Invite
            </Typography>
            <Divider />
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Users
            </Typography>

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                <FFillAndSelect
                  name="assignees"
                  options={options}
                  placeholder="Select member"
                />
                {!!errors.responseError && (
                  <Alert severity="error">{errors.responseError.message}</Alert>
                )}

                <LoadingButton
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Invite Members
                </LoadingButton>
                <Button onClick={handleClose}>Cancel</Button>
              </Stack>
            </FormProvider>
          </Stack>
        )}
      </Box>
    </Modal>
  );
}

export default AssignProJectModal;
