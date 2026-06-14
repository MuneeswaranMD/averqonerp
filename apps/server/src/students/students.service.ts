import { Injectable, ConflictException, NotFoundException, BadRequestException, InternalServerErrorException, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(schoolId: string, dto: CreateStudentDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Student@123', salt);

    try {
      return await this.prisma.$transaction(async (tx) => {
        let parent: any = null;
        if (dto.parentContact) {
          parent = await tx.parent.findFirst({
            where: { schoolId, primaryContact: dto.parentContact }
          });

          if (!parent) {
            const parentEmail = `parent_${dto.parentContact.replace(/[^0-9]/g, '')}@${schoolId}.local`;
            const existingParentUser = await tx.user.findUnique({ where: { email: parentEmail } });
            const parentUser = existingParentUser || await tx.user.create({
              data: {
                schoolId,
                email: parentEmail,
                passwordHash,
                role: Role.PARENT,
                firstName: dto.parentName?.split(' ')[0] || 'Parent',
                lastName: dto.parentName?.split(' ').slice(1).join(' ') || '',
                phone: dto.parentContact,
              }
            });
            parent = await tx.parent.create({
              data: {
                schoolId,
                userId: parentUser.id,
                primaryContact: dto.parentContact,
                occupation: 'N/A'
              }
            });
          }
        }

        const user = await tx.user.create({
          data: {
            schoolId,
            email: dto.email,
            passwordHash,
            role: Role.STUDENT,
            firstName: dto.firstName,
            lastName: dto.lastName,
            phone: '',
          },
        });

        // Collision-proof admissionNo: retry up to 5 times with timestamp + random suffix
        let admissionNo: string | null = null;
        for (let attempt = 0; attempt < 5; attempt++) {
          const candidate = `STU${new Date().getFullYear()}${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
          const existing = await tx.student.findUnique({ where: { admissionNo: candidate } });
          if (!existing) { admissionNo = candidate; break; }
        }
        if (!admissionNo) throw new InternalServerErrorException('Could not generate a unique admission number. Please try again.');

        let student: any;
        try {
          student = await tx.student.create({
            data: {
              schoolId,
              userId: user.id,
              admissionNo,
              rollNo: dto.rollNo,
              classId: dto.classId,
              sectionId: dto.sectionId,
              parentId: parent?.id,
            },
            include: {
              user: true,
              class: true,
              section: true,
              parent: { include: { user: true } }
            }
          });
        } catch (e: any) {
          if (e?.code === 'P2003' || e?.code === 'P2025') {
            throw new BadRequestException('Invalid classId or sectionId — the selected class or section does not exist.');
          }
          throw e;
        }

        if (parent) {
          const existingLink = await tx.parentStudent.findUnique({
            where: { parentId_studentId: { parentId: parent.id, studentId: student.id } }
          });
          if (!existingLink) {
            await tx.parentStudent.create({ data: { schoolId, parentId: parent.id, studentId: student.id } });
          }
        }

        return student;
      });
    } catch (err: any) {
      // Unexpected errors – log and rethrow as 500
      console.error('Error creating student:', err);
      // If it's already an HttpException (e.g., BadRequestException), rethrow it
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException(err?.message || 'Failed to create student');
    }
  }

  async findAll(schoolId: string, classId?: string) {
    const where: any = { schoolId };
    if (classId) where.classId = classId;

    return this.prisma.student.findMany({
      where,
      include: {
        user: true,
        class: true,
        section: true,
        parent: { include: { user: true } }
      },
      orderBy: { user: { firstName: 'asc' } }
    });
  }

  async findOne(id: string, schoolId: string) {
    const student = await this.prisma.student.findFirst({
      where: { id, schoolId },
      include: {
        user: true,
        class: true,
        section: true,
        parent: { include: { user: true } }
      }
    });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async update(id: string, schoolId: string, dto: UpdateStudentDto) {
    return this.prisma.$transaction(async (tx) => {
      const student = await tx.student.findFirst({
        where: { id, schoolId },
        include: { user: true }
      });
      if (!student) throw new NotFoundException('Student not found');

      if (dto.firstName || dto.lastName || dto.email || typeof dto.isActive === 'boolean') {
        await tx.user.update({
          where: { id: student.userId },
          data: {
            firstName: dto.firstName !== undefined ? dto.firstName : undefined,
            lastName: dto.lastName !== undefined ? dto.lastName : undefined,
            email: dto.email !== undefined ? dto.email : undefined,
            isActive: dto.isActive !== undefined ? dto.isActive : undefined
          }
        });
      }

      return tx.student.update({
        where: { id },
        data: {
          classId: dto.classId !== undefined ? dto.classId : undefined,
          sectionId: dto.sectionId !== undefined ? dto.sectionId : undefined,
          rollNo: dto.rollNo !== undefined ? dto.rollNo : undefined,
        },
        include: { user: true, class: true, section: true }
      });
    });
  }

  async remove(id: string, schoolId: string) {
    return this.prisma.$transaction(async (tx) => {
      const student = await tx.student.findFirst({ where: { id, schoolId } });
      if (!student) throw new NotFoundException('Student not found');

      await tx.user.update({
        where: { id: student.userId },
        data: { isActive: false }
      });

      return { message: 'Student account disabled successfully' };
    });
  }
}
