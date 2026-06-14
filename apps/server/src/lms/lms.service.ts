import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LMSService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Get courses folders & lessons list for student
  async getStudentCourses(schoolId: string, userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });
    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    return this.prisma.lMSCourse.findMany({
      where: { schoolId, classId: student.classId, sectionId: student.sectionId },
      include: {
        subject: true,
        lessons: true,
        assignments: {
          include: {
            submissions: {
              where: { studentId: student.id },
            },
          },
        },
      },
    });
  }

  // 2. Submit homework assignment (Student)
  async submitAssignment(schoolId: string, userId: string, dto: {
    assignmentId: string;
    fileUrl: string;
  }) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });
    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    return this.prisma.lMSSubmission.create({
      data: {
        assignmentId: dto.assignmentId,
        studentId: student.id,
        fileUrl: dto.fileUrl,
      },
    });
  }
}
