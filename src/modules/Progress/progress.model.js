const prisma = require("../../config/database");

exports.findByUserAndLesson = async (userId, lessonId) => {
  return await prisma.lessonProgress.findUnique({
    where: {
      userId_lessonId: { userId, lessonId },
    },
    include: {
      lesson: {
        select: {
          id: true,
          title: true,
          courseId: true,
        },
      },
    },
  });
};

exports.listByUser = async (userId) => {
  return await prisma.lessonProgress.findMany({
    where: { userId },
    include: {
      lesson: {
        select: {
          id: true,
          title: true,
          courseId: true,
          order: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
};

exports.upsert = async (userId, lessonId, data) => {
  return await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: { userId, lessonId },
    },
    create: {
      userId,
      lessonId,
      ...data,
    },
    update: data,
    include: {
      lesson: {
        select: { id: true, title: true, courseId: true },
      },
    },
  });
};
