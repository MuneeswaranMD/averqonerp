import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/v1/classes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.prisma.class.findMany({
      where: { schoolId: req.user.schoolId },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
  }
}
