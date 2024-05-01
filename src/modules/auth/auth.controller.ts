import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshJwtAuthGuard } from './refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh-token')
  refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user);
  }
}
