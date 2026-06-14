import { Module } from '@nestjs/common';
import { SectionsController } from './sections.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [SectionsController],
})
export class SectionsModule {}
