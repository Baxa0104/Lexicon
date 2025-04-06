// ======================
// Imports
// ======================

const express = require("express");
const app = express();
const bcrypt = require('bcryptjs');
const Ride = require('../models/Ride');
const User = require('../models/User');
const session = require('express-session');
const flash = require('connect-flash');
const db = require('../services/db');
const mysqlSession = require("express-mysql-session")(session);
const multer = require("multer");
const path = require("path");
const fs = require('fs');

// ======================
// Configuration
// ======================
app.set('view engine', 'pug');
app.set('views', './app/views');
app.use(express.static("static"));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
app.use('/bootstrap-icons', express.static('node_modules/bootstrap-icons'));
app.use("/uploads", express.static(path.join(__dirname, "../../static/uploads")));

// ======================
// Middleware
// ======================

// Session configuration
const sessionStore = new mysqlSession({
  expiration: 86400000,
  createDatabaseTable: true,
}, db.pool);

app.use(session({
  key: "user_sid",
  secret: process.env.SESSION_SECRET || "your-secret-key",
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 3600000,
  }
}));

app.use(flash());
app.use(express.urlencoded({ extended: true }));

// Global template variables
app.use((req, res, next) => {
  res.locals.userSession = req.session.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// ======================
// Authentication Middleware
// ======================
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    req.flash('error', 'Your session has expired. Please log in');
    return res.redirect('/login');
  }
  next();
};

// Middleware to check if user is a Driver
const isDriver = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'Driver' || req.session.user.role === 'Admin' ) {
    return next();
  }
  return res.status(403).json({ error: 'Access denied. Only drivers can create rides.' });
}

// Middleware to check if user is admin (only admins can delete other users)
function isAdmin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', 'Session expired. Please log in again.');
    return res.redirect('/login');
  }
  if (req.session.user.role !== 'Admin') {
    return res.status(403).send('Forbidden');
  }
  next();
}

// ======================
// Upload Config
// ======================

// Set storage engine for Photo Upload
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../static/uploads"),
  filename: (req, file, cb) => {
    // Get the file extension
    const ext = path.extname(file.originalname);
    
    // Generate a new filename based on user ID and timestamp
    let newFileName = `profile-${req.session.user.id}${ext}`;
    
    // Ensure the file name is unique by adding a timestamp if necessary
    let counter = 1;
    let filePath = path.join(__dirname, "../../static/uploads", newFileName);
    
    while (fs.existsSync(filePath)) {
      // If file exists, append counter to the filename
      newFileName = `profile-${req.session.user.id}-${Date.now()}-${counter}${ext}`;
      filePath = path.join(__dirname, "../../static/uploads", newFileName);
      counter++;
    }

    // Pass the unique filename to Multer
    cb(null, newFileName);
  },
});

// File filter (only images allowed)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

// Initialize upload middleware
const upload = multer({ 
  storage, 
  fileFilter, 
  limits: { fileSize: 2 * 1024 * 1024 } // Limit file size to 2MB
});
// ======================
// Routes
// ======================

// ----------------------
// Authentication Routes
// ----------------------
app.get('/login', (req, res) => {
  req.session.user ? res.redirect('/dashboard') : res.render('login');
});

app.post('/login', async (req, res) => {
  try {
    
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    req.session.user = {
      id: user.user_id,
      name: user.user_name,
      role: user.role
    };
    req.session.save(err => {
      err ? console.error('Session save error:', err) : res.redirect('/dashboard');
    });
    
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send('Server Error');
  }
});

app.get('/register', (req, res) => res.render('register'));

app.post('/register', async (req, res) => {
  try {
    const { username, email, password, phone_number, address } = req.body;

    if (await User.findByEmail(email)) {
      req.flash('error', 'Email already registered');
      return res.redirect('/register');
    }

    // Make sure the fields are being received properly
    console.log('Received Data:', { username, email, password, phone_number, address });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ 
      username, 
      email, 
      password: hashedPassword, 
      phone_number,  // Make sure this value is passed correctly
      address         // Make sure this value is passed correctly
    });

    req.flash('success', 'Registration successful! Please login');
    res.redirect('/login');
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).send('Server Error');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

