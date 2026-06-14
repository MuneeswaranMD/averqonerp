import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('api/v1/students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL)
  create(@Request() req: any, @Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(req.user.schoolId, createStudentDto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.ACCOUNTANT, Role.RECEPTIONIST)
  findAll(@Request() req: any, @Query('classId') classId?: string) {
    return this.studentsService.findAll(req.user.schoolId, classId);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL, Role.TEACHER, Role.ACCOUNTANT, Role.RECEPTIONIST)
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.studentsService.findOne(id, req.user.schoolId);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL)
  update(@Request() req: any, @Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(id, req.user.schoolId, updateStudentDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.PRINCIPAL)
  remove(@Request() req: any, @Param('id') id: string) {
    return this.studentsService.remove(id, req.user.schoolId);
  }
}
