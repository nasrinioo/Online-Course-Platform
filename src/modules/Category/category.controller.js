const CategoryService = require("./category.service");
const ErrorHandler = require("../../utils/errorHandler");

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const { withCourses } = req.query;

    let categories;
    if (withCourses === "true") {
      categories = await CategoryService.getAllCategoriesWithCourses();
    } else {
      categories = await CategoryService.getAllCategories();
    }

    res.json({ categories });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Get categories");
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryService.getCategoryById(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ category });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Get category");
  }
};

// Search categories
exports.searchCategories = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const categories = await CategoryService.searchCategories(q);
    res.json({ categories });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Search categories");
  }
};

// Get category statistics
exports.getCategoryStats = async (req, res) => {
  try {
    const stats = await CategoryService.getCategoryStats();
    res.json({ stats });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Get category stats");
  }
};

// Get categories with course count
exports.getCategoriesWithCourseCount = async (req, res) => {
  try {
    const categories = await CategoryService.getCategoriesWithCourseCount();
    res.json({ categories });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Get categories with course count");
  }
};

// Create new category (Admin only)
exports.createCategory = async (req, res) => {
  try {
    const categoryData = req.body;

    const category = await CategoryService.createCategory(categoryData);

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Create category");
  }
};

// Update category (Admin only)
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const category = await CategoryService.updateCategory(id, updateData);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Update category");
  }
};

// Delete category (Admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await CategoryService.deleteCategory(id);

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Delete category");
  }
};

// Toggle category status (Admin only)
exports.toggleCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await CategoryService.toggleCategoryStatus(id);

    res.json({
      message: "Category status updated successfully",
      category,
    });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Toggle category status");
  }
};

// Upload category image (Admin only)
exports.uploadCategoryImage = async (req, res) => {
  try {
    const uploadedImage = req.uploadedFile;

    if (!uploadedImage) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const { id } = req.params;

    const updatedCategory = await CategoryService.uploadCategoryImage(
      id,
      uploadedImage
    );

    res.json({
      message: "Category image uploaded successfully",
      category: updatedCategory,
      image: uploadedImage,
    });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Category image upload");
  }
};

// Remove category image (Admin only)
exports.removeCategoryImage = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCategory = await CategoryService.removeCategoryImage(id);

    res.json({
      message: "Category image removed successfully",
      category: updatedCategory,
    });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Category image removal");
  }
};
