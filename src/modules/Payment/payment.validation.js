const { body } = require("express-validator");

exports.validatePaymentCreate = [
  body("courseId").trim().notEmpty().withMessage("courseId is required"),
  body("amount").optional().isFloat({ min: 0 }),
  body("currency").optional().trim().isLength({ min: 3, max: 8 }),
  body("paymentMethod").optional().trim().isLength({ max: 100 }),
  body("transactionId").optional().trim().isLength({ max: 200 }),
];

const paymentStatuses = [
  "PENDING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
  "CANCELLED",
];

exports.validatePaymentStatus = [
  body("status")
    .trim()
    .notEmpty()
    .isIn(paymentStatuses)
    .withMessage(`status must be one of: ${paymentStatuses.join(", ")}`),
  body("transactionId").optional().trim().isLength({ max: 200 }),
];
