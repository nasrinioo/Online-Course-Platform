const prisma = require("../../config/database");

exports.findById = async (id) => {
  return await prisma.lesson.findUnique({
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
    },
  });
};

exports.findByCourseId = async (courseId, { publishedOnly }) => {
  const where = { courseId };
  if (publishedOnly) {
    where.isPublished = true;
  }
  return await prisma.lesson.findMany({
    where,
    orderBy: { order: "asc" },
    include: {
      _count: { select: { attachments: true } },
    },
  });
};

exports.create = async (data) => {
  return await prisma.lesson.create({
    data,
    include: {
      course: {
        select: { id: true, title: true, instructorId: true },
      },
    },
  });
};

exports.update = async (id, data) => {
  return await prisma.lesson.update({
    where: { id },
    data,
    include: {
      course: {
        select: { id: true, title: true, instructorId: true },
      },
    },
  });
};

exports.delete = async (id) => {
  return await prisma.lesson.delete({ where: { id } });
};
