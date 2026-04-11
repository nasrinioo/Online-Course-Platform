const express = require("express");
const {
  listByCourse,
  getById,
  createLesson,
  updateLesson,
  deleteLesson,
} = require("./lesson.controller");
const { auth, authorize } = require("../../middleware/auth");
const {
  validateLessonCreate,
  validateLessonUpdate,
} = require("./lesson.validation");
const { handleValidationErrors } = require("../../middleware/validation");

const router = express.Router();

router.get("/course/:courseId", listByCourse);
router.get("/:id", auth, getById);
router.post(
  "/",
  auth,
  authorize("INSTRUCTOR", "ADMIN"),
  validateLessonCreate,
  handleValidationErrors,
  createLesson
);
router.put(
  "/:id",
  auth,
  authorize("INSTRUCTOR", "ADMIN"),
  validateLessonUpdate,
  handleValidationErrors,
  updateLesson
);
router.delete(
  "/:id",
  auth,
  authorize("INSTRUCTOR", "ADMIN"),
  deleteLesson
);

module.exports = router;
