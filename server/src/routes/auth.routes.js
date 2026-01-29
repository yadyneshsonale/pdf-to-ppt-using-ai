// Authentication Routes
const express = require('express');
const router = express.Router();
const authService = require('../services/auth.service');
const { authenticate } = require('../middleware/auth.middleware');
const { validateBody, validateEmail, validatePassword } = require('../middleware/validation.middleware');
const jwtConfig = require('../config/jwt.config');

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register',
  validateBody(['email', 'password']),
  validateEmail,
  validatePassword,
  async (req, res, next) => {
    try {
      const { email, password, name } = req.body;
      const result = await authService.register({ email, password, name });
      
      // Set token cookie
      res.cookie('token', result.token, jwtConfig.cookieOptions);
      
      res.status(201).json({
        message: 'Registration successful',
        user: result.user,
        token: result.token
      });
    } catch (error) {
      if (error.message === 'User with this email already exists') {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  }
);

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login',
  validateBody(['email', 'password']),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      
      // Set token cookie
      res.cookie('token', result.token, jwtConfig.cookieOptions);
      
      res.json({
        message: 'Login successful',
        user: result.user,
        token: result.token
      });
    } catch (error) {
      if (error.message === 'Invalid email or password') {
        return res.status(401).json({ error: error.message });
      }
      next(error);
    }
  }
);

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

/**
 * GET /api/auth/me
 * Get current user
 */
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user.userId);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/auth/password
 * Update password
 */
router.put('/password',
  authenticate,
  validateBody(['currentPassword', 'newPassword']),
  validatePassword,
  async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await authService.updatePassword(
        req.user.userId,
        currentPassword,
        newPassword
      );
      res.json(result);
    } catch (error) {
      if (error.message === 'Current password is incorrect') {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  }
);

/**
 * GET /api/auth/verify
 * Verify token is valid
 */
router.get('/verify', authenticate, (req, res) => {
  res.json({
    valid: true,
    user: req.user
  });
});

module.exports = router;
