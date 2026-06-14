import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserPayload } from '../common/decorators/user.decorator';

@Injectable()
export class PlatformAdminService {
  constructor(private prisma: PrismaService) {}

  async getAllSchools(user: UserPayload) {
    const where = user.role === Role.SCHOOL_ADMIN ? { id: user.schoolId } : {};
    return this.prisma.school.findMany({
      where,
      include: {
        _count: {
          select: { users: true, students: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getPlatformStats(user: UserPayload) {
    const isSchoolAdmin = user.role === Role.SCHOOL_ADMIN;
    const schoolFilter = isSchoolAdmin ? { schoolId: user.schoolId } : {};

    const totalSchools = isSchoolAdmin ? 1 : await this.prisma.school.count();
    const totalUsers = await this.prisma.user.count({ where: schoolFilter });
    const totalStudents = await this.prisma.student.count({ where: schoolFilter });
    
    return {
      totalSchools,
      totalUsers,
      totalStudents,
      activeSubscriptions: isSchoolAdmin ? 1 : await this.prisma.school.count(),
      revenue: 124500,
    };
  }

  async getAllAdmins(user: UserPayload) {
    const where: any = {
      role: { in: [Role.SUPER_ADMIN, Role.SCHOOL_ADMIN] },
    };

    if (user.role === Role.SCHOOL_ADMIN) {
      where.schoolId = user.schoolId;
    }

    const admins = await this.prisma.user.findMany({
      where,
      include: {
        school: true,
        loginActivities: {
          orderBy: { loginTime: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return admins.map(admin => {
      const lastLogin = admin.loginActivities.length > 0 ? admin.loginActivities[0].loginTime : null;
      return {
        id: admin.id,
        name: `${admin.firstName} ${admin.lastName}`,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phone: admin.phone,
        schoolId: admin.schoolId,
        schoolName: admin.school?.name,
        lastLogin: lastLogin ? lastLogin.toISOString() : 'Never',
        status: admin.isActive ? 'Active' : 'Locked',
        activeModules: 14,
      };
    });
  }

  async provisionAdmin(data: any, user: UserPayload) {
    const tempPassword = data.password || Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(tempPassword, salt);

    const targetSchoolId = user.role === Role.SCHOOL_ADMIN ? user.schoolId : data.schoolId;

    const nameParts = data.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    const newUser = await this.prisma.user.create({
      data: {
        email: data.email,
        phone: data.phone || null,
        firstName,
        lastName,
        passwordHash,
        role: Role.SCHOOL_ADMIN,
        schoolId: targetSchoolId,
      },
      include: { school: true }
    });

    return {
      id: newUser.id,
      name: `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email,
      schoolName: newUser.school.name,
      status: newUser.isActive ? 'Active' : 'Locked',
      tempPassword: data.password ? undefined : tempPassword,
    };
  }

  async updateAdmin(id: string, data: any, user: UserPayload) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) throw new Error('User not found');
    
    if (user.role === Role.SCHOOL_ADMIN && existing.schoolId !== user.schoolId) {
      throw new ForbiddenException('Cannot edit admins outside of your school');
    }

    const nameParts = data.name ? data.name.split(' ') : [];
    const updateData: any = {
      email: data.email,
      phone: data.phone,
      schoolId: user.role === Role.SCHOOL_ADMIN ? user.schoolId : data.schoolId,
    };

    if (nameParts.length > 0) {
      updateData.firstName = nameParts[0];
      updateData.lastName = nameParts.slice(1).join(' ') || '';
    }

    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(data.password, salt);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: { school: true }
    });

    return {
      id: updatedUser.id,
      name: `${updatedUser.firstName} ${updatedUser.lastName}`,
      email: updatedUser.email,
      schoolName: updatedUser.school.name,
      status: updatedUser.isActive ? 'Active' : 'Locked',
    };
  }

  async toggleAdminLock(id: string, user: UserPayload) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) throw new Error('User not found');

    if (user.role === Role.SCHOOL_ADMIN && existing.schoolId !== user.schoolId) {
      throw new ForbiddenException('Cannot manage admins outside of your school');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isActive: !existing.isActive },
      include: { school: true }
    });

    return {
      id: updatedUser.id,
      name: `${updatedUser.firstName} ${updatedUser.lastName}`,
      email: updatedUser.email,
      schoolName: updatedUser.school.name,
      status: updatedUser.isActive ? 'Active' : 'Locked',
    };
  }

  async getPermissions(userId: string, user: UserPayload) {
    const targetUser = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) throw new Error('User not found');
    
    if (user.role === Role.SCHOOL_ADMIN && targetUser.schoolId !== user.schoolId) {
      throw new ForbiddenException('Cannot access permissions for this user');
    }

    const userPerms = await this.prisma.userPermission.findMany({
      where: { userId },
      include: { permission: true }
    });

    const matrix: Record<string, Record<string, boolean>> = {};
    for (const up of userPerms) {
      const parts = up.permission.name.split('_');
      if (parts.length === 2) {
        const [module, action] = parts;
        if (!matrix[module]) matrix[module] = {};
        matrix[module][action] = up.allowed;
      }
    }
    return matrix;
  }

  async updatePermissions(userId: string, permissions: { module: string, action: string, allowed: boolean }[], user: UserPayload) {
    const targetUser = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) throw new Error('User not found');

    if (user.role === Role.SCHOOL_ADMIN && targetUser.schoolId !== user.schoolId) {
      throw new ForbiddenException('Cannot edit permissions for admins outside of your school');
    }

    // This could be optimized, but doing it in a loop for clarity
    for (const p of permissions) {
      const permName = `${p.module}_${p.action}`;
      
      // Upsert Permission
      const permission = await this.prisma.permission.upsert({
        where: { name: permName },
        update: {},
        create: { name: permName }
      });

      // Upsert UserPermission
      await this.prisma.userPermission.upsert({
        where: { userId_permissionId: { userId, permissionId: permission.id } },
        update: { allowed: p.allowed },
        create: {
          userId,
          permissionId: permission.id,
          allowed: p.allowed
        }
      });
    }

    return { success: true };
  }
}
