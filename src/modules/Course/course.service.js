const Course = require('./course.model');

class CourseService {
  // Get published courses
  static async getPublishedCourses() {
    return await Course.findPublished();
  }

  // Get trending courses
  static async getTrendingCourses() {
    return await Course.findTrending();
  }

  // Get course by ID
  static async getCourseById(id) {
    return await Course.findById(id);
  }

  // Create course
  static async createCourse(courseData) {
    return await Course.create(courseData);
  }

  // Update course
  static async updateCourse(id, updateData) {
    return await Course.update(id, updateData);
  }

  // Delete course
  static async deleteCourse(id) {
    return await Course.delete(id);
  }

  // Get courses by instructor
  static async getCoursesByInstructor(instructorId) {
    return await Course.findByInstructor(instructorId);
  }

  // Search courses
  static async searchCourses(filters) {
    return await Course.search(filters);
  }

  // Get course statistics
  static async getCourseStats() {
    return await Course.getStats();
  }
}

module.exports = CourseService; 