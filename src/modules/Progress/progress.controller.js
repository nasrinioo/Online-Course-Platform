const ProgressService = require("./progress.service");
const ErrorHandler = require("../../utils/errorHandler");

exports.listMine = async (req, res) => {
  try {
    const progress = await ProgressService.listMine(req.user.id);
    res.json({ progress });
  } catch (error) {
    return ErrorHandler.handle(error, res, "List progress");
  }
};

exports.upsertLessonProgress = async (req, res) => {
  try {
    const record = await ProgressService.upsertForLesson(
      req.user.id,
      req.user.role,
      req.params.lessonId,
      req.body
    );
    res.json({ message: "Progress saved", progress: record });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Save progress");
  }
};
