const prisma = require('../../config/database');

class Course {
  // Find course by ID
  static async findById(id) {
    return await prisma.course.findUnique({
      where: { id },
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
          orderBy: { order: 'asc' },
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
      where: { isPublished: true },
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
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get trending courses
  static async findTrending() {
    return await prisma.course.findMany({
      where: { isPublished: true },
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
          _count: 'desc',
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

  // Delete course
  static async delete(id) {
    return await prisma.course.delete({
      where: { id },
    });
  }

  // Find courses by instructor
  static async findByInstructor(instructorId) {
    return await prisma.course.findMany({
      where: { instructorId },
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
      orderBy: { createdAt: 'desc' },
    });
  }

  // Search courses
  static async search(filters) {
    const { q, category, price, level } = filters;
    
    const where = {
      isPublished: true,
    };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (price) {
      where.price = { lte: parseFloat(price) };
    }

    return await prisma.course.findMany({
      where,
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
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get course statistics
  static async getStats() {
    const totalCourses = await prisma.course.count();
    const publishedCourses = await prisma.course.count({ where: { isPublished: true } });
    const totalEnrollments = await prisma.enrollment.count();

    return {
      total: totalCourses,
      published: publishedCourses,
      totalEnrollments,
    };
  }
}

module.exports = Course; 