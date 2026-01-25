import React from "react";
import "./ErrorMessage.scss";

const ErrorMessage = ({ children }) => {
  if (!children) return null;
  return <div className="error-message-ui">{children}</div>;
};

export default ErrorMessage;
