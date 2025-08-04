const User = require('./user.model');

// Get user by ID
exports.getUserById = async (userId) => {
  return await User.findById(userId);
};

// Get all users
exports.getAllUsers = async () => {
  return await User.findAll();
};

// Update user
exports.updateUser = async (userId, updateData) => {
  return await User.update(userId, updateData);
};

// Delete user
exports.deleteUser = async (userId) => {
  return await User.delete(userId);
};

// Get users by role
exports.getUsersByRole = async (role) => {
  return await User.findByRole(role);
};

// Search users
exports.searchUsers = async (searchTerm) => {
  return await User.search(searchTerm);
};

// Get user statistics
exports.getUserStats = async () => {
  return await User.getStats();
}; 