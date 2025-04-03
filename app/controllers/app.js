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


// ======================
// Configuration
// ======================
app.set('view engine', 'pug');
app.set('views', './app/views');

// ======================
// Middleware
// ======================
app.use(express.static("static"));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
app.use('/bootstrap-icons', express.static('node_modules/bootstrap-icons'));
app.use("/uploads", express.static(path.join(__dirname, "../../static/uploads")));


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
  // Session and user data
  res.locals.userSession = req.session.user;
  // Flash messages
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// ======================
// Authentication Middleware
// ======================
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    req.flash('error', 'Your session has expired. Please log in again.');
    return res.redirect('/login');
  }
  next();
};


// ======================
// Upload Config
// ======================

// Set storage engine for Photo Upload
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../static/uploads"), // Correct path
  filename: (req, file, cb) => {
    cb(null, `profile-${req.session.user.id}${path.extname(file.originalname)}`);
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
  limits: { fileSize: 2 * 1024 * 1024 } 
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
  try {
    const user = await User.getById(req.params.id);
    user.length 
      ? res.render('profile', { user: user[0] })
      : res.status(404).send("User not found");
  } catch (err) {
    console.error("Profile Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

// ----------------------
// Account Management Routes
// ----------------------
app.get('/account/edit/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.getById(req.session.user.id);
    res.render('editProfile', { user: user[0] });
  } catch (err) {
    console.error("Profile Edit Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post('/account/edit/profile', requireAuth, async (req, res) => {
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
  res.render('changePassword');
});

app.post('/account/edit/password', requireAuth, async (req, res) => {
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
  res.render('deleteConfirmation');
});

// Handle account deletion for current user
app.post('/account/delete', requireAuth, async (req, res) => {
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
  const userId = req.params.id;
  res.render('deleteConfirmation', { userId }); // Pass userId to the view
});


// Handle account deletion for a specific user (only accessible by admin)
app.post('/account/delete/:id', requireAuth, isAdmin, async (req, res) => {
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

// Middleware to check if user is admin (only admins can delete other users)
function isAdmin(req, res, next) {
  if (req.session.user.role !== 'Admin') {
    return res.status(403).send('Forbidden');
  }
  next();
}



// ======================
// Server Initialization
// ======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});