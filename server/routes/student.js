const express = require('express');
const { updateProfile, getProfile } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');
const { validateStudentProfile } = require('../middleware/validateRequest');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes
router.get('/profile', authorize('student'), getProfile);
router.post('/profile', authorize('student'), validateStudentProfile, updateProfile);

module.exports = router;
