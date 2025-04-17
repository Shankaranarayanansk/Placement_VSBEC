// server/utils/seeder.js
// Utility to seed the database with initial data for testing

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Student = require('../models/Student');
const config = require('../config/config');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Sample departments
const departments = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'];

// Sample districts
const districts = ['Chennai', 'Coimbatore', 'Salem', 'Madurai', 'Trichy', 'Tirunelveli'];

// Generate a random student
const generateRandomStudent = (index) => {
  const department = departments[Math.floor(Math.random() * departments.length)];
  const district = districts[Math.floor(Math.random() * districts.length)];
  const isPlaced = Math.random() > 0.4; // 60% chance of being placed
  
  const companies = ['TCS', 'Wipro', 'Infosys', 'Cognizant', 'HCL', 'Tech Mahindra', 'Accenture'];
  const noOfOffers = isPlaced ? Math.floor(Math.random() * 3) + 1 : 0;
  
  // Generate random company names
  const selectedCompanies = [];
  for (let i = 0; i < noOfOffers; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    if (!selectedCompanies.includes(company)) {
      selectedCompanies.push(company);
    }
  }
  
  const cgpa = (Math.random() * 3 + 7).toFixed(2); // CGPA between 7.0 and 10.0
  
  return {
    email: `student${index}@example.com`,
    mobileParent: `9876543${index.toString().padStart(3, '0')}`,
    dob: new Date(1998, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    tenthPercent: Math.floor(Math.random() * 15) + 85, // 85-100%
    twelfthPercent: Math.floor(Math.random() * 15) + 85, // 85-100%
    cgpa: parseFloat(cgpa),
    tenthSchool: `School ${Math.floor(Math.random() * 10) + 1}`,
    tenthYear: 2014 + Math.floor(Math.random() * 3),
    twelfthSchool: `Higher Secondary School ${Math.floor(Math.random() * 10) + 1}`,
    twelfthYear: 2016 + Math.floor(Math.random() * 3),
    diplomaPercent: Math.floor(Math.random() * 10) + 90,
    diplomaCollege: `Diploma College ${Math.floor(Math.random() * 5) + 1}`,
    diplomaYear: 2018 + Math.floor(Math.random() * 2),
    communicationAddress: `${Math.floor(Math.random() * 100) + 1}, Main Street, ${district}`,
    permanentAddress: `${Math.floor(Math.random() * 100) + 1}, Main Street, ${district}`,
    nativePlace: district,
    twelfthCutoff: Math.floor(Math.random() * 40) + 160, // 160-200
    district: district,
    resumeLink: `https://drive.google.com/resume${index}`,
    department: department,
    isPlaced: isPlaced,
    noOfOffers: noOfOffers,
    companyNames: selectedCompanies
  };
};

// Seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    
    console.log('Data cleared');
    
    // Create admin user
    await User.create({
      email: config.adminEmail,
      password: config.adminPassword,
      role: 'admin'
    });
    
    console.log('Admin user created');
    
    // Create sample students
    const studentCount = 50; // Number of sample students
    const studentData = [];
    const userData = [];
    
    for (let i = 1; i <= studentCount; i++) {
      const studentInfo = generateRandomStudent(i);
      studentData.push(studentInfo);
      
      // Create user accounts for students
      userData.push({
        email: studentInfo.email,
        password: config.studentPassword,
        role: 'student'
      });
    }
    
    // Insert students
    await Student.insertMany(studentData);
    await User.insertMany(userData);
    
    console.log(`${studentCount} sample students created`);
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();