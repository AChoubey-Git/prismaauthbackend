import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/modules/users/users.service';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.get('jwt_secret'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: { userId: number }) {
    const user = await this.usersService.findOne({ id: payload.userId });
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
