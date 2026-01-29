// PPT Routes
const express = require('express');
const router = express.Router();
const pptService = require('../services/ppt.service');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * GET /api/ppt
 * Get user's PPTs
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const ppts = await pptService.getUserPpts(req.user.userId, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10
    });
    res.json(ppts);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/ppt
 * Save a new PPT
 */
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { title, slideJson, templateId, pdfPath, texPath } = req.body;
    
    if (!title || !slideJson) {
      return res.status(400).json({ error: 'Title and slideJson are required' });
    }
    
    const ppt = await pptService.savePpt(req.user.userId, {
      title,
      slideJson,
      templateId,
      pdfPath,
      texPath
    });
    
    res.status(201).json(ppt);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/ppt/:id
 * Get single PPT
 */
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const ppt = await pptService.getPptById(req.params.id, req.user.userId);
    res.json(ppt);
  } catch (error) {
    if (error.message === 'PPT not found') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
});

/**
 * PUT /api/ppt/:id
 * Update PPT
 */
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { title, slideJson, templateId } = req.body;
    const ppt = await pptService.updatePpt(req.params.id, req.user.userId, {
      title,
      slideJson,
      templateId
    });
    res.json(ppt);
  } catch (error) {
    if (error.message === 'PPT not found') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
});

/**
 * DELETE /api/ppt/:id
 * Delete PPT
 */
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const result = await pptService.deletePpt(req.params.id, req.user.userId);
    res.json(result);
  } catch (error) {
    if (error.message === 'PPT not found') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
});

module.exports = router;
