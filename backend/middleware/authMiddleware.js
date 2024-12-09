const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      // Respond with error and stop further execution
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // If no token, respond and stop further execution
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  // If token is undefined or null
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };