import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { LMSService } from './lms.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { SchoolId } from '../common/decorators/school-id.decorator';
import { CurrentUser, UserPayload } from '../common/decorators/user.decorator';
import { Role } from '@prisma/client';

@Controller('api/v1/lms')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
export class LMSController {
  constructor(private readonly lmsService: LMSService) {}

  @Get('courses')
  @Roles(Role.STUDENT, Role.PARENT, Role.SCHOOL_ADMIN)
  async getCourses(
    @SchoolId() schoolId: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.lmsService.getStudentCourses(schoolId, user.userId);
  }

  @Post('submissions')
  @Roles(Role.STUDENT, Role.SCHOOL_ADMIN)
  async submitAssignment(
    @SchoolId() schoolId: string,
    @CurrentUser() user: UserPayload,
    @Body() dto: {
      assignmentId: string;
      fileUrl: string;
    },
  ) {
    return this.lmsService.submitAssignment(schoolId, user.userId, dto);
  }
}
