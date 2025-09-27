const prisma = require("../../config/database");

exports.findByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

exports.findById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
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
      createdAt: true,
      updatedAt: true,
    },
  });
};

exports.create = async (userData) => {
  return await prisma.$transaction(async (tx) => {
    return await tx.user.create({
      data: userData,
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
        createdAt: true,
      },
    });
  });
};

exports.findAll = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      avatar: true,
      bio: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

exports.update = async (id, updateData) => {
  return await prisma.$transaction(async (tx) => {
    return await tx.user.update({
      where: { id },
      data: updateData,
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
};

exports.delete = async (id) => {
  return await prisma.$transaction(async (tx) => {
    return await tx.user.delete({
      where: { id },
    });
  });
};

exports.findByRole = async (role) => {
  return await prisma.user.findMany({
    where: { role },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      avatar: true,
      bio: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

exports.search = async (searchTerm) => {
  return await prisma.user.findMany({
    where: {
      OR: [
        { firstName: { contains: searchTerm, mode: "insensitive" } },
        { lastName: { contains: searchTerm, mode: "insensitive" } },
        { email: { contains: searchTerm, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      avatar: true,
      bio: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

exports.getStats = async () => {
  const totalUsers = await prisma.user.count();
  const students = await prisma.user.count({ where: { role: "STUDENT" } });
  const instructors = await prisma.user.count({
    where: { role: "INSTRUCTOR" },
  });
  const admins = await prisma.user.count({ where: { role: "ADMIN" } });

  return {
    total: totalUsers,
    students,
    instructors,
    admins,
  };
};

exports.verifyEmail = async (userId) => {
  return await prisma.$transaction(async (tx) => {
    return await tx.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() },
    });
  });
};

exports.updateProfile = async (userId, profileData) => {
  return await prisma.$transaction(async (tx) => {
    return await tx.user.update({
      where: { id: userId },
      data: profileData,
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
};

exports.toggleActiveStatus = async (userId) => {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { isActive: true },
    });

    return await tx.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    });
  });
};
