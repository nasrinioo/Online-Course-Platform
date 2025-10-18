const { body, query } = require("express-validator");

// Course validation rules
const validateCourse = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL"),

  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be a boolean value"),

  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be a boolean value"),

  body("difficulty")
    .optional()
    .isIn(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"])
    .withMessage(
      "Difficulty must be BEGINNER, INTERMEDIATE, ADVANCED, or EXPERT"
    ),

  body("duration")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive integer (minutes)"),

  body("language")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Language must be between 2 and 50 characters"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),

  body("tags.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Each tag must be between 1 and 50 characters"),

  body("categoryId")
    .optional()
    .isString()
    .withMessage("Category ID must be a string"),

  body("instructorId")
    .optional()
    .isString()
    .withMessage("Instructor ID must be a string")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Instructor ID must contain only letters, numbers, hyphens, and underscores"
    ),
];

// Course search validation
const validateCourseSearch = [
  query("q")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Search term must be at least 2 characters"),

  query("category")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category must be between 2 and 50 characters"),

  query("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  query("level")
    .optional()
    .isIn(["BEGINNER", "INTERMEDIATE", "ADVANCED"])
    .withMessage("Level must be BEGINNER, INTERMEDIATE, or ADVANCED"),
];

module.exports = {
  validateCourse,
  validateCourseSearch,
};
