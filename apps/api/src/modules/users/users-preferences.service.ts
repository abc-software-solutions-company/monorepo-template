import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import _ from 'lodash';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { wrap } from '@mikro-orm/core';

import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';
import { User } from './entities/user.entity';
import { UserPreference } from './entities/user-preference.entity';

@Injectable()
export class UsersPreferencesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(UserPreference)
    private readonly userPreferenceRepository: EntityRepository<UserPreference>,
    private readonly em: EntityManager
  ) {}

  async updateReference(userId: string, updateDto: UpdateUserPreferenceDto): Promise<UserPreference> {
    if (_.isEmpty(updateDto)) {
      throw new BadRequestException('Data should not be empty');
    }

    const user = await this.userRepository.findOne(
      { id: userId },
      { populate: ['preference'] }
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.preference) {
      const newPreference = this.userPreferenceRepository.create(updateDto);
      await this.em.persist(newPreference);
      user.preference = newPreference;
    } else {
      wrap(user.preference).assign(updateDto);
    }

    await this.em.flush();

    return user.preference;
  }
}
