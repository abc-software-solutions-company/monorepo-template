import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';

import { PaginationDto } from '@/common/dtos/pagination.dto';
import { PaginationResponseDto } from '@/common/dtos/pagination-response.dto';

import { AUDIT_LOG_GET_FIELDS, AUDIT_LOG_HTTP_METHOD, AUDIT_LOG_TABLE_NAME } from './constants/audit-logs.constant';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { FilterAuditLogDto } from './dto/filter-audit-log.dto';
import { AuditLog } from './entities/audit-log.entity';

import { User } from '../users/entities/user.entity';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: EntityRepository<AuditLog>,
    private readonly em: EntityManager
  ) {}

  async create(createDto: CreateAuditLogDto) {
    const auditLog = this.auditLogRepository.create(createDto);

    await this.em.persistAndFlush(auditLog);

    return auditLog;
  }

  async find(filterDto: FilterAuditLogDto) {
    const { email, tableName, action, recordId, skip, limit } = filterDto;
    const queryBuilder = this.auditLogRepository.createQueryBuilder('audit');

    queryBuilder.select(AUDIT_LOG_GET_FIELDS);
    queryBuilder.leftJoinAndSelect('audit.user', 'user');
    if (email) queryBuilder.andWhere({ 'user.email': email });
    if (tableName) queryBuilder.andWhere({ tableName });
    if (action) queryBuilder.andWhere({ action });
    if (recordId) queryBuilder.andWhere({ recordId });
    queryBuilder.orderBy({ createdAt: 'DESC' });
    queryBuilder.offset(skip).limit(limit);

    const [entities, totalItems] = await queryBuilder.getResultAndCount();

    for (const entity of entities) {
      entity.title = await this.getRecordTitle(entity.tableName, entity.recordId);
    }

    const paginationDto = new PaginationDto({ totalItems, filterDto });

    return new PaginationResponseDto(entities, { paging: paginationDto });
  }

  async findOne(id: string) {
    const queryBuilder = this.auditLogRepository.createQueryBuilder('audit');

    queryBuilder.select(AUDIT_LOG_GET_FIELDS);
    queryBuilder.leftJoinAndSelect('audit.user', 'user');
    queryBuilder.where({ id });

    const auditLog = await queryBuilder.getSingleResult();

    auditLog.title = await this.getRecordTitle(auditLog.tableName, auditLog.recordId);

    if (!auditLog) {
      throw new NotFoundException('Audit log not found');
    }

    return auditLog;
  }

  async getRecordTitle(tableName: AUDIT_LOG_TABLE_NAME, recordId: string): Promise<string> {
    if (!Object.values(AUDIT_LOG_TABLE_NAME).includes(tableName)) return '';
    let title = '';

    try {
      const queryBuilder = this.em.createQueryBuilder(tableName, 'table');

      if (tableName === AUDIT_LOG_TABLE_NAME.USERS || tableName === AUDIT_LOG_TABLE_NAME.FILES) {
        queryBuilder.select('name');
        queryBuilder.where({ id: recordId });

        const result = await queryBuilder.getSingleResult();

        title = (result as any)?.name || '';
      } else {
        queryBuilder.select('nameLocalized');
        queryBuilder.where({ id: recordId });

        const result = await queryBuilder.getSingleResult();

        title = (result as any)?.nameLocalized?.[0]?.value || '';
      }

      return title;
    } catch (error) {
      return title;
    }
  }

  async auditLogCreate<T extends { id: string }>(creator: User, entity: T, tableName: AUDIT_LOG_TABLE_NAME) {
    const auditLog = this.auditLogRepository.create({
      user: creator,
      recordId: entity.id,
      tableName,
      action: AUDIT_LOG_HTTP_METHOD.CREATE,
      oldValue: {},
      newValue: { ...entity },
    });

    await this.em.persistAndFlush(auditLog);
  }

  async auditLogUpdate<T extends { id: string }>(creator: User, originalEntity: T, updatedEntity: T, tableName: AUDIT_LOG_TABLE_NAME) {
    const auditLog = this.auditLogRepository.create({
      user: creator,
      recordId: originalEntity.id,
      tableName,
      action: AUDIT_LOG_HTTP_METHOD.UPDATE,
      oldValue: { ...originalEntity },
      newValue: { ...updatedEntity },
    });

    await this.em.persistAndFlush(auditLog);
  }

  async auditLogDelete<T extends { id: string }>(creator: User, originalEntities: T[], updatedEntities: T[], tableName: AUDIT_LOG_TABLE_NAME) {
    const CHUNK_SIZE = 10;

    for (let i = 0; i < originalEntities.length; i += CHUNK_SIZE) {
      const chunk = [];

      for (let j = i; j < i + CHUNK_SIZE && j < originalEntities.length; j++) {
        chunk.push({
          user: creator,
          recordId: originalEntities[j].id,
          tableName,
          action: AUDIT_LOG_HTTP_METHOD.DELETE,
          oldValue: { ...originalEntities[j] },
          newValue: { ...updatedEntities[j] },
        });
      }

      for (const entry of chunk) {
        const newData = this.auditLogRepository.create(entry);

        await this.em.persist(newData);
      }

      await this.em.flush();
    }
  }
}
