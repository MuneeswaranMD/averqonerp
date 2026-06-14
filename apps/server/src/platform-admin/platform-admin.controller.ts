import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { PlatformAdminService } from './platform-admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser, UserPayload } from '../common/decorators/user.decorator';

@Controller('api/v1/platform-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
export class PlatformAdminController {
  constructor(private readonly platformAdminService: PlatformAdminService) {}

  @Get('schools')
  getSchools(@CurrentUser() user: UserPayload) {
    return this.platformAdminService.getAllSchools(user);
  }

  @Get('stats')
  getStats(@CurrentUser() user: UserPayload) {
    return this.platformAdminService.getPlatformStats(user);
  }

  @Get('admins')
  getAdmins(@CurrentUser() user: UserPayload) {
    return this.platformAdminService.getAllAdmins(user);
  }

  @Post('admins')
  provisionAdmin(@Body() data: any, @CurrentUser() user: UserPayload) {
    return this.platformAdminService.provisionAdmin(data, user);
  }

  @Put('admins/:id')
  updateAdmin(@Param('id') id: string, @Body() data: any, @CurrentUser() user: UserPayload) {
    return this.platformAdminService.updateAdmin(id, data, user);
  }

  @Post('admins/:id/lock')
  toggleAdminLock(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.platformAdminService.toggleAdminLock(id, user);
  }

  @Get('admins/:id/permissions')
  getPermissions(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.platformAdminService.getPermissions(id, user);
  }

  @Put('admins/:id/permissions')
  updatePermissions(@Param('id') id: string, @Body() data: any[], @CurrentUser() user: UserPayload) {
    return this.platformAdminService.updatePermissions(id, data, user);
  }
}
