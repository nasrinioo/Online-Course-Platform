const express = require("express");
const {
  listByCourse,
  createReview,
  updateReview,
  deleteReview,
} = require("./review.controller");
const { auth } = require("../../middleware/auth");
const {
  validateReviewCreate,
  validateReviewUpdate,
  requireReviewUpdatePayload,
} = require("./review.validation");
const { handleValidationErrors } = require("../../middleware/validation");

const router = express.Router();

router.get("/course/:courseId", listByCourse);
router.post(
  "/",
  auth,
  validateReviewCreate,
  handleValidationErrors,
  createReview
);
router.put(
  "/:id",
  auth,
  requireReviewUpdatePayload,
  validateReviewUpdate,
  handleValidationErrors,
  updateReview
);
router.delete("/:id", auth, deleteReview);

module.exports = router;
