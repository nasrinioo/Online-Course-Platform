const prisma = require("../../config/database");

exports.findById = async (id) => {
  return await prisma.enrollment.findUnique({
    where: { id },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          instructorId: true,
          isPublished: true,
          deletedAt: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

exports.findByUserAndCourse = async (userId, courseId) => {
  return await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId },
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          instructorId: true,
          isPublished: true,
          deletedAt: true,
        },
      },
    },
  });
};

exports.listByUser = async (userId) => {
  return await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          imageUrl: true,
          price: true,
          isPublished: true,
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });
};

exports.listByCourse = async (courseId) => {
  return await prisma.enrollment.findMany({
    where: { courseId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });
};

exports.create = async (data) => {
  return await prisma.enrollment.create({
    data,
    include: {
      course: {
        select: {
          id: true,
          title: true,
          imageUrl: true,
          price: true,
        },
      },
    },
  });
};

exports.update = async (id, data) => {
  return await prisma.enrollment.update({
    where: { id },
    data,
    include: {
      course: {
        select: { id: true, title: true },
      },
    },
  });
};
