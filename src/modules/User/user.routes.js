const express = require("express");
const {
  getProfile,
  getAllUsers,
  updateProfile,
  deleteUser,
  getUserById,
  getUsersByRole,
  searchUsers,
  getUserStats,
  uploadAvatar,
  removeAvatar,
  updatePreferences,
} = require("./user.controller");
const { auth, authorize } = require("../../middleware/auth");
const { validateProfileUpdate } = require("./user.validation");
const { handleValidationErrors } = require("../../middleware/validation");
const {
  uploadAvatar: uploadAvatarMiddleware,
} = require("../../middleware/upload");
const { attachServerStorage } = require("../../middleware/serverStorage");

const router = express.Router();

router.use(attachServerStorage);

router.get("/profile", auth, getProfile);
router.get("/", auth, authorize("ADMIN"), getAllUsers);
router.put(
  "/profile",
  auth,
  validateProfileUpdate,
  handleValidationErrors,
  updateProfile
);
router.put("/avatar", auth, uploadAvatarMiddleware, uploadAvatar);
router.delete("/avatar", auth, removeAvatar);
router.put("/preferences", auth, updatePreferences);
router.get("/:userId", auth, authorize("ADMIN"), getUserById);
router.delete("/:userId", auth, authorize("ADMIN"), deleteUser);
router.get("/role/:role", auth, authorize("ADMIN"), getUsersByRole);
router.get("/search", auth, authorize("ADMIN"), searchUsers);
router.get("/stats", auth, authorize("ADMIN"), getUserStats);

module.exports = router;
