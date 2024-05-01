import { $Enums, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  id: number;
  name: string;
  email: string;
  @Exclude()
  password: string;
  role: $Enums.Role;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
