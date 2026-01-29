// Admin Service
// Handles admin-specific operations

const prisma = require('../config/database');

class AdminService {
  /**
   * Get all users (admin only)
   */
  async getAllUsers(options = {}) {
    const { page = 1, limit = 20, search = '' } = options;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' } },
            { name: { contains: search, mode: 'insensitive' } }
          ]
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          plan: {
            select: {
              name: true
            }
          },
          _count: {
            select: {
              history: true,
              ppts: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalUsers,
      newUsersThisMonth,
      totalPpts,
      pptGenerationsThisMonth,
      usersByPlan,
      recentActivity
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: { createdAt: { gte: startOfMonth } }
      }),
      prisma.ppt.count(),
      prisma.ppt.count({
        where: { createdAt: { gte: startOfMonth } }
      }),
      prisma.user.groupBy({
        by: ['planId'],
        _count: { id: true }
      }),
      prisma.userHistory.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              email: true,
              name: true
            }
          }
        }
      })
    ]);

    // Get plan names for user distribution
    const plans = await prisma.plan.findMany();
    const planMap = new Map(plans.map(p => [p.id, p.name]));
    
    const userDistribution = usersByPlan.map(item => ({
      plan: planMap.get(item.planId) || 'Unknown',
      count: item._count.id
    }));

    return {
      totalUsers,
      newUsersThisMonth,
      totalPpts,
      pptGenerationsThisMonth,
      userDistribution,
      recentActivity
    };
  }

  /**
   * Get user details (admin view)
   */
  async getUserDetails(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        plan: true,
        history: {
          take: 20,
          orderBy: { createdAt: 'desc' }
        },
        ppts: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            templateId: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            history: true,
            ppts: true
          }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Update user role
   */
  async updateUserRole(userId, role) {
    const validRoles = ['USER', 'ADMIN'];
    if (!validRoles.includes(role)) {
      throw new Error('Invalid role');
    }

    return prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        role: true
      }
    });
  }

  /**
   * Delete user
   */
  async deleteUser(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Prevent deleting admin users
    if (user.role === 'ADMIN') {
      throw new Error('Cannot delete admin users');
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    return { message: 'User deleted successfully' };
  }
}

module.exports = new AdminService();
