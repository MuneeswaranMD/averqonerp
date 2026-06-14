/**
 * DEMO SEED SCRIPT — Green Valley International School
 * Academic Year: 2026-2027
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

const SCHOOL_DOMAIN = 'greenvalley.averqonerp.com';
const SCHOOL_NAME = 'Green Valley International School';
const DEFAULT_PASSWORD = 'Demo@1234';

const FIRST_NAMES_M = ['Aarav','Arjun','Rohan','Vikram','Ankit','Rahul','Karan','Siddharth','Aditya','Nikhil','Pranav','Rajesh','Suresh','Deepak','Manish','Amit','Varun','Tushar','Gaurav','Yash','Harsh','Rishabh','Parth','Dev','Neil','Ishaan','Kabir','Vivek','Sameer','Mohit'];
const FIRST_NAMES_F = ['Priya','Ananya','Riya','Sneha','Pooja','Divya','Kajal','Simran','Ayesha','Meera','Nisha','Isha','Tanvi','Sonal','Neha','Swati','Kavya','Aditi','Preeti','Shruti','Ankita','Diya','Kritika','Bhavna','Sakshi','Tanya','Mansi','Khushi','Palak','Ridhi'];
const LAST_NAMES = ['Sharma','Verma','Patel','Singh','Kumar','Gupta','Mehta','Joshi','Yadav','Mishra','Agarwal','Nair','Reddy','Pillai','Iyer','Bhat','Shah','Desai','Pandey','Chauhan','Srivastava','Dubey','Tiwari','Malhotra','Kapoor','Chaudhary','Sinha','Saxena','Trivedi','Mathur'];
const SUBJECTS_BY_GRADE = {
  lower: ['Mathematics','English','Science','Social Studies','Hindi','Art & Craft','Physical Education','Computer Science'],
  middle: ['Mathematics','English','Physics','Chemistry','Biology','History','Geography','Hindi','Computer Science','Physical Education'],
  upper: ['Mathematics','English','Physics','Chemistry','Biology','History','Political Science','Economics','Computer Science','Physical Education','Hindi'],
};
const DEPARTMENTS = ['Mathematics','Science','English','Social Studies','Computer Science','Physical Education','Hindi','Arts'];
const DESIGNATIONS = ['Senior Teacher','Junior Teacher','Head of Department','Assistant Teacher','Subject Expert'];
const PAYMENT_METHODS = ['Online - UPI','Online - Net Banking','Cash','Cheque','Online - Card'];
const EXPENSE_CATEGORIES = ['Salary','Utilities','Maintenance','Transport','Events','Stationery','Infrastructure','IT Equipment'];

function getSubjectsForGrade(gradeNum) {
  if (gradeNum <= 5) return SUBJECTS_BY_GRADE.lower;
  if (gradeNum <= 8) return SUBJECTS_BY_GRADE.middle;
  return SUBJECTS_BY_GRADE.upper;
}

function gradeFromMarks(obtained, max) {
  const pct = (obtained / max) * 100;
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B+';
  if (pct >= 60) return 'B';
  if (pct >= 50) return 'C';
  if (pct >= 40) return 'D';
  return 'F';
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, salt);

  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║   GREEN VALLEY INTERNATIONAL SCHOOL — DEMO SEED     ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  // ── 1. School ──────────────────────────────────────────────────────────────
  console.log('▶ Creating school...');
  let school = await prisma.school.findUnique({ where: { domain: SCHOOL_DOMAIN } });
  if (!school) {
    school = await prisma.school.create({
      data: {
        name: SCHOOL_NAME,
        domain: SCHOOL_DOMAIN,
        logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=GVIS&backgroundColor=1A6FDB&textColor=ffffff',
      },
    });
    console.log(`  ✓ School created: ${school.name} (${school.id})`);
  } else {
    console.log(`  ✓ School already exists: ${school.name}`);
  }
  const schoolId = school.id;

  // ── 1b. Principal & School Admin ──────────────────────────────────────────
  console.log('▶ Creating admin users...');
  const adminAccounts = [
    { first: 'Dr. Anand', last: 'Krishnaswamy', email: 'principal@greenvalley.edu', role: Role.PRINCIPAL },
    { first: 'Meghana', last: 'Rao', email: 'admin@greenvalley.edu', role: Role.SCHOOL_ADMIN },
    { first: 'Prakash', last: 'Nair', email: 'receptionist@greenvalley.edu', role: Role.RECEPTIONIST },
  ];
  for (const a of adminAccounts) {
    let u = await prisma.user.findUnique({ where: { email: a.email } });
    if (!u) {
      await prisma.user.create({ data: { schoolId, email: a.email, passwordHash, role: a.role, firstName: a.first, lastName: a.last, phone: `99${rand(10000000, 99999999)}` } });
      console.log(`  ✓ Created: ${a.email} [${a.role}]`);
    } else {
      console.log(`  ✓ Exists: ${a.email}`);
    }
  }

  // ── 2. Academic Year ───────────────────────────────────────────────────────
  console.log('▶ Creating academic year...');
  let academicYear = await prisma.academicYear.findUnique({ where: { schoolId_year: { schoolId, year: '2026-2027' } } });
  if (!academicYear) {
    academicYear = await prisma.academicYear.create({ data: { schoolId, year: '2026-2027', isActive: true } });
    console.log('  ✓ Academic Year: 2026-2027');
  } else {
    console.log('  ✓ Academic year already exists');
  }
  const academicYearId = academicYear.id;

  // ── 3. Classes & Sections ─────────────────────────────────────────────────
  console.log('▶ Creating classes and sections...');
  const classMap = {}; // gradeNum -> { class, sections: {A, B, C} }
  for (let g = 1; g <= 12; g++) {
    const className = `Grade ${g}`;
    let cls = await prisma.class.findFirst({ where: { schoolId, name: className } });
    if (!cls) cls = await prisma.class.create({ data: { schoolId, name: className } });

    const sections = {};
    for (const secName of ['A', 'B', 'C']) {
      let sec = await prisma.section.findFirst({ where: { schoolId, classId: cls.id, name: secName } });
      if (!sec) sec = await prisma.section.create({ data: { schoolId, classId: cls.id, name: secName } });
      sections[secName] = sec;
    }
    classMap[g] = { class: cls, sections };
  }
  console.log('  ✓ 12 classes × 3 sections = 36 sections created');

  // ── 4. Subjects ────────────────────────────────────────────────────────────
  console.log('▶ Creating subjects...');
  const subjectMap = {}; // classId -> [subjects]
  let subjectCounter = 1;
  for (let g = 1; g <= 12; g++) {
    const cls = classMap[g].class;
    const subjectNames = getSubjectsForGrade(g);
    subjectMap[cls.id] = [];
    for (const subName of subjectNames) {
      const code = `${subName.replace(/\s+/g, '').toUpperCase().slice(0, 4)}${g}${String(subjectCounter).padStart(2,'0')}`;
      let sub = await prisma.subject.findFirst({ where: { schoolId, classId: cls.id, name: subName } });
      if (!sub) sub = await prisma.subject.create({ data: { schoolId, classId: cls.id, name: subName, code } });
      subjectMap[cls.id].push(sub);
      subjectCounter++;
    }
  }
  console.log('  ✓ Subjects created for all grades');

  // ── 5. Teachers ────────────────────────────────────────────────────────────
  console.log('▶ Creating 28 teachers...');
  const teacherUsers = [];
  const teacherProfiles = [];
  const teacherNames = [
    { first: 'Ramesh', last: 'Krishnamurthy', dept: 'Mathematics', desig: 'Head of Department' },
    { first: 'Sunita', last: 'Agarwal', dept: 'Science', desig: 'Senior Teacher' },
    { first: 'Pradeep', last: 'Nair', dept: 'English', desig: 'Head of Department' },
    { first: 'Lalitha', last: 'Menon', dept: 'Hindi', desig: 'Senior Teacher' },
    { first: 'Vijay', last: 'Rajan', dept: 'Social Studies', desig: 'Head of Department' },
    { first: 'Geeta', last: 'Pillai', dept: 'Computer Science', desig: 'Subject Expert' },
    { first: 'Suresh', last: 'Iyer', dept: 'Physical Education', desig: 'Senior Teacher' },
    { first: 'Anita', last: 'Bose', dept: 'Mathematics', desig: 'Junior Teacher' },
    { first: 'Mohan', last: 'Rao', dept: 'Science', desig: 'Senior Teacher' },
    { first: 'Kavitha', last: 'Subramaniam', dept: 'English', desig: 'Senior Teacher' },
    { first: 'Arun', last: 'Sharma', dept: 'Mathematics', desig: 'Junior Teacher' },
    { first: 'Deepa', last: 'Mehta', dept: 'Hindi', desig: 'Junior Teacher' },
    { first: 'Sanjay', last: 'Gupta', dept: 'Social Studies', desig: 'Senior Teacher' },
    { first: 'Rekha', last: 'Joshi', dept: 'Arts', desig: 'Subject Expert' },
    { first: 'Naresh', last: 'Verma', dept: 'Computer Science', desig: 'Senior Teacher' },
    { first: 'Usha', last: 'Patel', dept: 'Science', desig: 'Junior Teacher' },
    { first: 'Kiran', last: 'Malhotra', dept: 'Mathematics', desig: 'Senior Teacher' },
    { first: 'Shobha', last: 'Nayak', dept: 'English', desig: 'Junior Teacher' },
    { first: 'Rajiv', last: 'Kapoor', dept: 'Physical Education', desig: 'Head of Department' },
    { first: 'Meena', last: 'Saxena', dept: 'Hindi', desig: 'Senior Teacher' },
    { first: 'Dinesh', last: 'Tripathi', dept: 'Social Studies', desig: 'Junior Teacher' },
    { first: 'Pooja', last: 'Chandra', dept: 'Science', desig: 'Senior Teacher' },
    { first: 'Harish', last: 'Dubey', dept: 'Mathematics', desig: 'Junior Teacher' },
    { first: 'Nandini', last: 'Shetty', dept: 'English', desig: 'Senior Teacher' },
    { first: 'Vikram', last: 'Pandey', dept: 'Computer Science', desig: 'Junior Teacher' },
    { first: 'Sarla', last: 'Tiwari', dept: 'Arts', desig: 'Senior Teacher' },
    { first: 'Ashok', last: 'Mishra', dept: 'Social Studies', desig: 'Senior Teacher' },
    { first: 'Poonam', last: 'Singh', dept: 'Science', desig: 'Junior Teacher' },
  ];

  for (let i = 0; i < teacherNames.length; i++) {
    const t = teacherNames[i];
    const email = `${t.first.toLowerCase()}.${t.last.toLowerCase()}@greenvalley.edu`;
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { schoolId, email, passwordHash, role: Role.TEACHER, firstName: t.first, lastName: t.last, phone: `98${rand(10000000, 99999999)}` }
      });
    }
    let teacher = await prisma.teacher.findUnique({ where: { userId: user.id } });
    if (!teacher) {
      teacher = await prisma.teacher.create({
        data: { schoolId, userId: user.id, designation: t.desig, joinedAt: randDate(new Date('2018-06-01'), new Date('2024-04-01')) }
      });
    }
    teacherUsers.push(user);
    teacherProfiles.push({ ...teacher, dept: t.dept, first: t.first, last: t.last });
  }
  console.log(`  ✓ ${teacherProfiles.length} teachers created`);

  // ── 6. SubjectTeacher assignments ─────────────────────────────────────────
  console.log('▶ Assigning teachers to subjects & sections...');
  let stCount = 0;
  for (let g = 1; g <= 12; g++) {
    const cls = classMap[g].class;
    const subjects = subjectMap[cls.id];
    for (const sec of Object.values(classMap[g].sections)) {
      for (const subject of subjects) {
        // Pick a teacher from matching dept or random
        const teacher = pick(teacherProfiles);
        try {
          const existing = await prisma.subjectTeacher.findFirst({
            where: { teacherId: teacher.id, subjectId: subject.id, classId: cls.id, sectionId: sec.id }
          });
          if (!existing) {
            await prisma.subjectTeacher.create({
              data: { schoolId, teacherId: teacher.id, subjectId: subject.id, classId: cls.id, sectionId: sec.id }
            });
            stCount++;
          }
        } catch (_) {}
      }
    }
  }
  console.log(`  ✓ ${stCount} subject-teacher assignments`);

  // ── 7. Accountants ────────────────────────────────────────────────────────
  console.log('▶ Creating 2 accountants...');
  const accountants = [
    { first: 'Ramya', last: 'Krishnan', email: 'ramya.krishnan@greenvalley.edu' },
    { first: 'Sunil', last: 'Batra', email: 'sunil.batra@greenvalley.edu' },
  ];
  for (const a of accountants) {
    let u = await prisma.user.findUnique({ where: { email: a.email } });
    if (!u) await prisma.user.create({ data: { schoolId, email: a.email, passwordHash, role: Role.ACCOUNTANT, firstName: a.first, lastName: a.last, phone: `97${rand(10000000, 99999999)}` } });
  }
  console.log('  ✓ 2 accountants created');

  // ── 8. Parents & Students ─────────────────────────────────────────────────
  console.log('▶ Creating 216 students across all grades...');
  const allStudents = [];
  let admissionCounter = 1000;

  // ~18 students per grade across 3 sections (6 each)
  for (let g = 1; g <= 12; g++) {
    const cls = classMap[g].class;
    const sectionKeys = ['A', 'B', 'C'];
    for (const secKey of sectionKeys) {
      const sec = classMap[g].sections[secKey];
      const count = g <= 10 ? 6 : 5; // slightly fewer in 11-12
      for (let si = 1; si <= count; si++) {
        const isMale = rand(0, 1) === 0;
        const firstName = pick(isMale ? FIRST_NAMES_M : FIRST_NAMES_F);
        const lastName = pick(LAST_NAMES);
        const email = `student.${firstName.toLowerCase()}${admissionCounter}@greenvalley.edu`;
        const admissionNo = `GVIS${new Date().getFullYear()}${String(admissionCounter).padStart(4, '0')}`;
        admissionCounter++;

        // Parent
        const parentFirstName = pick(FIRST_NAMES_M);
        const parentLastName = lastName;
        const parentContact = `9${rand(100000000, 999999999)}`;
        const parentEmail = `parent${admissionCounter}@greenvalley.edu`;

        try {
          // Create student user
          let studentUser = await prisma.user.findUnique({ where: { email } });
          if (!studentUser) {
            studentUser = await prisma.user.create({
              data: { schoolId, email, passwordHash, role: Role.STUDENT, firstName, lastName, phone: `8${rand(100000000, 999999999)}` }
            });
          }

          // Create/find parent user
          let parentUser = await prisma.user.findUnique({ where: { email: parentEmail } });
          if (!parentUser) {
            parentUser = await prisma.user.create({
              data: { schoolId, email: parentEmail, passwordHash, role: Role.PARENT, firstName: parentFirstName, lastName: parentLastName, phone: parentContact }
            });
          }
          let parent = await prisma.parent.findUnique({ where: { userId: parentUser.id } });
          if (!parent) {
            parent = await prisma.parent.create({
              data: { schoolId, userId: parentUser.id, primaryContact: parentContact, occupation: pick(['Business','Engineer','Doctor','Teacher','Government Employee','Lawyer','Banker','Farmer']) }
            });
          }

          // Create student
          let student = await prisma.student.findUnique({ where: { admissionNo } });
          if (!student) {
            student = await prisma.student.create({
              data: { schoolId, userId: studentUser.id, admissionNo, rollNo: String(si), classId: cls.id, sectionId: sec.id, parentId: parent.id }
            });
            await prisma.parentStudent.upsert({
              where: { parentId_studentId: { parentId: parent.id, studentId: student.id } },
              update: {},
              create: { schoolId, parentId: parent.id, studentId: student.id }
            });
          }
          allStudents.push({ student, grade: g, classId: cls.id, sectionId: sec.id });
        } catch (err) {
          // Skip duplicates silently
        }
      }
    }
  }
  console.log(`  ✓ ${allStudents.length} students created`);

  // ── 9. Fee Categories & Invoices ──────────────────────────────────────────
  console.log('▶ Creating fee categories and invoices...');
  const feeCategories = [
    { name: 'Tuition Fee Q1', amount: 18000 },
    { name: 'Tuition Fee Q2', amount: 18000 },
    { name: 'Tuition Fee Q3', amount: 18000 },
    { name: 'Tuition Fee Q4', amount: 18000 },
    { name: 'Annual Maintenance Charge', amount: 5000 },
    { name: 'Library Fee', amount: 1500 },
    { name: 'Sports Fee', amount: 2000 },
    { name: 'Lab Fee', amount: 3000 },
    { name: 'Transport Fee (Annual)', amount: 12000 },
    { name: 'Exam Fee', amount: 2500 },
  ];

  const feeCatRecords = [];
  for (const fc of feeCategories) {
    let cat = await prisma.feeCategory.findFirst({ where: { schoolId, name: fc.name } });
    if (!cat) cat = await prisma.feeCategory.create({ data: { schoolId, name: fc.name, amount: fc.amount } });
    feeCatRecords.push(cat);
  }

  // Create invoices for every student — tuition Q1-Q4, annual, exam
  const quarterlyInvoiceCategories = feeCatRecords.slice(0, 4); // Q1-Q4
  const annualFeeCategories = [feeCatRecords[4], feeCatRecords[5], feeCatRecords[6], feeCatRecords[7], feeCatRecords[9]]; // AMC, Library, Sports, Lab, Exam

  let totalFeeInvoices = 0;
  const dueDates = [
    new Date('2026-04-30'), new Date('2026-07-31'), new Date('2026-10-31'), new Date('2027-01-31')
  ];

  for (const { student } of allStudents) {
    // Quarterly tuition invoices
    for (let q = 0; q < 4; q++) {
      const cat = quarterlyInvoiceCategories[q];
      const dueDate = dueDates[q];
      const statusRoll = rand(1, 100);
      let status;
      if (dueDate < new Date()) {
        status = statusRoll <= 80 ? 'PAID' : statusRoll <= 90 ? 'PARTIAL' : 'UNPAID';
      } else {
        status = statusRoll <= 30 ? 'PAID' : 'UNPAID';
      }

      try {
        const inv = await prisma.feeInvoice.create({
          data: { schoolId, studentId: student.id, academicYearId, categoryId: cat.id, amount: cat.amount, dueDate, status }
        });
        totalFeeInvoices++;

        // Create payments
        if (status === 'PAID') {
          await prisma.feePayment.create({
            data: { schoolId, invoiceId: inv.id, amountPaid: cat.amount, paidAt: randDate(new Date('2026-04-01'), new Date()), paymentMethod: pick(PAYMENT_METHODS), transactionId: `TXN${Date.now()}${rand(1000,9999)}` }
          });
        } else if (status === 'PARTIAL') {
          const paid = parseFloat((Number(cat.amount) * randFloat(0.3, 0.7)).toFixed(2));
          await prisma.feePayment.create({
            data: { schoolId, invoiceId: inv.id, amountPaid: paid, paidAt: randDate(new Date('2026-04-01'), new Date()), paymentMethod: pick(PAYMENT_METHODS), transactionId: `TXN${Date.now()}${rand(1000,9999)}` }
          });
        }
        await sleep(1); // avoid unique constraint on transactionId
      } catch (_) {}
    }

    // Annual charges — always paid
    for (const cat of annualFeeCategories.slice(0, 3)) {
      try {
        const inv = await prisma.feeInvoice.create({
          data: { schoolId, studentId: student.id, academicYearId, categoryId: cat.id, amount: cat.amount, dueDate: new Date('2026-05-15'), status: 'PAID' }
        });
        await prisma.feePayment.create({
          data: { schoolId, invoiceId: inv.id, amountPaid: cat.amount, paidAt: randDate(new Date('2026-04-01'), new Date('2026-05-20')), paymentMethod: pick(PAYMENT_METHODS), transactionId: `TXN${Date.now()}${rand(1000,9999)}` }
        });
        totalFeeInvoices++;
        await sleep(1);
      } catch (_) {}
    }
  }
  console.log(`  ✓ ${totalFeeInvoices} fee invoices created`);

  // ── 10. Attendance (last 60 school days) ──────────────────────────────────
  console.log('▶ Seeding attendance records (60 days)...');
  const today = new Date();
  const schoolDays = [];
  for (let d = 90; d >= 1; d--) {
    const dt = new Date(today);
    dt.setDate(dt.getDate() - d);
    const dow = dt.getDay();
    if (dow !== 0 && dow !== 6) schoolDays.push(new Date(dt.toDateString())); // exclude weekends
    if (schoolDays.length >= 60) break;
  }

  let attCount = 0;
  for (const { student } of allStudents.slice(0, 100)) { // limit for performance
    for (const date of schoolDays.slice(0, 30)) {
      const roll = rand(1, 100);
      const status = roll <= 94 ? AttendanceStatus.PRESENT : roll <= 97 ? AttendanceStatus.LATE : AttendanceStatus.ABSENT;
      try {
        await prisma.attendance.upsert({
          where: { studentId_date: { studentId: student.id, date } },
          update: {},
          create: { schoolId, studentId: student.id, date, status, remarks: status === AttendanceStatus.ABSENT ? pick(['Sick leave', 'Family emergency', 'No reason given', 'Medical appointment']) : null }
        });
        attCount++;
      } catch (_) {}
    }
  }
  console.log(`  ✓ ${attCount} attendance records created`);

  // ── 11. Exams & Results ───────────────────────────────────────────────────
  console.log('▶ Creating exams and results...');
  const examDefs = [
    { name: 'Unit Test 1', start: new Date('2026-05-10'), end: new Date('2026-05-15') },
    { name: 'Mid-Term Examination', start: new Date('2026-07-20'), end: new Date('2026-07-28') },
    { name: 'Unit Test 2', start: new Date('2026-09-08'), end: new Date('2026-09-12') },
    { name: 'Quarterly Assessment', start: new Date('2026-10-05'), end: new Date('2026-10-12') },
    { name: 'Pre-Final Examination', start: new Date('2026-12-10'), end: new Date('2026-12-20') },
    { name: 'Annual Final Examination', start: new Date('2027-02-15'), end: new Date('2027-02-28') },
  ];

  const examRecords = [];
  for (const e of examDefs) {
    let exam = await prisma.exam.findFirst({ where: { schoolId, name: e.name, academicYearId } });
    if (!exam) {
      exam = await prisma.exam.create({ data: { schoolId, name: e.name, academicYearId, startDate: e.start, endDate: e.end } });
    }
    examRecords.push(exam);
  }

  let resultCount = 0;
  for (const { student, grade, classId } of allStudents.slice(0, 80)) {
    const subjects = subjectMap[classId] || [];
    for (const exam of examRecords.slice(0, 3)) { // 3 past exams
      for (const subject of subjects.slice(0, 5)) { // 5 subjects per student
        const maxMarks = 100;
        const obtained = randFloat(35, 98);
        const g = gradeFromMarks(obtained, maxMarks);
        try {
          await prisma.examResult.create({
            data: { schoolId, studentId: student.id, examId: exam.id, subjectId: subject.id, marksObtained: obtained, maxMarks, grade: g, status: 'APPROVED' }
          });
          resultCount++;
        } catch (_) {}
      }
    }
  }
  console.log(`  ✓ ${examRecords.length} exams, ${resultCount} results`);

  // ── 12. Transport ─────────────────────────────────────────────────────────
  console.log('▶ Creating buses, routes, stops...');
  const busData = [
    { vehicleNo: 'KA-01-AB-1234', driver: 'Raju Kumar', phone: '9876500001' },
    { vehicleNo: 'KA-01-CD-5678', driver: 'Suresh Babu', phone: '9876500002' },
    { vehicleNo: 'KA-02-EF-9012', driver: 'Mohan Lal', phone: '9876500003' },
    { vehicleNo: 'KA-03-GH-3456', driver: 'Venkat Rao', phone: '9876500004' },
    { vehicleNo: 'KA-04-IJ-7890', driver: 'Pratap Singh', phone: '9876500005' },
    { vehicleNo: 'KA-05-KL-2345', driver: 'Govind Das', phone: '9876500006' },
    { vehicleNo: 'KA-06-MN-6789', driver: 'Shiva Kumar', phone: '9876500007' },
    { vehicleNo: 'KA-07-OP-0123', driver: 'Ramesh Nair', phone: '9876500008' },
    { vehicleNo: 'KA-08-QR-4567', driver: 'Dinesh Reddy', phone: '9876500009' },
    { vehicleNo: 'KA-09-ST-8901', driver: 'Ajay Verma', phone: '9876500010' },
  ];

  const routeData = [
    { name: 'Route 1 – North Zone', start: 'Koramangala', end: 'Green Valley School', stops: ['Koramangala', 'BTM Layout', 'Jayanagar', 'Banashankari', 'School'] },
    { name: 'Route 2 – South Zone', start: 'Electronic City', end: 'Green Valley School', stops: ['Electronic City', 'Bommanahalli', 'HSR Layout', 'Silk Board', 'School'] },
    { name: 'Route 3 – East Zone', start: 'Whitefield', end: 'Green Valley School', stops: ['Whitefield', 'Marathahalli', 'Bellandur', 'Sarjapur Road', 'School'] },
    { name: 'Route 4 – West Zone', start: 'Rajajinagar', end: 'Green Valley School', stops: ['Rajajinagar', 'Basaveshwaranagar', 'Vijayanagar', 'Magadi Road', 'School'] },
    { name: 'Route 5 – Central', start: 'MG Road', end: 'Green Valley School', stops: ['MG Road', 'Richmond Circle', 'Shivajinagar', 'Cunningham Road', 'School'] },
    { name: 'Route 6 – Hebbal', start: 'Hebbal', end: 'Green Valley School', stops: ['Hebbal', 'MS Ramaiah', 'Sadashivanagar', 'Mehkri Circle', 'School'] },
    { name: 'Route 7 – Yelahanka', start: 'Yelahanka', end: 'Green Valley School', stops: ['Yelahanka', 'Bagalur', 'HBR Layout', 'Kalyan Nagar', 'School'] },
    { name: 'Route 8 – Bannerghatta', start: 'Bannerghatta', end: 'Green Valley School', stops: ['Bannerghatta', 'JP Nagar', 'Gottigere', 'Hulimavu', 'School'] },
    { name: 'Route 9 – Kengeri', start: 'Kengeri', end: 'Green Valley School', stops: ['Kengeri', 'Uttarahalli', 'Subramanya Nagar', 'Chord Road', 'School'] },
    { name: 'Route 10 – KR Puram', start: 'KR Puram', end: 'Green Valley School', stops: ['KR Puram', 'Hoodi', 'Banaswadi', 'Ramamurthy Nagar', 'School'] },
  ];

  const busRecords = [];
  for (const b of busData) {
    let bus = await prisma.bus.findUnique({ where: { vehicleNo: b.vehicleNo } });
    if (!bus) bus = await prisma.bus.create({ data: { schoolId, vehicleNo: b.vehicleNo, driverName: b.driver, driverPhone: b.phone } });
    busRecords.push(bus);
  }

  const routeRecords = [];
  const allStops = [];
  for (let i = 0; i < routeData.length; i++) {
    const r = routeData[i];
    const bus = busRecords[i % busRecords.length];
    let route = await prisma.route.findFirst({ where: { schoolId, name: r.name } });
    if (!route) route = await prisma.route.create({ data: { schoolId, name: r.name, startPoint: r.start, endPoint: r.end, busId: bus.id } });
    routeRecords.push(route);

    const times = ['06:30 AM', '06:45 AM', '07:00 AM', '07:15 AM', '07:30 AM'];
    for (let s = 0; s < r.stops.length; s++) {
      let stop = await prisma.stop.findFirst({ where: { routeId: route.id, name: r.stops[s] } });
      if (!stop) stop = await prisma.stop.create({ data: { schoolId, routeId: route.id, name: r.stops[s], sequence: s + 1, arrivalTime: times[s] || '07:30 AM' } });
      allStops.push({ stop, routeId: route.id });
    }
  }

  // Assign some students to routes
  let assignedTransport = 0;
  for (let i = 0; i < Math.min(allStudents.length, 80); i++) {
    const { student } = allStudents[i];
    const routeStop = allStops[i % allStops.length];
    try {
      await prisma.studentRoute.upsert({
        where: { studentId: student.id },
        update: {},
        create: { schoolId, studentId: student.id, routeId: routeStop.routeId, stopId: routeStop.stop.id }
      });
      assignedTransport++;
    } catch (_) {}
  }
  console.log(`  ✓ ${busRecords.length} buses, ${routeRecords.length} routes, ${assignedTransport} students assigned`);

  // ── 13. LMS Courses, Lessons, Assignments ─────────────────────────────────
  console.log('▶ Creating LMS courses, lessons, assignments...');
  const lmsTitles = ['Introduction & Overview', 'Core Concepts – Part 1', 'Core Concepts – Part 2', 'Practice & Application', 'Assessment & Review'];
  const assignmentTitles = ['Chapter 1 Worksheet', 'Mid-Unit Project', 'Research Assignment', 'Problem Set', 'Final Review Quiz'];

  let courseCount = 0, lessonCount = 0, assignmentCount = 0, subCount = 0;

  for (let g = 9; g <= 12; g++) { // LMS for upper grades
    const cls = classMap[g].class;
    const subjects = subjectMap[cls.id] || [];
    const secA = classMap[g].sections['A'];

    for (const subject of subjects.slice(0, 3)) {
      let course = await prisma.lMSCourse.findFirst({ where: { schoolId, subjectId: subject.id, classId: cls.id, sectionId: secA.id } });
      if (!course) {
        course = await prisma.lMSCourse.create({ data: { schoolId, name: `${subject.name} – Grade ${g}`, subjectId: subject.id, classId: cls.id, sectionId: secA.id } });
        courseCount++;

        for (const title of lmsTitles) {
          await prisma.lMSLesson.create({ data: { schoolId, courseId: course.id, title: `${subject.name}: ${title}`, description: `Comprehensive lesson on ${title.toLowerCase()} for ${subject.name}`, contentUrl: `https://storage.greenvalley.edu/lms/${subject.name.replace(/\s/g,'-').toLowerCase()}/lesson${lessonCount + 1}.pdf` } });
          lessonCount++;
        }

        for (let a = 0; a < 3; a++) {
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + rand(7, 60));
          const assignment = await prisma.lMSAssignment.create({
            data: { schoolId, courseId: course.id, title: `${subject.name}: ${assignmentTitles[a]}`, description: `Complete ${assignmentTitles[a]} for ${subject.name}`, dueDate }
          });
          assignmentCount++;

          // Some student submissions
          for (const { student, grade } of allStudents.filter(s => s.grade === g).slice(0, 4)) {
            try {
              await prisma.lMSSubmission.create({
                data: { assignmentId: assignment.id, studentId: student.id, fileUrl: `https://storage.greenvalley.edu/submissions/${student.id}-${assignment.id}.pdf`, marks: randFloat(60, 98), feedback: pick(['Excellent work!', 'Good effort, minor corrections needed.', 'Well presented.', 'Needs improvement in section 2.', 'Outstanding submission.']), status: 'GRADED' }
              });
              subCount++;
            } catch (_) {}
          }
        }
      }
    }
  }
  console.log(`  ✓ ${courseCount} courses, ${lessonCount} lessons, ${assignmentCount} assignments, ${subCount} submissions`);

  // ── 14. Admission Applications ────────────────────────────────────────────
  console.log('▶ Creating admission applications...');
  const appStatuses = [
    ...Array(50).fill('PENDING'),
    ...Array(30).fill('APPROVED'),
    ...Array(10).fill('REJECTED'),
  ];
  let appCount = 0;
  for (const status of appStatuses) {
    const firstName = pick([...FIRST_NAMES_M, ...FIRST_NAMES_F]);
    const lastName = pick(LAST_NAMES);
    const grade = rand(1, 12);
    try {
      await prisma.admissionApplication.create({
        data: {
          schoolId,
          firstName,
          lastName,
          email: `apply.${firstName.toLowerCase()}${rand(1000, 9999)}@gmail.com`,
          gradeRequested: `Grade ${grade}`,
          parentContact: `9${rand(100000000, 999999999)}`,
          status: status,
          appliedAt: randDate(new Date('2026-01-01'), new Date()),
        }
      });
      appCount++;
    } catch (_) {}
  }
  console.log(`  ✓ ${appCount} admission applications (50 pending, 30 approved, 10 rejected)`);

  // ── 15. Expenses (Accounting) ─────────────────────────────────────────────
  console.log('▶ Creating expense records...');
  const expenseTitles = {
    Salary: ['Teaching Staff Salaries', 'Support Staff Salaries', 'Admin Staff Salaries'],
    Utilities: ['Electricity Bill', 'Water Supply', 'Internet & Phone'],
    Maintenance: ['Building Maintenance', 'AC Servicing', 'Furniture Repair', 'Plumbing Work'],
    Transport: ['Bus Fuel', 'Bus Maintenance', 'Vehicle Insurance'],
    Events: ['Annual Day Expenses', 'Sports Day', 'Science Fair', 'Cultural Fest'],
    Stationery: ['Office Supplies', 'Chalk & Board Items', 'Printer Paper'],
    Infrastructure: ['Lab Equipment', 'Library Books', 'Smart Boards'],
    'IT Equipment': ['Computer Lab Upgrade', 'WiFi Router', 'Server Maintenance'],
  };

  let expenseCount = 0;
  for (let m = 1; m <= 5; m++) {
    const monthStart = new Date(2026, m + 2, 1);
    for (const [cat, titles] of Object.entries(expenseTitles)) {
      const title = pick(titles);
      const amount = cat === 'Salary' ? rand(300000, 800000) : rand(5000, 80000);
      const expDate = new Date(monthStart);
      expDate.setDate(rand(1, 28));
      try {
        await prisma.expense.create({
          data: { schoolId, title, amount, category: cat, date: expDate, paymentMethod: pick(['Bank Transfer', 'Cheque', 'Cash']), remarks: `Monthly ${cat.toLowerCase()} expense – ${expDate.toLocaleString('default', { month: 'long' })} 2026` }
        });
        expenseCount++;
      } catch (_) {}
    }
  }
  console.log(`  ✓ ${expenseCount} expense records`);

  // ── 16. Audit Logs ────────────────────────────────────────────────────────
  console.log('▶ Creating audit logs...');
  const adminUser = await prisma.user.findFirst({ where: { schoolId, role: 'SCHOOL_ADMIN' } }) || teacherUsers[0];
  const auditActions = [
    'Student enrolled: Aarav Sharma (GVIS2026-1001)',
    'Fee invoice generated for Grade 10-A',
    'Attendance marked for Grade 9-B',
    'Exam results uploaded: Mid-Term 2026',
    'New teacher added: Pradeep Nair',
    'Admission application approved: Riya Patel',
    'Transport route updated: Route 3 – East Zone',
    'LMS course published: Mathematics – Grade 11',
    'Fee payment recorded: ₹18,000 from Arjun Verma',
    'Report card generated for Grade 12-A',
  ];

  for (const action of auditActions) {
    try {
      await prisma.auditLog.create({
        data: { schoolId, userId: adminUser.id, action, details: `Action performed at ${new Date().toISOString()}`, createdAt: randDate(new Date('2026-04-01'), new Date()) }
      });
    } catch (_) {}
  }
  console.log('  ✓ Audit logs created');

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║              DEMO SEED COMPLETE! ✓                  ║');
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log('║  School     : Green Valley International School      ║');
  console.log('║  Domain     : greenvalley.averqonerp.com             ║');
  console.log('║  AcadYear   : 2026-2027                              ║');
  console.log(`║  Students   : ${allStudents.length} created                         ║`);
  console.log(`║  Teachers   : ${teacherProfiles.length} created                          ║`);
  console.log(`║  Exams      : ${examRecords.length} created                           ║`);
  console.log(`║  Buses      : ${busRecords.length} created                          ║`);
  console.log(`║  Routes     : ${routeRecords.length} created                         ║`);
  console.log(`║  LMS Courses: ${courseCount} created                          ║`);
  console.log(`║  Applications: ${appCount} created                        ║`);
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log('║  Login: greenvalley.averqonerp.com                   ║');
  console.log('║  Admin: principal@greenvalley.edu / Demo@1234        ║');
  console.log('║  Teacher: ramesh.krishnamurthy@greenvalley.edu       ║');
  console.log('║  All default password: Demo@1234                     ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');
}

main()
  .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
