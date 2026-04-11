const express = require("express");
const {
  listMine,
  getById,
  createPayment,
  patchStatus,
} = require("./payment.controller");
const { auth, authorize } = require("../../middleware/auth");
const {
  validatePaymentCreate,
  validatePaymentStatus,
} = require("./payment.validation");
const { handleValidationErrors } = require("../../middleware/validation");

const router = express.Router();

router.use(auth);

router.get("/me", listMine);
router.get("/:id", getById);
router.post(
  "/",
  validatePaymentCreate,
  handleValidationErrors,
  createPayment
);
router.patch(
  "/:id/status",
  authorize("ADMIN"),
  validatePaymentStatus,
  handleValidationErrors,
  patchStatus
);

module.exports = router;
