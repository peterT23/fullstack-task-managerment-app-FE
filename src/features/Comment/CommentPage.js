import React from "react";
import { FormProvider, FTextField } from "../../components/form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { Alert, LoadingButton } from "@mui/lab";
import { Stack } from "@mui/material";
import { useDispatch } from "react-redux";

import { createNewComment } from "./commentSlice";

const CommentSchema = Yup.object().shape({
  comment: Yup.string().required("Comment is required"),
});
const defaultValues = {
  comment: "",
};
function CommentPage({ taskId }) {
  const dispatch = useDispatch();

  const methods = useForm({
    resolver: yupResolver(CommentSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    let { comment } = data;
    try {
      reset();
      await dispatch(createNewComment({ comment, taskId }));
    } catch (error) {
      reset();
      setError("responseError", {
        type: "manual",
        message: error.message || "Create comment failed",
      });
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="column" spacing={3}>
          <FTextField
            name="comment"
            // label="Write comment or report"
            placeholder="Write comment or report"
            multiline
            rows={3}
          />
          {!!errors.responseError && (
            <Alert severity="error">{errors.responseError.message}</Alert>
          )}
          <Stack direction="row" justifyContent="end">
            <LoadingButton
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Sent
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </>
  );
}

export default CommentPage;
