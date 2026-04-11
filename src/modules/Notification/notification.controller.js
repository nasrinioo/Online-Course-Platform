const NotificationService = require("./notification.service");
const ErrorHandler = require("../../utils/errorHandler");

exports.listMine = async (req, res) => {
  try {
    const notifications = await NotificationService.listMine(
      req.user.id,
      req.query
    );
    res.json({ notifications });
  } catch (error) {
    return ErrorHandler.handle(error, res, "List notifications");
  }
};

exports.createNotification = async (req, res) => {
  try {
    const notification = await NotificationService.createForUser(
      req.user.role,
      req.body
    );
    res.status(201).json({ message: "Notification created", notification });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Create notification");
  }
};

exports.markRead = async (req, res) => {
  try {
    const notification = await NotificationService.markAsRead(
      req.params.id,
      req.user.id
    );
    res.json({ message: "Notification marked read", notification });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Mark notification read");
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await NotificationService.markAllAsRead(req.user.id);
    res.json({ message: "All notifications marked read" });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Mark all read");
  }
};
