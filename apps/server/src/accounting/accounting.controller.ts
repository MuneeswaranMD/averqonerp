import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { SchoolId } from '../common/decorators/school-id.decorator';
import { Role } from '@prisma/client';

@Controller('api/v1/accounting')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.ACCOUNTANT)
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  @Get('summary')
  async getSummary(@SchoolId() schoolId: string) {
    return this.accountingService.getSummary(schoolId);
  }

  @Get('expenses')
  async getExpenses(@SchoolId() schoolId: string) {
    return this.accountingService.getExpenses(schoolId);
  }

  @Post('expenses')
  async createExpense(
    @SchoolId() schoolId: string,
    @Body() dto: {
      title: string;
      amount: number;
      category: string;
      date: Date;
      paymentMethod: string;
      remarks?: string;
    },
  ) {
    return this.accountingService.createExpense(schoolId, dto);
  }
}
