const express = require('express');
const { 
  getAllStudents, 
  getAnalytics, 
  exportStudentData,
  getStudentById
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// Routes
router.get('/students', getAllStudents);
router.get('/students/:id', getStudentById);
router.get('/analytics', getAnalytics);
router.get('/export', exportStudentData);

module.exports = router;