import {
  Alert,
  Box,
  Button,
  Container,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import {
  FFillAndSelect,
  FormProvider,
  FTextField,
  FDatePicker,
} from "../../../components/form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../Users/userSlice";
import { capitalCase } from "change-case";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { createProject } from "../projectSlice";
import useAuth from "../../../hooks/useAuth";

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
const ProjectSchema = Yup.object().shape({
  title: Yup.string().required("Name is required"),
  description: Yup.string().optional(),
  dueDate: Yup.date().required("Due date is required"),
  assignees: Yup.array().of(Yup.string().required("Assignee ID is required")),
});
const defaultValues = {
  title: "",
  description: "",
  dueDate: null,
  assignees: [],
};
function NewProjectCreateModal({ open, handleClose }) {
  const methods = useForm({
    resolver: yupResolver(ProjectSchema),
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

  //remove the current manager
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
    console.log("check running");
    let { title, description, dueDate, assignees } = data;

    try {
      dueDate = new Date(dueDate).toISOString();
      reset();
      handleClose();
      await dispatch(createProject({ title, description, dueDate, assignees }));
    } catch (error) {
      reset();
      setError("responseError", {
        type: "manual",
        message: error.message || "Create Project failed",
      });
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Container maxWidth="sm">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create New Project
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
                <FDatePicker name="dueDate" label="Due date" />
              </LocalizationProvider>

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
                Create Project
              </LoadingButton>
              <Button onClick={handleClose}>Cancel</Button>
            </Stack>
          </FormProvider>
        </Box>
      </Container>
    </Modal>
  );
}

export default NewProjectCreateModal;
