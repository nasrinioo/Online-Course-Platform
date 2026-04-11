const ReviewService = require("./review.service");
const ErrorHandler = require("../../utils/errorHandler");

exports.listByCourse = async (req, res) => {
  try {
    const reviews = await ReviewService.listByCourse(req.params.courseId);
    res.json({ reviews });
  } catch (error) {
    return ErrorHandler.handle(error, res, "List reviews");
  }
};

exports.createReview = async (req, res) => {
  try {
    const review = await ReviewService.createReview(req.user.id, req.body);
    res.status(201).json({ message: "Review created", review });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Create review");
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await ReviewService.updateReview(
      req.params.id,
      req.user.id,
      req.body
    );
    res.json({ message: "Review updated", review });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Update review");
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await ReviewService.deleteReview(
      req.params.id,
      req.user.id,
      req.user.role
    );
    res.json({ message: "Review deleted" });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Delete review");
  }
};
