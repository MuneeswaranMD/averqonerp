import { Module } from '@nestjs/common';
import { LMSService } from './lms.service';
import { LMSController } from './lms.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [LMSService],
  controllers: [LMSController],
})
export class LMSModule {}
