import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Alert,
  Box,
  Button,
  Container,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import {
  FDatePicker,
  FFillAndSelect,
  FormProvider,
  FSelect,
  FTextField,
} from "../../../components/form";
import { capitalCase } from "change-case";
import { fDateCheck } from "../../../utils/formatTime";
import { editTaskAsync } from "../taskSlice";

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

const TaskSchema = Yup.object().shape({
  title: Yup.string().required("Name is required"),
  description: Yup.string().optional(),
  dueDate: Yup.date().required("Due date is required"),
  startDate: Yup.date(),
  assignees: Yup.array().of(Yup.string().required("Assignee ID is required")),
  priority: Yup.string().oneOf(["low", "medium", "high"]),
});

function TaskEditModal({ task, open, handleClose }) {
  const defaultValues = {
    title: task?.title || "",
    description: task?.description || "",
    dueDate: task?.dueDate ? fDateCheck(task.dueDate) : null,
    startDate: task?.startDate ? fDateCheck(task.startDate) : null,
    assignees: task?.assignees
      ? task.assignees.map((assignee) => assignee._id)
      : [],
    priority: task?.priority || "pending",
  };

  const methods = useForm({
    resolver: yupResolver(TaskSchema),
    defaultValues,
  });

  const dispatch = useDispatch();
  const { selectedProject } = useSelector((state) => state.projects);

  const options = selectedProject?.assignees.map((assignee) => ({
    value: assignee._id,
    label: `${capitalCase(assignee?.name)}-${assignee.email}`,
  }));

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    let { title, description, dueDate, startDate, assignees, priority } = data;
    dueDate = new Date(dueDate).toISOString();
    startDate = new Date(startDate).toISOString();

    try {
      reset();
      handleClose();

      await dispatch(
        editTaskAsync({
          title,
          description,
          dueDate,
          assignees,
          priority,
          startDate,
          taskId: task._id,
        })
      );
    } catch (error) {
      reset();
      setError("responseError", {
        type: "manual",
        message: error.message || "Create task failed",
      });
    }
  };

  const priorityArr = ["low", "medium", "high"];

  return (
    <Modal open={open} onClose={handleClose}>
      <Container maxWidth="sm">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Task
          </Typography>

          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <FTextField name="title" label="Task Name" />
              <FTextField
                name="description"
                label="Description"
                multiline
                rows={4}
              />

              <Stack direction="row" spacing={1}>
                <FSelect name="priority" label="Priority">
                  {priorityArr.map((priority) => (
                    <option value={priority} key={priority}>
                      {capitalCase(priority)}
                    </option>
                  ))}
                </FSelect>
              </Stack>
              <Stack direction="row" spacing={1}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <FDatePicker name="startDate" label="Start date" />
                  <FDatePicker name="dueDate" label="Due date" />
                </LocalizationProvider>
              </Stack>

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
                Update Task
              </LoadingButton>
              <Button onClick={handleClose}>Cancel</Button>
            </Stack>
          </FormProvider>
        </Box>
      </Container>
    </Modal>
  );
}

export default TaskEditModal;
