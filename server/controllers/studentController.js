const Student = require('../models/Student');

// @desc    Create or update student details
// @route   POST /api/student/profile
// @access  Private (Student)
exports.updateProfile = async (req, res, next) => {
  try {
    const studentEmail = req.user.email;

    if (req.body.isPlaced) {
      if (req.body.companyNames && typeof req.body.companyNames === 'string') {
        req.body.companyNames = req.body.companyNames
          .split(',')
          .map(company => company.trim())
          .filter(company => company.length > 0);
      }

      if (!req.body.noOfOffers && req.body.companyNames) {
        req.body.noOfOffers = req.body.companyNames.length;
      }
    } else {
      req.body.noOfOffers = 0;
      req.body.companyNames = [];
    }

    const student = await Student.findOneAndUpdate(
      { email: studentEmail },
      { ...req.body, email: studentEmail },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (err) {
    console.error(err);

    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private (Student)
exports.getProfile = async (req, res, next) => {
  try {
    const studentEmail = req.user.email;

    const student = await Student.findOne({ email: studentEmail });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
