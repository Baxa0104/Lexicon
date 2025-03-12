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

app.get("/dashboard", function(req, res) {
    res.render('layout', {
    currentRoute: '/dashboard'
    });
});

app.get("/rides", function(req, res) {
    var sql = 'SELECT * FROM ride';

    db.query(sql).then(results => {
        console.log("Fetched Data: ", results);

        res.render('listing', {
            currentRoute: '/rides',
            title: 'Ride Request',
            heading: 'List of Rides',
            data: results
        });
    }).catch(err => {
        console.error("Database Error: ", err);
        res.status(500).send("Internal Server Error");
    });
});

app.get("/social", function(req, res) {
    var sql = 'SELECT * FROM User';
    db.query(sql).then(results => {
        console.log("Fetched Data: ", results); // Log the data to verify its structure
        res.render('usersPage', {
            currentRoute: '/social',
            title: 'User List',
            heading: 'List of Users',
            data: results
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