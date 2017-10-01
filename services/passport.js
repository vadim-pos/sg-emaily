const passport = require('passport');
const mongoose = require('mongoose');
const GoogleAuthStrategy = require('passport-google-oauth20').Strategy;
const appKeys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

// Configuring google OAuth 2.0 strategy for passport
passport.use(new GoogleAuthStrategy({
  clientID: appKeys.googleClientID,
  clientSecret: appKeys.googleClientSecret,
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  // after receiving profile info from Google - create new user or return existing one
  User.findOne({ googleID: profile.id }).then((existingUser) => {
      if (existingUser) {
        // 1-st argument - error object, 2-nd - data
        done(null, existingUser);
      } else {
        new User({ googleID: profile.id }).save()
          .then(user => done(null, user));
      }
    });
}));