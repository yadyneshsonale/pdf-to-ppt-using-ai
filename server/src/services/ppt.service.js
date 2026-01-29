// PPT Service
// Handles presentation storage and management

const prisma = require('../config/database');

// Helper to stringify JSON for SQLite storage
const stringifyJson = (data) => typeof data === 'string' ? data : JSON.stringify(data);
// Helper to parse JSON from SQLite storage
const parseJson = (data) => {
  if (!data) return null;
  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch {
    return data;
  }
};

class PptService {
  /**
   * Save a generated PPT
   */
  async savePpt(userId, data) {
    const { title, slideJson, templateId, pdfPath, texPath } = data;

    const ppt = await prisma.ppt.create({
      data: {
        userId,
        title,
        slideJson: stringifyJson(slideJson),
        templateId,
        pdfPath,
        texPath
      }
    });

    // Also create history entry
    await prisma.userHistory.create({
      data: {
        userId,
        paperName: title,
        pptId: ppt.id
      }
    });

    return { ...ppt, slideJson: parseJson(ppt.slideJson) };
  }

  /**
   * Get user's PPTs
   */
  async getUserPpts(userId, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const [ppts, total] = await Promise.all([
      prisma.ppt.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          templateId: true,
          pdfPath: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.ppt.count({ where: { userId } })
    ]);

    return {
      data: ppts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get single PPT
   */
  async getPptById(pptId, userId) {
    const ppt = await prisma.ppt.findFirst({
      where: {
        id: pptId,
        userId
      }
    });

    if (!ppt) {
      throw new Error('PPT not found');
    }

    return { ...ppt, slideJson: parseJson(ppt.slideJson) };
  }

  /**
   * Update PPT
   */
  async updatePpt(pptId, userId, data) {
    const ppt = await prisma.ppt.findFirst({
      where: {
        id: pptId,
        userId
      }
    });

    if (!ppt) {
      throw new Error('PPT not found');
    }

    const updated = await prisma.ppt.update({
      where: { id: pptId },
      data: {
        title: data.title,
        slideJson: data.slideJson ? stringifyJson(data.slideJson) : undefined,
        templateId: data.templateId,
        updatedAt: new Date()
      }
    });
    
    return { ...updated, slideJson: parseJson(updated.slideJson) };
  }

  /**
   * Delete PPT
   */
  async deletePpt(pptId, userId) {
    const ppt = await prisma.ppt.findFirst({
      where: {
        id: pptId,
        userId
      }
    });

    if (!ppt) {
      throw new Error('PPT not found');
    }

    await prisma.ppt.delete({
      where: { id: pptId }
    });

    return { message: 'PPT deleted successfully' };
  }
}

module.exports = new PptService();
