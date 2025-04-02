const db = require('../services/db');
const bcrypt = require('bcryptjs');

class User {
        
  // Get all users (with filters for social.pug)
  static async getAll(category, searchTerm) {
    let sql = 'SELECT * FROM User';
    const params = [];
    
    if (category) {
      sql += ' WHERE role = ?';
      params.push(category);
    }
    
    if (searchTerm) {
      sql += (category ? ' AND' : ' WHERE') + 
            ' (user_name LIKE ? OR bio LIKE ?)';
      params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }
    
    return db.query(sql, params);
  }

  // Get a single user by ID (for profile.pug)
  static async getById(userId) {
    const sql = `
      SELECT 
        user_id, user_name, profile_pic, bio, 
        email, phone_number, address, role
      FROM User 
      WHERE user_id = ?
    `;
    return db.query(sql, [userId]);
  }

// Create new user (Registration)
static async create(userData) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Validate that user data is not undefined or missing
  const username = userData.username || null;
  const email = userData.email || null; 
  const phone_number = userData.phone || null; 
  const address = userData.address || null;

  if (!username || !email || !userData.password) {
    throw new Error("Required fields missing");
  }

  const sql = `
    INSERT INTO user 
      (user_name, email, password_hash, role, phone_number, address) 
    VALUES (?, ?, ?, 'Passenger', ?, ?)
  `;

  return db.query(sql, [
    username,
    email,
    hashedPassword,
    phone_number,     // Can be null
    address    // Can be null
  ]);
}

  // Find user by email (Login)
  static async findByEmail(email) {
    const sql = 'SELECT * FROM User WHERE email = ?'; 
    const results = await db.query(sql, [email]);
    return results[0];
  }

  // Find a user by their ID and delete
  static async findByIdAndDelete(userId) {
    const sql = 'DELETE FROM User WHERE user_id = ?';
    return db.query(sql, [userId]);
  }
}

module.exports = User;