import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { SchoolId } from '../common/decorators/school-id.decorator';
import { CurrentUser, UserPayload } from '../common/decorators/user.decorator';
import { Role, AttendanceStatus } from '@prisma/client';

@Controller('api/v1/attendance')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('students')
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.TEACHER)
  async getStudents(
    @SchoolId() schoolId: string,
    @Query('classId') classId: string,
    @Query('sectionId') sectionId: string,
  ) {
    return this.attendanceService.getStudentChecklist(schoolId, classId, sectionId);
  }

  @Post('mark')
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.TEACHER)
  async markAttendance(
    @SchoolId() schoolId: string,
    @Body() dto: {
      date: Date;
      records: { studentId: string; status: AttendanceStatus; remarks?: string }[];
    },
  ) {
    return this.attendanceService.markAttendance(schoolId, dto);
  }

  @Get('my-logs')
  @Roles(Role.STUDENT, Role.PARENT)
  async getMyLogs(
    @SchoolId() schoolId: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.attendanceService.getStudentLogs(schoolId, user.userId);
  }
}
