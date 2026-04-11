const express = require("express");
const {
  signup,
  login,
  changePassword,
  verifyEmail,
  toggleAccountStatus,
} = require("./auth.controller");
const { auth } = require("../../middleware/auth");
const {
  validateSignup,
  validateLogin,
  validatePasswordChange,
} = require("./auth.validation");
const { handleValidationErrors } = require("../../middleware/validation");
const {
  uploadAvatar: uploadAvatarMiddleware,
} = require("../../middleware/upload");
const { attachServerStorage } = require("../../middleware/serverStorage");
const { authRouteLimiter } = require("../../middleware/rateLimit");

const router = express.Router();

router.use(attachServerStorage);

router.post(
  "/signup",
  authRouteLimiter,
  validateSignup,
  handleValidationErrors,
  signup
);
router.post(
  "/login",
  authRouteLimiter,
  validateLogin,
  handleValidationErrors,
  login
);

router.put(
  "/change-password",
  auth,
  validatePasswordChange,
  handleValidationErrors,
  changePassword
);

// Admin routes
router.put("/verify-email/:userId", auth, verifyEmail);
router.put("/toggle-status/:userId", auth, toggleAccountStatus);

module.exports = router;
