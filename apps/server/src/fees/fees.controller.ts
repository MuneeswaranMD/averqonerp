import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { FeesService } from './fees.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { SchoolId } from '../common/decorators/school-id.decorator';
import * as userDecorator from '../common/decorators/user.decorator';
import { Role } from '@prisma/client';

@Controller('api/v1/fees')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
export class FeesController {
  constructor(private readonly feesService: FeesService) { }

  @Get('my-invoices')
  @Roles(Role.STUDENT, Role.PARENT)
  async getMyInvoices(
    @SchoolId() schoolId: string,
    @userDecorator.CurrentUser() user: userDecorator.UserPayload,
  ) {
    return this.feesService.getStudentInvoices(schoolId, user.userId);
  }

  @Get('invoices')
  @Roles(Role.SCHOOL_ADMIN, Role.ACCOUNTANT, Role.SUPER_ADMIN, Role.TEACHER)
  async getInvoices(@SchoolId() schoolId: string) {
    return this.feesService.getInvoices(schoolId);
  }

  @Post('invoices')
  @Roles(Role.SCHOOL_ADMIN, Role.ACCOUNTANT, Role.SUPER_ADMIN)
  async createInvoice(
    @SchoolId() schoolId: string,
    @Body() dto: {
      studentId: string;
      categoryName: string;
      amount: number;
      dueDate: Date;
    },
  ) {
    return this.feesService.createInvoice(schoolId, dto);
  }

  @Post('pay/:id')
  @Roles(Role.SCHOOL_ADMIN, Role.ACCOUNTANT, Role.SUPER_ADMIN, Role.STUDENT, Role.PARENT)
  async payInvoice(
    @SchoolId() schoolId: string,
    @Param('id') id: string,
    @Body() dto: { paymentMethod: string },
  ) {
    return this.feesService.payInvoice(schoolId, id, dto);
  }
}
