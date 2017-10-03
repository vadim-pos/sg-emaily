const passport = require('passport');

module.exports = (app) => {
  app.get('/auth/google', passport.authenticate('google', {
    // get user's profile info and email from Google
    scope: ['profile', 'email']
  }));
  
  // After receiving data from Google authenticate user and redirect to '/surveys'
  app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/surveys');
  });

  app.get('/api/logout', (req, res) => {
      req.logout();
      res.redirect('/');
  });

  app.get('/api/current-user', (req, res) => {
    res.send(req.user);
  });
};