// User Service
// Handles user profile and management operations

const prisma = require('../config/database');

class UserService {
  /**
   * Get user profile
   */
  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        plan: {
          select: {
            id: true,
            name: true,
            price: true,
            features: true
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
   * Update user profile
   */
  async updateProfile(userId, data) {
    const { name, email } = data;

    // Check if email is being changed and already exists
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: email.toLowerCase(),
          NOT: { id: userId }
        }
      });

      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email: email.toLowerCase() })
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true
      }
    });

    return user;
  }

  /**
   * Get all available plans
   */
  async getPlans() {
    return prisma.plan.findMany({
      orderBy: { price: 'asc' }
    });
  }

  /**
   * Upgrade user plan
   */
  async upgradePlan(userId, planName) {
    const plan = await prisma.plan.findUnique({
      where: { name: planName }
    });

    if (!plan) {
      throw new Error('Plan not found');
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { planId: plan.id },
      select: {
        id: true,
        email: true,
        name: true,
        plan: {
          select: {
            name: true,
            features: true
          }
        }
      }
    });

    return user;
  }
}

module.exports = new UserService();
