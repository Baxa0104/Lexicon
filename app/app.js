// Import express.js
const express = require("express");

// Create express app
var app = express();

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

// Add static files location
app.use(express.static("static"));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
app.use('/bootstrap-icons', express.static('node_modules/bootstrap-icons'))

// Get the functions in the db.js file to use
const db = require('./services/db');

// Default Route when Web page is opened. Root Route.
app.get("/", function(req, res) {
    res.redirect('/dashboard');
});

// Dashboard Route. Redirected from root route
app.get("/dashboard", function(req, res) {
    res.render('dashboard', {
    currentRoute: '/dashboard'
    });
});

app.get("/rides", function (req, res) {
    let sql = `SELECT r.ride_id, r.short_name, r.ride_pics, r.departure_date, r.destination_address,
                      u.user_name AS driver_name 
               FROM ride r 
               JOIN user u ON r.driver_id = u.user_id 
               WHERE u.role = "Driver"`;

    let params = [];
    let search = req.query.search;
   

    if (search) {
        sql += ` AND (u.user_name LIKE ? OR r.destination_address LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
    }

    console.log("SQL Query:", sql);
    console.log("Params:", params);

    db.query(sql, params).then(results => {
        res.render('listing', {
            currentRoute: '/rides',
            title: 'Ride Request',
            data: results,
            search: search
        });
    }).catch(err => {
        console.error("Database Error:", err);
        res.status(500).send("Internal Server Error");
    });
});

// Users listing route with search and category filtering
app.get("/social", function (req, res) {
    let sql = 'SELECT * FROM User';
    let params = [];
    let category = req.query.category;
    let search = req.query.search;

    // Apply category filter
    if (category) {
        sql += ' WHERE role = ?';
        params.push(category);
    }

    // Apply search filter (Matches username or bio)
    if (search) {
        sql += category ? ' AND' : ' WHERE';
        sql += ' (user_name LIKE ? OR bio LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    // Execute query with parameters
    db.query(sql, params).then(results => {
        console.log("Fetched Data: ", results); // Debugging log
        res.render('social', {
            currentRoute: '/social',
            title: 'User List',
            heading: 'List of Users',
            data: results,
            category: category,
            search: search // Pass search value to keep it in the input field
        });
    }).catch(err => {
        console.error("Database Error: ", err);
        res.status(500).send("Internal Server Error");
    });
});


// Dynamic route. Fetches user Profiles
app.get("/social/:id", function(req, res) {
    const userId = req.params.id;

    console.log("User ID from URL:", userId); // Log the ID to verify it's received

    const sql = 'SELECT * FROM User WHERE user_id = ?';

    db.query(sql, [userId]).then(results => {
        if (results.length === 0) {
            console.log("User not found for ID:", userId);
            return res.status(404).send("User not found.");
        }

        console.log("Fetched User: ", results[0]);

        res.render('profile', {
            title: 'User Profile',
            user: results[0]
        });
    }).catch(err => {
        console.error("Database Error: ", err);
        res.status(500).send("Internal Server Error");
    });
});


// Dynamic Route. Fetches Ride Details
app.get("/rides/:id", function(req, res) {
    const rideId = req.params.id;

    console.log("Ride ID from URL:", rideId); // Log the ID to verify it's received

    const sql = 'SELECT * FROM ride r JOIN user u ON r.driver_id = u.user_id WHERE u.role = "Driver" AND r.ride_id = ?';
    const apiKey = process.env.GRAPHHOPPER_API_KEY

    db.query(sql, [rideId]).then(results => {
        if (results.length === 0) {
            console.log("Ride not found for ID:", rideId);
            return res.status(404).send("Ride not found.");
        }

        console.log("Fetched Ride: ", results[0]);

        res.render('listingDetails', {
            title: 'Ride Details',
            ride: results[0],
            apiKey: apiKey
        });
    }).catch(err => {
        console.error("Database Error: ", err);
        res.status(500).send("Internal Server Error");
    });
});



// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});