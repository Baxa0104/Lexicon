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
    const sql = `
      INSERT INTO user 
        (user_name, email, password_hash, role, bio, address) 
      VALUES (?, ?, ?, 'Passenger', ?, ?)
    `;
    return db.query(sql, [
      userData.username,
      userData.email,
      hashedPassword,
    ]);
  }

  // Find user by email (Login)
  static async findByEmail(email) {
    const sql = 'SELECT * FROM User WHERE email = ?'; 
    const results = await db.query(sql, [email]);
    return results[0];
  }
}

module.exports = User;