import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { MailService } from 'src/utils/mail/mail.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { OtpDto } from './dto/otp.dto';
import { RefreshJwtAuthGuard } from './refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private _mailService: MailService,
  ) {}

  @Post('login')
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh-token')
  refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user);
  }

  @Get('verify-otp')
  async verifyOtp(@Query() query: OtpDto) {
    try {
      const isVerified = await this._mailService.verifyOtp(query);
      if (isVerified) {
        await this._mailService.update({ isVerified, ...query });
        return {
          status: true,
          message: 'You have successfully verified your email id',
        };
      }
      return {
        status: false,
        message: `Incorrect otp ${query.otp}`,
      };
    } catch (error) {
      return error.message;
    }
  }
}
