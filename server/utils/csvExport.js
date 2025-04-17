// server/utils/csvExport.js
const { Parser } = require('json2csv');

/**
 * Formats student data for CSV export
 * @param {Array} students - Array of student objects
 * @param {Array} fields - Fields to include in CSV
 * @returns {String} CSV formatted string
 */
exports.formatStudentsToCSV = (students, fields) => {
  // Format data for CSV
  const studentsForExport = students.map(student => {
    const formattedStudent = { ...student };
    
    // Convert companyNames array to comma-separated string
    if (Array.isArray(formattedStudent.companyNames)) {
      formattedStudent.companyNames = student.companyNames.join(', ');
    }
    
    // Format dates
    if (formattedStudent.dob) {
      formattedStudent.dob = new Date(student.dob).toLocaleDateString();
    }
    
    formattedStudent.createdAt = new Date(student.createdAt).toLocaleDateString();
    formattedStudent.updatedAt = new Date(student.updatedAt).toLocaleDateString();
    
    return formattedStudent;
  });
  
  // Set up fields if not provided
  if (!fields) {
    fields = [
      'email', 'department', 'mobileParent', 'dob', 'tenthPercent', 
      'twelfthPercent', 'cgpa', 'district', 'isPlaced', 
      'noOfOffers', 'companyNames'
    ];
  }
  
  // Generate CSV
  const opts = { fields };
  const parser = new Parser(opts);
  return parser.parse(studentsForExport);
};