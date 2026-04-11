const { body } = require("express-validator");

exports.validateProgressUpsert = [
  body("watchTime").optional().isInt({ min: 0 }),
  body("completed").optional().isBoolean(),
];
