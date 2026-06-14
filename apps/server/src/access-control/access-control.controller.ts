import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { SchoolId } from '../common/decorators/school-id.decorator';
import { CurrentUser, UserPayload } from '../common/decorators/user.decorator';
import { Role } from '@prisma/client';

@Controller('api/v1/access-control')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL)
export class AccessControlController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @Get('roles')
  async getRoles(@SchoolId() schoolId: string) {
    return this.accessControlService.getRoles(schoolId);
  }

  @Post('roles')
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  async createRole(
    @SchoolId() schoolId: string,
    @CurrentUser() user: UserPayload,
    @Body() dto: { name: string; permissionNames: string[] },
  ) {
    return this.accessControlService.createRole(schoolId, user.userId, dto);
  }

  @Put('roles/:id')
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  async updateRole(
    @SchoolId() schoolId: string,
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body() dto: { name: string; permissionNames: string[] },
  ) {
    return this.accessControlService.updateRole(schoolId, user.userId, id, dto);
  }

  @Delete('roles/:id')
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  async deleteRole(
    @SchoolId() schoolId: string,
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    return this.accessControlService.deleteRole(schoolId, user.userId, id);
  }

  @Get('permissions')
  async getPermissions() {
    return this.accessControlService.getPermissions();
  }

  @Get('users')
  async getUsers(@SchoolId() schoolId: string) {
    return this.accessControlService.getUsers(schoolId);
  }

  @Put('users/:id/role')
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  async updateUserRole(
    @SchoolId() schoolId: string,
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body() dto: { customRoleId: string | null },
  ) {
    return this.accessControlService.updateUserRole(schoolId, user.userId, id, dto);
  }

  @Get('users/:id/overrides')
  async getUserOverrides(
    @SchoolId() schoolId: string,
    @Param('id') id: string,
  ) {
    return this.accessControlService.getUserOverrides(schoolId, id);
  }

  @Post('users/:id/overrides')
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  async updateUserOverrides(
    @SchoolId() schoolId: string,
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body() dto: { overrides: { permissionName: string; allowed: boolean | null }[] },
  ) {
    return this.accessControlService.updateUserOverrides(schoolId, user.userId, id, dto);
  }

  @Get('audit-logs')
  async getAuditLogs(@SchoolId() schoolId: string) {
    return this.accessControlService.getAuditLogs(schoolId);
  }

  @Get('login-activities')
  async getLoginActivities(@SchoolId() schoolId: string) {
    return this.accessControlService.getLoginActivities(schoolId);
  }
}
