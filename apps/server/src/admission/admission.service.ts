import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplicationStatus, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdmissionService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Submit application (public)
  async apply(schoolId: string, dto: {
    firstName: string;
    lastName: string;
    email: string;
    gradeRequested: string;
    parentContact: string;
  }) {
    // Validate email isn't already used in database
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email is already in use by a registered account');
    }

    return this.prisma.admissionApplication.create({
      data: {
        schoolId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        gradeRequested: dto.gradeRequested,
        parentContact: dto.parentContact,
      },
    });
  }

  // 2. List applications (Admin)
  async getApplications(schoolId: string) {
    return this.prisma.admissionApplication.findMany({
      where: { schoolId },
      orderBy: { appliedAt: 'desc' },
    });
  }

  // 3. Process application (Approve/Reject)
  async processApplication(schoolId: string, applicationId: string, status: 'APPROVED' | 'REJECTED') {
    const app = await this.prisma.admissionApplication.findFirst({
      where: { id: applicationId, schoolId },
    });

    if (!app) {
      throw new NotFoundException('Admission application not found');
    }

    if (app.status !== ApplicationStatus.PENDING) {
      throw new BadRequestException('Application has already been processed');
    }

    if (status === 'REJECTED') {
      return this.prisma.admissionApplication.update({
        where: { id: applicationId },
        data: { status: ApplicationStatus.REJECTED },
      });
    }

    // If APPROVED, we create:
    // A Class / Section if none exist to assign the student to (default "Grade 10" / "A")
    // A User (STUDENT)
    // A Student profile
    // Wrap in a Prisma Transaction
    return this.prisma.$transaction(async (tx) => {
      // Find or create default Class
      let activeClass = await tx.class.findFirst({
        where: { schoolId, name: `Grade ${app.gradeRequested}` },
      });
      if (!activeClass) {
        activeClass = await tx.class.create({
          data: { schoolId, name: `Grade ${app.gradeRequested}` },
        });
      }

      // Find or create default Section
      let activeSection = await tx.section.findFirst({
        where: { schoolId, classId: activeClass.id, name: 'A' },
      });
      if (!activeSection) {
        activeSection = await tx.section.create({
          data: { schoolId, classId: activeClass.id, name: 'A' },
        });
      }

      // Create default User account for the student
      const defaultPassword = 'StudentLogin@123';
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(defaultPassword, salt);

      const user = await tx.user.create({
        data: {
          schoolId,
          email: app.email,
          passwordHash,
          role: Role.STUDENT,
          firstName: app.firstName,
          lastName: app.lastName,
          phone: app.parentContact,
        },
      });

      // Create Student profile
      const admissionNo = `ADM-${Date.now().toString().slice(-6)}`;
      const student = await tx.student.create({
        data: {
          schoolId,
          userId: user.id,
          admissionNo,
          classId: activeClass.id,
          sectionId: activeSection.id,
        },
      });

      // Update Application status
      await tx.admissionApplication.update({
        where: { id: applicationId },
        data: { status: ApplicationStatus.APPROVED },
      });

      return {
        student,
        user: {
          email: user.email,
          defaultPassword,
        },
      };
    });
  }
}
