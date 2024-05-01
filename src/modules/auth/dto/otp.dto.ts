import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class OtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  otp: string;
}
