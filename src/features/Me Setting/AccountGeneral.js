import React, { useCallback } from "react";
import { Box, Grid, Card, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useAuth from "../../hooks/useAuth";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { FormProvider, FTextField, FUploadAvatar } from "../../components/form";

import { useDispatch, useSelector } from "react-redux";

import { fData } from "../../utils/numberFormat";
import { updateMeProfile } from "./meSlice";

const UpdateUserSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
});

function AccountGeneral() {
  const { user } = useAuth();
  const { status } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const defaultValues = {
    name: user?.name || "",
    email: user?.email || "",
    avatarUrl: user?.avatarUrl || "",
    phone: user?.phone || 0,
    languages: user?.languages || "",
    description: user?.description || "",
    jobTitle: user?.jobTitle || "",
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data) => {
    dispatch(updateMeProfile({ userId: user._id, ...data }));
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      console.log("file", file);
      if (file) {
        setValue(
          "avatarUrl",
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4} item>
          <Card sx={{ py: 10, px: 3, textAlign: "center" }}>
            <FUploadAvatar
              name="avatarUrl"
              accept="image/*"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: "auto",
                    display: "block",
                    textAlign: "center",
                    color: "text.secondary",
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />
          </Card>
        </Grid>
        <Grid xs={12} md={8} item>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: "grid",
                rowGap: 3,
                columnGap: 1,
                gridTemplateColumns: {
                  xs: "repeat(1,1fr)",
                  sm: "repeat(2,1fr)",
                },
              }}
            >
              <FTextField name="name" label="Name" />
              <FTextField name="email" label="Email" disabled />
              <FTextField name="jobTitle" label="Job Title" />
              <FTextField name="languages" label="Languages" />

              <FTextField name="phone" label="Phone Number" />
            </Box>
            <Stack spacing={3} alignItems={"flex-end"} sx={{ mt: 3 }}>
              <FTextField
                name="description"
                label="About me"
                multiline
                rows={4}
              />
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting || status === "loading"}
              >
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default AccountGeneral;
