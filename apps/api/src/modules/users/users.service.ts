import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
    private readonly userRepository: Repository<User>,
    private readonly auditLogsService: AuditLogsService,
    private readonly awsService: AwsService
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

    const createdUser = await this.userRepository.save(newUser);

    if (creator) {
      await this.auditLogsService.auditLogCreate(creator, createdUser, AUDIT_LOG_TABLE_NAME.USERS);
    }

    return createdUser;
  }

  async find(filterDto: FilterUserDto) {
    const { q, order, status, sort, skip, limit } = filterDto;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.select(USER_GET_FIELDS);

    if (status) {
      queryBuilder.where('user.status in (:...status)', { status });
    }
    if (q) {
      queryBuilder
        .andWhere('LOWER(user.name) LIKE LOWER(:name)', { name: `%${q}%` })
        .orWhere('LOWER(user.email) LIKE LOWER(:email)', { email: `%${q}%` })
        .orWhere('LOWER(user.phoneNumber) LIKE LOWER(:phoneNumber)', { phoneNumber: `%${q}%` });
    }
    if (sort) {
      if (order) {
        queryBuilder.orderBy(`user.${sort}`, order);
      } else {
        queryBuilder.orderBy(`user.${sort}`, SORT_ORDER.DESC);
      }
    } else {
      queryBuilder.orderBy('user.createdAt', SORT_ORDER.DESC);
    }
    queryBuilder.skip(skip).take(limit);

    const [{ entities }, totalItems] = await Promise.all([queryBuilder.getRawAndEntities(), queryBuilder.getCount()]);
    const paginationDto = new PaginationDto({ totalItems, filterDto });

    return new PaginationResponseDto(entities, { paging: paginationDto });
  }

  async findOne(id: string) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.select(USER_GET_FIELDS);
    queryBuilder.where('user.id = :id', { id });

    const user = await queryBuilder.getOne();

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async findActiveUser(id: string) {
    const user = await this.userRepository.findOneBy({ id, status: USER_STATUS.ACTIVE });

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: { preference: true },
    });

    return user;
  }

  async findByOAuthAccount(provider: AUTH_PROVIDER, providerAccountId: string) {
    const user = await this.userRepository.findOneBy({ provider, providerAccountId });

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
    const user = await this.userRepository.findOneBy({ id });

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

    const updatedUser = await this.userRepository.save(user);

    await this.auditLogsService.auditLogUpdate(creator, originalUser, updatedUser, AUDIT_LOG_TABLE_NAME.USERS);

    return updatedUser;
  }

  async remove(id: string, creator: User) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const originalUser = structuredClone(user);

    user.status = USER_STATUS.DELETED;

    const deletedUser = await this.userRepository.save(user);

    await this.auditLogsService.auditLogDelete(creator, [originalUser], [deletedUser], AUDIT_LOG_TABLE_NAME.USERS);

    return deletedUser;
  }

  async bulkDelete(creator: User, bulkDeleteDto: BulkDeleteDto) {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id IN (:...ids)', { ids: bulkDeleteDto.ids })
      .orderBy('user.createdAt', SORT_ORDER.ASC)
      .getMany();

    const originalUsers = users.map(user => structuredClone(user));

    users.forEach(user => (user.status = USER_STATUS.DELETED));

    const deletedUsers = await this.userRepository.save(users);

    await this.auditLogsService.auditLogDelete(creator, originalUsers, deletedUsers, AUDIT_LOG_TABLE_NAME.USERS);

    return deletedUsers;
  }

  async getAllDeviceTokens() {
    const users = await this.userRepository.createQueryBuilder('user').select('user.deviceTokens').getMany();
    const deviceTokens = users.flatMap(user => user.deviceTokens);

    return deviceTokens;
  }

  async updateAvatar(id: string, file: Express.Multer.File) {
    const user = await this.userRepository.findOneBy({ id });

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

    const response = await this.userRepository.save(user);

    await this.awsService.putObject({ key: `avatars/${uniqueName}`, body: file.buffer });

    return {
      avatar: response.avatar,
    };
  }
}
