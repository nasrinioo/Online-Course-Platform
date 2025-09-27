const UserService = require("./user.service");

exports.getProfile = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    const updatedUser = await UserService.updateUser(req.user.id, {
      firstName,
      lastName,
      email,
    });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const users = await UserService.getUsersByRole(role);
    res.json({ users });
  } catch (error) {
    console.error("Get users by role error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const users = await UserService.searchUsers(q);
    res.json({ users });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const stats = await UserService.getUserStats();
    res.json({ stats });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    const uploadedAvatar = req.uploadedAvatar;

    if (!uploadedAvatar) {
      return res.status(400).json({ error: "No avatar uploaded" });
    }

    const userId = res.locals?.user?.id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User ID not found" });
    }

    const updatedUser = await UserService.uploadAvatar(userId, uploadedAvatar);

    req.saveUserSession({
      avatarUpdated: new Date(),
      avatarUrl: uploadedAvatar.url,
      userId: userId,
    });

    res.json({
      message: "Avatar uploaded successfully",
      user: updatedUser,
      avatar: uploadedAvatar,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({ error: "Avatar upload failed" });
  }
};

exports.removeAvatar = async (req, res) => {
  try {
    const userId = res.locals?.user?.id || req.user?.id;

    const updatedUser = await UserService.removeAvatar(userId);

    if (userId) {
      req.saveUserSession({
        avatarRemoved: new Date(),
      });
    }

    res.json({
      message: "Avatar removed successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Avatar removal error:", error);
    res.status(500).json({ error: "Avatar removal failed" });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const { theme, notifications, language, emailUpdates } = req.body;

    const preferences = {
      theme: theme || "light",
      notifications: notifications !== undefined ? notifications : true,
      language: language || "en",
      emailUpdates: emailUpdates !== undefined ? emailUpdates : true,
      updatedAt: new Date(),
    };

    const result = req.saveUserPreferences(preferences);

    if (result.success) {
      res.json({
        message: "Preferences updated successfully",
        preferences,
      });
    } else {
      res.status(500).json({ error: "Failed to update preferences" });
    }
  } catch (error) {
    console.error("Update preferences error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//  (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//  (Admin only)
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//  (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    await UserService.deleteUser(userId);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
