module.exports = (req, res, next) => {
  // If user was not authorized by passport - return 401 error
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' });
  }
  
  next();
};