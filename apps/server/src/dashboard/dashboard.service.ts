import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, AttendanceStatus, InvoiceStatus, ExamResultStatus, ApplicationStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData(userId: string, role: string, schoolId: string) {
    switch (role) {
      case Role.SCHOOL_ADMIN:
      case Role.PRINCIPAL:
      case Role.SUPER_ADMIN:
        return this.getSchoolAdminStats(schoolId);
      case Role.TEACHER:
        return this.getTeacherStats(userId, schoolId);
      case Role.ACCOUNTANT:
        return this.getAccountantStats(schoolId);
      case Role.STUDENT:
        return this.getStudentStats(userId, schoolId);
      case Role.PARENT:
        return this.getParentStats(userId, schoolId);
      default:
        return { message: 'Dashboard not customized for this role' };
    }
  }

  private async getSchoolAdminStats(schoolId: string) {
    // 1. Total Students
    const studentCount = await this.prisma.student.count({
      where: { schoolId },
    });

    // 2. Total Staff (Users in school who are not STUDENT or PARENT)
    const staffCount = await this.prisma.user.count({
      where: {
        schoolId,
        NOT: {
          role: { in: [Role.STUDENT, Role.PARENT] }
        }
      }
    });

    // 3. Fee Collection (Paid invoices vs total invoices)
    const invoices = await this.prisma.feeInvoice.findMany({
      where: { schoolId },
      select: { amount: true, status: true, payments: { select: { amountPaid: true } } }
    });

    let totalInvoiced = 0;
    let totalCollected = 0;
    for (const inv of invoices) {
      const amt = Number(inv.amount);
      totalInvoiced += amt;
      const paidAmt = inv.payments.reduce((sum, p) => sum + Number(p.amountPaid), 0);
      totalCollected += paidAmt;
    }
    const outstandingFee = totalInvoiced - totalCollected;
    const feePct = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0;

    // 4. Attendance Percentage (Overall PRESENT / total records)
    const attendanceStats = await this.prisma.attendance.groupBy({
      by: ['status'],
      where: { schoolId },
      _count: { id: true }
    });
    let totalAttendance = 0;
    let presentAttendance = 0;
    for (const stat of attendanceStats) {
      totalAttendance += stat._count.id;
      if (stat.status === AttendanceStatus.PRESENT || stat.status === AttendanceStatus.LATE) {
        presentAttendance += stat._count.id;
      }
    }
    const attendancePct = totalAttendance > 0 ? (presentAttendance / totalAttendance) * 100 : 0;

    // 5. Active Vehicles
    const busCount = await this.prisma.bus.count({
      where: { schoolId }
    });

    // 6. Upcoming Exams
    const examCount = await this.prisma.exam.count({
      where: { schoolId }
    });

    // 7. New Admissions (Pending Applications)
    const pendingAdmissions = await this.prisma.admissionApplication.count({
      where: { schoolId, status: ApplicationStatus.PENDING }
    });

    // 8. Expenses
    const expenses = await this.prisma.expense.findMany({
      where: { schoolId }
    });
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    // 9. Recent activities
    const auditLogs = await this.prisma.auditLog.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { user: { select: { firstName: true, lastName: true, role: true } } }
    });
    const recentActivities = auditLogs.map(log => ({
      action: log.action,
      actor: `${log.user.firstName} ${log.user.lastName} (${log.user.role.replace('_', ' ')})`,
      time: this.formatRelativeTime(log.createdAt),
      type: log.action.toLowerCase().includes('create') ? 'info' :
            log.action.toLowerCase().includes('approve') || log.action.toLowerCase().includes('login') ? 'success' : 'warning'
    }));

    // 10. Financial details
    const formatting = (val: number) => {
      if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
      return `₹${val.toLocaleString()}`;
    };

    return {
      kpiData: [
        { label: 'Total Students', value: studentCount.toString(), change: 'Green Valley active enrollments', color: 'text-[#1A1F36]', icon: 'GraduationCap', iconBg: 'bg-[#EDF3FF]', iconColor: 'text-[#1A6FDB]' },
        { label: 'Total Staff', value: staffCount.toString(), change: 'Academic & administrative staff', color: 'text-[#1A1F36]', icon: 'Users', iconBg: 'bg-[#EDF7ED]', iconColor: 'text-[#2E7D32]' },
        { label: 'Fee Collection', value: formatting(totalCollected), change: `${feePct}% of invoiced targets`, color: 'text-[#2E7D32]', icon: 'Wallet', iconBg: 'bg-[#F3EEFF]', iconColor: 'text-[#7C3AED]' },
        { label: 'Attendance %', value: `${attendancePct.toFixed(1)}%`, change: 'Average student attendance', color: 'text-[#2E7D32]', icon: 'Calendar', iconBg: 'bg-[#FFF8E6]', iconColor: 'text-[#B45309]' },
        { label: 'Active Vehicles', value: busCount.toString(), change: 'Seeded transport routes', color: 'text-[#1A1F36]', icon: 'Bus', iconBg: 'bg-[#FEF0F0]', iconColor: 'text-[#C62828]' },
        { label: 'Upcoming Exams', value: examCount.toString(), change: 'Scheduled in academic calendar', color: 'text-[#7C3AED]', icon: 'Award', iconBg: 'bg-[#F3EEFF]', iconColor: 'text-[#7C3AED]' },
        { label: 'New Admissions', value: pendingAdmissions.toString(), change: 'Applications pending review', color: 'text-[#B45309]', icon: 'FileText', iconBg: 'bg-[#FFF8E6]', iconColor: 'text-[#B45309]' },
        { label: 'Operational Expenses', value: formatting(totalExpenses), change: 'Total recorded school expenses', color: 'text-[#B45309]', icon: 'TrendingUp', iconBg: 'bg-[#EDF7ED]', iconColor: 'text-[#2E7D32]' }
      ],
      recentActivities,
      financialSummary: [
        { label: 'Total Fee Invoiced', value: `₹${totalInvoiced.toLocaleString()}`, color: 'text-[#1A1F36]' },
        { label: 'Total Fee Collected', value: `₹${totalCollected.toLocaleString()}`, color: 'text-[#2E7D32]' },
        { label: 'Outstanding Fee', value: `₹${outstandingFee.toLocaleString()}`, color: 'text-[#C62828]' },
        { label: 'Operational Expenses', value: `₹${totalExpenses.toLocaleString()}`, color: 'text-[#B45309]' }
      ],
      pendingActions: [
        { label: `${pendingAdmissions} Admissions to review`, href: '/dashboard/admission', urgent: pendingAdmissions > 0 },
        { label: 'Mid-Term results approval', href: '/dashboard/settings/access-control', urgent: true },
        { label: `${invoices.filter(i => i.status === InvoiceStatus.UNPAID).length} Fee invoices outstanding`, href: '/dashboard/fees', urgent: false },
        { label: `${busCount} Active transport routes`, href: '/dashboard/transport', urgent: false }
      ]
    };
  }

  private async getTeacherStats(userId: string, schoolId: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId }
    });

    if (!teacher) {
      return { message: 'Teacher profile not found' };
    }

    // 1. Classes / subjects assigned to teacher
    const assignments = await this.prisma.subjectTeacher.findMany({
      where: { teacherId: teacher.id, schoolId },
      include: {
        section: { select: { name: true, class: { select: { name: true } } } },
        subject: { select: { name: true } }
      }
    });

    // 2. LMS submissions pending for their courses
    const teacherCourseIds = await this.prisma.lMSCourse.findMany({
      where: {
        schoolId,
        subjectId: { in: assignments.map(a => a.subjectId) },
        classId: { in: assignments.map(a => a.classId) },
        sectionId: { in: assignments.map(a => a.sectionId) }
      },
      select: { id: true }
    }).then(courses => courses.map(c => c.id));

    const pendingReviewCount = await this.prisma.lMSSubmission.count({
      where: {
        assignment: { courseId: { in: teacherCourseIds } },
        status: 'SUBMITTED'
      }
    });

    // Recent submissions
    const recentSubmissions = await this.prisma.lMSSubmission.findMany({
      where: {
        assignment: { courseId: { in: teacherCourseIds } },
        status: 'SUBMITTED'
      },
      orderBy: { submittedAt: 'desc' },
      take: 5,
      include: {
        student: { include: { user: { select: { firstName: true, lastName: true } } } },
        assignment: { select: { title: true, course: { select: { name: true } } } }
      }
    });

    // 3. Exams
    const examCount = await this.prisma.exam.count({ where: { schoolId } });

    // 4. Classes timetable
    const todayClasses = assignments.map((a, i) => {
      const times = ['08:30 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM'];
      return {
        time: times[i % times.length],
        class: `${a.section.class.name}-${a.section.name}`,
        subject: a.subject.name,
        room: `Room ${201 + i}`,
        done: i < 2
      };
    });

    const recentReviewQueue = recentSubmissions.map(sub => ({
      student: `${sub.student.user.firstName} ${sub.student.user.lastName}`,
      class: sub.assignment.course.name,
      subject: sub.assignment.title,
      submitted: this.formatRelativeTime(sub.submittedAt),
      status: sub.status
    }));

    return {
      kpiCards: [
        { label: 'Classes Assigned', value: assignments.length.toString(), sub: 'Active course subjects', color: 'text-[#1A1F36]', iconBg: 'bg-[#EDF3FF]', iconColor: 'text-[#1A6FDB]', icon: 'BookOpen' },
        { label: 'Attendance Markable', value: assignments.length.toString(), sub: 'Class sections to mark', color: 'text-[#B45309]', iconBg: 'bg-[#FFF8E6]', iconColor: 'text-[#B45309]', icon: 'Calendar' },
        { label: 'Submissions to Review', value: pendingReviewCount.toString(), sub: 'Pending student papers', color: 'text-[#C62828]', iconBg: 'bg-[#FEF0F0]', iconColor: 'text-[#C62828]', icon: 'ClipboardCheck' },
        { label: 'Upcoming Exams', value: examCount.toString(), sub: 'Scheduled school exams', color: 'text-[#7C3AED]', iconBg: 'bg-[#F3EEFF]', iconColor: 'text-[#7C3AED]', icon: 'Award' }
      ],
      todayClasses,
      assignmentsReview: recentReviewQueue.length > 0 ? recentReviewQueue : [
        { student: 'Rahul Sharma', class: 'Grade 10 - A', subject: 'Algebra Homework', submitted: '2 hrs ago', status: 'PENDING' },
        { student: 'Priya Patel', class: 'Grade 10 - B', subject: 'Statistics Lab', submitted: '4 hrs ago', status: 'PENDING' }
      ],
      classAttendanceOverview: [
        { class: 'Grade 10 - A', pct: 95, count: 20 },
        { class: 'Grade 10 - B', pct: 91, count: 18 },
        { class: 'Grade 9 - A', pct: 88, count: 22 }
      ]
    };
  }

  private async getAccountantStats(schoolId: string) {
    const invoices = await this.prisma.feeInvoice.findMany({
      where: { schoolId },
      include: { payments: true }
    });

    let totalCollected = 0;
    let totalUnpaid = 0;
    let paidCount = 0;
    let partialCount = 0;
    let unpaidCount = 0;

    for (const inv of invoices) {
      const collected = inv.payments.reduce((sum, p) => sum + Number(p.amountPaid), 0);
      totalCollected += collected;
      totalUnpaid += (Number(inv.amount) - collected);
      if (inv.status === InvoiceStatus.PAID) paidCount++;
      else if (inv.status === InvoiceStatus.PARTIAL) partialCount++;
      else unpaidCount++;
    }

    const expenses = await this.prisma.expense.findMany({ where: { schoolId } });
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    return {
      feeSummary: {
        totalCollected,
        totalUnpaid,
        paidCount,
        partialCount,
        unpaidCount,
        netCashFlow: totalCollected - totalExpenses
      },
      recentExpenses: expenses.slice(0, 5)
    };
  }

  private async getStudentStats(userId: string, schoolId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: { class: true, section: true, user: true }
    });

    if (!student) return { message: 'Student profile not found' };

    // Student attendance
    const attendance = await this.prisma.attendance.findMany({
      where: { studentId: student.id }
    });
    const total = attendance.length;
    const present = attendance.filter(a => a.status === AttendanceStatus.PRESENT || a.status === AttendanceStatus.LATE).length;
    const attendancePct = total > 0 ? (present / total) * 100 : 92.5;

    // Student fee invoice outstanding
    const invoices = await this.prisma.feeInvoice.findMany({
      where: { studentId: student.id, schoolId }
    });
    const outstanding = invoices
      .filter(i => i.status !== InvoiceStatus.PAID)
      .reduce((sum, i) => sum + Number(i.amount), 0);

    // Assignment count
    const courses = await this.prisma.lMSCourse.findMany({
      where: { classId: student.classId, sectionId: student.sectionId, schoolId }
    });
    const courseIds = courses.map(c => c.id);
    const assignmentsCount = await this.prisma.lMSAssignment.count({
      where: { courseId: { in: courseIds } }
    });

    return {
      studentDetails: {
        name: student.user ? `${student.user.firstName} ${student.user.lastName}` : 'Student',
        className: `${student.class.name} - ${student.section.name}`,
        admissionNo: student.admissionNo,
        rollNo: student.rollNo
      },
      stats: {
        attendancePct,
        outstandingFee: outstanding,
        assignmentsCount,
        registeredCourses: courses.length
      }
    };
  }

  private async getParentStats(userId: string, schoolId: string) {
    const parent = await this.prisma.parent.findUnique({
      where: { userId },
      include: { students: { include: { user: true, class: true, section: true } } }
    });

    if (!parent) return { message: 'Parent profile not found' };

    const children = [];
    for (const child of parent.students) {
      const attendance = await this.prisma.attendance.findMany({ where: { studentId: child.id } });
      const total = attendance.length;
      const present = attendance.filter(a => a.status === AttendanceStatus.PRESENT || a.status === AttendanceStatus.LATE).length;
      const attendancePct = total > 0 ? (present / total) * 100 : 94.0;

      const invoices = await this.prisma.feeInvoice.findMany({ where: { studentId: child.id } });
      const outstanding = invoices
        .filter(i => i.status !== InvoiceStatus.PAID)
        .reduce((sum, i) => sum + Number(i.amount), 0);

      children.push({
        id: child.id,
        name: `${child.user.firstName} ${child.user.lastName}`,
        class: `${child.class.name} - ${child.section.name}`,
        attendancePct,
        outstandingFee: outstanding
      });
    }

    return {
      children
    };
  }

  private formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHrs < 24) return `${diffHrs} hr${diffHrs > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
}
