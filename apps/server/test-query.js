const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const schoolId = 'dummy'; // Doesn't matter, we just want to see if the query structure itself is valid
    const school = await prisma.school.findFirst();
    if (!school) {
        console.log("No school found");
        return;
    }
    const realSchoolId = school.id;
    
    console.log("Testing with schoolId:", realSchoolId);
    
    const users = await prisma.user.findMany({
      where: { schoolId: realSchoolId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        customRole: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            userPermissions: true,
          },
        },
      },
      orderBy: { email: 'asc' },
    });
    console.log("Success! Found users:", users.length);
  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
