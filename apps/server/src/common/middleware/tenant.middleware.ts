import { Injectable, NestMiddleware, BadRequestException, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

// Extend Express Request interface to include schoolId
export interface TenantRequest extends Request {
  schoolId?: string;
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: TenantRequest, res: Response, next: NextFunction) {
    const schoolId = req.headers['x-school-id'] as string;

    // Certain routes like register-school do not require x-school-id, they create the tenant.
    // So we don't throw an error here, but we bind the schoolId if present.
    // However, for routes requiring school context, our tenant guard will enforce it.
    if (schoolId) {
      // Validate that school exists
      const school = await this.prisma.school.findUnique({
        where: { id: schoolId },
      });
      if (!school) {
        throw new NotFoundException('School tenant not found');
      }
      req.schoolId = schoolId;
    }

    next();
  }
}
