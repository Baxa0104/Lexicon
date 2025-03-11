// Import express.js
const express = require("express");

// Create express app
const app = express();

// Add static files location
app.use(express.static("static"));

// Get the database functions
const db = require("./services/db");

// Root Route
app.get("/", (req, res) => {
    res.send("Hello world!");
});

// Test Database Connection Route
app.get("/db_test", async (req, res) => {
    try {
        const sql = "SELECT * FROM test_table";  // Declare sql properly
        const results = await db.query(sql);  // Ensure db.query() is properly awaited
        console.log(results);
        res.json(results);  // Use JSON for API responses
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Database error: " + err.message });
    }
});

// Goodbye Route
app.get("/goodbye", (req, res) => {
    res.send("Goodbye world!");
});

// Dynamic Route for Greeting
app.get("/hello/:name", (req, res) => {
    console.log(req.params);
    res.send(`Hello ${req.params.name}`);
});

// Fetch User Details Route
app.get("/rides/:ride_id", async (req, res) => {
    try {
        console.log(req.params); // Debugging log

        const ride_id = req.params.ride_id;
        const sql = "SELECT * FROM ride WHERE ride_id = ?";

        const results = await db.query(sql, [ride_id]);  // Await db.query() properly

        if (results.length === 0) {
            return res.status(404).json({ error: "Invalid user ID: No user found." });
        }

        res.json(results[0]); // Send user details as JSON
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).json({ error: "Database error: " + err.message });
    }
});

// Start server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
