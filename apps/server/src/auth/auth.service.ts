import { Injectable, ConflictException, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RegisterSchoolDto } from './dto/register-school.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Hash password helper
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  // Generate tokens payload
  private async generateTokens(userId: string, email: string | null, role: Role, schoolId: string) {
    const payload = { userId, email, role, schoolId };
    
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: (this.configService.get<string>('JWT_EXPIRES_IN') || '15m') as any,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d') as any,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: userId,
        email,
        role,
        schoolId,
      },
    };
  }

  // 1. Register School (Tenant + Super Admin user)
  async registerSchool(dto: RegisterSchoolDto) {
    // Check if domain is already registered
    const existingSchool = await this.prisma.school.findUnique({
      where: { domain: dto.domain },
    });
    if (existingSchool) {
      throw new ConflictException('School domain is already registered');
    }

    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.adminEmail },
    });
    if (existingUser) {
      throw new ConflictException('Admin email is already in use');
    }

    const passwordHash = await this.hashPassword(dto.adminPassword);

    // Run in Prisma transaction to ensure both school and super admin are created
    return this.prisma.$transaction(async (tx) => {
      const school = await tx.school.create({
        data: {
          name: dto.schoolName,
          domain: dto.domain,
        },
      });

      // Initialize default active academic year (e.g. current year)
      await tx.academicYear.create({
        data: {
          schoolId: school.id,
          year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
          isActive: true,
        },
      });

      const user = await tx.user.create({
        data: {
          schoolId: school.id,
          email: dto.adminEmail,
          passwordHash,
          role: Role.SUPER_ADMIN,
          firstName: dto.adminFirstName,
          lastName: dto.adminLastName,
        },
      });

      return this.generateTokens(user.id, user.email, user.role, user.schoolId);
    });
  }

  // 2. Register User under specific School context
  async registerUser(schoolId: string, dto: RegisterUserDto) {
    // Check if email exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await this.hashPassword(dto.password);

    return this.prisma.$transaction(async (tx) => {
      // Create core user
      const user = await tx.user.create({
        data: {
          schoolId,
          email: dto.email,
          passwordHash,
          role: dto.role,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
        },
      });

      // Role-specific creations
      if (dto.role === Role.STUDENT) {
        if (!dto.admissionNo || !dto.classId || !dto.sectionId) {
          throw new BadRequestException('admissionNo, classId, and sectionId are required for Student profiles');
        }
        await tx.student.create({
          data: {
            schoolId,
            userId: user.id,
            admissionNo: dto.admissionNo,
            rollNo: dto.rollNo,
            classId: dto.classId,
            sectionId: dto.sectionId,
            parentId: dto.parentId,
          },
        });
      } else if (dto.role === Role.PARENT) {
        if (!dto.primaryContact) {
          throw new BadRequestException('primaryContact is required for Parent profiles');
        }
        await tx.parent.create({
          data: {
            schoolId,
            userId: user.id,
            primaryContact: dto.primaryContact,
            occupation: dto.occupation,
          },
        });
      } else if (dto.role === Role.TEACHER) {
        if (!dto.designation) {
          throw new BadRequestException('designation is required for Teacher profiles');
        }
        await tx.teacher.create({
          data: {
            schoolId,
            userId: user.id,
            designation: dto.designation,
          },
        });
      }

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    });
  }

  // 3. User Login
  async login(dto: LoginDto, ip?: string, userAgent?: string) {
    // Lookup user by email, phone, user.id, or studentProfile.admissionNo
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.identifier },
          { phone: dto.identifier },
          { id: dto.identifier },
          { studentProfile: { admissionNo: dto.identifier } },
        ],
      },
      include: {
        studentProfile: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid identifier or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid identifier or password');
    }

    // Record login activity diagnostic
    await this.prisma.loginActivity.create({
      data: {
        schoolId: user.schoolId,
        userId: user.id,
        ipAddress: ip || null,
        device: userAgent || null,
        location: 'Unknown',
      },
    });

    return this.generateTokens(user.id, user.email, user.role, user.schoolId);
  }

  // 4. Token Refresh
  async refreshToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not active');
      }

      return this.generateTokens(user.id, user.email, user.role, user.schoolId);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
