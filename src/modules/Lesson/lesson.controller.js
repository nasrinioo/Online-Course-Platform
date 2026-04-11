const LessonService = require("./lesson.service");
const ErrorHandler = require("../../utils/errorHandler");

const guestUser = { id: null, role: "STUDENT" };

exports.listByCourse = async (req, res) => {
  try {
    const user = req.user || guestUser;
    const lessons = await LessonService.listByCourse(req.params.courseId, user);
    res.json({ lessons });
  } catch (error) {
    return ErrorHandler.handle(error, res, "List lessons");
  }
};

exports.getById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const lesson = await LessonService.getById(req.params.id, req.user);
    res.json({ lesson });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Get lesson");
  }
};

exports.createLesson = async (req, res) => {
  try {
    const lesson = await LessonService.createLesson(req.body, req.user);
    res.status(201).json({ message: "Lesson created successfully", lesson });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Create lesson");
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const lesson = await LessonService.updateLesson(
      req.params.id,
      req.body,
      req.user
    );
    res.json({ message: "Lesson updated successfully", lesson });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Update lesson");
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    await LessonService.removeLesson(req.params.id, req.user);
    res.json({ message: "Lesson deleted successfully" });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Delete lesson");
  }
};
