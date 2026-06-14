import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/v1/sections')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SectionsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll(@Request() req: any, @Query('classId') classId?: string) {
    const where: any = { schoolId: req.user.schoolId };
    if (classId) where.classId = classId;

    return this.prisma.section.findMany({
      where,
      select: { id: true, name: true, classId: true },
      orderBy: { name: 'asc' },
    });
  }
}
