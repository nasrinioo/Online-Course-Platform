const prisma = require("../../config/database");
const Review = require("./review.model");

exports.listByCourse = async (courseId) => {
  const course = await prisma.course.findFirst({
    where: { id: courseId, deletedAt: null, isPublished: true },
  });
  if (!course) throw new Error("Course not found");
  return await Review.listByCourse(courseId);
};

exports.createReview = async (userId, payload) => {
  const course = await prisma.course.findFirst({
    where: { id: payload.courseId, deletedAt: null, isPublished: true },
  });
  if (!course) throw new Error("Course not found");

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId: payload.courseId },
    },
  });
  if (!enrollment) {
    throw new Error("Must be enrolled to review this course");
  }

  const existing = await prisma.review.findUnique({
    where: {
      userId_courseId: { userId, courseId: payload.courseId },
    },
  });
  if (existing) {
    throw new Error("You have already reviewed this course");
  }

  return await Review.create({
    userId,
    courseId: payload.courseId,
    rating: payload.rating,
    comment: payload.comment ?? null,
  });
};

exports.updateReview = async (reviewId, userId, payload) => {
  const row = await Review.findById(reviewId);
  if (!row) throw new Error("Review not found");
  if (row.userId !== userId) {
    throw new Error("Not authorized to update this review");
  }
  const data = {};
  if (payload.rating !== undefined) data.rating = payload.rating;
  if (payload.comment !== undefined) data.comment = payload.comment;
  return await Review.update(reviewId, data);
};

exports.deleteReview = async (reviewId, userId, role) => {
  const row = await Review.findById(reviewId);
  if (!row) throw new Error("Review not found");
  if (row.userId !== userId && role !== "ADMIN") {
    throw new Error("Not authorized to delete this review");
  }
  return await Review.delete(reviewId);
};
