import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private _prismaService: PrismaService) {}
  create(createUserDto: CreateUserDto) {
    return this._prismaService.user.create({ data: createUserDto });
    // verify email send to the registered email id.
  }

  findAll() {
    return this._prismaService.user.findMany();
  }

  findOne(id: number) {
    return this._prismaService.user.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateUserDto) {
    return this._prismaService.user.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this._prismaService.user.delete({ where: { id } });
  }
}
