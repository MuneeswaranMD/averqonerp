import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransportService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Get bus routes, stops, and driver contacts
  async getRoutes(schoolId: string) {
    return this.prisma.route.findMany({
      where: { schoolId },
      include: {
        bus: true,
        stops: {
          orderBy: { sequence: 'asc' },
        },
      },
    });
  }
}
