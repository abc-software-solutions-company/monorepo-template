import { Entity, Enum, OneToOne, PrimaryKey } from '@mikro-orm/core';

import { User } from '@/modules/users/entities/user.entity';

import { USER_PREFERENCE_COLOR_SCHEME, USER_PREFERENCE_LANGUAGE } from '../constants/user-preference.constant';

@Entity({ tableName: 'users_preferences' })
export class UserPreference {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id: string;

  @Enum(() => USER_PREFERENCE_LANGUAGE)
  language: USER_PREFERENCE_LANGUAGE = USER_PREFERENCE_LANGUAGE.UNITED_STATES;

  @Enum(() => USER_PREFERENCE_COLOR_SCHEME)
  theme: USER_PREFERENCE_COLOR_SCHEME = USER_PREFERENCE_COLOR_SCHEME.DARK;

  @OneToOne(() => User, user => user.preference, { owner: false })
  user: User;
}
