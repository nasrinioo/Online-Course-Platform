const CourseService = require('./course.service');
const { setCache, getCache, deleteCache, TRENDING_COURSES_KEY } = require('../../utils/cache');

class CourseController {
  // Get all published courses
  async getAllCourses(req, res) {
    try {
      const courses = await CourseService.getPublishedCourses();
      res.json({ courses });
    } catch (error) {
      console.error('Get courses error:', error);
      res.status(500).json({ error: 'Internal server error' });
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
      console.error('Get trending courses error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get course by ID
  async getCourseById(req, res) {
    try {
      const { id } = req.params;
      const course = await CourseService.getCourseById(id);

      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      res.json({ course });
    } catch (error) {
      console.error('Get course error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create new course (Instructor/Admin only)
  async createCourse(req, res) {
    try {
      const courseData = {
        ...req.body,
        instructorId: req.user.id,
      };

      const course = await CourseService.createCourse(courseData);

      // Clear trending courses cache
      await deleteCache(TRENDING_COURSES_KEY);

      res.status(201).json({
        message: 'Course created successfully',
        course,
      });
    } catch (error) {
      console.error('Create course error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update course (Instructor/Admin only)
  async updateCourse(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Check if user is authorized to update this course
      const existingCourse = await CourseService.getCourseById(id);
      if (!existingCourse) {
        return res.status(404).json({ error: 'Course not found' });
      }

      if (existingCourse.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Not authorized to update this course' });
      }

      const course = await CourseService.updateCourse(id, updateData);

      // Clear trending courses cache
      await deleteCache(TRENDING_COURSES_KEY);

      res.json({
        message: 'Course updated successfully',
        course,
      });
    } catch (error) {
      console.error('Update course error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete course (Instructor/Admin only)
  async deleteCourse(req, res) {
    try {
      const { id } = req.params;

      // Check if user is authorized to delete this course
      const existingCourse = await CourseService.getCourseById(id);
      if (!existingCourse) {
        return res.status(404).json({ error: 'Course not found' });
      }

      if (existingCourse.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Not authorized to delete this course' });
      }

      await CourseService.deleteCourse(id);

      // Clear trending courses cache
      await deleteCache(TRENDING_COURSES_KEY);

      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error('Delete course error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get courses by instructor
  async getCoursesByInstructor(req, res) {
    try {
      const { instructorId } = req.params;
      const courses = await CourseService.getCoursesByInstructor(instructorId);
      res.json({ courses });
    } catch (error) {
      console.error('Get instructor courses error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Search courses
  async searchCourses(req, res) {
    try {
      const { q, category, price, level } = req.query;
      const courses = await CourseService.searchCourses({ q, category, price, level });
      res.json({ courses });
    } catch (error) {
      console.error('Search courses error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get course statistics
  async getCourseStats(req, res) {
    try {
      const stats = await CourseService.getCourseStats();
      res.json({ stats });
    } catch (error) {
      console.error('Get course stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new CourseController(); 