import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./Router/router.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);
