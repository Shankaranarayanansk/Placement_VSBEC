// server/controllers/authController.js
const User = require('../models/User');
const config = require('../config/config');

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for admin credentials
    if (email === config.adminEmail && password === config.adminPassword) {
      // Create token
      const token = generateAdminToken();
      
      return res.status(200).json({
        success: true,
        role: 'admin',
        token
      });
    }

    // Check for student
    // For students, we'll check if the password matches the common student password
    if (password !== config.studentPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if student exists or create a new one
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if not found
      user = await User.create({
        email,
        password: config.studentPassword,
        role: 'student'
      });
    } else {
      // Verify the password for existing users
      const isMatch = await user.matchPassword(config.studentPassword);
      
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
    }

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      role: user.role,
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Helper function to generate admin token
const generateAdminToken = () => {
  return require('jsonwebtoken').sign(
    { 
      id: 'admin',
      email: config.adminEmail,
      role: 'admin'
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpire }
  );
};