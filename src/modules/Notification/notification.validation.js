const { body } = require("express-validator");

const types = [
  "COURSE_UPDATE",
  "NEW_LESSON",
  "PAYMENT_SUCCESS",
  "PAYMENT_FAILED",
  "SYSTEM_MESSAGE",
];

exports.validateNotificationCreate = [
  body("userId").trim().notEmpty().withMessage("userId is required"),
  body("title")
    .trim()
    .notEmpty()
    .isLength({ max: 200 })
    .withMessage("title is required (max 200 chars)"),
  body("message").trim().notEmpty().isLength({ max: 2000 }),
  body("type")
    .trim()
    .notEmpty()
    .isIn(types)
    .withMessage(`type must be one of: ${types.join(", ")}`),
];
