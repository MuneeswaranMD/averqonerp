import { Controller, Post, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { AdmissionService } from './admission.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { SchoolId } from '../common/decorators/school-id.decorator';
import { Role } from '@prisma/client';

@Controller('api/v1/admission')
export class AdmissionController {
  constructor(private readonly admissionService: AdmissionService) {}

  @Post('apply')
  @UseGuards(TenantGuard)
  async apply(
    @SchoolId() schoolId: string,
    @Body() dto: {
      firstName: string;
      lastName: string;
      email: string;
      gradeRequested: string;
      parentContact: string;
    },
  ) {
    return this.admissionService.apply(schoolId, dto);
  }

  @Get('applications')
  @UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  async getApplications(@SchoolId() schoolId: string) {
    return this.admissionService.getApplications(schoolId);
  }

  @Put('applications/:id')
  @UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  async processApplication(
    @SchoolId() schoolId: string,
    @Param('id') id: string,
    @Body() dto: { status: 'APPROVED' | 'REJECTED' },
  ) {
    return this.admissionService.processApplication(schoolId, id, dto.status);
  }
}
