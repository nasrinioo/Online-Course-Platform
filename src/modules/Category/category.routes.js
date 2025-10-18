const express = require("express");
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  searchCategories,
  getCategoryStats,
  toggleCategoryStatus,
  getCategoriesWithCourseCount,
  uploadCategoryImage,
  removeCategoryImage,
} = require("./category.controller");
const { auth, authorize } = require("../../middleware/auth");
const {
  validateCategory,
  validateCategoryUpdate,
} = require("./category.validation");
const { handleValidationErrors } = require("../../middleware/validation");
const {
  uploadSingleImage: uploadImageMiddleware,
} = require("../../middleware/upload");
const { attachServerStorage } = require("../../middleware/serverStorage");

const router = express.Router();

router.use(attachServerStorage);

// Public routes
router.get("/", getAllCategories);
router.get("/stats", getCategoryStats);
router.get("/with-course-count", getCategoriesWithCourseCount);
router.get("/search", searchCategories);
router.get("/:id", getCategoryById);

// Admin only routes
router.post(
  "/",
  auth,
  authorize("ADMIN"),
  validateCategory,
  handleValidationErrors,
  createCategory
);

router.put(
  "/:id",
  auth,
  authorize("ADMIN"),
  validateCategoryUpdate,
  handleValidationErrors,
  updateCategory
);

router.delete("/:id", auth, authorize("ADMIN"), deleteCategory);

router.put(
  "/:id/toggle-status",
  auth,
  authorize("ADMIN"),
  toggleCategoryStatus
);

router.put(
  "/:id/image",
  auth,
  authorize("ADMIN"),
  uploadImageMiddleware,
  uploadCategoryImage
);

router.delete("/:id/image", auth, authorize("ADMIN"), removeCategoryImage);

module.exports = router;
