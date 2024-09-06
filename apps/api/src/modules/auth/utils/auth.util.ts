import { USER_ROLE } from '@/modules/users/constants/users.constant';
import { User } from '@/modules/users/entities/user.entity';

export const isAdmin = (user: User) => {
  return user.role === USER_ROLE.SUPER_ADMIN || user.role === USER_ROLE.ADMIN;
};
