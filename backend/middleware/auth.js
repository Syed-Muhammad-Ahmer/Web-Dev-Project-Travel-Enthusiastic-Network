const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

// Fallback secret for development (should be overridden by environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    console.log('Verifying token...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decoded:', decoded);
    
    if (!decoded.user || !decoded.user.id) {
      console.log('Invalid token structure:', decoded);
      return res.status(401).json({ message: 'Invalid token structure' });
    }

    // Find user by id from token
    const user = await User.findById(decoded.user.id);
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({ message: 'User not found' });
    }

    // Set both user and userId for compatibility
    req.user = user;
    req.userId = user._id;
    
    console.log('Auth middleware successful. User ID:', user._id);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    res.status(401).json({ message: 'Token is invalid' });
  }
};

module.exports = auth; 