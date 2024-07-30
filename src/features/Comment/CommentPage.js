import React, { useEffect, useRef } from "react";
import { FormProvider, FTextField } from "../../components/form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { Alert, LoadingButton } from "@mui/lab";
import {
  Avatar,
  Box,
  Button,
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

import { DownloadOutlined as DownloadOutlinedIcon } from "@mui/icons-material";
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
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  ///upload reference file

  const fileInput = useRef();

  const onSubmit = async (data) => {
    let { comment, referenceDocument, documentType } = data;
    try {
      reset();
      await dispatch(
        createNewComment({ comment, taskId, referenceDocument, documentType })
      );
      fileInput.current.value = "";
    } catch (error) {
      reset();
      setError("responseError", {
        type: "manual",
        message: error.message || "Create comment failed",
      });
    }
  };

  ////
  const handleFile = (e) => {
    const file = fileInput.current.files[0];
    const documentType = file?.type.startsWith("image/") ? "image" : "raw";

    if (file) {
      setValue("referenceDocument", file);
      setValue("documentType", documentType);
    }
  };

  const handleDeleteComment = (commentId) => {
    dispatch(deleteSingleComment({ commentId, taskId }));
  };

  const comments = currentPageComments.map(
    (commentId) => commentsById[commentId]
  );

  ///

  const renderComments = (
    <Box sx={{ height: "240px", overflow: "auto", mt: "10px" }}>
      <Stack
        direction="column"
        spacing={2}
        mt={2}
        sx={{ height: "100%", padding: "10px" }}
      >
        {comments.map((comment) => (
          <Box key={comment._id}>
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
                    src={comment.commentUser.avatarUrl}
                  />
                </Tooltip>
                <Typography variant="subtitle1" fontWeight="bold">
                  {capitalCase(comment.commentUser.name)}
                </Typography>
                <Stack direction="column">
                  <Typography variant="subtitle1">
                    {comment?.content}
                  </Typography>
                  {comment?.referenceDocument &&
                    (comment.documentType === "image" ? (
                      <a
                        href={comment.referenceDocument}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={comment.referenceDocument}
                          alt="attachment"
                          style={{ maxWidth: "200px", margin: "10px 0 10px 0" }}
                        />
                      </a>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<DownloadOutlinedIcon />}
                        href={comment.referenceDocument}
                        download
                        sx={{ mt: 2, fontSize: "13px" }}
                      >
                        Download Attachment
                      </Button>
                    ))}
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
            placeholder="Write comment or report"
            multiline
            rows={3}
          />

          <input type="file" ref={fileInput} onChange={handleFile} />

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
