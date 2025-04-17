// server/models/Student.js
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  mobileParent: {
    type: String,
    required: [true, 'Parent mobile number is required'],
    trim: true
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  tenthPercent: {
    type: Number,
    required: [true, '10th percentage is required'],
    min: 0,
    max: 100
  },
  twelfthPercent: {
    type: Number,
    required: [true, '12th percentage is required'],
    min: 0,
    max: 100
  },
  cgpa: {
    type: Number,
    required: [true, 'CGPA is required'],
    min: 0,
    max: 10
  },
  tenthSchool: {
    type: String,
    required: [true, '10th school name is required'],
    trim: true
  },
  tenthYear: {
    type: Number,
    required: [true, '10th year of passing is required']
  },
  twelfthSchool: {
    type: String,
    required: [true, '12th school name is required'],
    trim: true
  },
  twelfthYear: {
    type: Number,
    required: [true, '12th year of passing is required']
  },
  diplomaPercent: {
    type: Number,
    min: 0,
    max: 100
  },
  diplomaCollege: {
    type: String,
    trim: true
  },
  diplomaYear: {
    type: Number
  },
  communicationAddress: {
    type: String,
    required: [true, 'Communication address is required'],
    trim: true
  },
  permanentAddress: {
    type: String,
    required: [true, 'Permanent address is required'],
    trim: true
  },
  nativePlace: {
    type: String,
    required: [true, 'Native place is required'],
    trim: true
  },
  twelfthCutoff: {
    type: Number,
    required: [true, '12th cutoff is required'],
    min: 0,
    max: 200
  },
  district: {
    type: String,
    required: [true, 'District is required'],
    trim: true
  },
  resumeLink: {
    type: String,
    required: [true, 'Resume link is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'],
    trim: true
  },
  isPlaced: {
    type: Boolean,
    default: false
  },
  noOfOffers: {
    type: Number,
    default: 0
  },
  companyNames: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update 'updatedAt' on save
StudentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Student', StudentSchema);