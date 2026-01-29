// History Service
// Handles user PPT conversion history

const prisma = require('../config/database');

class HistoryService {
  /**
   * Get user's conversion history
   */
  async getUserHistory(userId, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([
      prisma.userHistory.findMany({
        where: { userId },
        include: {
          ppt: {
            select: {
              id: true,
              title: true,
              templateId: true,
              createdAt: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.userHistory.count({ where: { userId } })
    ]);

    return {
      data: history,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Add history entry
   */
  async addHistoryEntry(userId, paperName, pptId = null) {
    return prisma.userHistory.create({
      data: {
        userId,
        paperName,
        pptId
      }
    });
  }

  /**
   * Get single history entry
   */
  async getHistoryEntry(historyId, userId) {
    const entry = await prisma.userHistory.findFirst({
      where: {
        id: historyId,
        userId
      },
      include: {
        ppt: true
      }
    });

    if (!entry) {
      throw new Error('History entry not found');
    }

    return entry;
  }

  /**
   * Delete history entry
   */
  async deleteHistoryEntry(historyId, userId) {
    const entry = await prisma.userHistory.findFirst({
      where: {
        id: historyId,
        userId
      }
    });

    if (!entry) {
      throw new Error('History entry not found');
    }

    await prisma.userHistory.delete({
      where: { id: historyId }
    });

    return { message: 'History entry deleted' };
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId) {
    const [totalConversions, thisMonthConversions, recentPpts] = await Promise.all([
      prisma.userHistory.count({ where: { userId } }),
      prisma.userHistory.count({
        where: {
          userId,
          createdAt: {
            gte: new Date(new Date().setDate(1)) // First day of current month
          }
        }
      }),
      prisma.ppt.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          templateId: true,
          createdAt: true
        }
      })
    ]);

    return {
      totalConversions,
      thisMonthConversions,
      recentPpts
    };
  }
}

module.exports = new HistoryService();
