// Re-export all auth controller functions from their respective files
export { login, refreshToken, logout, logoutAll, getMe } from "./login.js";

export {
  signup,
  sendOtp,
  verifyOtpAndRegister,
  resendOtpHandler,
} from "./signup.js";

export { forgotPassword } from "./forgotPassword.js";

export {
  resetPasswordHandler,
  resendPasswordResetHandler,
} from "./resetPassword.js";
