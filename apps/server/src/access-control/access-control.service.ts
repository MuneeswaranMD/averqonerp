import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const SYSTEM_PERMISSIONS = [
  { name: 'admission.view', description: 'View online admission applications' },
  { name: 'admission.manage', description: 'Approve or reject admission applications' },
  { name: 'fees.view', description: 'View fee details and invoices' },
  { name: 'fees.collect', description: 'Collect and record fee payments' },
  { name: 'fees.manage', description: 'Create fee categories and invoices' },
  { name: 'attendance.view', description: 'View attendance records and reports' },
  { name: 'attendance.mark', description: 'Mark student attendance' },
  { name: 'attendance.manage', description: 'Configure attendance settings and rules' },
  { name: 'exams.view', description: 'View exam schedules and results' },
  { name: 'exams.grade', description: 'Grade exam submissions and enter marks' },
  { name: 'exams.approve', description: 'Approve and publish exam marksheet results' },
  { name: 'exams.manage', description: 'Create and configure exams and grades' },
  { name: 'lms.view', description: 'Access LMS courses and assignments' },
  { name: 'lms.manage', description: 'Manage LMS courses, lessons, and assignments' },
  { name: 'accounting.view', description: 'View school expenses and ledger' },
  { name: 'accounting.manage', description: 'Record school expenses and financial settings' },
  { name: 'transport.view', description: 'View bus routes and tracking information' },
  { name: 'transport.manage', description: 'Manage vehicles, drivers, and routes' },
  { name: 'classes.view', description: 'View allocated classes and timetable' },
  { name: 'classes.manage', description: 'Manage classes and subjects' },
  { name: 'students.view', description: 'View student profiles and directory' },
  { name: 'students.manage', description: 'Manage student details' },
  { name: 'assignments.view', description: 'View and access assignments' },
  { name: 'assignments.manage', description: 'Create and grade assignments' },
  { name: 'communication.view', description: 'View announcements and messages' },
  { name: 'communication.manage', description: 'Send messages and announcements' },
  { name: 'leave.apply', description: 'Apply for leaves' },
  { name: 'leave.manage', description: 'Approve or reject staff leaves' },
];

@Injectable()
export class AccessControlService {
  constructor(private readonly prisma: PrismaService) {}

  // Automatically seed/ensure permissions catalog exists
  async ensurePermissionsCatalog() {
    const existingCount = await this.prisma.permission.count();
    if (existingCount < SYSTEM_PERMISSIONS.length) {
      for (const perm of SYSTEM_PERMISSIONS) {
        await this.prisma.permission.upsert({
          where: { name: perm.name },
          update: { description: perm.description },
          create: { name: perm.name, description: perm.description },
        });
      }
    }
  }

  // Helper to log administrative actions
  async logAction(schoolId: string, userId: string, action: string, details?: string) {
    return this.prisma.auditLog.create({
      data: {
        schoolId,
        userId,
        action,
        details,
      },
    });
  }

