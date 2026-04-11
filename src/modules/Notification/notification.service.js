const prisma = require("../../config/database");
const Notification = require("./notification.model");

exports.listMine = async (userId, query) => {
  const unreadOnly = query.unreadOnly === "true" || query.unreadOnly === "1";
  return await Notification.listByUser(userId, { unreadOnly });
};

exports.createForUser = async (actorRole, payload) => {
  if (actorRole !== "ADMIN") {
    throw new Error("Not authorized to create notifications");
  }
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true },
  });
  if (!user) throw new Error("User not found");

  return await Notification.create({
    userId: payload.userId,
    title: payload.title,
    message: payload.message,
    type: payload.type,
  });
};

exports.markAsRead = async (notificationId, userId) => {
  const row = await Notification.findById(notificationId);
  if (!row || row.userId !== userId) {
    throw new Error("Notification not found");
  }
  return await Notification.markRead(notificationId);
};

exports.markAllAsRead = async (userId) => {
  await Notification.markAllRead(userId);
  return { updated: true };
};
