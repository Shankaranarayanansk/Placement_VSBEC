// server/utils/validators.js

/**
 * Validates an email address
 * @param {String} email - Email to validate
 * @returns {Boolean} Whether the email is valid
 */
exports.isValidEmail = (email) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validates a mobile number
   * @param {String} mobile - Mobile number to validate
   * @returns {Boolean} Whether the mobile number is valid
   */
  exports.isValidMobile = (mobile) => {
    // Allows for different country code formats
    const mobileRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    return mobileRegex.test(mobile);
  };
  
  /**
   * Validates a URL
   * @param {String} url - URL to validate
   * @returns {Boolean} Whether the URL is valid
   */
  exports.isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };
  
  /**
   * Validates user input and returns error messages if any
   * @param {Object} data - Input data to validate
   * @returns {Object} Object with isValid boolean and errors array
   */
  exports.validateInput = (data) => {
    const errors = [];
    
    // Required fields
    const requiredFields = [
      'mobileParent', 'dob', 'tenthPercent', 'twelfthPercent', 'cgpa',
      'tenthSchool', 'tenthYear', 'twelfthSchool', 'twelfthYear',
      'communicationAddress', 'permanentAddress', 'nativePlace',
      'twelfthCutoff', 'district', 'resumeLink', 'department'
    ];
    
    requiredFields.forEach(field => {
      if (!data[field] && data[field] !== 0) {
        errors.push(`${field} is required`);
      }
    });
    
    // Validate mobile
    if (data.mobileParent && !exports.isValidMobile(data.mobileParent)) {
      errors.push('Invalid parent mobile number');
    }
    
    // Validate percentages
    if (data.tenthPercent && (data.tenthPercent < 0 || data.tenthPercent > 100)) {
      errors.push('10th percentage must be between 0 and 100');
    }
    
    if (data.twelfthPercent && (data.twelfthPercent < 0 || data.twelfthPercent > 100)) {
      errors.push('12th percentage must be between 0 and 100');
    }
    
    if (data.cgpa && (data.cgpa < 0 || data.cgpa > 10)) {
      errors.push('CGPA must be between 0 and 10');
    }
    
    // Validate URL
    if (data.resumeLink && !exports.isValidURL(data.resumeLink)) {
      errors.push('Invalid resume link URL');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };