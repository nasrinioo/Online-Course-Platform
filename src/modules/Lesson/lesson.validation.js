const { body } = require("express-validator");

exports.validateLessonCreate = [
  body("courseId").trim().notEmpty().withMessage("courseId is required"),
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title must be at most 200 characters"),
  body("description").optional().trim().isLength({ max: 5000 }),
  body("content").optional().trim(),
  body("videoUrl").optional().trim().isURL().withMessage("videoUrl must be a URL"),
  body("duration").optional().isInt({ min: 0 }),
  body("order").isInt({ min: 0 }).withMessage("order must be a non-negative integer"),
  body("isPublished").optional().isBoolean(),
  body("isFree").optional().isBoolean(),
];

exports.validateLessonUpdate = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .isLength({ max: 200 }),
  body("description").optional().trim().isLength({ max: 5000 }),
  body("content").optional().trim(),
  body("videoUrl").optional().trim().isURL(),
  body("duration").optional().isInt({ min: 0 }),
  body("order").optional().isInt({ min: 0 }),
  body("isPublished").optional().isBoolean(),
  body("isFree").optional().isBoolean(),
];
