import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExamResultStatus } from '@prisma/client';

@Injectable()
export class ExamsService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Get terms list
  async getExams(schoolId: string) {
    return this.prisma.exam.findMany({
      where: { schoolId },
      orderBy: { startDate: 'desc' },
    });
  }

  // 2. Get student marks / report (aggregates GPA)
  async getStudentResults(schoolId: string, userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: { class: true },
    });
    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    const results = await this.prisma.examResult.findMany({
      where: {
        schoolId,
        studentId: student.id,
        status: ExamResultStatus.APPROVED,
      },
      include: { exam: true, subject: true },
    });

    // Calculate aggregate score
    let totalMarksObtained = 0;
    let totalMaxMarks = 0;
    results.forEach(r => {
      totalMarksObtained += Number(r.marksObtained);
      totalMaxMarks += Number(r.maxMarks);
    });

    const percentage = totalMaxMarks > 0 ? (totalMarksObtained / totalMaxMarks) * 100 : 0;
    
    // Determine GPA & Grade
    let gpa = 0;
    let grade = 'F';
    if (percentage >= 90) { gpa = 4.0; grade = 'A+'; }
    else if (percentage >= 80) { gpa = 3.5; grade = 'A'; }
    else if (percentage >= 70) { gpa = 3.0; grade = 'B'; }
    else if (percentage >= 60) { gpa = 2.5; grade = 'C'; }
    else if (percentage >= 50) { gpa = 2.0; grade = 'D'; }

    return {
      student: {
        admissionNo: student.admissionNo,
        rollNo: student.rollNo,
        className: student.class.name,
      },
      results,
      gpa,
      grade,
      percentage,
      totalMarksObtained,
      totalMaxMarks,
    };
  }

  // 3. Enter marks (bulk by subject/class)
  async enterMarks(schoolId: string, dto: {
    examId: string;
    subjectId: string;
    marks: { studentId: string; marksObtained: number; maxMarks: number }[];
  }) {
    const operations = dto.marks.map(m => {
      // Basic grade calculation
      const pct = (m.marksObtained / m.maxMarks) * 100;
      let grade = 'F';
      if (pct >= 90) grade = 'A+';
      else if (pct >= 80) grade = 'A';
      else if (pct >= 70) grade = 'B';
      else if (pct >= 60) grade = 'C';
      else if (pct >= 50) grade = 'D';

      return this.prisma.examResult.create({
        data: {
          schoolId,
          studentId: m.studentId,
          examId: dto.examId,
          subjectId: dto.subjectId,
          marksObtained: m.marksObtained,
          maxMarks: m.maxMarks,
          grade,
          status: ExamResultStatus.PENDING_APPROVAL,
        },
      });
    });

    return this.prisma.$transaction(operations);
  }

  // 4. Approve marksheet results
  async approveResults(schoolId: string, dto: { examId: string; subjectId: string }) {
    return this.prisma.examResult.updateMany({
      where: {
        schoolId,
        examId: dto.examId,
        subjectId: dto.subjectId,
        status: ExamResultStatus.PENDING_APPROVAL,
      },
      data: {
        status: ExamResultStatus.APPROVED,
      },
    });
  }

  // 5. Get pending approval results
  async getPendingResults(schoolId: string) {
    return this.prisma.examResult.findMany({
      where: { schoolId, status: ExamResultStatus.PENDING_APPROVAL },
      include: {
        exam: true,
        subject: true,
        student: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { examId: 'asc' },
    });
  }
}
