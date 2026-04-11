const prisma = require("../../config/database");
const Enrollment = require("./enrollment.model");

function canViewCourseRoster(user, course) {
  if (!course) return false;
  if (user.role === "ADMIN") return true;
  return user.role === "INSTRUCTOR" && course.instructorId === user.id;
}

exports.enroll = async (userId, courseId) => {
  const course = await prisma.course.findFirst({
    where: { id: courseId, deletedAt: null },
    select: {
      id: true,
      isPublished: true,
      price: true,
    },
  });
  if (!course) throw new Error("Course not found");
  if (!course.isPublished) throw new Error("Course is not available for enrollment");

  const existing = await Enrollment.findByUserAndCourse(userId, courseId);
  if (existing) {
    throw new Error("Already enrolled in this course");
  }

  if (course.price > 0) {
    const paid = await prisma.payment.findFirst({
      where: {
        userId,
        courseId,
        status: "COMPLETED",
      },
    });
    if (!paid) {
      throw new Error("Payment required before enrollment");
    }
  }

  return await Enrollment.create({ userId, courseId });
};

exports.getMine = async (userId) => {
  return await Enrollment.listByUser(userId);
};

exports.getById = async (enrollmentId, user) => {
  const row = await Enrollment.findById(enrollmentId);
  if (!row) throw new Error("Enrollment not found");
  if (row.userId === user.id) return row;
  if (canViewCourseRoster(user, row.course)) return row;
  throw new Error("Not authorized to view this enrollment");
};

exports.listForCourse = async (courseId, user) => {
  const course = await prisma.course.findFirst({
    where: { id: courseId, deletedAt: null },
    select: { id: true, instructorId: true, isPublished: true },
  });
  if (!course) throw new Error("Course not found");
  if (!canViewCourseRoster(user, course)) {
    throw new Error("Not authorized to view enrollments for this course");
  }
  return await Enrollment.listByCourse(courseId);
};

exports.updateEnrollment = async (enrollmentId, data, user) => {
  const row = await Enrollment.findById(enrollmentId);
  if (!row) throw new Error("Enrollment not found");
  if (row.userId !== user.id && user.role !== "ADMIN") {
    throw new Error("Not authorized to update this enrollment");
  }
  const allowed = {};
  if (data.progress !== undefined) allowed.progress = data.progress;
  if (data.completedAt !== undefined) {
    allowed.completedAt =
      data.completedAt === null ? null : new Date(data.completedAt);
  }
  return await Enrollment.update(enrollmentId, allowed);
};
