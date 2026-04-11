const prisma = require("../../config/database");
const Progress = require("./progress.model");

async function assertCanRecordProgress(userId, userRole, lesson) {
  if (!lesson || !lesson.course) throw new Error("Lesson not found");
  const course = await prisma.course.findFirst({
    where: { id: lesson.courseId, deletedAt: null },
    select: { id: true, instructorId: true },
  });
  if (!course) throw new Error("Lesson not found");
  if (userRole === "ADMIN") return;
  if (userRole === "INSTRUCTOR" && course.instructorId === userId) return;
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId: course.id },
    },
  });
  if (!enrollment) {
    throw new Error("Must be enrolled to update lesson progress");
  }
}

exports.listMine = async (userId) => {
  return await Progress.listByUser(userId);
};

exports.upsertForLesson = async (userId, userRole, lessonId, body) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      course: {
        select: { id: true, deletedAt: true, instructorId: true },
      },
    },
  });
  if (!lesson || lesson.course.deletedAt) {
    throw new Error("Lesson not found");
  }
  await assertCanRecordProgress(userId, userRole, lesson);

  const data = {};
  if (body.watchTime !== undefined) data.watchTime = body.watchTime;
  if (body.completed !== undefined) {
    data.completed = body.completed;
    data.completedAt = body.completed ? new Date() : null;
  }

  return await Progress.upsert(userId, lessonId, data);
};
