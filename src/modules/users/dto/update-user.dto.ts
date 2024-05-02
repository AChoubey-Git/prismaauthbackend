import { $Enums } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  IsDefined,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsDefined()
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsDefined()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password?: string;

  @IsDefined()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDefined()
  @IsEnum($Enums.Role)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  role: $Enums.Role;
}
