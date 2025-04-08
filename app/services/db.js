require("dotenv").config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Use path.join for more reliable path resolution
const caCertPath = path.join(__dirname, '../../certs/ca.pem');

const config = {
  db: {
    host: process.env.MYSQL_HOST,
    port: process.env.DB_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 0,
    ssl: {
      ca: fs.readFileSync(caCertPath)
    },
    // Additional connection options that might help
    connectTimeout: 10000, // 10 seconds
    charset: 'utf8mb4'
  }
};

// Add error handling for pool creation
const pool = mysql.createPool(config.db);

// Listen for connection errors
pool.on('connection', (connection) => {
  console.log('New connection established');
});

pool.on('error', (err) => {
  console.error('Database error:', err);
});

// Utility function with better error handling
async function query(sql, params) {
  try {
    const [rows, fields] = await pool.execute(sql, params);
    return rows;
  } catch (err) {
    console.error('Query error:', err);
    throw err; // Re-throw after logging
  }
}

module.exports = {
  pool,
  query
};