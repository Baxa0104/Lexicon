const db = require('../services/db');

class Ride {
  // Get all rides (with optional search filter)
  static async getAll(searchTerm) {
    let sql = `
      SELECT 
        r.ride_id, r.short_name, r.ride_pics, r.departure_date, 
        r.destination_address, r.origin_address, r.departure_time,
        r.available_seats, r.ride_details, r.driver_id,
        u.user_name AS driver_name, u.email, u.phone_number
      FROM ride r 
      JOIN user u ON r.driver_id = u.user_id 
      WHERE u.role = 'Driver'
    `;
    const params = [];
    
    if (searchTerm) {
      sql += ` AND (u.user_name LIKE ? OR r.destination_address LIKE ?)`;
      params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }
    
    return db.query(sql, params);
  }

  // Get a single ride by ID (for listingDetails.pug)
  static async getById(rideId) {
    const sql = `
      SELECT 
        r.*, 
        u.user_name, u.email, u.phone_number, u.address
      FROM ride r 
      JOIN user u ON r.driver_id = u.user_id 
      WHERE r.ride_id = ?
    `;
    return db.query(sql, [rideId]);
  }
}

module.exports = Ride;