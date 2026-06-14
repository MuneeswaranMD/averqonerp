/**
 * AVERQON ERP CONSOLIDATED DEMO SEED SCRIPT
 * Seeds:
 *  - 1 Super Admin (System School: admin.averqonerp.com)
 *  - 2 Tenant Schools (Green Valley International School, Oakridge Public School)
 *  - 5 School Admins (3 for Green Valley, 2 for Oakridge)
 *  - 25 Teachers (15 for Green Valley, 10 for Oakridge)
 *  - 200 Students (110 for Green Valley, 90 for Oakridge) with Parents
 *  - Fees, Attendance, Exams, Transport, LMS, Admissions, Expenses, Audit Logs
 * Run: node prisma/demo-seed.js
 */

const { PrismaClient, Role, AttendanceStatus, InvoiceStatus, SubmissionStatus, ApplicationStatus, ExamResultStatus } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// ─── Helpers ────────────────────────────────────────────────────────────────
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2));
const randDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const FIRST_NAMES_M = ['Aarav','Arjun','Rohan','Vikram','Ankit','Rahul','Karan','Siddharth','Aditya','Nikhil','Pranav','Rajesh','Suresh','Deepak','Manish','Amit','Varun','Tushar','Gaurav','Yash','Harsh','Rishabh','Parth','Dev','Neil','Ishaan','Kabir','Vivek','Sameer','Mohit'];
const FIRST_NAMES_F = ['Priya','Ananya','Riya','Sneha','Pooja','Divya','Kajal','Simran','Ayesha','Meera','Nisha','Isha','Tanvi','Sonal','Neha','Swati','Kavya','Aditi','Preeti','Shruti','Ankita','Diya','Kritika','Bhavna','Sakshi','Tanya','Mansi','Khushi','Palak','Ridhi'];
const LAST_NAMES = ['Sharma','Verma','Patel','Singh','Kumar','Gupta','Mehta','Joshi','Yadav','Mishra','Agarwal','Nair','Reddy','Pillai','Iyer','Bhat','Shah','Desai','Pandey','Chauhan','Srivastava','Dubey','Tiwari','Malhotra','Kapoor','Chaudhary','Sinha','Saxena','Trivedi','Mathur'];

const SUBJECTS_BY_GRADE = {
  lower: ['Mathematics','English','Science','Social Studies','Hindi','Art & Craft','Physical Education','Computer Science'],
  middle: ['Mathematics','English','Physics','Chemistry','Biology','History','Geography','Hindi','Computer Science','Physical Education'],
  upper: ['Mathematics','English','Physics','Chemistry','Biology','History','Political Science','Economics','Computer Science','Physical Education','Hindi'],
};

function getSubjectsForGrade(gradeNum) {
  if (gradeNum <= 5) return SUBJECTS_BY_GRADE.lower;
  if (gradeNum <= 8) return SUBJECTS_BY_GRADE.middle;
  return SUBJECTS_BY_GRADE.upper;
}

