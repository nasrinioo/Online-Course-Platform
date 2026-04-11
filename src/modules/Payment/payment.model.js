const prisma = require("../../config/database");

exports.findById = async (id) => {
  return await prisma.payment.findUnique({
    where: { id },
    include: {
      course: { select: { id: true, title: true, price: true } },
      user: {
        select: { id: true, email: true, firstName: true, lastName: true },
      },
    },
  });
};

exports.listByUser = async (userId) => {
  return await prisma.payment.findMany({
    where: { userId },
    include: {
      course: { select: { id: true, title: true, imageUrl: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

exports.create = async (data) => {
  return await prisma.payment.create({
    data,
    include: {
      course: { select: { id: true, title: true, price: true } },
    },
  });
};

exports.updateStatus = async (id, status, extra = {}) => {
  return await prisma.payment.update({
    where: { id },
    data: { status, ...extra },
    include: {
      course: { select: { id: true, title: true } },
      user: {
        select: { id: true, email: true, firstName: true, lastName: true },
      },
    },
  });
};
