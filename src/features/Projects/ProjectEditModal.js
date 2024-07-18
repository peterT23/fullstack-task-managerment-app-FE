import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../Users/userSlice";
import useAuth from "../../hooks/useAuth";
import { capitalCase } from "change-case";
import { Alert, Box, Container, Modal, Stack, Typography } from "@mui/material";
import {
  FFillAndSelect,
  FormProvider,
  FTextField,
} from "../../components/form";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import FDatePicker from "../../components/form/FDatePicker";
import { LoadingButton } from "@mui/lab";
import { createProject } from "./projectSlice";
import { fDate, fDateCheck } from "../../utils/formatTime";
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

const UpdateProjectSchema = Yup.object().shape({
  title: Yup.string().required("Name is required"),
  description: Yup.string().optional(),
  dueDate: Yup.date().required("Due date is required"),
  startDate: Yup.date(),
  budget: Yup.number().positive().integer(),
  status: Yup.string()
    .default("pending")
    .oneOf(["pending, ongoing, review, done, archive"]),
});

function ProjectEditModal({
  currentProject,
  handleCloseEditModal,
  openProjectEditModal,
}) {
  const defaultValues = {
    title: currentProject?.title || "",
    description: currentProject?.description || "",
    dueDate: currentProject?.dueDate
      ? fDateCheck(currentProject.dueDate)
      : null,
    startDate: currentProject?.startDate
      ? fDateCheck(currentProject.startDate)
      : null,
    budget: currentProject?.budget || 0,
    status: currentProject?.status || "",
  };
  const methods = useForm({
    resolver: yupResolver(UpdateProjectSchema),
    defaultValues,
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUsers({ page: 1, limit: 1000 }));
  }, [dispatch]);

  const { currentPageUsers, usersById } = useSelector((state) => state.users);
  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const { user: currentUser } = useAuth();
  //remove the current manager out of users arrays
  const updatedPageUsers = currentPageUsers.filter(
    (id) => id !== currentUser._id
  );
  const updatedUsersById = { ...usersById };
  delete updatedUsersById[currentUser._id];

  const options = updatedPageUsers.map((id) => ({
    value: id,
    label: `${capitalCase(updatedUsersById[id]?.name)}-${
      updatedUsersById[id].email
    }`,
  }));

  const onSubmit = async (data) => {
    let { title, description, dueDate, assignees } = data;

    try {
      dueDate = new Date(dueDate).toISOString();
      reset();
      handleCloseEditModal();
      await dispatch(createProject({ title, description, dueDate, assignees }));
    } catch (error) {
      reset();
      setError("responseError", {
        type: "manual",
        message: error.message || "Edit Project failed",
      });
    }
  };

  return (
    <Modal open={openProjectEditModal} onClose={handleCloseEditModal}>
      <Container maxWidth="sm">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit project
          </Typography>

          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <FTextField name="title" label="Project Name" />
              <FTextField
                name="description"
                label="Description"
                multiline
                rows={4}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <FDatePicker name="startDate" label="Start date" />
                <FDatePicker name="dueDate" label="Due date" />
              </LocalizationProvider>

              {/* <FFillAndSelect
                name="assignees"
                options={options}
                placeholder="Select member"
              /> */}

              {!!errors.responseError && (
                <Alert severity="error">{errors.responseError.message}</Alert>
              )}

              <LoadingButton
                fullwidth="true"
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Edit Project
              </LoadingButton>
            </Stack>
          </FormProvider>
        </Box>
      </Container>
    </Modal>
  );
}

export default ProjectEditModal;
