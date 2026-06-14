import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterSchoolDto {
  @IsString()
  @IsNotEmpty()
  schoolName: string;

  @IsString()
  @IsNotEmpty()
  domain: string; // e.g. "greenschool.averqonerp.com"

  @IsEmail()
  adminEmail: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  adminPassword: string;

  @IsString()
  @IsNotEmpty()
  adminFirstName: string;

  @IsString()
  @IsNotEmpty()
  adminLastName: string;
}
