// History Routes
const express = require('express');
const router = express.Router();
const historyService = require('../services/history.service');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * GET /api/history
 * Get user's conversion history
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const history = await historyService.getUserHistory(req.user.userId, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10
    });
    res.json(history);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/history/stats
 * Get user's statistics
 */
router.get('/stats', authenticate, async (req, res, next) => {
  try {
    const stats = await historyService.getUserStats(req.user.userId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/history/:id
 * Get single history entry
 */
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const entry = await historyService.getHistoryEntry(req.params.id, req.user.userId);
    res.json(entry);
  } catch (error) {
    if (error.message === 'History entry not found') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
});

/**
 * DELETE /api/history/:id
 * Delete history entry
 */
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const result = await historyService.deleteHistoryEntry(req.params.id, req.user.userId);
    res.json(result);
  } catch (error) {
    if (error.message === 'History entry not found') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
});

module.exports = router;
