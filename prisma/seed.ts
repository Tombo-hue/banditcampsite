// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    const adminPassword = await hash('fxkBfxdnRkeFv2', 12);
    const admin = await prisma.admin.upsert({
      where: { email: 'admin@banditcamp.co.uk' },
      update: {},
      create: {
        username: 'admin',
        email: 'admin@banditcamp.co.uk',
        passwordHash: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        isActive: true,
      },
    });

    console.log('Admin user created:', admin.email);
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 