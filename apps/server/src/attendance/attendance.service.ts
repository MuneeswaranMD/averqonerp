import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AttendanceStatus } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Get student checklist by class / section
  async getStudentChecklist(schoolId: string, classId: string, sectionId: string) {
    return this.prisma.student.findMany({
      where: { schoolId, classId, sectionId },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
      },
    });
  }

  // 2. Mark attendance (bulk)
  async markAttendance(schoolId: string, dto: {
    date: Date;
    records: { studentId: string; status: AttendanceStatus; remarks?: string }[];
  }) {
    const dateOnly = new Date(dto.date);
    dateOnly.setHours(0, 0, 0, 0);

    const operations = dto.records.map(r => {
      return this.prisma.attendance.upsert({
        where: {
          studentId_date: {
            studentId: r.studentId,
            date: dateOnly,
          },
        },
        create: {
          schoolId,
          studentId: r.studentId,
          date: dateOnly,
          status: r.status,
          remarks: r.remarks,
        },
        update: {
          status: r.status,
          remarks: r.remarks,
        },
      });
    });

    return this.prisma.$transaction(operations);
  }

  // 3. Get monthly log (for Student / Parent view)
  async getStudentLogs(schoolId: string, userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });
    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    return this.prisma.attendance.findMany({
      where: { schoolId, studentId: student.id },
      orderBy: { date: 'asc' },
    });
  }
}
