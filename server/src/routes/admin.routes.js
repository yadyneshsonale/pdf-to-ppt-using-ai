// Admin Routes
const express = require('express');
const router = express.Router();
const adminService = require('../services/admin.service');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 */
router.get('/dashboard', async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/users
 * Get all users
 */
router.get('/users', async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const users = await adminService.getAllUsers({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      search: search || ''
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/users/:id
 * Get user details
 */
router.get('/users/:id', async (req, res, next) => {
  try {
    const user = await adminService.getUserDetails(req.params.id);
    res.json(user);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
});

/**
 * PUT /api/admin/users/:id/role
 * Update user role
 */
router.put('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body;
    
    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }
    
    const user = await adminService.updateUserRole(req.params.id, role);
    res.json({
      message: 'User role updated',
      user
    });
  } catch (error) {
    if (error.message === 'Invalid role') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

/**
 * DELETE /api/admin/users/:id
 * Delete user
 */
router.delete('/users/:id', async (req, res, next) => {
  try {
    const result = await adminService.deleteUser(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.message === 'User not found' || error.message === 'Cannot delete admin users') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

module.exports = router;
