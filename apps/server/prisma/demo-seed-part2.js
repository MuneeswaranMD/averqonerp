/**
 * DEMO SEED PART 2 — LMS, Admissions, Expenses, Audit Logs
 * Picks up where demo-seed.js left off
 * Run: node prisma/demo-seed-part2.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2));
const randDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const FIRST_NAMES = ['Aarav','Arjun','Priya','Ananya','Rohan','Riya','Sneha','Vikram','Pooja','Divya','Rahul','Simran','Karan','Ayesha','Meera','Siddharth','Nisha','Isha','Tanvi','Aditya'];
const LAST_NAMES = ['Sharma','Verma','Patel','Singh','Kumar','Gupta','Mehta','Joshi','Yadav','Mishra','Agarwal','Nair','Reddy','Pillai','Iyer','Shah','Desai','Pandey','Chauhan','Mathur'];

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║   DEMO SEED PART 2 — LMS + Admissions + Expenses    ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  const school = await prisma.school.findUnique({ where: { domain: 'greenvalley.averqonerp.com' } });
  if (!school) { console.error('❌ School not found! Run demo-seed.js first.'); process.exit(1); }
  const schoolId = school.id;
  console.log(`✓ Found school: ${school.name}`);

  // ── LMS ────────────────────────────────────────────────────────────────────
  console.log('\n▶ Creating LMS courses, lessons & assignments...');

  const classes = await prisma.class.findMany({ where: { schoolId }, orderBy: { name: 'asc' } });
  const upperGradeClasses = classes.filter(c => {
    const num = parseInt(c.name.replace('Grade ', ''));
    return num >= 9 && num <= 12;
  });

  const lessonTitles = [
    'Introduction & Overview',
    'Core Concepts – Part 1',
    'Core Concepts – Part 2',
    'Practice & Application',
    'Assessment & Review',
  ];
  const assignmentTitles = [
    'Chapter Worksheet',
    'Mid-Unit Project',
    'Research Assignment',
  ];
  const feedbacks = [
    'Excellent work!', 'Good effort, minor corrections needed.',
    'Well presented.', 'Needs improvement in section 2.',
    'Outstanding submission.', 'Keep up the good work!',
  ];

  let courseCount = 0, lessonCount = 0, assignmentCount = 0, submissionCount = 0;

  for (const cls of upperGradeClasses) {
    const gradeNum = parseInt(cls.name.replace('Grade ', ''));
    const sections = await prisma.section.findMany({ where: { schoolId, classId: cls.id } });
    const subjects = await prisma.subject.findMany({ where: { schoolId, classId: cls.id }, take: 4 });
    const students = await prisma.student.findMany({ where: { schoolId, classId: cls.id }, take: 8 });

    for (const subject of subjects) {
      for (const section of sections.slice(0, 1)) { // 1 section per subject for speed
        // Check if course already exists
        const existing = await prisma.lMSCourse.findFirst({
          where: { schoolId, subjectId: subject.id, classId: cls.id, sectionId: section.id }
        });
        if (existing) continue;

        const course = await prisma.lMSCourse.create({
          data: {
            schoolId,
            name: `${subject.name} – Grade ${gradeNum}`,
            subjectId: subject.id,
            classId: cls.id,
            sectionId: section.id,
          }
        });
        courseCount++;

        // Lessons
        for (const title of lessonTitles) {
          await prisma.lMSLesson.create({
            data: {
              schoolId,
              courseId: course.id,
              title: `${subject.name}: ${title}`,
              description: `Comprehensive lesson covering ${title.toLowerCase()} for ${subject.name}.`,
              contentUrl: `https://storage.greenvalley.edu/lms/${subject.name.replace(/\s/g, '-').toLowerCase()}-l${lessonCount + 1}.pdf`,
              createdAt: randDate(new Date('2026-04-01'), new Date()),
            }
          });
          lessonCount++;
        }

        // Assignments + submissions
        for (let a = 0; a < assignmentTitles.length; a++) {
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + rand(5, 45));
          const assignment = await prisma.lMSAssignment.create({
            data: {
              schoolId,
              courseId: course.id,
              title: `${subject.name}: ${assignmentTitles[a]}`,
              description: `Complete the ${assignmentTitles[a]} for ${subject.name}. Submit before the due date.`,
              dueDate,
              createdAt: randDate(new Date('2026-04-01'), new Date()),
            }
          });
          assignmentCount++;

          // Student submissions
          for (const student of students.slice(0, 5)) {
            try {
              await prisma.lMSSubmission.create({
                data: {
                  assignmentId: assignment.id,
                  studentId: student.id,
                  fileUrl: `https://storage.greenvalley.edu/submissions/${student.id.slice(0,8)}-${assignment.id.slice(0,8)}.pdf`,
                  marks: randFloat(55, 98),
                  feedback: pick(feedbacks),
                  status: 'GRADED',
                  submittedAt: randDate(new Date('2026-04-15'), new Date()),
                }
              });
              submissionCount++;
            } catch (_) {}
          }
        }
      }
    }
    console.log(`  ✓ Grade ${gradeNum}: ${subjects.length} courses done`);
  }
  console.log(`  ✓ Total: ${courseCount} courses, ${lessonCount} lessons, ${assignmentCount} assignments, ${submissionCount} submissions`);

  // ── Admissions ─────────────────────────────────────────────────────────────
  console.log('\n▶ Creating admission applications...');
  const existingApps = await prisma.admissionApplication.count({ where: { schoolId } });

  if (existingApps < 80) {
    const appBatch = [];
    const statuses = [
      ...Array(50).fill('PENDING'),
      ...Array(30).fill('APPROVED'),
      ...Array(10).fill('REJECTED'),
    ];
    for (const status of statuses) {
      const firstName = pick(FIRST_NAMES);
      const lastName = pick(LAST_NAMES);
      appBatch.push({
        schoolId,
        firstName,
        lastName,
        email: `apply.${firstName.toLowerCase()}${rand(10000, 99999)}@gmail.com`,
        gradeRequested: `Grade ${rand(1, 12)}`,
        parentContact: `9${rand(100000000, 999999999)}`,
        status,
        appliedAt: randDate(new Date('2026-01-01'), new Date()),
      });
    }
    await prisma.admissionApplication.createMany({ data: appBatch, skipDuplicates: true });
    console.log(`  ✓ ${appBatch.length} admission applications created (50 pending, 30 approved, 10 rejected)`);
  } else {
    console.log(`  ✓ ${existingApps} applications already exist, skipping`);
  }

  // ── Expenses ──────────────────────────────────────────────────────────────
  console.log('\n▶ Creating expense records...');
  const existingExpenses = await prisma.expense.count({ where: { schoolId } });

  if (existingExpenses < 10) {
    const expenseBatch = [];
    const expenseData = [
      { cat: 'Salary', titles: ['Teaching Staff Salaries', 'Support Staff Salaries', 'Admin Staff Salaries'], min: 300000, max: 800000 },
      { cat: 'Utilities', titles: ['Electricity Bill', 'Water Supply', 'Internet & Phone'], min: 8000, max: 35000 },
      { cat: 'Maintenance', titles: ['Building Maintenance', 'AC Servicing', 'Furniture Repair'], min: 5000, max: 60000 },
      { cat: 'Transport', titles: ['Bus Fuel', 'Bus Maintenance', 'Vehicle Insurance'], min: 20000, max: 80000 },
      { cat: 'Events', titles: ['Annual Day', 'Sports Day', 'Science Fair', 'Cultural Fest'], min: 15000, max: 120000 },
      { cat: 'Stationery', titles: ['Office Supplies', 'Printer Paper', 'Lab Consumables'], min: 3000, max: 20000 },
      { cat: 'Infrastructure', titles: ['Lab Equipment', 'Library Books', 'Smart Boards'], min: 30000, max: 200000 },
      { cat: 'IT Equipment', titles: ['Computer Lab Upgrade', 'WiFi Routers', 'Server Maintenance'], min: 25000, max: 150000 },
    ];
    const months = [
      new Date('2026-04-15'), new Date('2026-05-10'), new Date('2026-06-08'),
      new Date('2026-07-12'), new Date('2026-08-05'), new Date('2026-09-18'),
    ];
    const paymentMethods = ['Bank Transfer', 'Cheque', 'Cash', 'Online Transfer'];

    for (const month of months) {
      for (const exp of expenseData) {
        const date = new Date(month);
        date.setDate(rand(1, 25));
        expenseBatch.push({
          schoolId,
          title: pick(exp.titles),
          amount: rand(exp.min, exp.max),
          category: exp.cat,
          date,
          paymentMethod: pick(paymentMethods),
          remarks: `${exp.cat} expense for ${date.toLocaleString('default', { month: 'long', year: 'numeric' })}`,
        });
      }
    }
    await prisma.expense.createMany({ data: expenseBatch });
    console.log(`  ✓ ${expenseBatch.length} expense records created`);
  } else {
    console.log(`  ✓ ${existingExpenses} expenses already exist, skipping`);
  }

  // ── Audit Logs ─────────────────────────────────────────────────────────────
  console.log('\n▶ Creating audit logs & login activities...');
  const adminUser = await prisma.user.findFirst({ where: { schoolId, role: 'PRINCIPAL' } });
  if (adminUser) {
    const auditEntries = [
      'Student enrolled: Aarav Sharma (GVIS2026-1001)',
      'Fee invoice generated for Grade 10-A (Q1 Tuition)',
      'Attendance marked for Grade 9-B — 32/35 present',
      'Mid-Term exam results uploaded for Grade 11',
      'New teacher profile created: Pradeep Nair (English HoD)',
      'Admission application approved: Riya Patel → Grade 5',
      'Transport Route 3 updated — new stop added: Marathahalli',
      'LMS course published: Mathematics – Grade 11A',
      'Fee payment recorded: ₹18,000 — Arjun Verma (GVIS2026-1042)',
      'Report card generated: Grade 12-A Final Examination',
      'Bulk attendance import: Grade 1 through Grade 5 (June 2026)',
      'Fee reminder sent to 23 students with overdue invoices',
      'New academic year 2026-2027 activated',
      'Transport manager account created: Mr. Venkatesh',
      'Library fee waiver approved for 5 students (scholarship)',
    ];

    for (const action of auditEntries) {
      try {
        await prisma.auditLog.create({
          data: {
            schoolId,
            userId: adminUser.id,
            action,
            details: `Performed via Admin Panel on ${randDate(new Date('2026-04-01'), new Date()).toLocaleDateString()}`,
            createdAt: randDate(new Date('2026-04-01'), new Date()),
          }
        });
      } catch (_) {}
    }

    // Login activities
    const loginBatch = Array.from({ length: 20 }, () => ({
      schoolId,
      userId: adminUser.id,
      ipAddress: `192.168.${rand(1, 10)}.${rand(1, 254)}`,
      device: pick(['Chrome/Windows', 'Safari/MacOS', 'Firefox/Windows', 'Chrome/Android', 'Safari/iPhone']),
      location: pick(['Bangalore, IN', 'Mumbai, IN', 'Chennai, IN', 'Hyderabad, IN']),
      loginTime: randDate(new Date('2026-05-01'), new Date()),
    }));
    await prisma.loginActivity.createMany({ data: loginBatch, skipDuplicates: true });
    console.log(`  ✓ ${auditEntries.length} audit logs + 20 login activity records`);
  }

  // ── Final Summary ──────────────────────────────────────────────────────────
  const [studentCount, teacherCount, invoiceCount, attCount, examCount, busCount, appCount, expenseCount] = await Promise.all([
    prisma.student.count({ where: { schoolId } }),
    prisma.teacher.count({ where: { schoolId } }),
    prisma.feeInvoice.count({ where: { schoolId } }),
    prisma.attendance.count({ where: { schoolId } }),
    prisma.exam.count({ where: { schoolId } }),
    prisma.bus.count({ where: { schoolId } }),
    prisma.admissionApplication.count({ where: { schoolId } }),
    prisma.expense.count({ where: { schoolId } }),
  ]);

  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║          DEMO SEED FULLY COMPLETE! ✓                ║');
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log(`║  Students       : ${String(studentCount).padEnd(34)}║`);
  console.log(`║  Teachers       : ${String(teacherCount).padEnd(34)}║`);
  console.log(`║  Fee Invoices   : ${String(invoiceCount).padEnd(34)}║`);
  console.log(`║  Attendance Recs: ${String(attCount).padEnd(34)}║`);
  console.log(`║  Exams          : ${String(examCount).padEnd(34)}║`);
  console.log(`║  Buses          : ${String(busCount).padEnd(34)}║`);
  console.log(`║  LMS Courses    : ${String(courseCount).padEnd(34)}║`);
  console.log(`║  Admissions     : ${String(appCount).padEnd(34)}║`);
  console.log(`║  Expenses       : ${String(expenseCount).padEnd(34)}║`);
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log('║  LOGIN CREDENTIALS (password: Demo@1234)             ║');
  console.log('║  principal@greenvalley.edu  → Principal              ║');
  console.log('║  admin@greenvalley.edu      → School Admin           ║');
  console.log('║  ramesh.krishnamurthy@greenvalley.edu → Teacher      ║');
  console.log('║  ramya.krishnan@greenvalley.edu → Accountant         ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');
}

main()
  .catch((e) => { console.error('\n❌ Error:', e.message); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
