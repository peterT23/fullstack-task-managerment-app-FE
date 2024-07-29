import React, { useEffect } from "react";
import { FormProvider, FTextField } from "../../components/form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { Alert, LoadingButton } from "@mui/lab";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import {
  createNewComment,
  deleteSingleComment,
  getCommentsOfTask,
} from "./commentSlice";
import { capitalCase } from "change-case";
import { stringAvatar } from "../../utils/nameToLetterAvatar";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import useAuth from "../../hooks/useAuth";

const CommentSchema = Yup.object().shape({
  comment: Yup.string().required("Comment is required"),
});
const defaultValues = {
  comment: "",
};
function CommentPage({ taskId }) {
  const dispatch = useDispatch();

  const { user: currentUser } = useAuth();

  useEffect(() => {
    dispatch(getCommentsOfTask({ taskId }));
  }, [dispatch, taskId]);

  const { currentPageComments, commentsById } = useSelector(
    (state) => state.comments
  );

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

  const handleDeleteComment = (commentId) => {
    dispatch(deleteSingleComment({ commentId, taskId }));
  };

  const comments = currentPageComments.map(
    (commentId) => commentsById[commentId]
  );
  console.log("comments", comments);
  const renderComments = (
    <Box sx={{ height: "240px", overflow: "auto", mt: "10px" }}>
      <Stack
        direction="column"
        spacing={2}
        mt={2}
        sx={{ height: "100%", padding: "10px" }}
      >
        {comments.map((comment) => (
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              key={comment._id}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="start"
                spacing={3}
              >
                <Tooltip
                  title={`${
                    comment.commentUser.name
                      ? capitalCase(comment.commentUser.name)
                      : "Unknown"
                  }- ${comment.commentUser.role}`}
                  key={comment.commentUser._id}
                >
                  <Avatar
                    {...stringAvatar(
                      comment.commentUser.name
                        ? capitalCase(comment.commentUser.name)
                        : "Unknown"
                    )}
                    src={comment.commentUser.avartarUrl}
                  />
                </Tooltip>
                <Stack direction="column">
                  <Typography variant="subtitle1" fontWeight="bold">
                    {capitalCase(comment.commentUser.name)}
                  </Typography>
                  <Typography variant="subtitle2">{comment.content}</Typography>
                </Stack>
              </Stack>
              {currentUser._id === comment.commentUser._id && (
                <Stack>
                  <IconButton
                    sx={{ color: "red" }}
                    onClick={() => handleDeleteComment(comment._id)}
                  >
                    <DeleteForeverOutlinedIcon />
                  </IconButton>
                </Stack>
              )}
            </Stack>
            <Divider />
          </Box>
        ))}
      </Stack>
    </Box>
  );

  return (
    <Box>
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
      {comments.length > 0 && renderComments}
    </Box>
  );
}

export default CommentPage;
