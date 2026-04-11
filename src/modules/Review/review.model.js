const prisma = require("../../config/database");

exports.findById = async (id) => {
  return await prisma.review.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
      course: {
        select: { id: true, title: true },
      },
    },
  });
};

exports.listByCourse = async (courseId) => {
  return await prisma.review.findMany({
    where: { courseId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

exports.create = async (data) => {
  return await prisma.review.create({
    data,
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
      course: { select: { id: true, title: true } },
    },
  });
};

exports.update = async (id, data) => {
  return await prisma.review.update({
    where: { id },
    data,
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
  });
};

exports.delete = async (id) => {
  return await prisma.review.delete({ where: { id } });
};
