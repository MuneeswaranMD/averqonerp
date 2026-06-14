import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { UserPayload } from '../decorators/user.decorator';
import { Role } from '@prisma/client';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserPayload;

    if (!user) {
      throw new ForbiddenException('User session not found');
    }

    // SUPER_ADMIN and SCHOOL_ADMIN bypass granular permission checks
    if (user.role === Role.SUPER_ADMIN || user.role === Role.SCHOOL_ADMIN) {
      return true;
    }

    // Fetch user and their permissions/custom role info
    const userRecord = await this.prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        customRoleId: true,
        userPermissions: {
          select: {
            allowed: true,
            permission: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!userRecord) {
      throw new ForbiddenException('User record not found');
    }

    // Fetch custom role permissions if the user has a custom role
    let customRolePermissionNames: string[] = [];
    if (userRecord.customRoleId) {
      const rolePermissions = await this.prisma.rolePermission.findMany({
        where: { roleId: userRecord.customRoleId },
        select: {
          permission: {
            select: {
              name: true,
            },
          },
        },
      });
      customRolePermissionNames = rolePermissions.map((rp) => rp.permission.name);
    }

    // Default permissions mapping for users without a custom role
    const defaultPermissions: Record<string, string[]> = {
      [Role.TEACHER]: ['attendance.view', 'attendance.mark', 'exams.view', 'exams.grade', 'lms.view', 'lms.manage'],
      [Role.ACCOUNTANT]: ['fees.view', 'fees.collect', 'accounting.view', 'accounting.manage'],
      [Role.STUDENT]: ['attendance.view', 'exams.view', 'lms.view', 'transport.view'],
      [Role.PARENT]: ['attendance.view', 'fees.view', 'exams.view', 'transport.view'],
    };

    const userDefaults = defaultPermissions[user.role] || [];

    // Verify all required permissions are met
    for (const requiredPerm of requiredPermissions) {
      // 1. Check user overrides first
      const override = userRecord.userPermissions.find(
        (up) => up.permission.name === requiredPerm,
      );

      if (override !== undefined) {
        if (!override.allowed) {
          // Explicitly blocked by override
          return false;
        }
        // Explicitly allowed by override
        continue;
      }

      // 2. If no override, check custom role (if user has one)
      if (userRecord.customRoleId) {
        if (!customRolePermissionNames.includes(requiredPerm)) {
          return false;
        }
        continue;
      }

      // 3. Fallback to default role permissions
      if (!userDefaults.includes(requiredPerm)) {
        return false;
      }
    }

    return true;
  }
}
