const { body } = require("express-validator");

exports.validateEnroll = [
  body("courseId").trim().notEmpty().withMessage("courseId is required"),
];

exports.validateEnrollmentUpdate = [
  body("progress")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("progress must be between 0 and 100"),
  body("completedAt")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("completedAt must be a valid ISO date"),
];
