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
        u.user_name, u.email, u.phone_number, u.address, u.user_id
      FROM ride r 
      JOIN user u ON r.driver_id = u.user_id 
      WHERE r.ride_id = ?
    `;
    return db.query(sql, [rideId]);
  }

  static async create({ short_name, departure_date, departure_time, origin_address, destination_address, available_seats, ride_details, price, ride_pics, user_id }) {
    const query = `
      INSERT INTO ride (available_seats, departure_date, departure_time, destination_address, driver_id, origin_address, price, ride_details, short_name, ride_pics, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await db.query(query, [
      available_seats,         // Available Seats
      departure_date,          // Departure Date
      departure_time,          // Departure Time
      destination_address,     // Destination Address
      user_id,                 // Driver ID (mapped from user_id)
      origin_address,          // Origin Address
      price,                   // Price
      ride_details,            // Ride Details
      short_name,              // Ride Name (short_name)
      ride_pics,               // Ride Image URL
      'Scheduled'              // Status (hardcoded as 'Scheduled')
    ]);
  }

   // Get rides created by the user (driver)
   static async getRidesCreatedByUser(userId) {
    const sql = `
      SELECT r.ride_id, r.origin_address, r.destination_address, r.departure_time, 
             r.short_name, r.ride_details, r.status, r.ride_pics
      FROM ride AS r
      WHERE r.driver_id = ?
      ORDER BY r.departure_time DESC
    `;
    return db.query(sql, [userId]);
  }

  // Get rides booked by the user (passenger)
  static async getRidesBookedByUser(userId) {
    const sql = `
      SELECT r.ride_id, r.origin_address, r.destination_address, r.departure_time, 
             b.booking_time, b.status, b.payment_status
      FROM booking AS b
      JOIN ride AS r ON b.ride_id = r.ride_id
      WHERE b.user_id = ? AND (b.status = 'Pending' OR b.status = 'Confirmed')
      ORDER BY b.booking_time DESC
    `;
    return db.query(sql, [userId]);
  }

  // Get past bookings (completed or canceled)
  static async getPastBookingsByUser(userId) {
    const sql = `
      SELECT r.ride_id, r.origin_address, r.destination_address, r.departure_time, 
             b.booking_time, b.status, b.payment_status
      FROM booking AS b
      JOIN ride AS r ON b.ride_id = r.ride_id
      WHERE b.user_id = ? AND (b.status = 'Completed' OR b.status = 'Canceled')
      ORDER BY b.booking_time DESC
    `;
    return db.query(sql, [userId]);
  }
  
}


module.exports = Ride;