// server/middleware/validateRequest.js
// Middleware for validating request bodies

const validateStudentProfile = (req, res, next) => {
    const {
      mobileParent, dob, tenthPercent, twelfthPercent, cgpa,
      tenthSchool, tenthYear, twelfthSchool, twelfthYear,
      communicationAddress, permanentAddress, nativePlace,
      twelfthCutoff, district, resumeLink, department
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
      if (!value && value !== 0) {
        missingFields.push(key);
      }
    });
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Check numeric values
    if (tenthPercent < 0 || tenthPercent > 100) {
      return res.status(400).json({
        success: false,
        message: '10th percentage must be between 0 and 100'
      });
    }
    
    if (twelfthPercent < 0 || twelfthPercent > 100) {
      return res.status(400).json({
        success: false,
        message: '12th percentage must be between 0 and 100'
      });
    }
    
    if (cgpa < 0 || cgpa > 10) {
      return res.status(400).json({
        success: false,
        message: 'CGPA must be between 0 and 10'
      });
    }
    
    // Check year format
    const currentYear = new Date().getFullYear();
    
    if (tenthYear < 1990 || tenthYear > currentYear) {
      return res.status(400).json({
        success: false,
        message: '10th year of passing is invalid'
      });
    }
    
    if (twelfthYear < 1990 || twelfthYear > currentYear) {
      return res.status(400).json({
        success: false,
        message: '12th year of passing is invalid'
      });
    }
    
    // Check if placement data is consistent
    if (req.body.isPlaced) {
      if (!req.body.noOfOffers && req.body.noOfOffers !== 0) {
        return res.status(400).json({
          success: false,
          message: 'Number of offers is required if placed'
        });
      }
      
      if ((!req.body.companyNames || req.body.companyNames.length === 0) && 
          (!req.body.companyNames || typeof req.body.companyNames !== 'string' || !req.body.companyNames.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Company names are required if placed'
        });
      }
    }
    
    next();}