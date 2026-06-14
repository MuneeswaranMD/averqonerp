const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const email = 'muneeswaranmd2004@gmail.com';
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (user) {
      console.log('User found! Current role:', user.role);
      
      const updated = await prisma.user.update({
        where: { email },
        data: { role: 'SUPER_ADMIN' }
      });
      
      console.log('Successfully updated user to SUPER_ADMIN:', updated.email);
    } else {
      console.log('User not found. You need to sign up first, or let me know the correct email.');
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
