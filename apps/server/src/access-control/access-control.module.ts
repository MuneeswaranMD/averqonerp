import { Module } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { AccessControlController } from './access-control.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [AccessControlService],
  controllers: [AccessControlController],
  exports: [AccessControlService],
})
export class AccessControlModule {}
