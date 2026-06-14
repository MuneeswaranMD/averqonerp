const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Your school ID from JWT
  const schoolId = '3231ebc8-33b1-4617-a00d-a370bfa96ef3';

  // Verify school exists
  const school = await prisma.school.findUnique({ where: { id: schoolId } });
  if (!school) {
    console.error('School not found! Check the schoolId.');
    process.exit(1);
  }
  console.log(`Seeding classes & sections for school: ${school.name}`);

  const classNames = [
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4',
    'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8',
    'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12',
  ];
  const sectionNames = ['A', 'B', 'C'];

  for (const className of classNames) {
    // Upsert-like: skip if already exists
    const existing = await prisma.class.findFirst({
      where: { schoolId, name: className },
    });
    let classRecord = existing;
    if (!existing) {
      classRecord = await prisma.class.create({
        data: { schoolId, name: className },
      });
      console.log(`  Created class: ${className}`);
    } else {
      console.log(`  Class already exists: ${className}`);
    }

    for (const secName of sectionNames) {
      const existingSec = await prisma.section.findFirst({
        where: { schoolId, classId: classRecord.id, name: secName },
      });
      if (!existingSec) {
        await prisma.section.create({
          data: { schoolId, classId: classRecord.id, name: secName },
        });
        console.log(`    Created section: ${className} - ${secName}`);
      } else {
        console.log(`    Section already exists: ${className} - ${secName}`);
      }
    }
  }

  console.log('\nDone! Classes and sections seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
