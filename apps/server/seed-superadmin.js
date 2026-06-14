const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    const schoolDomain = 'admin.averqonerp.com';
    const email = 'superadmin@averqonerp.com';
    
    // Check if school already exists
    let school = await prisma.school.findUnique({
      where: { domain: schoolDomain }
    });

    if (!school) {
      console.log('Creating System School...');
      school = await prisma.school.create({
        data: {
          name: 'AverqonERP Administration',
          domain: schoolDomain,
        }
      });
      console.log('Created school:', school.id);
    } else {
      console.log('System school already exists:', school.id);
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('Creating Super Admin user...');
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('Admin@123', salt);

      user = await prisma.user.create({
        data: {
          schoolId: school.id,
          email,
          passwordHash,
          role: 'SUPER_ADMIN',
          firstName: 'System',
          lastName: 'Administrator',
          isActive: true
        }
      });
      console.log('Created super admin:', user.id);
    } else {
      console.log('Super admin already exists:', user.id);
      
      // Update role just in case
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          role: 'SUPER_ADMIN',
          schoolId: school.id
        }
      });
      console.log('Updated existing super admin to correct role/school.');
    }
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
