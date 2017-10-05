const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');

const appKeys = require('./config/keys');
const PORT = process.env.PORT || 5000;
const app = express();

// Use native promises
mongoose.Promise = global.Promise;

app.use(bodyParser.json());

app.use(cookieSession({
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  keys: [appKeys.cookieKey] // keys for cookie encryption
}));

app.use(passport.initialize());
app.use(passport.session());

// Load mongoose models
require('./models/user');
require('./models/survey');

// Connect to DB
mongoose.connect(appKeys.mongoURI);

// Load passport configuration
require('./services/passport');

// Add application auth routes
require('./routes/authRoutes')(app);
// Add application billing routes
require('./routes/billingRoutes')(app);
// Add application survey routes
require('./routes/surveyRoutes')(app);

// Add production routing
if (process.env.NODE_ENV === 'production') {
  // serve up production assets
  app.use(express.static('client/build'));
  // serve up the index.html file when route is unrecognized
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => console.log(`☰☰☰ ➔ Express running on port ${PORT} ✔ ☰☰☰`));