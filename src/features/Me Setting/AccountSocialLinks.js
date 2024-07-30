import { Card, InputAdornment, Stack } from "@mui/material";
import React from "react";
import { FormProvider, FTextField } from "../../components/form";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";

import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import { useForm } from "react-hook-form";
import { updateMeProfile } from "./meSlice";

const SOCIAL_LINKS = [
  { value: "facebookLink", icon: <FacebookIcon sx={{ fontSize: 30 }} /> },
  { value: "linkedinLink", icon: <LinkedInIcon sx={{ fontSize: 30 }} /> },
  { value: "twitterLink", icon: <TwitterIcon sx={{ fontSize: 30 }} /> },
];
function AccountSocialLinks() {
  const status = useSelector((state) => state.users.status);
  const { user } = useAuth();
  const dispatch = useDispatch();

  const defaultValues = {
    facebookLink: user?.facebookLink || "",
    linkedinLink: user?.linkedinLink || "",
    twitterLink: user?.twitterLink || "",
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    dispatch(updateMeProfile({ userId: user._id, ...data }));
    console.log("userID", user._id);
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">
          {SOCIAL_LINKS.map((link) => (
            <FTextField
              key={link.value}
              name={link.value}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">{link.icon}</InputAdornment>
                ),
              }}
            />
          ))}
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting || status === "loading"}
          >
            Save Changes
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}

export default AccountSocialLinks;
