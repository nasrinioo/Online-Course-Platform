const EnrollmentService = require("./enrollment.service");
const ErrorHandler = require("../../utils/errorHandler");

exports.createEnrollment = async (req, res) => {
  try {
    const enrollment = await EnrollmentService.enroll(
      req.user.id,
      req.body.courseId
    );
    res.status(201).json({
      message: "Enrolled successfully",
      enrollment,
    });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Enroll");
  }
};

exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await EnrollmentService.getMine(req.user.id);
    res.json({ enrollments });
  } catch (error) {
    return ErrorHandler.handle(error, res, "My enrollments");
  }
};

exports.getById = async (req, res) => {
  try {
    const enrollment = await EnrollmentService.getById(
      req.params.id,
      req.user
    );
    res.json({ enrollment });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Get enrollment");
  }
};

exports.listByCourse = async (req, res) => {
  try {
    const enrollments = await EnrollmentService.listForCourse(
      req.params.courseId,
      req.user
    );
    res.json({ enrollments });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Course enrollments");
  }
};

exports.patchEnrollment = async (req, res) => {
  try {
    const enrollment = await EnrollmentService.updateEnrollment(
      req.params.id,
      req.body,
      req.user
    );
    res.json({ message: "Enrollment updated", enrollment });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Update enrollment");
  }
};
