const express = require("express");
const {
  createEnrollment,
  getMyEnrollments,
  getById,
  listByCourse,
  patchEnrollment,
} = require("./enrollment.controller");
const { auth } = require("../../middleware/auth");
const {
  validateEnroll,
  validateEnrollmentUpdate,
} = require("./enrollment.validation");
const { handleValidationErrors } = require("../../middleware/validation");

const router = express.Router();

router.use(auth);

router.post("/", validateEnroll, handleValidationErrors, createEnrollment);
router.get("/me", getMyEnrollments);
router.get("/course/:courseId", listByCourse);
router.get("/:id", getById);
router.patch(
  "/:id",
  validateEnrollmentUpdate,
  handleValidationErrors,
  patchEnrollment
);

module.exports = router;