  // 1. Roles CRUD
  async getRoles(schoolId: string) {
    return this.prisma.customRole.findMany({
      where: { schoolId },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: { users: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async createRole(schoolId: string, userId: string, dto: { name: string; permissionNames: string[] }) {
    await this.ensurePermissionsCatalog();

    // Check if role name already exists in school
    const existing = await this.prisma.customRole.findFirst({
      where: { schoolId, name: dto.name },
    });
    if (existing) {
      throw new BadRequestException(`Role with name "${dto.name}" already exists`);
    }

    // Resolve permission IDs from names
    const permissions = await this.prisma.permission.findMany({
      where: { name: { in: dto.permissionNames } },
    });

    const newRole = await this.prisma.$transaction(async (tx) => {
      const role = await tx.customRole.create({
        data: {
          schoolId,
          name: dto.name,
        },
      });

      if (permissions.length > 0) {
        await tx.rolePermission.createMany({
          data: permissions.map((p) => ({
            roleId: role.id,
            permissionId: p.id,
          })),
        });
      }

      return role;
    });

    await this.logAction(
      schoolId,
      userId,
      `Created Custom Role: ${dto.name}`,
      `Permissions assigned: ${dto.permissionNames.join(', ')}`,
    );

    return newRole;
  }

  async updateRole(
    schoolId: string,
    userId: string,
    id: string,
    dto: { name: string; permissionNames: string[] },
  ) {
    const role = await this.prisma.customRole.findFirst({
      where: { id, schoolId },
    });

    if (!role) {
      throw new NotFoundException('Custom role not found');
    }

    await this.ensurePermissionsCatalog();

    // Resolve permission IDs from names
    const permissions = await this.prisma.permission.findMany({
      where: { name: { in: dto.permissionNames } },
    });

    await this.prisma.$transaction(async (tx) => {
      // Update role name
      await tx.customRole.update({
        where: { id },
        data: { name: dto.name },
      });

      // Clear existing permissions
      await tx.rolePermission.deleteMany({
        where: { roleId: id },
      });

      // Insert new permissions
      if (permissions.length > 0) {
        await tx.rolePermission.createMany({
          data: permissions.map((p) => ({
            roleId: id,
            permissionId: p.id,
          })),
        });
      }
    });

    await this.logAction(
      schoolId,
      userId,
      `Updated Custom Role: ${dto.name}`,
      `New permissions assigned: ${dto.permissionNames.join(', ')}`,
    );

    return { success: true };
  }

  async deleteRole(schoolId: string, userId: string, id: string) {
    const role = await this.prisma.customRole.findFirst({
      where: { id, schoolId },
    });

    if (!role) {
      throw new NotFoundException('Custom role not found');
    }

    // Unassign this custom role from all users
    await this.prisma.user.updateMany({
      where: { schoolId, customRoleId: id },
      data: { customRoleId: null },
    });

    // Delete role permission mappings
    await this.prisma.rolePermission.deleteMany({
      where: { roleId: id },
    });

    // Delete the role
    await this.prisma.customRole.delete({
      where: { id },
    });

    await this.logAction(
      schoolId,
      userId,
      `Deleted Custom Role: ${role.name}`,
      `Role ID: ${id}`,
    );

    return { success: true };
  }

  // 2. Permissions catalog
  async getPermissions() {
    await this.ensurePermissionsCatalog();
    return this.prisma.permission.findMany({
      orderBy: { name: 'asc' },
    });
  }

  // 3. User & Overrides management
  async getUsers(schoolId: string) {
    return this.prisma.user.findMany({
      where: { schoolId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        customRole: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            userPermissions: true,
          },
        },
      },
      orderBy: { email: 'asc' },
    });
  }

  async updateUserRole(schoolId: string, adminId: string, targetUserId: string, dto: { customRoleId: string | null }) {
    const targetUser = await this.prisma.user.findFirst({
      where: { id: targetUserId, schoolId },
    });

    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    // If setting custom role, verify it exists and belongs to the same school
    if (dto.customRoleId) {
      const roleExists = await this.prisma.customRole.findFirst({
        where: { id: dto.customRoleId, schoolId },
      });
      if (!roleExists) {
        throw new BadRequestException('Requested custom role does not exist in this school');
      }
    }

    await this.prisma.user.update({
      where: { id: targetUserId },
      data: { customRoleId: dto.customRoleId },
    });

    await this.logAction(
      schoolId,
      adminId,
      `Updated user custom role override for ${targetUser.email}`,
      dto.customRoleId ? `Assigned custom role ID: ${dto.customRoleId}` : 'Cleared custom role override',
    );

    return { success: true };
  }

  async getUserOverrides(schoolId: string, targetUserId: string) {
    const targetUser = await this.prisma.user.findFirst({
      where: { id: targetUserId, schoolId },
    });

    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    await this.ensurePermissionsCatalog();
    const allPermissions = await this.prisma.permission.findMany({
      orderBy: { name: 'asc' },
    });

    const overrides = await this.prisma.userPermission.findMany({
      where: { userId: targetUserId },
      include: { permission: true },
    });

    return allPermissions.map((p) => {
      const ov = overrides.find((o) => o.permissionId === p.id);
      return {
        permissionId: p.id,
        name: p.name,
        description: p.description,
        overrideState: ov ? ov.allowed : null, // true, false, or null
      };
    });
  }

  async updateUserOverrides(
    schoolId: string,
    adminId: string,
    targetUserId: string,
    dto: { overrides: { permissionName: string; allowed: boolean | null }[] },
  ) {
    const targetUser = await this.prisma.user.findFirst({
      where: { id: targetUserId, schoolId },
    });

    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    await this.ensurePermissionsCatalog();

    for (const ov of dto.overrides) {
      const permission = await this.prisma.permission.findUnique({
        where: { name: ov.permissionName },
      });

      if (!permission) continue;

      if (ov.allowed === null) {
        // Delete override if exists
        await this.prisma.userPermission.deleteMany({
          where: {
            userId: targetUserId,
            permissionId: permission.id,
          },
        });
      } else {
        // Upsert override
        await this.prisma.userPermission.upsert({
          where: {
            userId_permissionId: {
              userId: targetUserId,
              permissionId: permission.id,
            },
          },
          update: { allowed: ov.allowed },
          create: {
            userId: targetUserId,
            permissionId: permission.id,
            allowed: ov.allowed,
          },
        });
      }
    }

    await this.logAction(
      schoolId,
      adminId,
      `Modified permission overrides for user ${targetUser.email}`,
      JSON.stringify(dto.overrides),
    );

    return { success: true };
  }

  // 4. Audit & Diagnostic History
  async getAuditLogs(schoolId: string) {
    return this.prisma.auditLog.findMany({
      where: { schoolId },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100, // retrieve latest 100 audits
    });
  }

  async getLoginActivities(schoolId: string) {
    return this.prisma.loginActivity.findMany({
      where: { schoolId },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { loginTime: 'desc' },
      take: 100, // retrieve latest 100 logins
    });
  }
}
