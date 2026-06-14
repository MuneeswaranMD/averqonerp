import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { TenantRequest } from '../middleware/tenant.middleware';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<TenantRequest>();
    if (!request.schoolId) {
      throw new BadRequestException('x-school-id header is required for this operation');
    }
    return true;
  }
}
