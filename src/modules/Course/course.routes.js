const express = require("express");
const CourseController = require("./course.controller");
const { auth, authorize } = require("../../middleware/auth");
const { validateCourse, validateCourseSearch } = require("./course.validation");
const { handleValidationErrors } = require("../../middleware/validation");

const router = express.Router();

router.get("/", CourseController.getAllCourses);
router.get("/trending", CourseController.getTrendingCourses);
router.get("/search", validateCourseSearch, handleValidationErrors, CourseController.searchCourses);
router.get("/stats", auth, authorize("ADMIN"), CourseController.getCourseStats);
router.get("/deleted", auth, authorize("ADMIN"), CourseController.getDeletedCourses);
router.get("/:id", CourseController.getCourseById);
router.post(
  "/",
  auth,
  authorize("INSTRUCTOR", "ADMIN"),
  validateCourse,
  handleValidationErrors,
  CourseController.createCourse
);
router.put(
  "/:id",
  auth,
  authorize("INSTRUCTOR", "ADMIN"),
  validateCourse,
  handleValidationErrors,
  CourseController.updateCourse
);
router.delete(
  "/:id",
  auth,
  authorize("INSTRUCTOR", "ADMIN"),
  CourseController.deleteCourse
);
router.get(
  "/instructor/:instructorId",
  CourseController.getCoursesByInstructor
);

// Admin only routes for soft delete management
router.patch(
  "/:id/restore",
  auth,
  authorize("ADMIN"),
  CourseController.restoreCourse
);

router.delete(
  "/:id/hard-delete",
  auth,
  authorize("ADMIN"),
  CourseController.hardDeleteCourse
);

module.exports = router;
