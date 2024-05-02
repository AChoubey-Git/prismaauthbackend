import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MailService } from 'src/utils/mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Controller('users')
export class UsersController {
  private port: number;
  constructor(
    private readonly usersService: UsersService,
    private _mailService: MailService,
    private _cofigService: ConfigService,
  ) {
    this.port = this._cofigService.get('port');
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const verifiedUser = await this._mailService.findOne({ email });
    if (verifiedUser && verifiedUser?.isVerified) {
      return this.usersService.create({ ...createUserDto, isVerified: true });
    }
    const res = await this._mailService.sendVerificationEmail(email);
    return {
      message: `Verify your ${email} by clicking the bellow verify-otp url`,
      verify_otp: `http://localhost:${this.port}/auth/verify-otp?email=${email}&otp=${res.otp}`,
      preview_email: res.preview_email,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const { id } = req.user;
    try {
      const user = await this.usersService.update(+id, updateUserDto);
      if (user) {
        return { status: true, user };
      }
      return { status: false, message: 'userId not found' };
    } catch (error) {
      return error.message;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.usersService.findOne({ id: +id });
      if (user) {
        return { status: true, user };
      }
      return { status: false, message: 'userId not found' };
    } catch (error) {
      return error.message;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.usersService.update(+id, updateUserDto);
      if (user) {
        return { status: true, user };
      }
      return { status: false, message: 'userId not found' };
    } catch (error) {
      return error.message;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne({ id: +id });
      if (user) {
        await this.usersService.remove(+id);
        return { status: true, message: 'Successfuly deleted' };
      }
      return { status: false, message: 'userId not available' };
    } catch (error) {
      return error.message;
    }
  }
}
