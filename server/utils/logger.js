// server/utils/logger.js
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Get current date for log filename
const getLogFileName = () => {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.log`;
};

// Format timestamp for log entries
const formatTimestamp = () => {
  const date = new Date();
  return `${date.toISOString()}`;
};

// Log levels
const LOG_LEVELS = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

/**
 * Write a log entry to the log file
 * @param {String} level - Log level
 * @param {String} message - Log message
 * @param {Object} data - Additional data to log
 */
const writeLog = (level, message, data = null) => {
  const timestamp = formatTimestamp();
  const logEntry = {
    timestamp,
    level,
    message,
    ...(data && { data })
  };
  
  const logFilePath = path.join(logsDir, getLogFileName());
  
  try {
    fs.appendFileSync(
      logFilePath,
      `${JSON.stringify(logEntry)}\n`
    );
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${level}] ${message}`, data || '');
    }
  } catch (err) {
    console.error('Error writing to log file:', err);
  }
};

// Logger interface
const logger = {
  info: (message, data) => writeLog(LOG_LEVELS.INFO, message, data),
  warning: (message, data) => writeLog(LOG_LEVELS.WARNING, message, data),
  error: (message, data) => writeLog(LOG_LEVELS.ERROR, message, data),
  debug: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      writeLog(LOG_LEVELS.DEBUG, message, data);
    }
  },
  
  // Log request information
  logRequest: (req, res, next) => {
    const startTime = Date.now();
    
    // Log when the response is sent
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const logData = {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get('user-agent')
      };
      
      if (res.statusCode >= 400) {
        logger.warning(`HTTP ${req.method} ${req.originalUrl} - ${res.statusCode}`, logData);
      } else {
        logger.info(`HTTP ${req.method} ${req.originalUrl} - ${res.statusCode}`, logData);
      }
    });
    
    next();
  }
};

module.exports = logger;