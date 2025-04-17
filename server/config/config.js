// server/config/config.js
module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    jwtExpire: '24h',
    adminEmail: 'vsbec@placementmp',
    adminPassword: 'Placementvsbec',
    studentPassword: 'vsbec@placement',
    departments: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL']
  };