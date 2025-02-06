import React from "react";
import { Snackbar, Alert } from "@mui/material";

const ToastMessage = ({ open, message, severity, handleClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert severity={severity ? severity : "success"}>{message}</Alert>
    </Snackbar>
  );
};

export default ToastMessage;
