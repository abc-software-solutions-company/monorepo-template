import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

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
    private readonly auditLogRepository: Repository<AuditLog>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager
  ) {}

  async create(createDto: CreateAuditLogDto) {
    const auditLog = this.auditLogRepository.create(createDto);

    const createdAuditLog = this.auditLogRepository.save(auditLog);

    return createdAuditLog;
  }

  async find(filterDto: FilterAuditLogDto) {
    const { email, tableName, action, recordId, skip, limit } = filterDto;
    const queryBuilder = this.auditLogRepository.createQueryBuilder('audit');

    queryBuilder.select(AUDIT_LOG_GET_FIELDS);
    queryBuilder.leftJoin('audit.user', 'user');
    if (email) queryBuilder.andWhere('user.email = :email', { email });
    if (tableName) queryBuilder.andWhere('audit.tableName = :tableName', { tableName });
    if (action) queryBuilder.andWhere('audit.action = :action', { action });
    if (recordId) queryBuilder.andWhere('audit.recordId = :recordId', { recordId });
    queryBuilder.orderBy('audit.createdAt', 'DESC');
    queryBuilder.skip(skip).take(limit);

    const [{ entities }, totalItems] = await Promise.all([queryBuilder.getRawAndEntities(), queryBuilder.getCount()]);

    for (const entity of entities) {
      entity.title = await this.getRecordTitle(entity.tableName, entity.recordId);
    }

    const paginationDto = new PaginationDto({ totalItems, filterDto });

    return new PaginationResponseDto(entities, { paging: paginationDto });
  }

  async findOne(id: string) {
    const queryBuilder = this.auditLogRepository.createQueryBuilder('audit');

    queryBuilder.select(AUDIT_LOG_GET_FIELDS);
    queryBuilder.leftJoin('audit.user', 'user');
    queryBuilder.where('audit.id = :id', { id });

    const auditLog = await queryBuilder.getOne();

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
      const queryBuilder = this.entityManager.createQueryBuilder();

      if (tableName === AUDIT_LOG_TABLE_NAME.USERS || tableName === AUDIT_LOG_TABLE_NAME.FILES) {
        queryBuilder.select('table.name', 'name');
        queryBuilder.from(tableName, 'table');
        queryBuilder.where('table.id = :recordId', { recordId });

        const result = await queryBuilder.getRawOne();

        title = result.name || '';
      } else {
        queryBuilder.select('table.nameLocalized', 'titleLocalized');
        queryBuilder.from(tableName, 'table');
        queryBuilder.where('table.id = :recordId', { recordId });

        const result = await queryBuilder.getRawOne();

        title = result.titleLocalized?.[0]?.value || '';
      }

      return title;
    } catch (error) {
      return title;
    }
  }

  async auditLogCreate<T extends { id: string }>(creator: User, entity: T, tableName: AUDIT_LOG_TABLE_NAME) {
    await this.auditLogRepository.save({
      user: creator,
      recordId: entity.id,
      tableName,
      action: AUDIT_LOG_HTTP_METHOD.CREATE,
      oldValue: {},
      newValue: { ...entity },
    });
  }

  async auditLogUpdate<T extends { id: string }>(creator: User, originalEntity: T, updatedEntity: T, tableName: AUDIT_LOG_TABLE_NAME) {
    await this.auditLogRepository.save({
      user: creator,
      recordId: originalEntity.id,
      tableName,
      action: AUDIT_LOG_HTTP_METHOD.UPDATE,
      oldValue: { ...originalEntity },
      newValue: { ...updatedEntity },
    });
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

        await this.auditLogRepository.save(newData);
      }
    }
  }
}
