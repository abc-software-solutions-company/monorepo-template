import { User } from '@/modules/users/entities/user.entity';

export class UserCreatedEvent {
  creator: User;
  afterCreate: User;
}

export class UserUpdatedEvent {
  creator: User;
  beforeUpdate: User;
  afterUpdate: User;
}

export class UserDeletedEvent {
  creator: User;
  beforeDelete: User[];
  afterDelete: User[];
}
