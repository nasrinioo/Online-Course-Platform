const express = require("express");
const {
  listMine,
  createNotification,
  markRead,
  markAllRead,
} = require("./notification.controller");
const { auth, authorize } = require("../../middleware/auth");
const { validateNotificationCreate } = require("./notification.validation");
const { handleValidationErrors } = require("../../middleware/validation");

const router = express.Router();

router.use(auth);

router.get("/", listMine);
router.patch("/read-all", markAllRead);
router.post(
  "/",
  authorize("ADMIN"),
  validateNotificationCreate,
  handleValidationErrors,
  createNotification
);
router.patch("/:id/read", markRead);

module.exports = router;