function gradeFromMarks(obtained, max) {
  const pct = (obtained / max) * 100;
  if (pct >= 90) return 'A1';
  if (pct >= 80) return 'A2';
  if (pct >= 70) return 'B1';
  if (pct >= 60) return 'B2';
  if (pct >= 50) return 'C1';
  if (pct >= 40) return 'C2';
  if (pct >= 35) return 'D';
  return 'F';
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║       AVERQON ERP — CONSOLIDATED DEMO SEED          ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  // Precompute bcrypt password hash to speed up user creations immensely
  console.log('▶ Precomputing password hash for default credentials ("Demo@1234")...');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Demo@1234', salt);
  console.log('  ✓ Password hash precomputed.\n');

  // ─── Delete Existing Data ──────────────────────────────────────────────────
  const deleteOrder = [
    'loginActivity', 'auditLog', 'userPermission', 'rolePermission', 'permission',
    'customRole', 'parentStudent', 'admissionApplication', 'expense', 'lMSSubmission',
    'lMSAssignment', 'lMSLesson', 'lMSCourse', 'studentRoute', 'stop', 'route',
    'bus', 'examResult', 'exam', 'feePayment', 'feeInvoice', 'feeCategory',
    'attendance', 'subjectTeacher', 'subject', 'section', 'class', 'teacher',
    'parent', 'student', 'user', 'academicYear', 'school'
  ];
  console.log('▶ Clearing existing database tables in dependency order...');
  for (const table of deleteOrder) {
    try {
      await prisma[table].deleteMany({});
    } catch (err) {
      console.log(`  ⚠ Skip clearing table "${table}":`, err.message);
    }
  }
  console.log('  ✓ Database cleared successfully.\n');

  // ── 1. System School & Super Admin ──────────────────────────────────────────
  console.log('▶ Creating system administration school & Super Admin...');
  const systemSchool = await prisma.school.create({
    data: {
      name: 'AverqonERP Administration',
      domain: 'admin.averqonerp.com',
      logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Averqon&backgroundColor=0f172a&textColor=ffffff',
    }
  });

  const superAdmin = await prisma.user.create({
    data: {
      schoolId: systemSchool.id,
      email: 'superadmin@averqonerp.com',
      passwordHash,
      role: Role.SUPER_ADMIN,
      firstName: 'System',
      lastName: 'Administrator',
      phone: '9999999999',
    }
  });
  console.log(`  ✓ Super Admin created: ${superAdmin.email} [SUPER_ADMIN]`);
  console.log(`  ✓ System School created: ${systemSchool.name}\n`);


  // ── 2. Tenant Schools ──────────────────────────────────────────────────────
  console.log('▶ Creating 2 tenant schools...');
  const schools = [
    {
      name: 'Green Valley International School',
      domain: 'greenvalley.averqonerp.com',
      logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=GVIS&backgroundColor=1A6FDB&textColor=ffffff',
    },
    {
      name: 'Oakridge Public School',
      domain: 'oakridge.averqonerp.com',
      logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=OPS&backgroundColor=E11D48&textColor=ffffff',
    }
  ];

  const schoolRecords = [];
  for (const s of schools) {
    const record = await prisma.school.create({ data: s });
    schoolRecords.push(record);
    console.log(`  ✓ Created school: ${record.name} (${record.domain})`);
  }
  console.log('');

  const [schoolGVIS, schoolOPS] = schoolRecords;

  // ── 3. School Admins (5 total: 3 for Green Valley, 2 for Oakridge) ──────────
  console.log('▶ Creating 5 School Admins...');
  const adminDefs = [
    { first: 'Meghana', last: 'Rao', email: 'admin@greenvalley.edu', role: Role.SCHOOL_ADMIN, schoolId: schoolGVIS.id },
    { first: 'Anand', last: 'Kulkarni', email: 'admin2.greenvalley@averqonerp.com', role: Role.SCHOOL_ADMIN, schoolId: schoolGVIS.id },
    { first: 'Sanjay', last: 'Patil', email: 'admin3.greenvalley@averqonerp.com', role: Role.SCHOOL_ADMIN, schoolId: schoolGVIS.id },
    { first: 'Vikram', last: 'Sinha', email: 'admin@oakridge.edu', role: Role.SCHOOL_ADMIN, schoolId: schoolOPS.id },
    { first: 'Priya', last: 'Sharma', email: 'admin2.oakridge@averqonerp.com', role: Role.SCHOOL_ADMIN, schoolId: schoolOPS.id }
  ];

  for (const ad of adminDefs) {
    await prisma.user.create({
      data: {
        schoolId: ad.schoolId,
        email: ad.email,
        passwordHash,
        role: ad.role,
        firstName: ad.first,
        lastName: ad.last,
        phone: `91${rand(70000000, 99999999)}`,
      }
    });
    console.log(`  ✓ Created Admin: ${ad.email} for school ID: ${ad.schoolId.slice(0, 8)}...`);
  }

  // Also create a Principal for each school for high-level management dashboards
  const principals = [
    { first: 'Dr. Anand', last: 'Krishnaswamy', email: 'principal@greenvalley.edu', schoolId: schoolGVIS.id },
    { first: 'Dr. Robert', last: 'Miller', email: 'principal@oakridge.edu', schoolId: schoolOPS.id }
  ];
  for (const pr of principals) {
    await prisma.user.create({
      data: {
        schoolId: pr.schoolId,
        email: pr.email,
        passwordHash,
        role: Role.PRINCIPAL,
        firstName: pr.first,
        lastName: pr.last,
        phone: `91${rand(70000000, 99999999)}`,
      }
    });
    console.log(`  ✓ Created Principal: ${pr.email}`);
  }
  console.log('');

  // ── 4. Academic Years ──────────────────────────────────────────────────────
  console.log('▶ Setting up Academic Years...');
  const academicYears = [];
  for (const s of schoolRecords) {
    const ay = await prisma.academicYear.create({
      data: {
        schoolId: s.id,
        year: '2026-2027',
        isActive: true
      }
    });
    academicYears.push(ay);
    console.log(`  ✓ School ${s.name} Academic Year: ${ay.year}`);
  }
  console.log('');

  // ── 5. Classes & Sections (12 grades × 3 sections = 36 sections per school) ─
  console.log('▶ Generating grades and sections (Grades 1-12, A-B-C)...');
  const classMapsBySchool = {}; // schoolId -> gradeNum -> { class, sections: {A, B, C} }

  for (const s of schoolRecords) {
    classMapsBySchool[s.id] = {};
    for (let g = 1; g <= 12; g++) {
      const className = `Grade ${g}`;
      const cls = await prisma.class.create({
        data: { schoolId: s.id, name: className }
      });
      const sections = {};
      for (const secName of ['A', 'B', 'C']) {
        const sec = await prisma.section.create({
          data: { schoolId: s.id, classId: cls.id, name: secName }
        });
        sections[secName] = sec;
      }
      classMapsBySchool[s.id][g] = { class: cls, sections };
    }
    console.log(`  ✓ Created classes & sections for ${s.name}`);
  }
  console.log('');

  // ── 6. Subjects ────────────────────────────────────────────────────────────
  console.log('▶ Populating subjects for all grade levels...');
  const subjectMapsBySchool = {}; // schoolId -> classId -> [subjects]

  for (const s of schoolRecords) {
    subjectMapsBySchool[s.id] = {};
    let subjectCounter = 1;
    for (let g = 1; g <= 12; g++) {
      const cls = classMapsBySchool[s.id][g].class;
      const subjectNames = getSubjectsForGrade(g);
      subjectMapsBySchool[s.id][cls.id] = [];
      for (const subName of subjectNames) {
        const code = `${subName.replace(/\s+/g, '').toUpperCase().slice(0, 4)}${g}${String(subjectCounter).padStart(2, '0')}`;
        const sub = await prisma.subject.create({
          data: { schoolId: s.id, classId: cls.id, name: subName, code }
        });
        subjectMapsBySchool[s.id][cls.id].push(sub);
        subjectCounter++;
      }
    }
    console.log(`  ✓ Populated subjects for ${s.name}`);
  }
  console.log('');


  // ── 7. Teachers (25 total: 15 for Green Valley, 10 for Oakridge) ───────────
  console.log('▶ Generating 25 Teachers across schools...');
  const teachersBySchool = {}; // schoolId -> [teachers]

  const teacherNamesGVIS = [
    { first: 'Ramesh', last: 'Krishnamurthy', desig: 'Head of Department' },
    { first: 'Sunita', last: 'Agarwal', desig: 'Senior Teacher' },
    { first: 'Pradeep', last: 'Nair', desig: 'Head of Department' },
    { first: 'Lalitha', last: 'Menon', desig: 'Senior Teacher' },
    { first: 'Vijay', last: 'Rajan', desig: 'Head of Department' },
    { first: 'Geeta', last: 'Pillai', desig: 'Subject Expert' },
    { first: 'Suresh', last: 'Iyer', desig: 'Senior Teacher' },
    { first: 'Anita', last: 'Bose', desig: 'Junior Teacher' },
    { first: 'Mohan', last: 'Rao', desig: 'Senior Teacher' },
    { first: 'Kavitha', last: 'Subramaniam', desig: 'Senior Teacher' },
    { first: 'Arun', last: 'Sharma', desig: 'Junior Teacher' },
    { first: 'Deepa', last: 'Mehta', desig: 'Junior Teacher' },
    { first: 'Sanjay', last: 'Gupta', desig: 'Senior Teacher' },
    { first: 'Rekha', last: 'Joshi', desig: 'Subject Expert' },
    { first: 'Naresh', last: 'Verma', desig: 'Senior Teacher' }
  ];

  const teacherNamesOPS = [
    { first: 'Kiran', last: 'Malhotra', desig: 'Senior Teacher' },
    { first: 'Shobha', last: 'Nayak', desig: 'Junior Teacher' },
    { first: 'Rajiv', last: 'Kapoor', desig: 'Head of Department' },
    { first: 'Meena', last: 'Saxena', desig: 'Senior Teacher' },
    { first: 'Dinesh', last: 'Tripathi', desig: 'Junior Teacher' },
    { first: 'Pooja', last: 'Chandra', desig: 'Senior Teacher' },
    { first: 'Harish', last: 'Dubey', desig: 'Junior Teacher' },
    { first: 'Nandini', last: 'Shetty', desig: 'Senior Teacher' },
    { first: 'Vikram', last: 'Pandey', desig: 'Junior Teacher' },
    { first: 'Sarla', last: 'Tiwari', desig: 'Senior Teacher' }
  ];

  const schoolsWithTeachers = [
    { schoolId: schoolGVIS.id, emailSuffix: 'greenvalley.edu', names: teacherNamesGVIS },
    { schoolId: schoolOPS.id, emailSuffix: 'oakridge.edu', names: teacherNamesOPS }
  ];

  for (const st of schoolsWithTeachers) {
    teachersBySchool[st.schoolId] = [];
    for (const tn of st.names) {
      const email = `${tn.first.toLowerCase()}.${tn.last.toLowerCase()}@${st.emailSuffix}`;
      const user = await prisma.user.create({
        data: {
          schoolId: st.schoolId,
          email,
          passwordHash,
          role: Role.TEACHER,
          firstName: tn.first,
          lastName: tn.last,
          phone: `98${rand(10000000, 99999999)}`,
        }
      });
      const teacher = await prisma.teacher.create({
        data: {
          schoolId: st.schoolId,
          userId: user.id,
          designation: tn.desig,
          joinedAt: randDate(new Date('2019-01-01'), new Date('2025-01-01'))
        }
      });
      teachersBySchool[st.schoolId].push({ ...teacher, first: tn.first, last: tn.last });
    }
    console.log(`  ✓ Seeded ${teachersBySchool[st.schoolId].length} teachers in ${st.schoolId === schoolGVIS.id ? 'Green Valley' : 'Oakridge'}`);
  }
  console.log('');

  // Assign teachers to subjects and sections (SubjectTeacher)
  console.log('▶ Setting up SubjectTeacher assignments...');
  for (const s of schoolRecords) {
    let assignmentCount = 0;
    const teachersList = teachersBySchool[s.id];
    for (let g = 1; g <= 12; g++) {
      const cls = classMapsBySchool[s.id][g].class;
      const sections = classMapsBySchool[s.id][g].sections;
      const subjects = subjectMapsBySchool[s.id][cls.id];
      for (const sec of Object.values(sections)) {
        for (const sub of subjects) {
          const teacher = pick(teachersList);
          await prisma.subjectTeacher.create({
            data: {
              schoolId: s.id,
              teacherId: teacher.id,
              subjectId: sub.id,
              classId: cls.id,
              sectionId: sec.id
            }
          });
          assignmentCount++;
        }
      }
    }
    console.log(`  ✓ Mapped ${assignmentCount} subject-teacher entries for ${s.name}`);
  }
  console.log('');

  // ── 8. Students & Parents (200 total: 110 for Green Valley, 90 for Oakridge) ─
  console.log('▶ Generating 200 Students and their Parent links...');
  const studentsBySchool = {}; // schoolId -> [students]
  let studentCounter = 1000;

  const targetCounts = [
    { schoolId: schoolGVIS.id, suffix: 'greenvalley.edu', count: 110, prefix: 'GVIS' },
    { schoolId: schoolOPS.id, suffix: 'oakridge.edu', count: 90, prefix: 'OPS' }
  ];

  for (const tc of targetCounts) {
    studentsBySchool[tc.schoolId] = [];
    console.log(`  → Seeding ${tc.count} students in ${tc.prefix}...`);

    for (let i = 1; i <= tc.count; i++) {
      const isMale = rand(0, 1) === 0;
      const firstName = pick(isMale ? FIRST_NAMES_M : FIRST_NAMES_F);
      const lastName = pick(LAST_NAMES);
      const email = `student.${firstName.toLowerCase()}${studentCounter}@${tc.suffix}`;
      const admissionNo = `${tc.prefix}${new Date().getFullYear()}${String(studentCounter).padStart(4, '0')}`;
      studentCounter++;

      // Distribute student in a class & section sequentially
      const gradeIndex = ((i - 1) % 12) + 1; // 1 to 12
      const sectionLetters = ['A', 'B', 'C'];
      const sectionLetter = sectionLetters[(i - 1) % 3];
      const classObj = classMapsBySchool[tc.schoolId][gradeIndex].class;
      const sectionObj = classMapsBySchool[tc.schoolId][gradeIndex].sections[sectionLetter];

      // Parent Info
      const parentFirstName = pick(FIRST_NAMES_M);
      const parentLastName = lastName;
      const parentEmail = `parent${studentCounter}@${tc.suffix}`;
      const parentContact = `9${rand(100000000, 999999999)}`;

      // Create Student User
      const studentUser = await prisma.user.create({
        data: {
          schoolId: tc.schoolId,
          email,
          passwordHash,
          role: Role.STUDENT,
          firstName,
          lastName,
          phone: `8${rand(100000000, 999999999)}`,
        }
      });

      // Create Parent User & Record
      const parentUser = await prisma.user.create({
        data: {
          schoolId: tc.schoolId,
          email: parentEmail,
          passwordHash,
          role: Role.PARENT,
          firstName: parentFirstName,
          lastName: parentLastName,
          phone: parentContact,
        }
      });
      const parent = await prisma.parent.create({
        data: {
          schoolId: tc.schoolId,
          userId: parentUser.id,
          primaryContact: parentContact,
          occupation: pick(['Business Owner', 'Software Engineer', 'Physician', 'Educator', 'Civil Servant', 'Attorney', 'Banker', 'Consultant']),
        }
      });

      // Create Student Record
      const student = await prisma.student.create({
        data: {
          schoolId: tc.schoolId,
          userId: studentUser.id,
          admissionNo,
          rollNo: String(Math.floor((i - 1) / 3) + 1),
          classId: classObj.id,
          sectionId: sectionObj.id,
          parentId: parent.id,
        }
      });

      // Establish ParentStudent Link
      await prisma.parentStudent.create({
        data: {
          schoolId: tc.schoolId,
          parentId: parent.id,
          studentId: student.id,
        }
      });

      studentsBySchool[tc.schoolId].push({ student, gradeNum: gradeIndex, classId: classObj.id, sectionId: sectionObj.id });
    }
    console.log(`  ✓ Seeding completed. Count: ${studentsBySchool[tc.schoolId].length}`);
  }
  console.log('');

  // ── 9. Fee Records ──────────────────────────────────────────────────────────
  console.log('▶ Setting up Fee Categories, Invoices & Payments...');
  const feeCategories = [
    { name: 'Tuition Fee Q1', amount: 15000 },
    { name: 'Tuition Fee Q2', amount: 15000 },
    { name: 'Tuition Fee Q3', amount: 15000 },
    { name: 'Tuition Fee Q4', amount: 15000 },
    { name: 'Annual Maintenance Charge', amount: 4500 },
    { name: 'Sports Fee', amount: 1200 },
    { name: 'Library Resource Fee', amount: 800 },
    { name: 'Laboratory Fee', amount: 2000 },
    { name: 'Transport Fee (Annual)', amount: 10000 },
    { name: 'Standard Examination Fee', amount: 1800 }
  ];

  const dueDates = [
    new Date('2026-04-10'), new Date('2026-07-10'), new Date('2026-10-10'), new Date('2027-01-10')
  ];

  for (const s of schoolRecords) {
    let invoiceCount = 0;
    let paymentCount = 0;

    // Create fee categories for school
    const catRecords = [];
    for (const fc of feeCategories) {
      const cat = await prisma.feeCategory.create({
        data: { schoolId: s.id, name: fc.name, amount: fc.amount }
      });
      catRecords.push(cat);
    }

    const tuitionCats = catRecords.slice(0, 4);
    const otherCats = catRecords.slice(4);

    const students = studentsBySchool[s.id];
    const ay = academicYears.find(a => a.schoolId === s.id);

    for (const { student } of students) {
      // 1. Generate Quarterly Tuition Invoices
      for (let q = 0; q < 4; q++) {
        const cat = tuitionCats[q];
        const dueDate = dueDates[q];
        
        let status = 'UNPAID';
        const roll = rand(1, 100);
        if (dueDate < new Date()) {
          status = roll <= 85 ? 'PAID' : roll <= 95 ? 'PARTIAL' : 'UNPAID';
        } else {
          status = roll <= 25 ? 'PAID' : 'UNPAID';
        }

        const invoice = await prisma.feeInvoice.create({
          data: {
            schoolId: s.id,
            studentId: student.id,
            academicYearId: ay.id,
            categoryId: cat.id,
            amount: cat.amount,
            dueDate,
            status: status
          }
        });
        invoiceCount++;

        // Add Payments if status is PAID or PARTIAL
        if (status === 'PAID') {
          await prisma.feePayment.create({
            data: {
              schoolId: s.id,
              invoiceId: invoice.id,
              amountPaid: cat.amount,
              paidAt: randDate(new Date('2026-04-01'), new Date()),
              paymentMethod: pick(['UPI', 'Card', 'Net Banking', 'Cash']),
              transactionId: `TXN${Date.now()}${rand(1000, 9999)}`
            }
          });
          paymentCount++;
        } else if (status === 'PARTIAL') {
          const partialPaid = parseFloat((Number(cat.amount) * randFloat(0.3, 0.7)).toFixed(2));
          await prisma.feePayment.create({
            data: {
              schoolId: s.id,
              invoiceId: invoice.id,
              amountPaid: partialPaid,
              paidAt: randDate(new Date('2026-04-01'), new Date()),
              paymentMethod: pick(['UPI', 'Cash']),
              transactionId: `TXNP${Date.now()}${rand(1000, 9999)}`
            }
          });
          paymentCount++;
        }
        await sleep(1); // avoid transaction ID timestamp collisions
      }

      // 2. Generate other annual fees for a subset
      const randCat = pick(otherCats);
      const invoice = await prisma.feeInvoice.create({
        data: {
          schoolId: s.id,
          studentId: student.id,
          academicYearId: ay.id,
          categoryId: randCat.id,
          amount: randCat.amount,
          dueDate: new Date('2026-05-30'),
          status: 'PAID'
        }
      });
      invoiceCount++;

      await prisma.feePayment.create({
        data: {
          schoolId: s.id,
          invoiceId: invoice.id,
          amountPaid: randCat.amount,
          paidAt: randDate(new Date('2026-04-15'), new Date('2026-05-30')),
          paymentMethod: pick(['UPI', 'Net Banking', 'Cheque']),
          transactionId: `TXNA${Date.now()}${rand(1000, 9999)}`
        }
      });
      paymentCount++;
      await sleep(1);
    }
    console.log(`  ✓ Generated ${invoiceCount} invoices & ${paymentCount} payments for ${s.name}`);
  }
  console.log('');

  // ── 10. Attendance Records ─────────────────────────────────────────────────
  console.log('▶ Generating 30 days of attendance registers for a subset of students...');
  const today = new Date();
  const schoolDays = [];
  // Gather last 30 weekdays (Monday to Friday)
  for (let d = 45; d >= 1; d--) {
    const dt = new Date(today);
    dt.setDate(dt.getDate() - d);
    const dow = dt.getDay();
    if (dow !== 0 && dow !== 6) {
      schoolDays.push(new Date(dt.toDateString()));
    }
    if (schoolDays.length >= 30) break;
  }

  for (const s of schoolRecords) {
    let attRecords = 0;
    const students = studentsBySchool[s.id].slice(0, 40); // Limit to 40 students per school for performance
    
    for (const { student } of students) {
      for (const date of schoolDays) {
        const roll = rand(1, 100);
        const status = roll <= 92 ? AttendanceStatus.PRESENT 
                       : roll <= 95 ? AttendanceStatus.LATE 
                       : roll <= 98 ? AttendanceStatus.ABSENT 
                       : AttendanceStatus.HALF_DAY;

        await prisma.attendance.create({
          data: {
            schoolId: s.id,
            studentId: student.id,
            date,
            status,
            remarks: status === AttendanceStatus.ABSENT ? pick(['Sick leave', 'Doctor appointment', 'Personal reason', 'Uninformed']) : null
          }
        });
        attRecords++;
      }
    }
    console.log(`  ✓ Created ${attRecords} attendance entries for ${s.name}`);
  }
  console.log('');

  // ── 11. Exam Types & Results ───────────────────────────────────────────────
  console.log('▶ Creating Exams and Exam Results...');
  const examDefs = [
    { name: 'Unit Test 1', durationDays: 5, startOffset: -60 },
    { name: 'Mid-Term Examination', durationDays: 8, startOffset: -30 },
    { name: 'Unit Test 2', durationDays: 5, startOffset: 10 }
  ];

  for (const s of schoolRecords) {
    const ay = academicYears.find(a => a.schoolId === s.id);
    const students = studentsBySchool[s.id].slice(0, 50); // Seed results for 50 students per school
    
    let resultCount = 0;
    for (const ed of examDefs) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + ed.startOffset);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + ed.durationDays);

      const exam = await prisma.exam.create({
        data: {
          schoolId: s.id,
          name: ed.name,
          academicYearId: ay.id,
          startDate,
          endDate
        }
      });

      // Don't seed future exam results (Unit Test 2 has offset +10)
      if (ed.startOffset < 0) {
        for (const { student, classId } of students) {
          const subjects = subjectMapsBySchool[s.id][classId] || [];
          for (const sub of subjects.slice(0, 5)) { // 5 subjects per student
            const maxMarks = 100;
            const obtained = randFloat(38, 99);
            const gradeLetter = gradeFromMarks(obtained, maxMarks);
            
            await prisma.examResult.create({
              data: {
                schoolId: s.id,
                studentId: student.id,
                examId: exam.id,
                subjectId: sub.id,
                marksObtained: obtained,
                maxMarks,
                grade: gradeLetter,
                status: 'APPROVED'
              }
            });
            resultCount++;
          }
        }
      }
    }
    console.log(`  ✓ Seeded exams and ${resultCount} exam results for ${s.name}`);
  }
  console.log('');

  // ── 12. Transport Routes ───────────────────────────────────────────────────
  console.log('▶ Setting up Buses, Routes, Stops, and student mapping...');
  const routesData = [
    { name: 'Route A – East Bengaluru', start: 'Indiranagar', end: 'School Campus', stops: ['Indiranagar', 'Domlur', 'Halasuru', 'Murugeshpalya'] },
    { name: 'Route B – South Bengaluru', start: 'Jayanagar', end: 'School Campus', stops: ['Jayanagar', 'JP Nagar', 'BTM Layout', 'Silk Board'] },
    { name: 'Route C – Tech Corridor', start: 'Whitefield', end: 'School Campus', stops: ['Whitefield', 'Marathahalli', 'Bellandur', 'Kadubeesanahalli'] },
    { name: 'Route D – North Hub', start: 'Hebbal', end: 'School Campus', stops: ['Hebbal', 'RT Nagar', 'Sanjay Nagar', 'Sadashivanagar'] }
  ];

  for (const s of schoolRecords) {
    const buses = [];
    for (let i = 1; i <= 3; i++) {
      const bus = await prisma.bus.create({
        data: {
          schoolId: s.id,
          vehicleNo: `${s.id === schoolGVIS.id ? 'KA' : 'MH'}-01-FB-${1000 + i * 111}`,
          driverName: pick(['Rajesh Kumar', 'Vikram Singh', 'Abdul Rahman', 'Gurpreet Singh', 'Dharma Naik']),
          driverPhone: `988000${rand(1000, 9999)}`
        }
      });
      buses.push(bus);
    }

    let assignedTransport = 0;
    const stopsPool = [];
    
    for (let rIdx = 0; rIdx < routesData.length; rIdx++) {
      const rd = routesData[rIdx];
      const bus = buses[rIdx % buses.length];

      const route = await prisma.route.create({
        data: {
          schoolId: s.id,
          name: rd.name,
          startPoint: rd.start,
          endPoint: rd.end,
          busId: bus.id
        }
      });

      const times = ['06:40 AM', '06:55 AM', '07:10 AM', '07:25 AM'];
      for (let st = 0; st < rd.stops.length; st++) {
        const stopObj = await prisma.stop.create({
          data: {
            schoolId: s.id,
            routeId: route.id,
            name: rd.stops[st],
            sequence: st + 1,
            arrivalTime: times[st]
          }
        });
        stopsPool.push({ routeId: route.id, stopId: stopObj.id });
      }
    }

    // Assign transport to 35 students in each school
    const students = studentsBySchool[s.id].slice(0, 35);
    for (let stIdx = 0; stIdx < students.length; stIdx++) {
      const { student } = students[stIdx];
      const poolItem = stopsPool[stIdx % stopsPool.length];
      await prisma.studentRoute.create({
        data: {
          schoolId: s.id,
          studentId: student.id,
          routeId: poolItem.routeId,
          stopId: poolItem.stopId
        }
      });
      assignedTransport++;
    }
    console.log(`  ✓ Seeded buses, routes, and mapped ${assignedTransport} students to transport for ${s.name}`);
  }
  console.log('');

  // ── 13. LMS (Courses, Lessons, Assignments, Submissions) ───────────────────
  console.log('▶ Populating digital LMS Course catalogs & lessons (Grades 9-12)...');
  const courseTitles = ['Advanced Algebra', 'Mechanics & Relativity', 'Organic Chemistry & Biochemistry', 'Modern World History', 'Data Structures & Algorithms'];
  const lessonHeaders = ['Introduction & Basics', 'Theoretical Foundations', 'Practical Lab / Case Study', 'Advanced Problem Solving', 'Mock Assessment'];
  const assignmentDefs = ['Weekly Home Assignment', 'Mid-Term Capstone Project', 'End-Chapter Quiz'];

  for (const s of schoolRecords) {
    let coursesCount = 0, lessonsCount = 0, assignmentsCount = 0, subsCount = 0;
    
    // Select upper grade class definitions
    for (let g = 9; g <= 12; g++) {
      const cls = classMapsBySchool[s.id][g].class;
      const sections = classMapsBySchool[s.id][g].sections;
      const subjects = subjectMapsBySchool[s.id][cls.id].slice(0, 3); // Seed 3 courses per grade

      const students = studentsBySchool[s.id].filter(st => st.gradeNum === g).map(x => x.student);

      for (const sub of subjects) {
        for (const sec of Object.values(sections).slice(0, 1)) { // Seed for section A
          const course = await prisma.lMSCourse.create({
            data: {
              schoolId: s.id,
              name: `${sub.name} - Grade ${g}${sec.name}`,
              subjectId: sub.id,
              classId: cls.id,
              sectionId: sec.id
            }
          });
          coursesCount++;

          // Lessons
          for (const lh of lessonHeaders) {
            await prisma.lMSLesson.create({
              data: {
                schoolId: s.id,
                courseId: course.id,
                title: `${sub.name}: ${lh}`,
                description: `Self-paced learning material covering ${lh.toLowerCase()} concepts.`,
                contentUrl: `https://storage.averqonerp.com/lms/docs/${course.id.slice(0, 8)}/${lh.replace(/\s+/g,'-').toLowerCase()}.pdf`
              }
            });
            lessonsCount++;
          }

          // Assignments & Submissions
          for (let a = 0; a < assignmentDefs.length; a++) {
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + (a * 10) - 5); // Some overdue, some upcoming

            const assignment = await prisma.lMSAssignment.create({
              data: {
                schoolId: s.id,
                courseId: course.id,
                title: `${sub.name}: ${assignmentDefs[a]}`,
                description: `Read the instructions and submit your research essay or problem set answers before the deadline.`,
                dueDate
              }
            });
            assignmentsCount++;

            // Create submissions for past assignments (dueDate < now)
            if (dueDate < new Date()) {
              for (const student of students.slice(0, 5)) { // 5 student submissions per assignment
                const isGraded = rand(1, 100) <= 80;
                await prisma.lMSSubmission.create({
                  data: {
                    assignmentId: assignment.id,
                    studentId: student.id,
                    fileUrl: `https://storage.averqonerp.com/submissions/${student.id.slice(0, 8)}-assignment-${assignment.id.slice(0, 8)}.pdf`,
                    marks: isGraded ? randFloat(60, 100) : null,
                    feedback: isGraded ? pick(['Terrific reasoning and layout.', 'Good effort. Keep it up.', 'Some calculation errors in Q3.', 'Outstanding work!']) : null,
                    status: isGraded ? SubmissionStatus.GRADED : SubmissionStatus.SUBMITTED,
                    submittedAt: randDate(new Date(dueDate.getTime() - 86400000 * 3), dueDate)
                  }
                });
                subsCount++;
              }
            }
          }
        }
      }
    }
    console.log(`  ✓ LMS populated for ${s.name}: ${coursesCount} courses, ${lessonsCount} lessons, ${assignmentsCount} assignments, ${subsCount} submissions`);
  }
  console.log('');

  // ── 14. Admission Applications ─────────────────────────────────────────────
  console.log('▶ Populating Admission funnel applications...');
  for (const s of schoolRecords) {
    let appCount = 0;
    const applicationBatch = [];

    // Create 45 pending, 25 approved, 10 rejected applications
    const statFlow = [
      ...Array(45).fill(ApplicationStatus.PENDING),
      ...Array(25).fill(ApplicationStatus.APPROVED),
      ...Array(10).fill(ApplicationStatus.REJECTED)
    ];

    for (const status of statFlow) {
      const isMale = rand(0, 1) === 0;
      const firstName = pick(isMale ? FIRST_NAMES_M : FIRST_NAMES_F);
      const lastName = pick(LAST_NAMES);
      const grade = rand(1, 12);
      
      applicationBatch.push({
        schoolId: s.id,
        firstName,
        lastName,
        email: `apply.${firstName.toLowerCase()}${rand(1000, 9999)}@gmail.com`,
        gradeRequested: `Grade ${grade}`,
        parentContact: `9${rand(100000000, 999999999)}`,
        status,
        appliedAt: randDate(new Date('2026-01-01'), new Date())
      });
    }
    await prisma.admissionApplication.createMany({ data: applicationBatch });
    console.log(`  ✓ Created ${statFlow.length} applications (45 pending, 25 approved, 10 rejected) for ${s.name}`);
  }
  console.log('');

  // ── 15. Accounting Expenses ─────────────────────────────────────────────────
  console.log('▶ Generating recurring accounting expense ledgers...');
  const expenseTemplates = [
    { category: 'Utilities', titles: ['Electricity Bill Payment', 'Water Utility Invoice', 'High-Speed Broadband Internet'], min: 5000, max: 20000 },
    { category: 'Salary', titles: ['Monthly Teachers Payroll', 'Non-Teaching Staff Salaries', 'Security & Housekeeping Staff Pay'], min: 250000, max: 600000 },
    { category: 'Maintenance', titles: ['Classroom Painting & Carpentry', 'HVAC/Air Conditioner Repair', 'Electrical Wiring Upgrades'], min: 8000, max: 45000 },
    { category: 'Transport', titles: ['Diesel Supply for Buses', 'Annual RTO Vehicle Insurance', 'Spare Parts & Brake Overhauls'], min: 15000, max: 75000 },
    { category: 'Events', titles: ['Annual Sports Day Ceremony', 'Science Exhibition Materials', 'Inter-School Debating Fest Expenses'], min: 10000, max: 90000 },
    { category: 'Stationery', titles: ['Office Administrative Paper Supplies', 'Chalks, Dusters & Whiteboard Markers', 'Library Catalog Registry Notebooks'], min: 2000, max: 12000 }
  ];

  for (const s of schoolRecords) {
    const expenseBatch = [];
    const months = [
      new Date('2026-01-10'), new Date('2026-02-12'), new Date('2026-03-08'),
      new Date('2026-04-15'), new Date('2026-05-10'), new Date('2026-06-05')
    ];

    for (const m of months) {
      for (const et of expenseTemplates) {
        const date = new Date(m);
        date.setDate(rand(1, 28));

        expenseBatch.push({
          schoolId: s.id,
          title: pick(et.titles),
          amount: rand(et.min, et.max),
          category: et.category,
          date,
          paymentMethod: pick(['Bank Transfer', 'Cheque', 'Corporate Card', 'Cash']),
          remarks: `${et.category} cost booked for ${date.toLocaleString('default', { month: 'long', year: 'numeric' })}`
        });
      }
    }
    await prisma.expense.createMany({ data: expenseBatch });
    console.log(`  ✓ Seeded ${expenseBatch.length} expense log entries for ${s.name}`);
  }
  console.log('');

  // ── 16. Audit Logs & Logins ────────────────────────────────────────────────
  console.log('▶ Populating system audit trails...');
  for (const s of schoolRecords) {
    const adminUser = await prisma.user.findFirst({ where: { schoolId: s.id, role: Role.SCHOOL_ADMIN } });
    if (adminUser) {
      const logTemplates = [
        'Enrolled new student and linked parent profile',
        'Generated quarterly tuition fee invoices for Academic Year 2026-2027',
        'Updated bus transport route details and stops sequence',
        'Approved class-wise marksheet submission from Subject Teacher',
        'Published new digital resource booklet on LMS course catalog',
        'Logged cash fee receipt payment in accounting ledger',
        'Updated roles and permissions matrix for Accountant role',
        'Approved student admission application from funnel',
        'Generated monthly school performance and attendance reports',
        'Configured SMTP email and SMS notification gateways'
      ];

      for (const action of logTemplates) {
        await prisma.auditLog.create({
          data: {
            schoolId: s.id,
            userId: adminUser.id,
            action,
            details: `Action triggered via management console IP 10.14.23.${rand(10, 99)}`,
            createdAt: randDate(new Date('2026-04-01'), new Date())
          }
        });
      }

      // Login activities
      const logins = Array.from({ length: 15 }, () => ({
        schoolId: s.id,
        userId: adminUser.id,
        ipAddress: `192.168.1.${rand(10, 199)}`,
        device: pick(['Chrome/Windows', 'Safari/MacOS', 'Firefox/Windows', 'Chrome/Android', 'Safari/iOS']),
        location: pick(['Bangalore, KA', 'Mumbai, MH', 'Chennai, TN', 'Delhi, DL', 'Pune, MH']),
        loginTime: randDate(new Date('2026-05-01'), new Date())
      }));
      await prisma.loginActivity.createMany({ data: logins });
    }
  }
  console.log('  ✓ Generated audit logs & login activities.');

  // ─── Verification & Summary ───────────────────────────────────────────────
  const [
    dbSchools, dbUsers, dbStudents, dbTeachers, dbFeeInvoices, 
    dbFeePayments, dbAttendance, dbExams, dbExamResults, 
    dbBuses, dbRoutes, dbLmsCourses, dbLmsLessons, dbAdmissions, dbExpenses
  ] = await Promise.all([
    prisma.school.count(),
    prisma.user.count(),
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.feeInvoice.count(),
    prisma.feePayment.count(),
    prisma.attendance.count(),
    prisma.exam.count(),
    prisma.examResult.count(),
    prisma.bus.count(),
    prisma.route.count(),
    prisma.lMSCourse.count(),
    prisma.lMSLesson.count(),
    prisma.admissionApplication.count(),
    prisma.expense.count()
  ]);

  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║            DEMO DATABASE SEEDING SUMMARY             ║');
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log(`║  Schools             : ${String(dbSchools).padEnd(30)}║`);
  console.log(`║  Total Users         : ${String(dbUsers).padEnd(30)}║`);
  console.log(`║  Super Admins        : ${String(1).padEnd(30)}║`);
  console.log(`║  School Admins       : ${String(5).padEnd(30)}║`);
  console.log(`║  Teachers            : ${String(dbTeachers).padEnd(30)}║`);
  console.log(`║  Students            : ${String(dbStudents).padEnd(30)}║`);
  console.log(`║  Fee Invoices        : ${String(dbFeeInvoices).padEnd(30)}║`);
  console.log(`║  Fee Payments        : ${String(dbFeePayments).padEnd(30)}║`);
  console.log(`║  Attendance Records  : ${String(dbAttendance).padEnd(30)}║`);
  console.log(`║  Exams               : ${String(dbExams).padEnd(30)}║`);
  console.log(`║  Exam Results        : ${String(dbExamResults).padEnd(30)}║`);
  console.log(`║  Buses & Routes      : ${String(dbBuses + ' Buses, ' + dbRoutes + ' Routes').padEnd(30)}║`);
  console.log(`║  LMS Courses/Lessons : ${String(dbLmsCourses + ' Courses, ' + dbLmsLessons + ' Lessons').padEnd(30)}║`);
  console.log(`║  Admissions Applications: ${String(dbAdmissions).padEnd(27)}║`);
  console.log(`║  Expense Records     : ${String(dbExpenses).padEnd(30)}║`);
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log('║  DEFAULT LOGIN CREDENTIALS (password: Demo@1234)     ║');
  console.log('║  - superadmin@averqonerp.com (Super Admin)           ║');
  console.log('║  - admin@greenvalley.edu     (GVIS Admin)            ║');
  console.log('║  - admin@oakridge.edu        (OPS Admin)             ║');
  console.log('║  - principal@greenvalley.edu (GVIS Principal)        ║');
  console.log('║  - ramesh.krishnamurthy@greenvalley.edu (Teacher)    ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');
}

main()
  .catch((e) => {
    console.error('❌ Database Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
