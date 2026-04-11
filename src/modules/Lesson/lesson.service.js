const prisma = require("../../config/database");
const Lesson = require("./lesson.model");

async function getCourse(courseId) {
  return await prisma.course.findFirst({
    where: { id: courseId, deletedAt: null },
    select: {
      id: true,
      instructorId: true,
      isPublished: true,
    },
  });
}

function canManageCourse(user, course) {
  if (!course) throw new Error("Course not found");
  if (user.role === "ADMIN") return true;
  if (user.role === "INSTRUCTOR" && course.instructorId === user.id) return true;
  return false;
}

async function isEnrolled(userId, courseId) {
  const row = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId },
    },
  });
  return !!row;
}

exports.listByCourse = async (courseId, user) => {
  const course = await getCourse(courseId);
  if (!course) throw new Error("Course not found");
  if (!course.isPublished && !canManageCourse(user, course)) {
    throw new Error("Course not found");
  }
  const publishedOnly = !canManageCourse(user, course);
  const lessons = await Lesson.findByCourseId(courseId, { publishedOnly });
  return lessons;
};

exports.getById = async (lessonId, user) => {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson || !lesson.course || lesson.course.deletedAt) {
    throw new Error("Lesson not found");
  }
  const { course } = lesson;
  if (canManageCourse(user, course)) {
    return lesson;
  }
  if (!course.isPublished) {
    throw new Error("Lesson not found");
  }
  const enrolled = await isEnrolled(user.id, course.id);
  if (lesson.isPublished || lesson.isFree) {
    return lesson;
  }
  if (enrolled) {
    return lesson;
  }
  throw new Error("Lesson not found");
};

exports.createLesson = async (payload, user) => {
  const course = await getCourse(payload.courseId);
  if (!canManageCourse(user, course)) {
    throw new Error("Not authorized to manage lessons for this course");
  }
  return await Lesson.create(payload);
};

exports.updateLesson = async (lessonId, payload, user) => {
  const existing = await Lesson.findById(lessonId);
  if (!existing) throw new Error("Lesson not found");
  if (!canManageCourse(user, existing.course)) {
    throw new Error("Not authorized to update this lesson");
  }
  return await Lesson.update(lessonId, payload);
};

exports.removeLesson = async (lessonId, user) => {
  const existing = await Lesson.findById(lessonId);
  if (!existing) throw new Error("Lesson not found");
  if (!canManageCourse(user, existing.course)) {
    throw new Error("Not authorized to delete this lesson");
  }
  return await Lesson.delete(lessonId);
};
