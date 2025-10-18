const Course = require("./course.model");
const User = require("../User/user.model");

class CourseService {
  static async getPublishedCourses() {
    return await Course.findPublished();
  }

  static async getTrendingCourses() {
    return await Course.findTrending();
  }
  static async getCourseById(id) {
    return await Course.findById(id);
  }

  static async createCourse(courseData) {
    if (courseData.instructorId) {
      const instructor = await User.findById(courseData.instructorId);
      if (!instructor) {
        throw new Error("Instructor not found");
      }
      if (instructor.role !== "INSTRUCTOR" && instructor.role !== "ADMIN") {
        throw new Error("User is not an instructor");
      }
    }

    return await Course.create(courseData);
  }

  static async updateCourse(id, updateData, user) {
    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      throw new Error("Course not found");
    }

    if (existingCourse.instructorId !== user.id && user.role !== "ADMIN") {
      throw new Error("Not authorized to update this course");
    }

    return await Course.update(id, updateData);
  }

  static async deleteCourse(id, user) {
    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      throw new Error("Course not found");
    }

    if (existingCourse.instructorId !== user.id && user.role !== "ADMIN") {
      throw new Error("Not authorized to delete this course");
    }

    return await Course.delete(id);
  }

  static async getCoursesByInstructor(instructorId) {
    return await Course.findByInstructor(instructorId);
  }

  static async searchCourses(filters) {
    return await Course.search(filters);
  }

  static async getCourseStats() {
    return await Course.getStats();
  }

  // Get soft deleted courses (admin only)
  static async getDeletedCourses() {
    return await Course.findDeleted();
  }

  // Restore soft deleted course (admin only)
  static async restoreCourse(id, user) {
    if (user.role !== "ADMIN") {
      throw new Error("Only admins can restore courses");
    }

    const course = await Course.findById(id);
    if (!course) {
      throw new Error("Course not found");
    }

    return await Course.restore(id);
  }

  // Hard delete course (admin only)
  static async hardDeleteCourse(id, user) {
    if (user.role !== "ADMIN") {
      throw new Error("Only admins can permanently delete courses");
    }

    const course = await Course.findById(id);
    if (!course) {
      throw new Error("Course not found");
    }

    return await Course.hardDelete(id);
  }

  // Validate instructor exists and has correct role
  static async validateInstructor(instructorId) {
    const instructor = await User.findById(instructorId);
    if (!instructor) {
      throw new Error("Instructor not found");
    }
    if (instructor.role !== "INSTRUCTOR" && instructor.role !== "ADMIN") {
      throw new Error("User is not an instructor");
    }
    return instructor;
  }
}

module.exports = CourseService;
