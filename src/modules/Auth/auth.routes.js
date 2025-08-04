const express = require("express");
const {
  signup,
  login,
  getProfile,
  updateProfile,
  uploadAvatar,
  removeAvatar,
  changePassword,
  getUserStats,
  updatePreferences,
  verifyEmail,
  toggleAccountStatus,
} = require("./auth.controller");
const { auth } = require("../../middleware/auth");
const {
  validateSignup,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
} = require("./auth.validation");
const { handleValidationErrors } = require("../../middleware/validation");
const {
  uploadAvatar: uploadAvatarMiddleware,
} = require("../../middleware/upload");
const { attachServerStorage } = require("../../middleware/serverStorage");

const router = express.Router();

router.use(attachServerStorage);

router.post("/signup", validateSignup, handleValidationErrors, signup);
router.post("/login", validateLogin, handleValidationErrors, login);

router.get("/profile", auth, getProfile);
router.put(
  "/profile",
  auth,
  validateProfileUpdate,
  handleValidationErrors,
  updateProfile
);
router.put("/avatar", auth, uploadAvatarMiddleware, uploadAvatar);
router.delete("/avatar", auth, removeAvatar);
router.put(
  "/change-password",
  auth,
  validatePasswordChange,
  handleValidationErrors,
  changePassword
);
router.get("/stats", auth, getUserStats);
router.put("/preferences", auth, updatePreferences);

// Admin routes
router.put("/verify-email/:userId", auth, verifyEmail);
router.put("/toggle-status/:userId", auth, toggleAccountStatus);

module.exports = router;
