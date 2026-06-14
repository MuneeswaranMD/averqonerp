import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AdmissionModule } from './admission/admission.module';
import { FeesModule } from './fees/fees.module';
import { AccountingModule } from './accounting/accounting.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ExamsModule } from './exams/exams.module';
import { LMSModule } from './lms/lms.module';
import { TransportModule } from './transport/transport.module';
import { AccessControlModule } from './access-control/access-control.module';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { StudentsModule } from './students/students.module';
import { ClassesModule } from './classes/classes.module';
import { SectionsModule } from './sections/sections.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PlatformAdminModule } from './platform-admin/platform-admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/server/.env', '.env'],
    }),
    PrismaModule,
    AuthModule,
    AdmissionModule,
    FeesModule,
    AccountingModule,
    AttendanceModule,
    ExamsModule,
    LMSModule,
    TransportModule,
    AccessControlModule,
    StudentsModule,
    ClassesModule,
    SectionsModule,
    DashboardModule,
    PlatformAdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes('*');
  }
}
