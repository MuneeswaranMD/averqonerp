import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { SchoolId } from '../common/decorators/school-id.decorator';
import { CurrentUser, UserPayload } from '../common/decorators/user.decorator';
import { Role } from '@prisma/client';

@Controller('api/v1/exams')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard, TenantGuard)
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.STUDENT, Role.PARENT)
  @Permissions('exams.view')
  async getExams(@SchoolId() schoolId: string) {
    return this.examsService.getExams(schoolId);
  }

  @Get('my-results')
  @Roles(Role.STUDENT, Role.PARENT)
  @Permissions('exams.view')
  async getMyResults(
    @SchoolId() schoolId: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.examsService.getStudentResults(schoolId, user.userId);
  }

  @Post('marks')
  @Roles(Role.SUPER_ADMIN, Role.TEACHER)
  @Permissions('exams.grade')
  async enterMarks(
    @SchoolId() schoolId: string,
    @Body() dto: {
      examId: string;
      subjectId: string;
      marks: { studentId: string; marksObtained: number; maxMarks: number }[];
    },
  ) {
    return this.examsService.enterMarks(schoolId, dto);
  }

  @Get('results/pending')
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL)
  @Permissions('exams.approve')
  async getPendingResults(@SchoolId() schoolId: string) {
    return this.examsService.getPendingResults(schoolId);
  }

  @Post('results/approve')
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL)
  @Permissions('exams.approve')
  async approveResults(
    @SchoolId() schoolId: string,
    @Body() dto: { examId: string; subjectId: string },
  ) {
    return this.examsService.approveResults(schoolId, dto);
  }
}
