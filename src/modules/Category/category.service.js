const Category = require("./category.model");
const { deleteImage } = require("../../utils/cloudinary");
const { executePrismaTransaction } = require("../../utils/transactions");

exports.getCategoryById = async (categoryId) => {
  return await Category.findById(categoryId);
};

exports.getAllCategories = async () => {
  return await Category.findAll();
};

exports.getAllCategoriesWithCourses = async () => {
  return await Category.findAllWithCourses();
};

exports.createCategory = async (categoryData) => {
  // Check if category name already exists
  const existingCategory = await Category.findByName(categoryData.name);
  if (existingCategory) {
    throw new Error("Category with this name already exists");
  }

  return await Category.create(categoryData);
};

exports.updateCategory = async (categoryId, updateData) => {
  // If updating name, check if new name already exists
  if (updateData.name) {
    const existingCategory = await Category.findByName(updateData.name);
    if (existingCategory && existingCategory.id !== categoryId) {
      throw new Error("Category with this name already exists");
    }
  }

  return await Category.update(categoryId, updateData);
};

exports.deleteCategory = async (categoryId) => {
  return await Category.delete(categoryId);
};

exports.searchCategories = async (searchTerm) => {
  return await Category.search(searchTerm);
};

exports.getCategoryStats = async () => {
  return await Category.getStats();
};

exports.toggleCategoryStatus = async (categoryId) => {
  return await Category.toggleActiveStatus(categoryId);
};

exports.getCategoriesWithCourseCount = async () => {
  return await Category.getCategoriesWithCourseCount();
};

exports.uploadCategoryImage = async (categoryId, uploadedImage) => {
  try {
    return await executePrismaTransaction(async (tx) => {
      const currentCategory = await tx.category.findUnique({
        where: { id: categoryId },
        select: { imageUrl: true },
      });

      if (currentCategory.imageUrl) {
        try {
          const imageUrl = currentCategory.imageUrl;
          const publicIdMatch = imageUrl.match(/\/v\d+\/([^\/]+)\./);
          if (publicIdMatch) {
            const publicId = publicIdMatch[1];
            await deleteImage(publicId);
          }
        } catch (error) {
          console.error("Error deleting old category image:", error);
        }
      }

      return await tx.category.update({
        where: { id: categoryId },
        data: { imageUrl: uploadedImage.url },
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
          isActive: true,
          updatedAt: true,
        },
      });
    });
  } catch (error) {
    throw new Error(`Category image upload failed: ${error.message}`);
  }
};

exports.removeCategoryImage = async (categoryId) => {
  try {
    return await executePrismaTransaction(async (tx) => {
      const currentCategory = await tx.category.findUnique({
        where: { id: categoryId },
        select: { imageUrl: true },
      });

      if (currentCategory.imageUrl) {
        try {
          const imageUrl = currentCategory.imageUrl;
          const publicIdMatch = imageUrl.match(/\/v\d+\/([^\/]+)\./);
          if (publicIdMatch) {
            const publicId = publicIdMatch[1];
            await deleteImage(publicId);
          }
        } catch (error) {
          console.error("Error deleting category image:", error);
        }
      }

      return await tx.category.update({
        where: { id: categoryId },
        data: { imageUrl: null },
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
          isActive: true,
          updatedAt: true,
        },
      });
    });
  } catch (error) {
    throw new Error(`Category image removal failed: ${error.message}`);
  }
};
