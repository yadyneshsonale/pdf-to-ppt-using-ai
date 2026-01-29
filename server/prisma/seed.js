// Database seeding script
// Creates default plans and admin user

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create plans
  const plans = [
    {
      name: 'FREE',
      price: 0,
      features: [
        'Up to 5 PPT conversions/month',
        'Basic templates only',
        'Standard quality',
        'Email support'
      ]
    },
    {
      name: 'PAID',
      price: 9.99,
      features: [
        'Up to 50 PPT conversions/month',
        'All templates including premium',
        'High quality output',
        'Priority email support',
        'Custom branding'
      ]
    },
    {
      name: 'PREMIUM',
      price: 29.99,
      features: [
        'Unlimited PPT conversions',
        'All templates + exclusive designs',
        'Highest quality output',
        '24/7 priority support',
        'Custom branding',
        'API access',
        'Team collaboration'
      ]
    }
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan
    });
    console.log(`✅ Created/updated plan: ${plan.name}`);
  }

  // Get FREE plan for default user assignment
  const freePlan = await prisma.plan.findUnique({ where: { name: 'FREE' } });

  // Create default admin account
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@papertoppt.com' },
    update: {},
    create: {
      email: 'admin@papertoppt.com',
      passwordHash: adminPassword,
      name: 'System Admin',
      role: 'ADMIN',
      planId: freePlan?.id
    }
  });
  console.log(`✅ Created admin user: ${admin.email}`);

  // Create a test user
  const userPassword = await bcrypt.hash('user123', 12);
  const testUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      passwordHash: userPassword,
      name: 'Test User',
      role: 'USER',
      planId: freePlan?.id
    }
  });
  console.log(`✅ Created test user: ${testUser.email}`);

  console.log('');
  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('Default credentials:');
  console.log('  Admin: admin@papertoppt.com / admin123');
  console.log('  User:  user@example.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
