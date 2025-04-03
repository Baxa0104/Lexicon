const db = require('../services/db');
const bcrypt = require('bcryptjs');

class User {

  // Get all users (with filters for social.pug)
  static async getAll(category, searchTerm) {
    let sql = 'SELECT * FROM user';
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
        email, phone_number, address, role, password_hash
      FROM user 
      WHERE user_id = ?
    `;
    const results = await db.query(sql, [userId]);
    return results.length ? results : null;
  }

  // Create a new user (Registration)
  static async create(userData) {

    const username = userData.username || null;
    const email = userData.email || null; 
    const phone_number = userData.phone_number || null; 
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
      userData.password,
      phone_number, // Can be null
      address       // Can be null
    ]);
  }

  // Update user profile
  static async update(userId, { user_name, bio, phone_number, address }) {
    const query = `
      UPDATE user 
      SET 
        user_name = ?,
        bio = ?,
        phone_number = ?,
        address = ? 
      WHERE user_id = ?
    `;

    await db.query(query, [
      user_name,
      bio,
      phone_number,
      address,
      userId
    ]);
  }

  // Update user password
  static async updatePassword(userId, newPasswordHash) {
    const sql = `UPDATE user SET password_hash = ? WHERE user_id = ?`;
    return db.query(sql, [newPasswordHash, userId]);
  }

  // Find user by email (for login)
  static async findByEmail(email) {
    const sql = 'SELECT * FROM user WHERE email = ?'; 
    const results = await db.query(sql, [email]);
    return results.length ? results[0] : null;
  }

  // Delete user by ID
  static async deleteById(userId) {
    const sql = 'DELETE FROM user WHERE user_id = ?';
    return db.query(sql, [userId]);
  }
}

module.exports = User;
