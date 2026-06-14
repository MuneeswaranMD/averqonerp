import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ClassesController],
})
export class ClassesModule {}
