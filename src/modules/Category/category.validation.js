const { body } = require('express-validator');

// Category creation validation
exports.validateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_&]+$/)
    .withMessage('Category name can only contain letters, numbers, spaces, hyphens, underscores, and ampersands'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
];

// Category update validation
exports.validateCategoryUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_&]+$/)
    .withMessage('Category name can only contain letters, numbers, spaces, hyphens, underscores, and ampersands'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
];

// Search validation
exports.validateSearch = [
  body('q')
    .trim()
    .notEmpty()
    .withMessage('Search query is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
];
