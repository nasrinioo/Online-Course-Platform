const { body } = require("express-validator");

exports.validateReviewCreate = [
  body("courseId").trim().notEmpty().withMessage("courseId is required"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("rating must be an integer between 1 and 5"),
  body("comment").optional().trim().isLength({ max: 2000 }),
];

exports.requireReviewUpdatePayload = (req, res, next) => {
  if (req.body.rating === undefined && req.body.comment === undefined) {
    return res.status(400).json({
      error: "Provide rating and/or comment to update",
    });
  }
  next();
};

exports.validateReviewUpdate = [
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("rating must be an integer between 1 and 5"),
  body("comment").optional().trim().isLength({ max: 2000 }),
];
