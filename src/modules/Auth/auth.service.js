const bcrypt = require("bcryptjs");
const User = require("../User/user.model");
const { generateToken } = require("../../utils/jwt");

exports.signup = async (userData) => {
  const { email, password, firstName, lastName, role } = userData;

  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    role,
    avatar: null,
    bio: null,
    isActive: true,
  });

  const token = generateToken(user.id, user.role);

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    },
    token,
  };
};

exports.login = async (email, password) => {
  const user = await User.findByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (!user.isActive) {
    throw new Error("Account is deactivated");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user.id, user.role);

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    },
    token,
  };
};

exports.changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findByEmail(user.email);
  if (!user) {
    throw new Error("User not found");
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password
  );
  if (!isCurrentPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 12);

  await User.update(userId, { password: hashedNewPassword });

  return { message: "Password updated successfully" };
};

exports.verifyEmail = async (userId) => {
  return await User.verifyEmail(userId);
};

exports.toggleAccountStatus = async (userId) => {
  return await User.toggleActiveStatus(userId);
};
