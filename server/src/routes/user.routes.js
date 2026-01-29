// User Routes
const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * GET /api/users/profile
 * Get current user's profile
 */
router.get('/profile', authenticate, async (req, res, next) => {
  try {
    const profile = await userService.getProfile(req.user.userId);
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/users/profile
 * Update current user's profile
 */
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await userService.updateProfile(req.user.userId, { name, email });
    res.json(user);
  } catch (error) {
    if (error.message === 'Email already in use') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

/**
 * GET /api/users/plans
 * Get all available plans
 */
router.get('/plans', async (req, res, next) => {
  try {
    const plans = await userService.getPlans();
    res.json(plans);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/users/upgrade
 * Upgrade user plan
 */
router.post('/upgrade', authenticate, async (req, res, next) => {
  try {
    const { planName } = req.body;
    
    if (!planName) {
      return res.status(400).json({ error: 'Plan name is required' });
    }
    
    const user = await userService.upgradePlan(req.user.userId, planName);
    res.json({
      message: 'Plan upgraded successfully',
      user
    });
  } catch (error) {
    if (error.message === 'Plan not found') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
});

module.exports = router;
