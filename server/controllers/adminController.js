// server/controllers/adminController.js
const Student = require('../models/Student');
const { Parser } = require('json2csv');
const mongoose = require('mongoose');

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private (Admin)
exports.getAllStudents = async (req, res, next) => {
  try {
    // Handle filtering
    const filter = {};
    
    // Filter by placement status if specified
    if (req.query.placed === 'true') {
      filter.isPlaced = true;
    } else if (req.query.placed === 'false') {
      filter.isPlaced = false;
    }
    
    // Filter by department if specified
    if (req.query.department) {
      filter.department = req.query.department;
    }
    
    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { email: searchRegex },
        { district: searchRegex },
        { nativePlace: searchRegex },
        { companyNames: searchRegex }
      ];
    }
    
    // Find students based on filters
    const students = await Student.find(filter).sort({ updatedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get student analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
exports.getAnalytics = async (req, res, next) => {
  try {
    // Department-wise analytics
    const departmentStats = await Student.aggregate([
      {
        $group: {
          _id: '$department',
          totalStudents: { $sum: 1 },
          placedStudents: { 
            $sum: { $cond: ['$isPlaced', 1, 0] } 
          },
          avgCGPA: { $avg: '$cgpa' },
          totalOffers: { $sum: '$noOfOffers' }
        }
      },
      {
        $project: {
          department: '$_id',
          totalStudents: 1,
          placedStudents: 1,
          notPlacedStudents: { $subtract: ['$totalStudents', '$placedStudents'] },
          placementRate: { 
            $multiply: [
              { $divide: ['$placedStudents', '$totalStudents'] },
              100
            ]
          },
          avgCGPA: { $round: ['$avgCGPA', 2] },
          totalOffers: 1,
          _id: 0
        }
      },
      { $sort: { department: 1 } }
    ]);
    
    // Company-wise offers
    const companyStats = await Student.aggregate([
      { $match: { isPlaced: true } },
      { $unwind: '$companyNames' },
      {
        $group: {
          _id: {
            company: '$companyNames',
            department: '$department'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.company',
          departmentCounts: {
            $push: {
              department: '$_id.department',
              count: '$count'
            }
          },
          totalOffers: { $sum: '$count' }
        }
      },
      { $sort: { totalOffers: -1 } }
    ]);
    
    // Overall stats
    const overallStats = await Student.aggregate([
      {
        $group: {
          _id: null,
          totalStudents: { $sum: 1 },
          placedStudents: { 
            $sum: { $cond: ['$isPlaced', 1, 0] } 
          },
          totalOffers: { $sum: '$noOfOffers' },
          avgCGPA: { $avg: '$cgpa' }
        }
      },
      {
        $project: {
          _id: 0,
          totalStudents: 1,
          placedStudents: 1,
          notPlacedStudents: { $subtract: ['$totalStudents', '$placedStudents'] },
          placementRate: { 
            $multiply: [
              { $divide: ['$placedStudents', '$totalStudents'] },
              100
            ]
          },
          totalOffers: 1,
          avgCGPA: { $round: ['$avgCGPA', 2] }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        departmentStats,
        companyStats,
        overallStats: overallStats[0] || {
          totalStudents: 0,
          placedStudents: 0,
          notPlacedStudents: 0,
          placementRate: 0,
          totalOffers: 0,
          avgCGPA: 0
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Export students data as CSV
// @route   GET /api/admin/export
// @access  Private (Admin)
exports.exportStudentData = async (req, res, next) => {
  try {
    // Apply same filters as getAllStudents
    const filter = {};
    
    if (req.query.placed === 'true') {
      filter.isPlaced = true;
    } else if (req.query.placed === 'false') {
      filter.isPlaced = false;
    }
    
    if (req.query.department) {
      filter.department = req.query.department;
    }
    
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { email: searchRegex },
        { district: searchRegex },
        { nativePlace: searchRegex },
        { companyNames: searchRegex }
      ];
    }
    
    // Get students data
    const students = await Student.find(filter).lean();
    
    // Format data for CSV
    const studentsForExport = students.map(student => {
      // Convert companyNames array to comma-separated string
      const formattedStudent = { ...student };
      formattedStudent.companyNames = student.companyNames.join(', ');
      
      // Format dates
      formattedStudent.dob = new Date(student.dob).toLocaleDateString();
      formattedStudent.createdAt = new Date(student.createdAt).toLocaleDateString();
      formattedStudent.updatedAt = new Date(student.updatedAt).toLocaleDateString();
      
      return formattedStudent;
    });
    
    // Set up CSV parser
    const fields = [
      'email', 'department', 'mobileParent', 'dob', 'tenthPercent', 'twelfthPercent',
      'cgpa', 'district', 'isPlaced', 'noOfOffers', 'companyNames'
    ];
    
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(studentsForExport);
    
    // Set response headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=students-data.csv');
    
    // Send CSV data
    res.status(200).send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get student by ID
// @route   GET /api/admin/students/:id
// @access  Private (Admin)
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (err) {
    console.error(err);
    
    // Handle invalid ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};