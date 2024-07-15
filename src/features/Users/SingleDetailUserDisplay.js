import {
  Avatar,
  Box,
  Chip,
  Link,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { capitalCase } from "change-case";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import InterpreterModeOutlinedIcon from "@mui/icons-material/InterpreterModeOutlined";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";

import React from "react";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "3px solid green",
  boxShadow: 24,
};
function SingleDetailUserDisplay({ open, handleClose, user }) {
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            ...style,
            width: { xs: 230, sm: 320 },
            height: { xs: 500, sm: 450 },
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "start",
            borderRadius: "10px",
            padding: "15px",
          }}
        >
          <Chip
            label={capitalCase(user.role)}
            color={user.role === "manager" ? "primary" : "secondary"}
            sx={{
              width: "100",
              height: 30,
              margin: "5px",
              textAlign: "center",
            }}
          />
          <Avatar
            src={user.avatarUrl}
            alt={user.name}
            sx={{
              mx: "auto",
              borderWidth: 2,
              borderStyle: "solid",
              borderColor: "common.white",
            }}
          />
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              width: "100%",
              textAlign: "center",
            }}
          >
            {capitalCase(user.name)}
          </Typography>

          <Typography
            variant="string"
            sx={{
              width: "100%",
              textAlign: "center",
            }}
          >
            {user.email}
          </Typography>
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ContactPhoneOutlinedIcon sx={{ mr: "10px" }} />
            <Typography sx={{ margin: "5px" }}>{user.phone}</Typography>
          </Stack>

          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <DescriptionOutlinedIcon sx={{ mr: "10px" }} />
            <Typography sx={{ margin: "5px" }}>{user.description}</Typography>
          </Stack>
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <InterpreterModeOutlinedIcon sx={{ mr: "10px" }} />
            <Typography sx={{ margin: "5px" }}>{user.languages}</Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={8}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Stack
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // textAlign: "center",
              }}
            >
              <Typography variant="string">{user.projectCount}</Typography>
              <Typography variant="string" color="text.secondary">
                Projects
              </Typography>
            </Stack>
            <Stack
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="string">{user.taskCount}</Typography>
              <Typography variant="string" color="text.secondary">
                Tasks
              </Typography>
            </Stack>
          </Stack>

          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FacebookOutlinedIcon sx={{ mr: "10px" }} />

            <Link
              href={user.facebookLink}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              color="primary"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {user.facebookLink ? "Go to Facebook" : ""}
            </Link>
          </Stack>
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LinkedInIcon sx={{ mr: "10px" }} />
            <Link
              href={user.linkedinLink}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              color="primary"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {user.linkedinLin ? "Go to LinkedIn" : ""}
            </Link>
          </Stack>
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TwitterIcon sx={{ mr: "10px" }} />
            <Link
              href={user.twitterLink}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              color="primary"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {user.twitterLink ? "Go to TwitterLink" : ""}
            </Link>
          </Stack>
          {/* <ChildModal /> */}
        </Box>
      </Modal>
    </>
  );
}

export default SingleDetailUserDisplay;
