const db = require('../services/db');

class Dashboard {
    // Method to fetch stats for the dashboard
    static async getUserDashboardStats(userId) {
        try {
            // Get total bookings (this doesn't require user-specific filtering)
            const totalBookingsResult = await db.query('SELECT COUNT(*) AS totalBookings FROM ride WHERE driver_id = ?', [userId]);
            const totalBookings = totalBookingsResult[0].totalBookings;

            // Get user-specific bookings count
            const userBookingsResult = await db.query('SELECT COUNT(*) AS userBookings FROM booking WHERE user_id = ?', [userId]);
            const userBookings = userBookingsResult[0].userBookings;

            // Dummy CO2 emission calculation (random value for now)
            const co2Emission = (Math.random() * 100).toFixed(2);

            return {
                totalBookings,
                userBookings,
                co2Emission,
            };
        } catch (err) {
            console.error("Error fetching dashboard stats:", err);
            throw new Error("Failed to fetch dashboard stats.");
        }
    }
}

module.exports = Dashboard;
