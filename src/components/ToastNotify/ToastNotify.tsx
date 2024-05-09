import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface ToastNotifyProps {
  message: string;
  onClose: () => void;
}

const ToastNotify: React.FC<ToastNotifyProps> = ({ message, onClose }) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={!!message}
      autoHideDuration={3000}
      onClose={onClose}
    >
      <Alert severity={"error"}>{message}</Alert>
    </Snackbar>
  );
};

export default ToastNotify;
