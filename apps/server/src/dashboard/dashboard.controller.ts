import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('api/v1/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboard(@Request() req: any) {
    // req.user has { id, email, role, schoolId } from JwtAuthGuard
    return this.dashboardService.getDashboardData(
      req.user.id,
      req.user.role,
      req.user.schoolId
    );
  }
}
