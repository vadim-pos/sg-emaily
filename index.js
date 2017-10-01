const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');

const appKeys = require('./config/keys');
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cookieSession({
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  keys: [appKeys.cookieKey] // keys for cookie encryption
}));

app.use(passport.initialize());
app.use(passport.session());

// Load mongoose models
require('./models/user');

// Connect to DB
mongoose.connect(appKeys.mongoURI);

// Load passport configuration
require('./services/passport');

// Add application auth routes
require('./routes/authRoutes')(app);

app.listen(PORT, () => console.log(`☰☰☰ ➔ Express running on port ${PORT} ✔ ☰☰☰`));