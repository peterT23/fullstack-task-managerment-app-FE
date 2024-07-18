import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import {
  Alert,
  Box,
  Button,
  Container,
  InputAdornment,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { FormProvider, FSelect, FTextField } from "../../components/form";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import FDatePicker from "../../components/form/FDatePicker";
import { LoadingButton } from "@mui/lab";
import { editProject } from "./projectSlice";
import { fDateCheck } from "../../utils/formatTime";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import { capitalCase } from "change-case";
import { useParams } from "react-router-dom";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 260, sm: 350 },
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
  budget: Yup.number(),
  status: Yup.string().oneOf(
    ["pending", "ongoing", "review", "done", "archive"],
    "Invalid status"
  ),
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
    status: currentProject?.status || "pending",
  };
  const methods = useForm({
    resolver: yupResolver(UpdateProjectSchema),
    defaultValues,
  });

  const dispatch = useDispatch();

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const params = useParams();
  const { projectId } = params;
  const onSubmit = async (data) => {
    let { title, description, dueDate, startDate, status, budget } = data;

    try {
      dueDate = new Date(dueDate).toISOString();
      startDate = new Date(startDate).toISOString();
      reset();
      handleCloseEditModal();
      await dispatch(
        editProject({
          title,
          description,
          dueDate,
          startDate,
          status,
          budget,
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
  const statusArr = ["pending", "ongoing", "review", "done", "archive"];

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
              <Stack direction="row" spacing={1}>
                <FTextField
                  name="budget"
                  label="Budget"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <RequestQuoteOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <FSelect name="status" label="Status">
                  {statusArr.map((status) => (
                    <option value={status} key={status}>
                      {capitalCase(status)}
                    </option>
                  ))}
                </FSelect>
              </Stack>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack direction="row" spacing={1}>
                  <FDatePicker name="startDate" label="Start date" />
                  <FDatePicker name="dueDate" label="Due date" />
                </Stack>
              </LocalizationProvider>

              {!!errors.responseError && (
                <Alert severity="error">{errors.responseError.message}</Alert>
              )}

              <LoadingButton
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Edit Project
              </LoadingButton>
              <Button onClick={handleCloseEditModal}>Cancel</Button>
            </Stack>
          </FormProvider>
        </Box>
      </Container>
    </Modal>
  );
}

export default ProjectEditModal;
