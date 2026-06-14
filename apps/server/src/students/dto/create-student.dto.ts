import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  classId: string;

  @IsString()
  @IsNotEmpty()
  sectionId: string;

  @IsString()
  @IsOptional()
  rollNo?: string;

  @IsString()
  @IsNotEmpty()
  parentContact: string;

  @IsString()
  @IsNotEmpty()
  parentName: string;
}
