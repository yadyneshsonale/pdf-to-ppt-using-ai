// Authentication Middleware
// Verifies JWT token and attaches user to request

const authService = require('../services/auth.service');

/**
 * Require authentication
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header or cookie
    let token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify token
    const decoded = authService.verifyToken(token);
    
    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Require admin role
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

/**
 * Optional authentication - attaches user if token present
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (token) {
      const decoded = authService.verifyToken(token);
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };
    }
  } catch (error) {
    // Token invalid, continue without user
  }
  next();
};

module.exports = {
  authenticate,
  requireAdmin,
  optionalAuth
};
