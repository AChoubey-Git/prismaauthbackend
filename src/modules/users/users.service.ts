import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { userSelect } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly roundsOfHashing: number;
  constructor(
    private _prismaService: PrismaService,
    private _configService: ConfigService,
  ) {
    this.roundsOfHashing = this._configService.get('roundsOfHashing');
  }
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.roundsOfHashing,
    );
    createUserDto.password = hashedPassword;
    return this._prismaService.user.create({
      data: createUserDto,
      select: userSelect,
    });
  }

  async findOne(query: { id: number }) {
    return this._prismaService.user.findUnique({
      where: query,
      select: userSelect,
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        this.roundsOfHashing,
      );
    }
    return this._prismaService.user.update({
      where: { id },
      data: updateUserDto,
      select: userSelect,
    });
  }

  remove(id: number) {
    return this._prismaService.user.delete({
      where: { id },
      select: userSelect,
    });
  }
}
