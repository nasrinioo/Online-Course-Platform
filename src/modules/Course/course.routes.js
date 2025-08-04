const express = require('express');
const CourseController = require('./course.controller');
const { auth, authorize } = require('../../middleware/auth');
const { validateCourse } = require('./course.validation');
const { handleValidationErrors } = require('../../middleware/validation');

const router = express.Router();

router.get('/', CourseController.getAllCourses);
router.get('/trending', CourseController.getTrendingCourses);
router.get('/search', CourseController.searchCourses);
router.get('/stats', auth, authorize('ADMIN'), CourseController.getCourseStats);
router.get('/:id', CourseController.getCourseById);
router.post('/', auth, authorize('INSTRUCTOR', 'ADMIN'), validateCourse, handleValidationErrors, CourseController.createCourse);
router.put('/:id', auth, authorize('INSTRUCTOR', 'ADMIN'), validateCourse, handleValidationErrors, CourseController.updateCourse);
router.delete('/:id', auth, authorize('INSTRUCTOR', 'ADMIN'), CourseController.deleteCourse);
router.get('/instructor/:instructorId', CourseController.getCoursesByInstructor);

module.exports = router; 