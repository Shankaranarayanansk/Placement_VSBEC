// Middleware for validating student profile request body
const Student = require('../models/Student');

const validateStudentProfile = (req, res, next) => {
  const {
    mobileParent, dob, tenthPercent, twelfthPercent, cgpa,
    tenthSchool, tenthYear, twelfthSchool, twelfthYear,
    communicationAddress, permanentAddress, nativePlace,
    twelfthCutoff, district, resumeLink, department, isPlaced,
    noOfOffers, companyNames
  } = req.body;

  // Required fields check
  const requiredFields = {
    mobileParent, dob, tenthPercent, twelfthPercent, cgpa,
    tenthSchool, tenthYear, twelfthSchool, twelfthYear,
    communicationAddress, permanentAddress, nativePlace,
    twelfthCutoff, district, resumeLink, department
  };

  const missingFields = [];

  Object.entries(requiredFields).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      missingFields.push(key);
    }
  });

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  // Percentage validations
  if (typeof tenthPercent !== 'number' || tenthPercent < 0 || tenthPercent > 100) {
    return res.status(400).json({
      success: false,
      message: '10th percentage must be a number between 0 and 100'
    });
  }

  if (typeof twelfthPercent !== 'number' || twelfthPercent < 0 || twelfthPercent > 100) {
    return res.status(400).json({
      success: false,
      message: '12th percentage must be a number between 0 and 100'
    });
  }

  if (typeof cgpa !== 'number' || cgpa < 0 || cgpa > 10) {
    return res.status(400).json({
      success: false,
      message: 'CGPA must be a number between 0 and 10'
    });
  }

  // Year validations
  const currentYear = new Date().getFullYear();

  if (typeof tenthYear !== 'number' || tenthYear < 1990 || tenthYear > currentYear) {
    return res.status(400).json({
      success: false,
      message: '10th year of passing is invalid'
    });
  }

  if (typeof twelfthYear !== 'number' || twelfthYear < 1990 || twelfthYear > currentYear) {
    return res.status(400).json({
      success: false,
      message: '12th year of passing is invalid'
    });
  }

  // Placement info validation
  if (isPlaced) {
    if (noOfOffers === undefined || typeof noOfOffers !== 'number' || noOfOffers < 1) {
      return res.status(400).json({
        success: false,
        message: 'Number of offers must be a number greater than 0 if placed'
      });
    }

    if (!companyNames || 
        (typeof companyNames === 'string' && !companyNames.trim()) || 
        (Array.isArray(companyNames) && companyNames.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Company names are required if placed'
      });
    }
  }

  next();
};

module.exports = { validateStudentProfile };
