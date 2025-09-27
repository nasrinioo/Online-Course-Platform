const User = require("./user.model");
const { deleteImage } = require("../../utils/cloudinary");
const { executePrismaTransaction } = require("../../utils/transactions");

exports.getUserById = async (userId) => {
  return await User.findById(userId);
};

exports.getAllUsers = async () => {
  return await User.findAll();
};

exports.updateUser = async (userId, updateData) => {
  return await User.update(userId, updateData);
};

exports.deleteUser = async (userId) => {
  return await User.delete(userId);
};

exports.getUsersByRole = async (role) => {
  return await User.findByRole(role);
};

exports.searchUsers = async (searchTerm) => {
  return await User.search(searchTerm);
};

exports.getUserStats = async () => {
  return await User.getStats();
};

exports.uploadAvatar = async (userId, uploadedAvatar) => {
  try {
    return await executePrismaTransaction(async (tx) => {
      const currentUser = await tx.user.findUnique({
        where: { id: userId },
        select: { avatar: true },
      });

      if (currentUser.avatar) {
        try {
          const avatarUrl = currentUser.avatar;
          const publicIdMatch = avatarUrl.match(/\/v\d+\/([^\/]+)\./);
          if (publicIdMatch) {
            const publicId = publicIdMatch[1];
            await deleteImage(publicId);
          }
        } catch (error) {
          console.error("Error deleting old avatar:", error);
        }
      }

      return await tx.user.update({
        where: { id: userId },
        data: { avatar: uploadedAvatar.url },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          avatar: true,
          bio: true,
          isActive: true,
          emailVerified: true,
          updatedAt: true,
        },
      });
    });
  } catch (error) {
    throw new Error(`Avatar upload failed: ${error.message}`);
  }
};

exports.removeAvatar = async (userId) => {
  try {
    return await executePrismaTransaction(async (tx) => {
      const currentUser = await tx.user.findUnique({
        where: { id: userId },
        select: { avatar: true },
      });

      if (currentUser.avatar) {
        try {
          const avatarUrl = currentUser.avatar;
          const publicIdMatch = avatarUrl.match(/\/v\d+\/([^\/]+)\./);
          if (publicIdMatch) {
            const publicId = publicIdMatch[1];
            await deleteImage(publicId);
          }
        } catch (error) {
          console.error("Error deleting avatar:", error);
        }
      }

      return await tx.user.update({
        where: { id: userId },
        data: { avatar: null },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          avatar: true,
          bio: true,
          isActive: true,
          emailVerified: true,
          updatedAt: true,
        },
      });
    });
  } catch (error) {
    throw new Error(`Avatar removal failed: ${error.message}`);
  }
};
