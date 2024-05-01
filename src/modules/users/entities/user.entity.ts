import { $Enums, Prisma } from '@prisma/client';
export class UserEntity {
  id: number;
  name: string;
  email: string;
  role: $Enums.Role;
  isVerified: boolean;
}
export const userSelect: Prisma.UserSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  isVerified: true,
};