// ----------------------
// Dashboard Routes
// ----------------------
app.get("/", (req, res) => res.redirect('/dashboard'));

app.get("/dashboard", requireAuth, async (req, res) => {

  if (!req.session.user) {
    req.flash('error', 'Session expired. Please log in again.');
    return res.redirect('/login');
  }

  try {
    res.render('dashboard', { 
      currentRoute: '/dashboard',
      user: req.session.user
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

// ----------------------
// Ride Management Routes
// ----------------------
app.get("/rides", async (req, res) => {

  if (!req.session.user) {
    req.flash('error', 'Session expired. Please log in again.');
    return res.redirect('/login');
  }

  try {
    const rides = await Ride.getAll(req.query.search);
    res.render('listing', {
      currentRoute: '/rides',
      title: 'Ride Requests',
      data: rides,
      search: req.query.search
    });
  } catch (err) {
    console.error("Rides Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/rides/:id", async (req, res) => {

  if (!req.session.user) {
    req.flash('error', 'Session expired. Please log in again.');
    return res.redirect('/login');
  }

  try {
    const ride = await Ride.getById(req.params.id);
    ride.length ? res.render('listingDetails', { ride: ride[0] }) : res.status(404).send("Ride not found");
  } catch (err) {
    console.error("Ride Details Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

// ----------------------
// User Management Routes
// ----------------------
app.get("/social", async (req, res) => {

  if (!req.session.user) {
    req.flash('error', 'Session expired. Please log in again.');
    return res.redirect('/login');
  }

  try {
    const users = await User.getAll(req.query.category, req.query.search);
    res.render('social', {
      currentRoute: '/social',
      title: 'User List',
      data: users,
      category: req.query.category,
      search: req.query.search
    });
  } catch (err) {
    console.error("Social Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/social/:id", async (req, res) => {

  if (!req.session.user) {
    req.flash('error', 'Session expired. Please log in again.');
    return res.redirect('/login');
  }

  try {
    const user = await User.getById(req.params.id);

    // Check if the user object is null or undefined
    if (user && user.length > 0) {
      res.render('profile', { user: user[0] });
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.error("Profile Error:", err);
    res.status(500).send("Internal Server Error");
  }
});


// ----------------------
// Account Management Routes
// ----------------------
app.get('/account/edit/profile', requireAuth, async (req, res) => {

  if (!req.session.user) {
    req.flash('error', 'Session expired. Please log in again.');
    return res.redirect('/login');
  }

  try {
    const user = await User.getById(req.session.user.id);
    res.render('editProfile', { user: user[0] });
  } catch (err) {
    console.error("Profile Edit Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post('/account/edit/profile', requireAuth, async (req, res) => {

  if (!req.session.user) {
    req.flash('error', 'Session expired. Please log in again.');
    return res.redirect('/login');
  }

  try {
    const { username, bio, phone_number, address } = req.body;
    
    // Convert empty strings to null for database
    const cleanBio = bio === '' ? null : bio;
    const cleanPhone = phone_number === '' ? null : phone_number;
    const cleanAddress = address === '' ? null : address;

    const userId = req.session.user.id;

    await User.update(userId, { 
      user_name: username, 
      bio: cleanBio, 
      phone_number: cleanPhone, 
      address: cleanAddress 
    });
    
    req.flash('success', 'Profile updated successfully');
    res.redirect(`/social/${userId}`);
  } catch (err) {
    console.error("Profile Update Error:", err);
    req.flash('error', 'Failed to update profile');
    res.redirect('/account/edit/profile');
  }
});

app.post("/account/edit/picture", requireAuth, upload.single("profile_pic"), async (req, res) => {

  if (!req.session.user) {
    req.flash('error', 'Session expired. Please log in again.');
    return res.redirect('/login');
  }

  try {
    if (!req.file) {
      req.flash("error", "Please upload an image file.");
      return res.redirect("/account/edit/picture");
    }

    const imagePath = `/uploads/${req.file.filename}`;
    
    // Update the user profile in the database
    await User.updatePicture(req.session.user.id, { profile_pic: imagePath });

    // Update session data
    req.session.user.profile_pic = imagePath;

    req.flash("success", "Profile picture updated successfully!");
    res.redirect(`/social/${req.session.user.id}`);
  } catch (err) {
    console.error("Profile Picture Upload Error:", err);
    req.flash("error", "Failed to upload profile picture.");
    res.redirect("/account/edit/picture");
  }
});

app.get('/account/edit/password', requireAuth, (req, res) => {

  if (!req.session.user) {
    req.flash('error', 'Session expired. Please log in again.');
    return res.redirect('/login');
  }

  res.render('changePassword');
});

app.post('/account/edit/password', requireAuth, async (req, res) => {

  if (!req.session.user) {
    req.flash('error', 'Session expired. Please log in again.');
    return res.redirect('/login');
  }

  try {
    const { current_password, new_password, confirm_password } = req.body;
    const user = await User.getById(req.session.user.id);
    
    if (!await bcrypt.compare(current_password, user[0].password_hash)) {
      req.flash('error', 'Current password is incorrect');
      return res.redirect('/account/edit/password');
    }

    if (new_password !== confirm_password) {
      req.flash('error', 'New passwords do not match');
      return res.redirect('/account/edit/password');
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await User.updatePassword(req.session.user.id, hashedPassword);
    
    req.flash('success', 'Password updated successfully');
    res.redirect(`/social/${req.session.user.id}`);
  } catch (err) {
    console.error("Password Change Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Render the delete confirmation page for current user (who is logged in)
app.get('/account/delete', requireAuth, (req, res) => {
  if (!req.session.user) {
    req.flash('error', 'Session expired. Please log in again.');
    return res.redirect('/login');
  }
  res.render('deleteConfirmation');
});

// Handle account deletion for current user
app.post('/account/delete', requireAuth, async (req, res) => {
  if (!req.session.user) {
    req.flash('error', 'Session expired. Please log in again.');
    return res.redirect('/login');
  }
  try {
    await User.deleteById(req.session.user.id);
    req.session.destroy(() => res.redirect('/login')); // After deleting, log out and redirect to login
  } catch (err) {
    console.error('Account Deletion Error:', err);
    req.flash('error', 'Failed to delete account');
    res.redirect('/account/delete'); // Go back to the delete confirmation page if there's an error
  }
});

// Admin Deleting Any User (by ID)
app.get('/account/delete/:id', requireAuth, isAdmin, (req, res) => {
  if (!req.session.user) {
    req.flash('error', 'Session expired. Please log in again.');
    return res.redirect('/login');
  }
  const userId = req.params.id;
  res.render('deleteConfirmation', { userId }); // Pass userId to the view
});


// Handle account deletion for a specific user (only accessible by admin)
app.post('/account/delete/:id', requireAuth, isAdmin, async (req, res) => {
  if (!req.session.user) {
    req.flash('error', 'Session expired. Please log in again.');
    return res.redirect('/login');
  }
  const userId = req.params.id;
  try {
    await User.deleteById(userId); // Delete user by ID
    req.flash('success', 'Successfully Deleted');
    res.redirect('/social'); // Redirect to social page after successful deletion
  } catch (err) {
    console.error('Account Deletion Error:', err);
    req.flash('error', 'Failed to delete user');
    res.redirect('/social'); // Redirect back to the social page if there's an error
  }
});

// Route for booking a ride
app.get('/book/:ride_id', (req, res) => {
    const rideId = req.params.ride_id;

    // Check if the ride exists
    const sql = 'SELECT * FROM ride WHERE ride_id = ?';
    db.query(sql, [rideId])
        .then(results => {
            if (results.length > 0) {
                // Update the booking status or create a booking entry
                const bookingSql = 'INSERT INTO booking (ride_id, user_id) VALUES (?, ?)';
                db.query(bookingSql, [rideId, req.user.user_id])
                    .then(() => {
                        res.send('Booking successful!');
                    })
                    .catch(err => {
                        console.error('Booking Error:', err);
                        res.status(500).send('Error during booking.');
                    });
            } else {
                res.status(404).send('Ride not found.');
            }
        })
        .catch(err => {
            console.error('Database Error:', err);
            res.status(500).send('Error retrieving ride.');
        });
});


// Route to handle booking a ride
// Route to handle booking a ride
app.post('/book/:rideId', requireAuth, async (req, res) => {
  const userId = req.session.user.id;
  const rideId = req.params.rideId;

  try {
    const checkBookingSql = `SELECT * FROM booking WHERE ride_id = ? AND user_id = ?`;
    const existingBooking = await db.query(checkBookingSql, [rideId, userId]);

    if (existingBooking.length > 0) {
      req.flash('error', 'You have already booked this ride.');
      return res.redirect(`/rides/${rideId}`);
    }

    const checkSeatsSql = `SELECT available_seats FROM ride WHERE ride_id = ?`;
    const ride = await db.query(checkSeatsSql, [rideId]);

    if (ride.length === 0 || ride[0].available_seats <= 0) {
      req.flash('error', 'No available seats for this ride.');
      return res.redirect(`/rides/${rideId}`);
    }

    const bookingSql = `INSERT INTO booking (user_id, ride_id, booking_time, status) VALUES (?, ?, NOW(), 'Pending')`;
    await db.query(bookingSql, [userId, rideId]);

    const updateSeatsSql = `UPDATE ride SET available_seats = available_seats - 1 WHERE ride_id = ?`;
    await db.query(updateSeatsSql, [rideId]);

    req.flash('success', 'Your booking has been successful!');
    res.redirect(`/rides/${rideId}`);
  } catch (err) {
    console.error("Booking Error:", err);
    req.flash('error', 'Error booking the ride.');
    res.redirect(`/rides/${rideId}`);
  }
});



// Route to fetch requested rides (history)
app.get('/history', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;

    // Use the model functions to fetch data
    const createdByMe = await Ride.getRidesCreatedByUser(userId);
    const myBookings = await Ride.getRidesBookedByUser(userId);
    const pastBookings = await Ride.getPastBookingsByUser(userId);

    // Render the history page with the results
    res.render('history', {
      title: 'Ride History',
      heading: 'Your Ride History',
      createdByMe: createdByMe,
      myBookings: myBookings,
      pastBookings: pastBookings,
      currentRoute: "/history"
    });
  } catch (err) {
    console.error("History Fetching Error:", err);
    req.flash('error', 'Error retrieving ride history.');
    res.redirect('/dashboard');
  }
});


// GET route to show ride creation form
app.get('/create/ride', requireAuth, isDriver, (req, res) => {
  res.render('createRide', {
    currentRoute: "/create/ride"
  });
});


// POST route to handle ride creation
app.post('/create/ride', requireAuth, isDriver, upload.single("ride_image"), async (req, res) => {
  try {
    const { short_name, departure_date, departure_time, origin_address, destination_address, available_seats, ride_details, price } = req.body;

    // Handle the uploaded image if present
    const ride_pics = req.file ? `/uploads/${req.file.filename}` : null;
    console.log(req.body); // Log to see the data being submitted


    // Create the ride in the database
    await Ride.create({
      short_name,          // Ride Name
      departure_date,      // Departure Date
      departure_time,      // Departure Time
      origin_address,      // Origin Address
      destination_address, // Destination Address
      available_seats,     // Available Seats
      ride_details,        // Additional Details
      price,               // Price
      ride_pics,           // Image URL
      user_id: req.session.user.id,  // Driver ID from session (user_id)
    });

    req.flash("success", "Ride created successfully!");
    res.redirect('/rides');
  } catch (err) {
    console.error("Ride Creation Error:", err);
    req.flash("error", "Failed to create ride.");
    res.redirect('/create/ride');
  }
});



// ======================
// Server Initialization
// ======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});