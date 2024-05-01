import { $Enums } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsBoolean()
  @IsOptional()
  isVerified: boolean;
  
  @IsOptional()
  @IsString()
  @IsEnum($Enums.Role)
  role: $Enums.Role;
}
