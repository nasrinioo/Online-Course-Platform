const express = require('express');
const { 
  getProfile, 
  getAllUsers, 
  updateProfile, 
  deleteUser, 
  getUserById, 
  getUsersByRole, 
  searchUsers, 
  getUserStats 
} = require('./user.controller');
const { auth, authorize } = require('../../middleware/auth');
const { validateProfileUpdate } = require('./user.validation');
const { handleValidationErrors } = require('../../middleware/validation');

const router = express.Router();

router.get('/profile', auth, getProfile);
router.get('/', auth, authorize('ADMIN'), getAllUsers);
router.put('/profile', auth, validateProfileUpdate, handleValidationErrors, updateProfile);
router.get('/:userId', auth, authorize('ADMIN'), getUserById);
router.delete('/:userId', auth, authorize('ADMIN'), deleteUser);
router.get('/role/:role', auth, authorize('ADMIN'), getUsersByRole);
router.get('/search', auth, authorize('ADMIN'), searchUsers);
router.get('/stats', auth, authorize('ADMIN'), getUserStats);

module.exports = router; 