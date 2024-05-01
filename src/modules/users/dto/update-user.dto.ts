import { PartialType } from '@nestjs/mapped-types';
import { $Enums } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  name: string;

  @IsBoolean()
  @IsOptional()
  isVerified: boolean;

  @IsOptional()
  @IsString()
  @IsEnum($Enums.Role)
  role: $Enums.Role;
}
