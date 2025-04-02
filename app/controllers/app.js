const express = require("express");
const app = express();
const bcrypt = require('bcryptjs');
const Ride = require('../models/Ride');
const User = require('../models/User');  // Changed from Social to User for consistency
const session = require('express-session');
const flash = require('connect-flash');
const db = require('../services/db');
const mysqlSession = require("express-mysql-session")(session);

// ======================
// Configuration
// ======================
app.set('view engine', 'pug');
app.set('views', './app/views');

// ======================
// Middleware
// ======================

// Serve static files
app.use(express.static("static"));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
app.use('/bootstrap-icons', express.static('node_modules/bootstrap-icons'));



// ======================
// Cookies and Sessions
// ======================

// Create a session store using your MySQL connection pool
const sessionStore = new mysqlSession({
  expiration: 86400000, // 1 day in milliseconds
  createDatabaseTable: true,  // Automatically creates the sessions table if it doesn't exist
}, db.pool);  // Use the pool from db.js


// Session middleware configuration
app.use(session({
  key: "user_sid",
  secret: "your-secret-key",  // Replace with an environment variable in production
  store: sessionStore,  // Use the session store
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,  // Set to true if using HTTPS
    httpOnly: true,  // Helps prevent cross-site scripting (XSS)
    maxAge: 3600000, // Cookie expires in 1 hour
  }
}));

// Flash messages
app.use(flash());

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Debug: Log session on every request
app.use((req, res, next) => {
    console.log("Session on request:", req.session);
    next();
});

// Make flash messages available in templates
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Authentication middleware
const requireAuth = (req, res, next) => {
  console.log("Checking authentication. Session user:", req.session.user);
    if (!req.session.user) {
        req.flash('error', 'Your session has expired. Please log in again.');
        return res.redirect('/login');  // Redirect to login
    }
    next();
};

// Global middleware to pass userSession to all views
app.use((req, res, next) => {
  // Make userSession available globally to all templates
  res.locals.userSession = req.session.user;
  next();
});


// ======================
// Login Routes
// ======================

// Login page
app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('login');
});

// Login handler
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
    console.log("User session after login:", req.session.user);

    // Ensure session is saved before redirect
    req.session.save(err => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).send('Server error');
      }
      res.redirect('/dashboard');
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send('Server Error');
  }
});

// Registration Routes
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      req.flash('error', 'Email already registered');
      return res.redirect('/register');
    }

    await User.create({ username, email, password });
    req.flash('success', 'Registration successful! Please login');
    res.redirect('/login');
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).send('Server Error');
  }
});

// Logout Route
app.get('/logout', (req, res) => {
  console.log("Logging out. Destroying session.");
  req.session.destroy();
  res.redirect('/login');
});

// ======================
// Basic Routes
// ======================
app.get("/", (req, res) => res.redirect('/dashboard'));

// ======================
// Protected Routes
// ======================

app.get("/dashboard", requireAuth, async (req, res) => {
  console.log("Session inside dashboard:", req.session.user);
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

// Rides Listing
app.get("/rides", async (req, res) => {
  try {
    const search = req.query.search;
    const rides = await Ride.getAll(search);
    
    res.render('listing', {
      currentRoute: '/rides',
      title: 'Ride Request',
      data: rides,
      search: search
    });
  } catch (err) {
    console.error("Rides Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Single Ride Details
app.get("/rides/:id", async (req, res) => {
  try {
    const rideId = req.params.id;
    const ride = await Ride.getById(rideId);

    if (!ride.length) {
      return res.status(404).send("Ride not found");
    }

    res.render('listingDetails', {
      title: 'Ride Details',
      ride: ride[0],
    });
  } catch (err) {
    console.error("Ride Details Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Social Users Listing
app.get("/social", async (req, res) => {
  try {
    const { category, search } = req.query;
    const users = await User.getAll(category, search);

    res.render('social', {
      currentRoute: '/social',
      title: 'User List',
      heading: 'List of Users',
      data: users,
      category: category,
      search: search
    });

  } catch (err) {
    console.error("Social Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

// User Profile
app.get("/social/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.getById(userId);

    if (!user.length) {
      return res.status(404).send("User not found");
    }

    res.render('profile', {
      title: 'User Profile',
      user: user[0],
      userSession: req.session.user
    });
  } catch (err) {
    console.error("Profile Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Profile Edit
app.post('/account/edit', requireAuth, async (req, res) => {
  try {
      const { username, bio, phone, address } = req.body;
      const userId = req.session.user?.id;
      console.log("Editing profile for user ID:", userId);

      await User.update(userId, { username, bio, phone, address });
      req.flash('success', 'Profile updated successfully');
      res.redirect('/account/edit');
  } catch (err) {
      console.error("Profile Update Error:", err);
      res.status(500).send("Internal Server Error");
  }
});

// Route to render delete confirmation page
app.get('/account/delete', (req, res) => {

  res.render('deleteConfirmation', {
    userSession: req.session.user
  
  });
});

app.post('/account/delete', requireAuth, async (req, res) => {
  const userId = req.session.user.id;

  try {
    // Attempt to delete user from the database
    const result = await User.findByIdAndDelete(userId);

    if (!result) {
      req.flash('error', 'Account deletion failed.');
      return res.redirect('/account/delete'); // Return the user back if deletion failed
    }

    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).send('Error logging out');
      }

      // Redirect after successfully deleting the account
      res.redirect('/'); // Redirect to homepage or login page
    });
  } catch (err) {
    console.error('Error deleting account:', err);
    req.flash('error', 'An error occurred while deleting the account.');
    res.redirect('/account/delete'); // Return the user back if an error occurred
  }
});

// ======================
// Server Start
// ======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});
