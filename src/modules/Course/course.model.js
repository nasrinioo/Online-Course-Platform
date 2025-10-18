const prisma = require("../../config/database");

class Course {
  static async findById(id) {
    return await prisma.course.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        lessons: {
          where: { isPublished: true },
          orderBy: { order: "asc" },
        },
        _count: {
          select: {
            lessons: true,
            enrollments: true,
          },
        },
      },
    });
  }

  // Get all published courses
  static async findPublished() {
    return await prisma.course.findMany({
      where: {
        isPublished: true,
        deletedAt: null,
      },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            lessons: true,
            enrollments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Get trending courses
  static async findTrending() {
    return await prisma.course.findMany({
      where: {
        isPublished: true,
        deletedAt: null,
      },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            lessons: true,
            enrollments: true,
          },
        },
      },
      orderBy: {
        enrollments: {
          _count: "desc",
        },
      },
      take: 10,
    });
  }

  // Create new course
  static async create(courseData) {
    return await prisma.course.create({
      data: courseData,
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  // Update course
  static async update(id, updateData) {
    return await prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  // Soft delete course
  static async delete(id) {
    return await prisma.course.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isPublished: false,
      },
    });
  }

  // Hard delete course (admin only)
  static async hardDelete(id) {
    return await prisma.course.delete({
      where: { id },
    });
  }

  // Restore soft deleted course
  static async restore(id) {
    return await prisma.course.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }

  // Get soft deleted courses (admin only)
  static async findDeleted() {
    return await prisma.course.findMany({
      where: {
        deletedAt: { not: null },
      },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            lessons: true,
            enrollments: true,
          },
        },
      },
      orderBy: { deletedAt: "desc" },
    });
  }

  // Find courses by instructor
  static async findByInstructor(instructorId) {
    return await prisma.course.findMany({
      where: {
        instructorId,
        deletedAt: null,
      },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            lessons: true,
            enrollments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Search courses
  static async search(filters) {
    const { q, category, price, level } = filters;

    const where = {
      isPublished: true,
      deletedAt: null,
    };

    // Text search in title and description
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { tags: { has: q } }, // Search in tags array
      ];
    }

    // Category filter
    if (category) {
      where.categoryId = category;
    }

    // Price filter (maximum price)
    if (price) {
      where.price = { lte: parseFloat(price) };
    }

    // Difficulty level filter
    if (level) {
      where.difficulty = level.toUpperCase();
    }

    return await prisma.course.findMany({
      where,
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        _count: {
          select: {
            lessons: true,
            enrollments: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Get course statistics
  static async getStats() {
    const totalCourses = await prisma.course.count();
    const publishedCourses = await prisma.course.count({
      where: { isPublished: true },
    });
    const totalEnrollments = await prisma.enrollment.count();

    return {
      total: totalCourses,
      published: publishedCourses,
      totalEnrollments,
    };
  }
}

module.exports = Course;
