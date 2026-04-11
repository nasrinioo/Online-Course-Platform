const prisma = require("../../config/database");

exports.findById = async (id) => {
  return await prisma.notification.findUnique({ where: { id } });
};

exports.listByUser = async (userId, { unreadOnly } = {}) => {
  const where = { userId };
  if (unreadOnly) where.isRead = false;
  return await prisma.notification.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
};

exports.create = async (data) => {
  return await prisma.notification.create({ data });
};

exports.markRead = async (id) => {
  return await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
};

exports.markAllRead = async (userId) => {
  return await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
};
