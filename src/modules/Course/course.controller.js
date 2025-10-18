const CourseService = require("./course.service");
const {
  setCache,
  getCache,
  deleteCache,
  TRENDING_COURSES_KEY,
} = require("../../utils/cache");
const ErrorHandler = require("../../utils/errorHandler");

class CourseController {
  async getAllCourses(req, res) {
    try {
      const courses = await CourseService.getPublishedCourses();
      res.json({ courses });
    } catch (error) {
      return ErrorHandler.handle(error, res, "Get courses");
    }
  }

  // Get trending courses (cached)
  async getTrendingCourses(req, res) {
    try {
      // Try to get from cache first
      let trendingCourses = await getCache(TRENDING_COURSES_KEY);

      if (!trendingCourses) {
        trendingCourses = await CourseService.getTrendingCourses();
        // Cache the result
        await setCache(TRENDING_COURSES_KEY, trendingCourses);
      }

      res.json({ trendingCourses });
    } catch (error) {
      return ErrorHandler.handle(error, res, "Get trending courses");
    }
  }

  async getCourseById(req, res) {
    try {
      const { id } = req.params;
      const course = await CourseService.getCourseById(id);

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      res.json({ course });
    } catch (error) {
      return ErrorHandler.handle(error, res, "Get course");
    }
  }

  // Create new course (Instructor/Admin only)
  async createCourse(req, res) {
    try {
      let instructorId = req.user.id;

      if (req.user.role === "ADMIN" && req.body.instructorId) {
        await CourseService.validateInstructor(req.body.instructorId);
        instructorId = req.body.instructorId;
      }

      const courseData = {
        ...req.body,
        instructorId,
      };

      const course = await CourseService.createCourse(courseData);

      // Clear trending courses cache
      await deleteCache(TRENDING_COURSES_KEY);

      res.status(201).json({
        message: "Course created successfully",
        course,
      });
    } catch (error) {
      return ErrorHandler.handle(error, res, "Create course");
    }
  }

  // Update course (Instructor/Admin only)
  async updateCourse(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const course = await CourseService.updateCourse(id, updateData, req.user);

      // Clear trending courses cache
      await deleteCache(TRENDING_COURSES_KEY);

      res.json({
        message: "Course updated successfully",
        course,
      });
    } catch (error) {
      return ErrorHandler.handle(error, res, "Update course");
    }
  }

  // Delete course (Instructor/Admin only)
  async deleteCourse(req, res) {
    try {
      const { id } = req.params;

      await CourseService.deleteCourse(id, req.user);

      // Clear trending courses cache
      await deleteCache(TRENDING_COURSES_KEY);

      res.json({ message: "Course deleted successfully" });
    } catch (error) {
      return ErrorHandler.handle(error, res, "Delete course");
    }
  }

  // Get courses by instructor
  async getCoursesByInstructor(req, res) {
    try {
      const { instructorId } = req.params;
      const courses = await CourseService.getCoursesByInstructor(instructorId);
      res.json({ courses });
    } catch (error) {
      return ErrorHandler.handle(error, res, "Get instructor courses");
    }
  }

  // Search courses
  async searchCourses(req, res) {
    try {
      const { q, category, price, level } = req.query;
      const courses = await CourseService.searchCourses({
        q,
        category,
        price,
        level,
      });
      res.json({ courses });
    } catch (error) {
      return ErrorHandler.handle(error, res, "Search courses");
    }
  }

  // Get course statistics (Admin only)
  async getCourseStats(req, res) {
    try {
      const stats = await CourseService.getCourseStats();
      res.json({ stats });
    } catch (error) {
      return ErrorHandler.handle(error, res, "Get course stats");
    }
  }

  // Get soft deleted courses (Admin only)
  async getDeletedCourses(req, res) {
    try {
      const courses = await CourseService.getDeletedCourses();
      res.json({ courses });
    } catch (error) {
      return ErrorHandler.handle(error, res, "Get deleted courses");
    }
  }

  // Restore soft deleted course (Admin only)
  async restoreCourse(req, res) {
    try {
      const { id } = req.params;
      const course = await CourseService.restoreCourse(id, req.user);

      // Clear trending courses cache
      await deleteCache(TRENDING_COURSES_KEY);

      res.json({
        message: "Course restored successfully",
        course,
      });
    } catch (error) {
      return ErrorHandler.handle(error, res, "Restore course");
    }
  }

  // Hard delete course (Admin only)
  async hardDeleteCourse(req, res) {
    try {
      const { id } = req.params;
      await CourseService.hardDeleteCourse(id, req.user);

      // Clear trending courses cache
      await deleteCache(TRENDING_COURSES_KEY);

      res.json({ message: "Course permanently deleted" });
    } catch (error) {
      return ErrorHandler.handle(error, res, "Hard delete course");
    }
  }
}

module.exports = new CourseController();
