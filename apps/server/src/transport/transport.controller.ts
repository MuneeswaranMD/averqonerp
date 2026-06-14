import { Controller, Get, UseGuards } from '@nestjs/common';
import { TransportService } from './transport.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { SchoolId } from '../common/decorators/school-id.decorator';

@Controller('api/v1/transport')
@UseGuards(JwtAuthGuard, TenantGuard)
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Get('routes')
  async getRoutes(@SchoolId() schoolId: string) {
    return this.transportService.getRoutes(schoolId);
  }
}
