import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { wrap } from '@mikro-orm/core';

import { BulkDeleteDto } from '@/common/dtos/bulk-delete.dto';
import { PaginationDto } from '@/common/dtos/pagination.dto';
import { PaginationResponseDto } from '@/common/dtos/pagination-response.dto';

import { SORT_ORDER } from '@/common/constants/order.constant';

import { checkValidPassword, hashPassword } from '@/common/utils/password.util';
import { toSlug } from '@/common/utils/string.util';

import { USER_FIELDS_TO_CREATE_OR_UPDATE, USER_GET_FIELDS, USER_STATUS } from './constants/users.constant';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AUDIT_LOG_TABLE_NAME } from '../audit-logs/constants/audit-logs.constant';
import { AUTH_PROVIDER } from '../auth/constants/auth.constant';
import { AwsService } from '../aws/aws.service';
import { getFileExtension } from '../files/utils/file.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly auditLogsService: AuditLogsService,
    private readonly awsService: AwsService,
    private readonly em: EntityManager
  ) {}

  async create(creator: User, createDto: CreateUserDto) {
    const newUser = new User();

    for (const field of USER_FIELDS_TO_CREATE_OR_UPDATE as string[]) {
      if (createDto[field] !== undefined) {
        newUser[field] = createDto[field];
      }
    }

    if (createDto.password) {
      newUser.password = hashPassword(createDto.password);
    }

    await this.em.persistAndFlush(newUser);

    if (creator) {
      await this.auditLogsService.auditLogCreate(creator, newUser, AUDIT_LOG_TABLE_NAME.USERS);
    }

    return newUser;
  }

  async find(filterDto: FilterUserDto) {
    const { q, order, status, sort, skip, limit } = filterDto;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.select(USER_GET_FIELDS);

    if (status) {
      queryBuilder.where({ status: { $in: status } });
    }
    if (q) {
      queryBuilder.andWhere({
        $or: [
          { name: { $ilike: `%${q}%` } },
          { email: { $ilike: `%${q}%` } },
          { phoneNumber: { $ilike: `%${q}%` } },
        ],
      });
    }
    if (sort) {
      if (order) {
        queryBuilder.orderBy({ [sort]: order });
      } else {
        queryBuilder.orderBy({ [sort]: SORT_ORDER.DESC });
      }
    } else {
      queryBuilder.orderBy({ createdAt: SORT_ORDER.DESC });
    }
    queryBuilder.offset(skip).limit(limit);

    const [entities, totalItems] = await queryBuilder.getResultAndCount();
    const paginationDto = new PaginationDto({ totalItems, filterDto });

    return new PaginationResponseDto(entities, { paging: paginationDto });
  }

  async findOne(id: string) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.select(USER_GET_FIELDS);
    queryBuilder.where({ id });

    const user = await queryBuilder.getSingleResult();

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async findActiveUser(id: string) {
    const user = await this.userRepository.findOne({ id, status: USER_STATUS.ACTIVE });

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne(
      { email },
      { populate: ['preference'] }
    );

    return user;
  }

  async findByOAuthAccount(provider: AUTH_PROVIDER, providerAccountId: string) {
    const user = await this.userRepository.findOne({ provider, providerAccountId });

    return user;
  }

  async findByEmailAndPassword(email: string, password: string) {
    const user = await this.findByEmail(email);

    if (!user) return null;

    const isValidPassword = await checkValidPassword(user.password, password);

    if (!isValidPassword) return null;

    return user;
  }

  async update(id: string, creator: User, updateDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const originalUser = structuredClone(user);

    if (!user.deviceTokens) user.deviceTokens = [];
    if (!user.deviceTokens.includes(updateDto.deviceToken)) {
      user.deviceTokens.push(updateDto.deviceToken);
    }

    for (const field of USER_FIELDS_TO_CREATE_OR_UPDATE as string[]) {
      if (updateDto[field] !== undefined) {
        user[field] = updateDto[field];
      }
    }

    await this.em.flush();

    await this.auditLogsService.auditLogUpdate(creator, originalUser, user, AUDIT_LOG_TABLE_NAME.USERS);

    return user;
  }

  async remove(id: string, creator: User) {
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const originalUser = structuredClone(user);

    user.status = USER_STATUS.DELETED;

    await this.em.flush();

    await this.auditLogsService.auditLogDelete(creator, [originalUser], [user], AUDIT_LOG_TABLE_NAME.USERS);

    return user;
  }

  async bulkDelete(creator: User, bulkDeleteDto: BulkDeleteDto) {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where({ id: { $in: bulkDeleteDto.ids } })
      .orderBy({ createdAt: SORT_ORDER.ASC })
      .getResult();

    const originalUsers = users.map(user => structuredClone(user));

    users.forEach(user => (user.status = USER_STATUS.DELETED));

    await this.em.flush();

    await this.auditLogsService.auditLogDelete(creator, originalUsers, users, AUDIT_LOG_TABLE_NAME.USERS);

    return users;
  }

  async getAllDeviceTokens() {
    const users = await this.userRepository.createQueryBuilder('user').select('deviceTokens').getResult();
    const deviceTokens = users.flatMap(user => user.deviceTokens);

    return deviceTokens;
  }

  async updateAvatar(id: string, file: Express.Multer.File) {
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const ext = await getFileExtension(file);

    const uniqueName = toSlug(user.email.split('@')[0].replace('.', '_')) + '-avatar' + ext;

    // const destinationPath = path.join(FILE_ROOT_PATH, 'avatars');

    // createDirectory(destinationPath);

    // const filePath = path.join(destinationPath, uniqueName);

    // fs.writeFile(filePath, file.buffer, async writeErr => {
    //   if (writeErr) throw new UnprocessableEntityException(`Can not write ${filePath}`);

    //   user.avatar = `/avatars/${uniqueName}`;
    // });

    user.avatar = `/avatars/${uniqueName}`;

    await this.em.flush();

    await this.awsService.putObject({ key: `avatars/${uniqueName}`, body: file.buffer });

    return {
      avatar: user.avatar,
    };
  }
}
