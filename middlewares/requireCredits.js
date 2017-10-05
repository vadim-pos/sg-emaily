module.exports = (req, res, next) => {
  // If user was not authorized by passport - return 401 error
  if (req.user.credits < 1) {
    return res.status(403).send({ error: 'Not enough credits!' });
  }
  
  next();
};