import {
  Alert,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { FTextField } from "../../components/form";

import { useForm } from "react-hook-form";
import { FormProvider } from "../../components/form";

import { yupResolver } from "@hookform/resolvers/yup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { useDispatch } from "react-redux";
import { createMemberAccount } from "./userSlice";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 240, sm: 400 },

  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "5px",
  p: 2,
};

const MemberRegisterSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid Email").required("Email is required"),
  password: Yup.string().required("Password is required"),
  passwordConfirmation: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "passwords must match"),
  role: Yup.string()
    .default("member")
    .oneOf(["member"], "create new account for member")
    .required("role is required"),
});

const defaultValues = {
  name: "",
  email: "",
  role: "member",
  password: "",
  passwordConfirmation: "",
};
function NewMemberCreateModal({
  openCreateNewMemberModal,
  handleCloseCreateNewMemberModal,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const dispatch = useDispatch();

  const methods = useForm({
    resolver: yupResolver(MemberRegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    const { email, name, role, password } = data;
    try {
      handleCloseCreateNewMemberModal();
      reset();
      await dispatch(
        createMemberAccount({ name, email, role, password })
      ).unwrap();
    } catch (error) {
      reset();
      // setError("responseError", error);

      setError("responseError", {
        type: "manual",
        message: error.message || "Member Registration failed",
      });
    }
  };
  return (
    <Modal
      open={openCreateNewMemberModal}
      onClose={handleCloseCreateNewMemberModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Stack spacing={3}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ mb: "20px" }}
            >
              Create a new member{" "}
            </Typography>
            <Divider />
            {!!errors.responseError && (
              <Alert severity="error">{errors.responseError.message}</Alert>
            )}
            <Stack spacing={3}>
              <FTextField name="name" label="Full name" />
              <FTextField name="email" label="Email address" />
              <FTextField
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FTextField
                name="passwordConfirmation"
                label="Password Confirmation"
                type={showPasswordConfirmation ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowPasswordConfirmation(!showPasswordConfirmation)
                        }
                        edge="end"
                      >
                        {showPasswordConfirmation ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <LoadingButton
                fullWidth="true"
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Create
              </LoadingButton>
            </Stack>
          </FormProvider>
        </Stack>
      </Box>
    </Modal>
  );
}

export default NewMemberCreateModal;
