import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AlertMsg() {
  return (
    <ToastContainer
      position="top-right"
      hideProgressBar={false}
      newestOnTop={false}
      pauseOnHover
    ></ToastContainer>
  );
}

export default AlertMsg;
